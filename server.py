import http.server
import socketserver
import json
import math
import urllib.parse
import os
import re
import os

PORT = int(os.environ.get("PORT", 8000))
INDEX_FILE = "rag_index.json"
KEY_FILE = "gemini_key.txt"

# --------------------------------------------------------------------------
# SECURE API KEY GATEWAYS
# --------------------------------------------------------------------------
def get_gemini_key():
    # First, check the Render environment variable
    env_key = os.getenv("GEMINI_API_KEY")
    if env_key:
        return env_key.strip()

    # Fallback for local development
    if os.path.exists(KEY_FILE):
        try:
            with open(KEY_FILE, "r", encoding="utf-8") as f:
                return f.read().strip()
        except Exception:
            return None

    return None

def call_gemini_api(api_key, user_message, history, system_instruction):
    endpoint = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key={api_key}"
    
    contents = []
    for msg in history:
        contents.append({
            "role": msg.get("role"),
            "parts": [{"text": msg.get("text")}]
        })
    contents.append({
        "role": "user",
        "parts": [{"text": user_message}]
    })
    
    payload = {
        "contents": contents,
        "systemInstruction": {
            "parts": [{"text": system_instruction}]
        }
    }
    
    try:
        import urllib.request
        data = json.dumps(payload).encode('utf-8')
        req = urllib.request.Request(
            endpoint,
            data=data,
            headers={'Content-Type': 'application/json'},
            method='POST'
        )
        with urllib.request.urlopen(req, timeout=10) as response:
            resp_data = json.loads(response.read().decode('utf-8'))
            candidates = resp_data.get("candidates", [])
            if candidates:
                parts = candidates[0].get("content", {}).get("parts", [])
                if parts:
                    return parts[0].get("text", "")
            return "No candidates returned from Gemini API."
    except Exception as e:
        print(f"[Gemini Error] API call failed: {e}")
        return "Error communicating with Gemini backend API. Make sure your server has internet access and the API key is correct."

# --------------------------------------------------------------------------
# LOCAL TF-IDF VECTOR SCORING ENGINE
# --------------------------------------------------------------------------
class RAGEngine:
    def __init__(self):
        self.chunks = []
        self.vocab = []
        self.idf = {}
        self.load_index()

    def load_index(self):
        if os.path.exists(INDEX_FILE):
            try:
                with open(INDEX_FILE, 'r', encoding='utf-8') as f:
                    data = json.load(f)
                    self.chunks = data.get('chunks', [])
                    self.vocab = data.get('vocab', [])
                    self.idf = data.get('idf', {})
                print(f"[RAG] Loaded static index. {len(self.chunks)} segments.")
            except Exception as e:
                print(f"[RAG] Error reading index schema: {e}")

    def save_index(self, filename, chunks_text):
        doc_count = len(chunks_text)
        if doc_count == 0:
            return {
                "filename": "",
                "date": "",
                "chunks_count": 0,
                "vocab_size": 0
            }
        
        vocab = set()
        df = {}
        def tokenize(text):
            return re.findall(r'\w+', text.lower())
        
        doc_term_freqs = []
        for chunk in chunks_text:
            tokens = tokenize(chunk)
            freqs = {}
            unique_tokens = set(tokens)
            for t in tokens:
                freqs[t] = freqs.get(t, 0) + 1
                vocab.add(t)
            for t in unique_tokens:
                df[t] = df.get(t, 0) + 1
            doc_term_freqs.append(freqs)
            
        idf = {}
        for term in vocab:
            # Document frequency smoothing
            idf[term] = math.log(1 + (doc_count / (df.get(term, 0) or 1)))
            
        index_chunks = []
        for idx, text in enumerate(chunks_text):
            freqs = doc_term_freqs[idx]
            tfidf = {}
            magnitude_sq = 0.0
            for term, tf in freqs.items():
                score = tf * idf[term]
                tfidf[term] = score
                magnitude_sq += score * score
                
            index_chunks.append({
                "text": text,
                "vector": tfidf,
                "magnitude": math.sqrt(magnitude_sq)
            })
            
        import datetime
        date_str = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        
        data = {
            "filename": filename,
            "date": date_str,
            "chunks": index_chunks,
            "vocab": list(vocab),
            "idf": idf
        }
        
        try:
            with open(INDEX_FILE, 'w', encoding='utf-8') as f:
                json.dump(data, f, indent=4)
            self.chunks = index_chunks
            self.vocab = list(vocab)
            self.idf = idf
            print(f"[RAG] Stored RAG index: {len(self.chunks)} chunks.")
            return data
        except Exception as e:
            print(f"[RAG] Index write failed: {e}")
            raise e

    def retrieve(self, query, top_k=2):
        if not self.chunks:
            return []
            
        def tokenize(text):
            return re.findall(r'\w+', text.lower())
            
        query_tokens = tokenize(query)
        if not query_tokens:
            return []
            
        query_freqs = {}
        for t in query_tokens:
            query_freqs[t] = query_freqs.get(t, 0) + 1
            
        query_vector = {}
        query_mag_sq = 0.0
        for term, tf in query_freqs.items():
            if term in self.idf:
                score = tf * self.idf[term]
                query_vector[term] = score
                query_mag_sq += score * score
                
        query_magnitude = math.sqrt(query_mag_sq)
        if query_magnitude == 0:
            results = []
            for chunk in self.chunks:
                chunk_text = chunk.get('text', '').lower()
                overlap = sum(1 for t in query_tokens if t in chunk_text)
                results.append({
                    "text": chunk.get('text', ''),
                    "score": overlap / len(query_tokens) if query_tokens else 0
                })
            filtered = [r for r in results if r['score'] > 0.1]
            filtered.sort(key=lambda x: x['score'], reverse=True)
            return filtered[:top_k]
            
        results = []
        for chunk in self.chunks:
            dot_product = 0.0
            chunk_vector = chunk.get('vector', {})
            for term, q_score in query_vector.items():
                if term in chunk_vector:
                    dot_product += q_score * chunk_vector[term]
                    
            chunk_magnitude = chunk.get('magnitude', 0.0)
            similarity = 0.0
            if query_magnitude > 0 and chunk_magnitude > 0:
                similarity = dot_product / (query_magnitude * chunk_magnitude)
                
            results.append({
                "text": chunk.get('text', ''),
                "score": similarity
            })
            
        filtered = [r for r in results if r['score'] > 0.05]
        filtered.sort(key=lambda x: x['score'], reverse=True)
        return filtered[:top_k]

