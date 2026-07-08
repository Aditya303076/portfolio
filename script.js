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
    if (chatGreetNode) chatGreetNode.innerHTML = `<span class="term-prompt">aditya@system:~$</span> ${activeConfig.chatbot.greeting}`;
    if (chatMockNode) chatMockNode.textContent = activeConfig.chatbot.mockText;
}

// Run config loader instantly
loadPortfolioConfig();


// ==========================================================================
// BACKGROUND CANVAS COORDINATE GRID & PARTICLES SYSTEM
// ==========================================================================
const canvas = document.getElementById('bg-canvas');
const ctx = canvas.getContext('2d');

let particles = [];
const particleCount = 25;
let activeGridEffect = true;
let mouseX = -1000;
let mouseY = -1000;
let isMouseOnScreen = false;

function resizeCanvas() {
    if (canvas) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    isMouseOnScreen = true;
});

window.addEventListener('mouseleave', () => {
    isMouseOnScreen = false;
});

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
        this.size = Math.random() * 2 + 0.5;
        this.speedY = -(Math.random() * 0.4 + 0.1);
        this.speedX = Math.random() * 0.2 - 0.1;
        this.opacity = Math.random() * 0.3 + 0.05;
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
        ctx.fill();
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
    const width = canvas.width;
    const height = canvas.height;
    
    // Technical grid spacing
    const size = 70;
    
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.008)';
    ctx.lineWidth = 1;
    
    // Draw vertical lines
    for (let x = 0; x < width; x += size) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
    }
    
    // Draw horizontal lines
    for (let y = 0; y < height; y += size) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
    }
    
    // Interactive mouse coordinate tracking
    if (isMouseOnScreen && activeGridEffect) {
        // Subtle axis alignment lines
        ctx.strokeStyle = 'rgba(255, 204, 1, 0.015)';
        ctx.beginPath();
        ctx.moveTo(mouseX, 0);
        ctx.lineTo(mouseX, height);
        ctx.moveTo(0, mouseY);
        ctx.lineTo(width, mouseY);
        ctx.stroke();
        
        // Digital scope reticle
        ctx.strokeStyle = 'rgba(255, 204, 1, 0.1)';
        ctx.beginPath();
        ctx.arc(mouseX, mouseY, 10, 0, Math.PI * 2);
        ctx.stroke();
        
        // Render current coordinate coordinates label
        ctx.fillStyle = 'rgba(255, 204, 1, 0.3)';
        ctx.font = '9px monospace';
        ctx.fillText(`SYS.LOC // [${Math.floor(mouseX)}px, ${Math.floor(mouseY)}px]`, mouseX + 15, mouseY - 12);
        
        // Highlight grid points nearby
        const range = 180;
        const startX = Math.floor((mouseX - range) / size) * size;
        const endX = Math.floor((mouseX + range) / size) * size;
        const startY = Math.floor((mouseY - range) / size) * size;
        const endY = Math.floor((mouseY + range) / size) * size;
        
        for (let x = startX; x <= endX; x += size) {
            for (let y = startY; y <= endY; y += size) {
                const dist = Math.hypot(x - mouseX, y - mouseY);
                if (dist < range) {
                    const intensity = (1 - dist / range);
                    ctx.fillStyle = `rgba(255, 204, 1, ${intensity * 0.35})`;
                    ctx.beginPath();
                    ctx.arc(x, y, 2.5, 0, Math.PI * 2);
                    ctx.fill();
                    
                    // Outer pulse overlay
                    ctx.fillStyle = `rgba(255, 204, 1, ${intensity * 0.1})`;
                    ctx.beginPath();
                    ctx.arc(x, y, 5, 0, Math.PI * 2);
                    ctx.fill();
                }
            }
        }
    }
}

if (canvas && ctx) {
    animateParticles();
}

// ==========================================================================
// TECHNICAL INTERACTIVE COMPONENT UTILITIES
// ==========================================================================

// Global Notification Toast
function showNotification(msg) {
    let container = document.getElementById('tech-toast-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'tech-toast-container';
        container.className = 'tech-toast-container';
        document.body.appendChild(container);
    }
    
    const toast = document.createElement('div');
    toast.className = 'tech-toast glass-panel';
    toast.innerHTML = `<i class="fa-solid fa-microchip"></i> <span>${msg}</span>`;
    container.appendChild(toast);
    
    setTimeout(() => {
        toast.classList.add('show');
    }, 50);
    
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 400);
    }, 3200);
}

