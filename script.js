// ==========================================================================
// PORTFOLIO CONFIGURATION DATABASE (Local + Default Fallback)
// ==========================================================================
const DEFAULT_CONFIG = {
    profile: {
        name: "ADITYA",
        label: "AI & SOFTWARE",
        subLabel: "ENGINEER",
        tagline: "Building premium full-stack interfaces, hardware-integrated mobile systems (Flutter), and intelligent agent implementations. Crafting high-performance digital ecosystems.",
        about: `<p>I design and implement custom digital applications that combine functional efficiency with premium visual appeal. My expertise spans mobile development via Flutter (integrating device hardware and local storage solutions) and advanced AI pipelines (utilizing Large Language Model APIs for custom reasoning tasks).</p>
                <p>Inspired by premium digital agency philosophies, I prioritize high performance, micro-interactions, responsive structures, and strong typographic layout. Every system I build is structured for scalability and long-term search accessibility.</p>`,
        quote: `"The code we design today builds the foundations for the automated platforms of tomorrow."`
    },
    metrics: {
        m1Val: "5+",
        m1Lbl: "Projects Done",
        m2Val: "99%",
        m2Lbl: "Code Quality",
        m3Val: "2x",
        m3Lbl: "Load Speedup"
    },
    project: {
        title: "EmotionAI App",
        desc: "A native Flutter application integrated with a localized camera feed controller to evaluate facial features and process emotion classifications in real time. It binds hardware camera streams, handles frame buffers efficiently, and uses optimized inference files for local predictions."
    },
    chatbot: {
        greeting: "Hi! I am Aditya's AI Assistant. I can tell you about his projects (like the Camera Service inside EmotionAI), skills, workflow, or contact details. Ask me anything!",
        mockText: "\"Hi! I can share Aditya's experience in full-stack dev and AI. What would you like to know?\"",
        ragReplies: [
            {
                keywords: "emotionai, facial, face, camera, expression, emotion, classification",
                answer: "EmotionAI is one of Aditya's core projects. It's a Flutter mobile app utilizing standard camera stream controls to feed frames into an expression analysis network, providing real-time emotional readings."
            },
            {
                keywords: "camera service, camera_service, service, stream",
                answer: "The Camera Service class manages active lens initializations, camera configurations, frames pipelines, and platform permissions to connect physical hardware feeds with processing models."
            },
            {
                keywords: "skills, technologies, tech, languages, specialize, experience",
                answer: "Aditya specializes in cross-platform systems (Flutter/Dart), frontend design (HTML, Vanilla CSS, JS), backend operations (Node.js, Express, Python), and AI/LLM api orchestration."
            },
            {
                keywords: "process, workflow, steps, how you work, development",
                answer: "His roadmap involves 4 key phases: 1) Discovery & specs, 2) Visual layout/styling structure design, 3) Implementation of state pipelines & code logic, and 4) Production speed optimizations."
            },
            {
                keywords: "contact, hire, email, phone, reach, location",
                answer: "You can reach Aditya directly at info@aditya.dev, fill out the inquiry form in the contact section, or check his GitHub at github.com."
            },
            {
                keywords: "who are you, describe aditya, tell me about yourself, about",
                answer: "Aditya is an AI & Full-Stack/Mobile Engineer focused on building high-performance creative interfaces and custom machine learning pipelines. He designs scalable web platforms and native Flutter applications."
            }
        ]
    }
};

// Global config instance
let activeConfig = { ...DEFAULT_CONFIG };

// Load configurations from LocalStorage
function loadPortfolioConfig() {
    const raw = localStorage.getItem('portfolio_config');
    if (raw) {
        try {
            activeConfig = JSON.parse(raw);
        } catch (e) {
            console.error("Failed parsing localStorage config, falling back to default.", e);
            activeConfig = { ...DEFAULT_CONFIG };
        }
    }
    renderDynamicContent();
}