rag_engine = RAGEngine()

# --------------------------------------------------------------------------
# ON-BOOT AUTO SCAN CHANNELS
# --------------------------------------------------------------------------
def scan_documents_folder():
    documents_dir = os.path.join(os.path.dirname(__file__), "documents")
    if not os.path.exists(documents_dir):
        try:
            os.makedirs(documents_dir)
            print(f"[RAG] Created documents directory: {documents_dir}")
        except Exception as e:
            print(f"[RAG] Failed creating directory: {e}")
            return

    txt_path = os.path.join(documents_dir, "documents.txt")
    pdf_path = os.path.join(documents_dir, "resume.pdf")
    
    chunks = []
    indexed_files = []
    
    if os.path.exists(txt_path):
        try:
            with open(txt_path, 'r', encoding='utf-8') as f:
                text = f.read()
            paragraphs = [p.strip() for p in text.split('\n\n') if p.strip()]
            chunks.extend(paragraphs)
            indexed_files.append("documents.txt")
            print(f"[RAG] Auto-indexed documents.txt: found {len(paragraphs)} paragraphs.")
        except Exception as e:
            print(f"[RAG] Error indexing documents.txt: {e}")
            
    if os.path.exists(pdf_path):
        try:
            import pypdf
            reader = pypdf.PdfReader(pdf_path)
            pdf_chunks = []
            for page in reader.pages:
                text = page.extract_text()
                if text:
                    paragraphs = [p.strip() for p in text.split('\n\n') if p.strip()]
                    pdf_chunks.extend(paragraphs)
            chunks.extend(pdf_chunks)
            indexed_files.append("resume.pdf")
            print(f"[RAG] Auto-indexed resume.pdf: found {len(pdf_chunks)} segments.")
        except ImportError:
            print("[RAG WARNING] 'pypdf' package is not installed. To parse PDF files on startup, run 'pip install pypdf'.")
        except Exception as e:
            print(f"[RAG] Error reading resume.pdf: {e}")
            
    if chunks:
        filename = ", ".join(indexed_files)
        rag_engine.save_index(filename, chunks)

scan_documents_folder()