// Metrics Counting Up Animation
function initMetricCounters() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
                entry.target.classList.add('counted');
                animateCounter(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    document.querySelectorAll('.metric-card h3').forEach(item => {
        observer.observe(item);
    });
}

function animateCounter(el) {
    const rawText = el.textContent;
    const numMatch = rawText.match(/\d+/);
    if (!numMatch) return;
    
    const targetVal = parseInt(numMatch[0]);
    const suffix = rawText.replace(numMatch[0], '');
    
    let startVal = 0;
    const duration = 1200;
    const startTime = performance.now();
    
    function updateCounter(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased = progress * (2 - progress); // easeOutQuad
        
        el.textContent = Math.floor(eased * targetVal) + suffix;
        
        if (progress < 1) {
            requestAnimationFrame(updateCounter);
        } else {
            el.textContent = targetVal + suffix;
        }
    }
    requestAnimationFrame(updateCounter);
}

// 3D Perspective Card Tilt Rotations
function initCardTilts() {
    const tiltItems = document.querySelectorAll('.service-card, .project-showcase, .architecture-diagram, .chatbot-panel');
    tiltItems.forEach(item => {
        item.addEventListener('mousemove', (e) => {
            const rect = item.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = ((centerY - y) / centerY) * 5; // max 5 degrees
            const rotateY = ((x - centerX) / centerX) * 5; 
            
            item.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.01, 1.01, 1.01)`;
            item.style.setProperty('--mouse-x', `${(x / rect.width) * 100}%`);
            item.style.setProperty('--mouse-y', `${(y / rect.height) * 100}%`);
        });
        
        item.addEventListener('mouseleave', () => {
            item.style.transform = '';
            item.style.setProperty('--mouse-x', '50%');
            item.style.setProperty('--mouse-y', '50%');
        });
    });
}

// Command Palette Keyboard Search Controls (Ctrl + K)
function initCommandPalette() {
    const cmdPalette = document.getElementById('cmd-palette');
    const cmdInput = document.getElementById('cmd-palette-input');
    const cmdSuggestions = document.getElementById('cmd-palette-suggestions');
    const cmdResults = document.getElementById('cmd-palette-results');
    const cmdCloseBtn = document.getElementById('cmd-close-btn');
    const navCmdBtn = document.getElementById('nav-cmd-btn');
    
    if (!cmdPalette) return;
    
    let activeIndex = -1;
    let visibleItems = [];

    function openPalette() {
        cmdPalette.classList.add('active');
        cmdPalette.setAttribute('aria-hidden', 'false');
        setTimeout(() => cmdInput.focus(), 50);
        resetSearch();
    }
    
    function closePalette() {
        cmdPalette.classList.remove('active');
        cmdPalette.setAttribute('aria-hidden', 'true');
    }
    
    function resetSearch() {
        cmdInput.value = '';
        cmdSuggestions.style.display = 'block';
        cmdResults.style.display = 'none';
        activeIndex = -1;
        updateSelection();
    }
    
    window.addEventListener('keydown', (e) => {
        if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
            e.preventDefault();
            if (cmdPalette.classList.contains('active')) {
                closePalette();
            } else {
                openPalette();
            }
        }
        
        if (e.key === 'Escape' && cmdPalette.classList.contains('active')) {
            closePalette();
        }
    });
    
    if (navCmdBtn) navCmdBtn.addEventListener('click', openPalette);
    if (cmdCloseBtn) cmdCloseBtn.addEventListener('click', closePalette);
    
    cmdPalette.addEventListener('click', (e) => {
        if (e.target === cmdPalette) closePalette();
    });
    
    cmdInput.addEventListener('input', () => {
        const query = cmdInput.value.trim().toLowerCase();
        if (!query) {
            cmdSuggestions.style.display = 'block';
            cmdResults.style.display = 'none';
            activeIndex = -1;
            return;
        }
        
        cmdSuggestions.style.display = 'none';
        cmdResults.style.display = 'block';
        
        const allItems = Array.from(cmdSuggestions.querySelectorAll('.cmd-item'));
        cmdResults.innerHTML = '';
        
        const filtered = allItems.filter(item => {
            const text = item.textContent.toLowerCase();
            const shortcut = item.querySelector('.cmd-shortcut') ? item.querySelector('.cmd-shortcut').textContent.toLowerCase() : '';
            return text.includes(query) || shortcut.includes(query);
        });
        
        if (filtered.length > 0) {
            filtered.forEach(item => {
                const clone = item.cloneNode(true);
                clone.setAttribute('data-action', item.getAttribute('data-action'));
                if (item.hasAttribute('data-target')) {
                    clone.setAttribute('data-target', item.getAttribute('data-target'));
                }
                clone.addEventListener('click', () => handleCmdAction(clone));
                cmdResults.appendChild(clone);
            });
        } else {
            cmdResults.innerHTML = `<div class="cmd-no-results">No options match "${query}"</div>`;
        }
        
        activeIndex = -1;
        updateSelection();
    });
    
    cmdPalette.addEventListener('keydown', (e) => {
        if (!cmdPalette.classList.contains('active')) return;
        
        const container = cmdResults.style.display === 'block' ? cmdResults : cmdSuggestions;
        visibleItems = Array.from(container.querySelectorAll('.cmd-item'));
        
        if (visibleItems.length === 0) return;
        
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            activeIndex = (activeIndex + 1) % visibleItems.length;
            updateSelection();
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            activeIndex = (activeIndex - 1 + visibleItems.length) % visibleItems.length;
            updateSelection();
        } else if (e.key === 'Enter') {
            e.preventDefault();
            if (activeIndex >= 0 && activeIndex < visibleItems.length) {
                handleCmdAction(visibleItems[activeIndex]);
            }
        }
    });
    
    function updateSelection() {
        visibleItems.forEach((item, idx) => {
            if (idx === activeIndex) {
                item.classList.add('selected');
                item.scrollIntoView({ block: 'nearest' });
            } else {
                item.classList.remove('selected');
            }
        });
    }
    
    cmdSuggestions.querySelectorAll('.cmd-item').forEach(item => {
        item.addEventListener('click', () => handleCmdAction(item));
    });
    
    function handleCmdAction(item) {
        const action = item.getAttribute('data-action');
        const target = item.getAttribute('data-target');
        
        closePalette();
        
        if (action === 'nav') {
            const section = document.getElementById(target);
            if (section) {
                section.scrollIntoView({ behavior: 'smooth' });
                history.pushState(null, null, `#${target}`);
            }
        } else if (action === 'chat') {
            if (chatbotWidget && chatInput) {
                chatbotWidget.classList.add('active');
                if (target === 'hello') {
                    chatInput.focus();
                } else {
                    chatInput.value = target;
                    handleUserSend();
                }
            }
        } else if (action === 'admin') {
            window.location.href = 'admin.html';
        } else if (action === 'grid') {
            activeGridEffect = !activeGridEffect;
            showNotification(activeGridEffect ? 'Interactive tracking grid activated' : 'Background grid deactivated');
        }
    }
}