// Render values dynamically to HTML placeholders
function renderDynamicContent() {
    // Hero titles & tags
    const labelNode = document.getElementById('dyn-hero-label');
    const titleNode = document.getElementById('dyn-hero-title');
    const taglineNode = document.getElementById('dyn-hero-tagline');
    
    if (labelNode) labelNode.textContent = activeConfig.profile.label;
    if (titleNode) {
        // Render name and tag separated with styled stroke
        titleNode.innerHTML = `${activeConfig.profile.name}<br><span class="text-stroke">${activeConfig.profile.label}</span>`;
    }
    if (taglineNode) taglineNode.textContent = activeConfig.profile.tagline;

    // Metrics counters
    const m1Node = document.getElementById('dyn-metric-1');
    const m1LblNode = document.getElementById('dyn-metric-1-label');
    const m2Node = document.getElementById('dyn-metric-2');
    const m2LblNode = document.getElementById('dyn-metric-2-label');
    const m3Node = document.getElementById('dyn-metric-3');
    const m3LblNode = document.getElementById('dyn-metric-3-label');

    if (m1Node) m1Node.textContent = activeConfig.metrics.m1Val;
    if (m1LblNode) m1LblNode.textContent = activeConfig.metrics.m1Lbl;
    if (m2Node) m2Node.textContent = activeConfig.metrics.m2Val;
    if (m2LblNode) m2LblNode.textContent = activeConfig.metrics.m2Lbl;
    if (m3Node) m3Node.textContent = activeConfig.metrics.m3Val;
    if (m3LblNode) m3LblNode.textContent = activeConfig.metrics.m3Lbl;

    // About description & quote
    const aboutDescNode = document.getElementById('dyn-about-desc');
    const aboutQuoteNode = document.getElementById('dyn-about-quote');
    if (aboutDescNode) aboutDescNode.innerHTML = activeConfig.profile.about;
    if (aboutQuoteNode) aboutQuoteNode.textContent = activeConfig.profile.quote;

    // Project Details
    const projectTitleNode = document.getElementById('dyn-project-title');
    const projectDescNode = document.getElementById('dyn-project-desc');
    if (projectTitleNode) projectTitleNode.textContent = activeConfig.project.title;
    if (projectDescNode) projectDescNode.textContent = activeConfig.project.desc;

    // Chatbot assets
    const chatGreetNode = document.getElementById('dyn-chatbot-greeting');
    const chatMockNode = document.getElementById('dyn-mock-chat-bubble');
    if (chatGreetNode) chatGreetNode.textContent = activeConfig.chatbot.greeting;
    if (chatMockNode) chatMockNode.textContent = activeConfig.chatbot.mockText;
}

// Run config loader instantly
loadPortfolioConfig();


// ==========================================================================
// BACKGROUND CANVAS PARTICLES SYSTEM
// ==========================================================================
const canvas = document.getElementById('bg-canvas');
const ctx = canvas.getContext('2d');

let particles = [];
const particleCount = 40;