# --------------------------------------------------------------------------
# SERVER API HANDLERS
# --------------------------------------------------------------------------
class RAGHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        # Prevent cache locks
        self.send_header('Cache-Control', 'no-store, no-cache, must-revalidate')
        super().end_headers()

    def do_POST(self):
        parsed_url = urllib.parse.urlparse(self.path)
        path = parsed_url.path
        
        if path == '/api/save_gemini_key':
            content_length = int(self.headers['Content-Length'])
            post_data = self.rfile.read(content_length)
            try:
                payload = json.loads(post_data.decode('utf-8'))
                key = payload.get('key', '').strip()
                
                if key:
                    with open(KEY_FILE, 'w', encoding='utf-8') as f:
                        f.write(key)
                else:
                    if os.path.exists(KEY_FILE):
                        os.remove(KEY_FILE)
                
                self.send_response(200)
                self.send_header('Content-Type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps({"status": "success"}).encode('utf-8'))
            except Exception as e:
                self.send_response(500)
                self.send_header('Content-Type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps({"status": "error", "message": str(e)}).encode('utf-8'))

        elif path == '/api/chat':
            content_length = int(self.headers['Content-Length'])
            post_data = self.rfile.read(content_length)
            try:
                payload = json.loads(post_data.decode('utf-8'))
                message = payload.get('message', '')
                history = payload.get('history', [])
                
                # Perform RAG retrieval
                hits = rag_engine.retrieve(message, top_k=2)
                context_text = ""
                if hits:
                    context_text = "\n".join([f"- {h['text']}" for h in hits])
                
                # Read Gemini API Key
                api_key = get_gemini_key()
                
                if api_key:
                    sys_prompt = "You are Aditya AI, representing Aditya (a Fresher AI & Software Engineer). "
                    if context_text:
                        sys_prompt += f"\nHere is context retrieved from Aditya's resume/PDFs:\n{context_text}\nAlways prioritize answering questions using this context if it matches. "
                    else:
                        sys_prompt += "\nNo matching resume context was found. Answer questions politely as his assistant. "
                    sys_prompt += "Keep answers under 3 sentences max, and speak from Aditya's perspective (e.g. 'I built this...')."
                    
                    bot_reply = call_gemini_api(api_key, message, history, sys_prompt)
                else:
                    if hits:
                        match = hits[0]
                        clean_text = match['text'].replace('\n', ' ')
                        bot_reply = f"[RAG OFFLINE MATCH] (Confidence: {int(match['score']*100)}%):\n\n\"{clean_text}\"\n\n(Configure Aditya's Gemini API key in admin dashboard for full conversation generation)"
                    else:
                        bot_reply = "Hello! I am Aditya's assistant. Aditya's Gemini API key is currently not configured on this server, and no matching context was found in the indexed resume database."
                
                self.send_response(200)
                self.send_header('Content-Type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps({"status": "success", "reply": bot_reply}).encode('utf-8'))
            except Exception as e:
                self.send_response(500)
                self.send_header('Content-Type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps({"status": "error", "message": str(e)}).encode('utf-8'))

        elif path == '/api/index_rag':
            content_length = int(self.headers['Content-Length'])
            post_data = self.rfile.read(content_length)
            try:
                payload = json.loads(post_data.decode('utf-8'))
                filename = payload.get('filename', 'resume.pdf')
                chunks = payload.get('chunks', [])
                
                rag_engine.save_index(filename, chunks)
                
                self.send_response(200)
                self.send_header('Content-Type', 'application/json')
                self.end_headers()
                
                resp = {
                    "status": "success",
                    "filename": filename,
                    "chunks_count": len(chunks),
                    "vocab_size": len(rag_engine.vocab)
                }
                self.wfile.write(json.dumps(resp).encode('utf-8'))
            except Exception as e:
                self.send_response(500)
                self.send_header('Content-Type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps({"status": "error", "message": str(e)}).encode('utf-8'))
                
        elif path == '/api/query_rag':
            content_length = int(self.headers['Content-Length'])
            post_data = self.rfile.read(content_length)
            try:
                payload = json.loads(post_data.decode('utf-8'))
                query = payload.get('query', '')
                top_k = payload.get('top_k', 2)
                
                hits = rag_engine.retrieve(query, top_k)
                
                self.send_response(200)
                self.send_header('Content-Type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps({"status": "success", "hits": hits}).encode('utf-8'))
            except Exception as e:
                self.send_response(500)
                self.send_header('Content-Type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps({"status": "error", "message": str(e)}).encode('utf-8'))
                
        elif path == '/api/clear_rag':
            try:
                if os.path.exists(INDEX_FILE):
                    os.remove(INDEX_FILE)
                rag_engine.chunks = []
                rag_engine.vocab = []
                rag_engine.idf = {}
                
                self.send_response(200)
                self.send_header('Content-Type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps({"status": "success"}).encode('utf-8'))
            except Exception as e:
                self.send_response(500)
                self.end_headers()
                self.wfile.write(str(e).encode('utf-8'))
        else:
            self.send_response(404)
            self.end_headers()

    def do_GET(self):
        parsed_url = urllib.parse.urlparse(self.path)
        path = parsed_url.path
        
        if path == '/api/get_gemini_status':
            try:
                key = get_gemini_key()
                status = "configured" if key else "unconfigured"
                
                self.send_response(200)
                self.send_header('Content-Type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps({"status": status}).encode('utf-8'))
            except Exception as e:
                self.send_response(500)
                self.end_headers()
                self.wfile.write(str(e).encode('utf-8'))
                
        elif path == '/api/get_rag_stats':
            try:
                filename = ""
                date = ""
                chunks_count = 0
                vocab_size = 0
                if os.path.exists(INDEX_FILE):
                    with open(INDEX_FILE, 'r', encoding='utf-8') as f:
                        data = json.load(f)
                        filename = data.get('filename', '')
                        date = data.get('date', '')
                        chunks_count = len(data.get('chunks', []))
                        vocab_size = len(data.get('vocab', []))
                
                self.send_response(200)
                self.send_header('Content-Type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps({
                    "filename": filename,
                    "date": date,
                    "chunks_count": chunks_count,
                    "vocab_size": vocab_size
                }).encode('utf-8'))
            except Exception as e:
                self.send_response(500)
                self.end_headers()
                self.wfile.write(str(e).encode('utf-8'))
        else:
            super().do_GET()

if __name__ == '__main__':
    print(f"Starting python server on http://localhost:{PORT}...")
    handler = RAGHandler
    with socketserver.TCPServer(("", PORT), handler) as httpd:
        print("[RAG SERVER] Active and listening.")
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            pass
        finally:
            httpd.server_close()