// Live Scanning Dashboard Simulator (Featured Project Card)
function initScannerMock() {
    const scanEmotion = document.getElementById('scan-val-emotion');
    const scanPercent = document.getElementById('scan-val-percent');
    if (!scanEmotion || !scanPercent) return;
    
    const moods = ['FOCUSED', 'CREATIVE', 'ENGAGED', 'CALCULATING', 'INNOVATING', 'ACTIVE'];
    
    setInterval(() => {
        const mood = moods[Math.floor(Math.random() * moods.length)];
        const confidence = (Math.random() * 4 + 95.8).toFixed(2);
        
        scanEmotion.textContent = mood;
        scanPercent.textContent = `${confidence}%`;
        
        // Randomize coordinates and metrics in log screen
        const debugLogs = document.querySelectorAll('.scanner-debug-panel .debug-log-line');
        if (debugLogs.length >= 5) {
            const rx = Math.floor(Math.random() * 150 + 420);
            const ry = Math.floor(Math.random() * 100 + 150);
            debugLogs[3].textContent = `> target_coordinates: x[${rx}] y[${ry}]`;
            
            const rTime = Math.floor(Math.random() * 7 + 8);
            debugLogs[4].textContent = `> response_delay: ${rTime}ms`;
        }
    }, 2800);
}

// Active Navbar Item Scroll Highlighting
function initActiveSectionObserver() {
    const sections = document.querySelectorAll('section');
    const links = document.querySelectorAll('.nav-links a');
    
    if (sections.length === 0 || links.length === 0) return;
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                links.forEach(l => {
                    if (l.getAttribute('href') === `#${id}`) {
                        l.classList.add('active');
                    } else {
                        l.classList.remove('active');
                    }
                });
            }
        });
    }, {
        root: null,
        rootMargin: '-55% 0px -45% 0px'
    });
    
    sections.forEach(s => observer.observe(s));
}