function resizeCanvas() {
    if (canvas) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

class Particle {
    constructor() {
        this.reset();
        if (canvas) this.y = Math.random() * canvas.height;
    }

    reset() {
        if (canvas) {
            this.x = Math.random() * canvas.width;
            this.y = canvas.height + 20;
        }
        this.size = Math.random() * 3 + 1;
        this.speedY = -(Math.random() * 0.8 + 0.2);
        this.speedX = Math.random() * 0.4 - 0.2;
        this.opacity = Math.random() * 0.4 + 0.1;
    }

    update() {
        this.y += this.speedY;
        this.x += this.speedX;

        if (canvas && (this.y < -10 || this.x < -10 || this.x > canvas.width + 10)) {
            this.reset();
        }
    }

    draw() {
        if (!ctx) return;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 204, 1, ${this.opacity})`;
        ctx.shadowBlur = 10;
        ctx.shadowColor = 'rgba(255, 204, 1, 0.5)';
        ctx.fill();
        ctx.shadowBlur = 0;
    }
}

for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
}

function animateParticles() {
    if (canvas && ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawGrid();
        particles.forEach(p => {
            p.update();
            p.draw();
        });
    }
    requestAnimationFrame(animateParticles);
}

function drawGrid() {
    if (!ctx || !canvas) return;
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.015)';
    ctx.lineWidth = 1;
    const size = 60;
    
    for (let x = 0; x < canvas.width; x += size) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
    }
    
    for (let y = 0; y < canvas.height; y += size) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
    }
}

if (canvas && ctx) {
    animateParticles();
}

// ==========================================================================
// SCROLL REVEAL ANIMATIONS (Intersection Observer)
// ==========================================================================
const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
};

const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

document.querySelectorAll('.reveal-item').forEach(item => {
    revealObserver.observe(item);
});

// ==========================================================================
// MOBILE NAVBAR DRAWER TRIGGER
// ==========================================================================
const mobileMenuBtn = document.getElementById('mobile-menu-btn');
const navLinks = document.querySelector('.nav-links');

if (mobileMenuBtn && navLinks) {
    mobileMenuBtn.addEventListener('click', () => {
        navLinks.style.display = navLinks.style.display === 'flex' ? 'none' : 'flex';
        if (navLinks.style.display === 'flex') {
            navLinks.style.flexDirection = 'column';
            navLinks.style.position = 'absolute';
            navLinks.style.top = '100%';
            navLinks.style.left = '0';
            navLinks.style.width = '100%';
            navLinks.style.background = 'rgba(7, 8, 10, 0.95)';
            navLinks.style.padding = '2rem';
            navLinks.style.gap = '1.5rem';
            navLinks.style.borderBottom = 'var(--border-glass)';
        }
    });
}

// Close mobile menu on link click
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        if (window.innerWidth <= 992 && navLinks) {
            navLinks.style.display = 'none';
        }
    });
});

// ==========================================================================
// FAQ ACCORDION HANDLERS
// ==========================================================================
document.querySelectorAll('.faq-question-btn').forEach(button => {
    button.addEventListener('click', () => {
        const faqItem = button.parentElement;
        const answer = faqItem.querySelector('.faq-answer');
        const isActive = faqItem.classList.contains('active');

        document.querySelectorAll('.faq-item').forEach(item => {
            item.classList.remove('active');
            item.querySelector('.faq-answer').style.maxHeight = null;
            item.querySelector('.faq-question-btn').setAttribute('aria-expanded', 'false');
        });

        if (!isActive && answer) {
            faqItem.classList.add('active');
            answer.style.maxHeight = answer.scrollHeight + 'px';
            button.setAttribute('aria-expanded', 'true');
        }
    });
});

// ==========================================================================
// CONTACT FORM SUBMISSION
// ==========================================================================
const contactForm = document.getElementById('inquiry-form');

if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('form-name').value;
        const email = document.getElementById('form-email').value;
        
        alert(`Thank you, ${name}! Your inquiry has been received. Aditya will respond at ${email} shortly.`);
        contactForm.reset();
    });
}

// ==========================================================================
// CHATBOT WIDGET CONTROLLER (Gemini & RAG Configured)
// ==========================================================================
const chatbotWidget = document.getElementById('chatbot-widget');
const chatbotBubble = document.getElementById('chatbot-bubble');
const chatbotPanel = document.getElementById('chatbot-panel');
const chatMessages = document.getElementById('chat-messages');
const chatInput = document.getElementById('chat-input');
const chatSendBtn = document.getElementById('chat-send-btn');
const botStatusText = document.getElementById('bot-status-text');

// Settings Tab Elements
const chatSettingsBtn = document.getElementById('chat-settings-btn');
const chatMessagesTab = document.getElementById('chat-messages-tab');
const chatSettingsTab = document.getElementById('chat-settings-tab');
const geminiKeyInput = document.getElementById('gemini-key');
const saveSettingsBtn = document.getElementById('save-settings-btn');
const backChatBtn = document.getElementById('back-chat-btn');

// Suggestion Chips
const suggestionChips = document.querySelectorAll('.suggestion-chip');

// Hero button trigger connection
const heroChatBtn = document.getElementById('hero-chat-btn');
if (heroChatBtn && chatbotWidget && chatInput) {
    heroChatBtn.addEventListener('click', () => {
        chatbotWidget.classList.add('active');
        chatInput.focus();
    });
}

// Toggle chatbot panel open/close
if (chatbotBubble && chatbotWidget && chatInput) {
    chatbotBubble.addEventListener('click', () => {
        chatbotWidget.classList.toggle('active');
        if (chatbotWidget.classList.contains('active')) {
            chatInput.focus();
        }
    });
}

// Toggle Settings screen
if (chatSettingsBtn && chatMessagesTab && chatSettingsTab) {
    chatSettingsBtn.addEventListener('click', () => {
        chatMessagesTab.style.display = 'none';
        chatSettingsTab.style.display = 'flex';
    });
}

if (backChatBtn && chatSettingsTab && chatMessagesTab) {
    backChatBtn.addEventListener('click', () => {
        chatSettingsTab.style.display = 'none';
        chatMessagesTab.style.display = 'flex';
    });
}

// Save Gemini API key
if (saveSettingsBtn && geminiKeyInput && botStatusText && chatSettingsTab && chatMessagesTab) {
    saveSettingsBtn.addEventListener('click', () => {
        const key = geminiKeyInput.value.trim();
        if (key) {
            localStorage.setItem('gemini_api_key', key);
            botStatusText.textContent = "Active (Gemini Live)";
            addBotMessage("Gemini API connection activated! I'm now running on live generative intelligence. Ask me anything.");
        } else {
            localStorage.removeItem('gemini_api_key');
            botStatusText.textContent = "Active (Offline Mode)";
            addBotMessage("Settings updated. Live API key removed. Returning to client-side offline mode.");
        }
        chatSettingsTab.style.display = 'none';
        chatMessagesTab.style.display = 'flex';
    });
}

// Check for existing API key on load
if (geminiKeyInput && botStatusText) {
    const storedKey = localStorage.getItem('gemini_api_key');
    if (storedKey) {
        geminiKeyInput.value = storedKey;
        botStatusText.textContent = "Active (Gemini Live)";
    }
}

// Send messages actions
function handleUserSend() {
    if (!chatInput) return;
    const text = chatInput.value.trim();
    if (!text) return;
    
    addUserMessage(text);
    chatInput.value = '';
    
    showTypingIndicator();
    
    const apiKey = localStorage.getItem('gemini_api_key');
    if (apiKey) {
        fetchGeminiReply(text, apiKey);
    } else {
        setTimeout(() => {
            hideTypingIndicator();
            const reply = getOfflineReply(text);
            addBotMessage(reply);
        }, 800);
    }
}

if (chatInput) {
    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            handleUserSend();
        }
    });
}

if (chatSendBtn) {
    chatSendBtn.addEventListener('click', handleUserSend);
}

// Suggestion chip triggers
suggestionChips.forEach(chip => {
    chip.addEventListener('click', () => {
        const query = chip.getAttribute('data-query');
        addUserMessage(query);
        showTypingIndicator();
        
        const apiKey = localStorage.getItem('gemini_api_key');
        if (apiKey) {
            fetchGeminiReply(query, apiKey);
        } else {
            setTimeout(() => {
                hideTypingIndicator();
                const reply = getOfflineReply(query);
                addBotMessage(reply);
            }, 800);
        }
    });
});

// UI helper methods
function addUserMessage(text) {
    if (!chatMessages) return;
    const msg = document.createElement('div');
    msg.className = 'message user';
    msg.textContent = text;
    chatMessages.appendChild(msg);
    scrollChat();
}

function addBotMessage(text) {
    if (!chatMessages) return;
    const msg = document.createElement('div');
    msg.className = 'message bot';
    msg.textContent = text;
    chatMessages.appendChild(msg);
    scrollChat();
}

function showTypingIndicator() {
    if (!chatMessages) return;
    const ind = document.createElement('div');
    ind.className = 'typing-indicator';
    ind.id = 'typing-ind';
    ind.innerHTML = `
        <div class="typing-dot"></div>
        <div class="typing-dot"></div>
        <div class="typing-dot"></div>
    `;
    chatMessages.appendChild(ind);
    scrollChat();
}

function hideTypingIndicator() {
    const ind = document.getElementById('typing-ind');
    if (ind) ind.remove();
}

function scrollChat() {
    if (chatMessages) {
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
}

// Offline reply matching using loaded configuration database
function getOfflineReply(input) {
    const lowerInput = input.toLowerCase();
    const list = activeConfig.chatbot.ragReplies;
    
    for (const entry of list) {
        const kwList = entry.keywords.split(',').map(k => k.trim().toLowerCase());
        if (kwList.some(keyword => lowerInput.includes(keyword))) {
            return entry.answer;
        }
    }
    
    return "That is a great question! I can provide info about Aditya's skills, development workflow, Flutter camera projects, or email contacts. Or, enter your Gemini API key in the settings tab (gear icon) to enable live generative AI conversation!";
}

// Conversation context history array
let conversationHistory = [];

// Gemini API Live fetch call
async function fetchGeminiReply(userMessage, apiKey) {
    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;
    
    conversationHistory.push({
        role: "user",
        parts: [{ text: userMessage }]
    });

    const requestData = {
        contents: conversationHistory,
        systemInstruction: {
            parts: [{ 
                text: `You are Aditya AI, representing Aditya. Here is your profile data:
                       Name: ${activeConfig.profile.name}
                       Role: ${activeConfig.profile.label}
                       About: ${activeConfig.profile.about.replace(/<[^>]*>/g, '')}
                       Project details: ${activeConfig.project.title} - ${activeConfig.project.desc}
                       Always answer queries politely and professionally. Keep answers under 3 sentences max. If they ask about other projects, state that he specializes in native ML apps like ${activeConfig.project.title}.`
            }]
        }
    };

    try {
        const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestData)
        });

        hideTypingIndicator();

        if (!response.ok) {
            console.error("Gemini request failed");
            addBotMessage("I encountered an error communicating with Gemini API. Falling back to offline context: " + getOfflineReply(userMessage));
            conversationHistory.pop();
            return;
        }

        const data = await response.json();
        const botReply = data.candidates[0].content.parts[0].text;
        
        addBotMessage(botReply);
        
        conversationHistory.push({
            role: "model",
            parts: [{ text: botReply }]
        });
        
        if (conversationHistory.length > 10) {
            conversationHistory.shift();
            conversationHistory.shift();
        }

    } catch (err) {
        console.error("Network request failed:", err);
        hideTypingIndicator();
        addBotMessage("A network error occurred. Falling back to offline context: " + getOfflineReply(userMessage));
        conversationHistory.pop();
    }
}