// Copy Contact Email to Clipboard
function initCopyEmail() {
    const copyBtn = document.getElementById('copy-email-btn');
    if (copyBtn) {
        copyBtn.addEventListener('click', () => {
            const email = 'info@aditya.dev';
            navigator.clipboard.writeText(email)
                .then(() => {
                    showNotification('Email address copied to clipboard');
                })
                .catch(err => {
                    console.error('Clipboard copy failed: ', err);
                });
        });
    }
}

// Bind all technical components on DOM load
document.addEventListener('DOMContentLoaded', () => {
    initMetricCounters();
    initCardTilts();
    initCommandPalette();
    initScannerMock();
    initActiveSectionObserver();
    initCopyEmail();
});

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

// Toggle chatbot panel open/close
if (chatbotBubble && chatbotWidget && chatInput) {
    chatbotBubble.addEventListener('click', (e) => {
        e.stopPropagation(); // Prevent document click handler from instantly firing
        chatbotWidget.classList.toggle('active');
        if (chatbotWidget.classList.contains('active')) {
            chatInput.focus();
        }
    });
}

// Close chatbot when clicking outside of it
document.addEventListener('click', (e) => {
    if (chatbotWidget && chatbotWidget.classList.contains('active')) {
        if (!chatbotWidget.contains(e.target)) {
            const isHeroBtn = heroChatBtn && heroChatBtn.contains(e.target);
            const isCmdBtn = document.getElementById('nav-cmd-btn') && document.getElementById('nav-cmd-btn').contains(e.target);
            if (!isHeroBtn && !isCmdBtn) {
                chatbotWidget.classList.remove('active');
            }
        }
    }
});

// Update chatbot connection status indicators from backend
async function checkBackendGeminiStatus() {
    try {
        const res = await fetch('/api/get_gemini_status');
        if (res.ok) {
            const data = await res.json();
            if (botStatusText) {
                if (data.status === 'configured') {
                    botStatusText.textContent = "Active (Gemini Live)";
                } else {
                    botStatusText.textContent = "Active (Offline RAG Mode)";
                }
            }
        }
    } catch(e) {
        if (botStatusText) botStatusText.textContent = "Offline (Local)";
    }
}
checkBackendGeminiStatus();

// Send messages actions
async function handleUserSend() {
    if (!chatInput) return;
    const text = chatInput.value.trim();
    if (!text) return;
    
    addUserMessage(text);
    chatInput.value = '';
    
    showTypingIndicator();
    
    try {
        const formattedHistory = [];
        const msgElements = chatMessages.querySelectorAll('.message');
        
        msgElements.forEach(el => {
            if (el.id === 'dyn-chatbot-greeting') return;
            const isBot = el.classList.contains('bot');
            const contentText = el.innerText.replace(/^(user@client:~\$|aditya@system:~\$)/, '').trim();
            formattedHistory.push({
                role: isBot ? "model" : "user",
                text: contentText
            });
        });
        
        if (formattedHistory.length > 0 && formattedHistory[formattedHistory.length - 1].role === 'user') {
            formattedHistory.pop();
        }
        
        const response = await fetch('/api/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                message: text,
                history: formattedHistory
            })
        });
        
        hideTypingIndicator();
        
        if (response.ok) {
            const data = await response.json();
            addBotMessage(data.reply);
        } else {
            addBotMessage("Server error executing conversations.");
        }
    } catch(err) {
        console.error("Chat request failed:", err);
        hideTypingIndicator();
        addBotMessage("Connection error. Ensure your server is active.");
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
        chatInput.value = query;
        handleUserSend();
    });
});

// UI helper methods
function addUserMessage(text) {
    if (!chatMessages) return;
    const msg = document.createElement('div');
    msg.className = 'message user';
    msg.innerHTML = `<span class="term-prompt">user@client:~$</span> ${text}`;
    chatMessages.appendChild(msg);
    scrollChat();
}

function addBotMessage(text) {
    if (!chatMessages) return;
    const msg = document.createElement('div');
    msg.className = 'message bot';
    msg.innerHTML = `<span class="term-prompt">aditya@system:~$</span> ${text}`;
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
    
    return "That is a great question! I can provide info about Aditya's skills, development workflow, Flutter camera projects, or email contacts.";
}

// Window Scroll Progress Indicator & Parallax Custom Property
window.addEventListener('scroll', () => {
    const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = height > 0 ? (winScroll / height) * 100 : 0;
    
    document.documentElement.style.setProperty('--scroll-progress', `${scrolled}%`);
    document.documentElement.style.setProperty('--scroll-y', `${winScroll}px`);
});
