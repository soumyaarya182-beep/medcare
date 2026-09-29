/* =========================================================
   MEDCARE - FRONTEND JAVASCRIPT
   ========================================================= */

/*
   Backend URL

   Local development:
   Frontend: http://localhost:5500
   Backend:  http://localhost:5000

   If frontend and backend are deployed together,
   you can change this back to '/api'.
*/

const API = "http://localhost:5000/api";


/* =========================================================
   GLOBAL STATE
   ========================================================= */

let authToken = localStorage.getItem("medcare_token") || null;

let currentUser =
    JSON.parse(localStorage.getItem("medcare_user")) || null;

let chatHistory = [];

let autoSpeak = false;


/* =========================================================
   DOM HELPERS
   ========================================================= */

const $ = (selector) => document.querySelector(selector);

const $$ = (selector) => document.querySelectorAll(selector);


/* =========================================================
   LIVE REGION / ACCESSIBILITY
   ========================================================= */

function announce(message) {

    const liveRegion = $("#live-region");

    if (!liveRegion) return;

    liveRegion.textContent = "";

    setTimeout(() => {
        liveRegion.textContent = message;
    }, 50);
}


/* =========================================================
   API HELPER
   ========================================================= */

async function apiRequest(
    endpoint,
    options = {}
) {

    const headers = {
        "Content-Type": "application/json",
        ...(options.headers || {})
    };


    if (authToken) {
        headers.Authorization =
            `Bearer ${authToken}`;
    }


    try {

        const response = await fetch(
            `${API}${endpoint}`,
            {
                ...options,
                headers
            }
        );


        const data =
            await response.json()
                .catch(() => ({}));


        if (!response.ok) {

            throw new Error(
                data.message ||
                data.error ||
                "Something went wrong."
            );

        }


        return data;

    } catch (error) {

        console.error(
            "API Error:",
            error
        );

        throw error;
    }
}


/* =========================================================
   AUTH TOKEN
   ========================================================= */

function saveAuth(
    token,
    user
) {

    authToken = token;
    currentUser = user;

    localStorage.setItem(
        "medcare_token",
        token
    );

    localStorage.setItem(
        "medcare_user",
        JSON.stringify(user)
    );
}


function clearAuth() {

    authToken = null;
    currentUser = null;

    localStorage.removeItem(
        "medcare_token"
    );

    localStorage.removeItem(
        "medcare_user"
    );
}


/* =========================================================
   AUTH MODAL
   ========================================================= */

const authModal = $("#auth-modal");

const loginForm = $("#login-form");

const registerForm =
    $("#register-form");

const loginNavBtn =
    $("#login-nav-btn");

const getStartedBtn =
    $("#get-started-btn");

const closeAuth =
    $("#close-auth");

const toggleAuth =
    $("#toggle-auth");


function openAuthModal(
    mode = "login"
) {

    if (!authModal) return;

    authModal.hidden = false;

    document.body.classList.add(
        "modal-open"
    );

    setAuthMode(mode);

    announce(
        `${mode === "login"
            ? "Login"
            : "Registration"} dialog opened`
    );
}


function closeAuthModal() {

    if (!authModal) return;

    authModal.hidden = true;

    document.body.classList.remove(
        "modal-open"
    );
}


function setAuthMode(mode) {

    if (!loginForm ||
        !registerForm ||
        !toggleAuth) {
        return;
    }


    if (mode === "register") {

        loginForm.hidden = true;

        registerForm.hidden = false;

        toggleAuth.innerHTML =
            `Already have an account?
             <strong>Login</strong>`;

    } else {

        loginForm.hidden = false;

        registerForm.hidden = true;

        toggleAuth.innerHTML =
            `Don't have an account?
             <strong>Register</strong>`;
    }
}


/* =========================================================
   AUTH EVENTS
   ========================================================= */

loginNavBtn?.addEventListener(
    "click",
    (event) => {

        event.preventDefault();

        openAuthModal("login");
    }
);


getStartedBtn?.addEventListener(
    "click",
    () => {

        openAuthModal("register");
    }
);


closeAuth?.addEventListener(
    "click",
    closeAuthModal
);


$(".modal-overlay")?.addEventListener(
    "click",
    closeAuthModal
);


toggleAuth?.addEventListener(
    "click",
    () => {

        const isLoginVisible =
            !loginForm.hidden;

        setAuthMode(
            isLoginVisible
                ? "register"
                : "login"
        );
    }
);


/* =========================================================
   LOGIN
   ========================================================= */

loginForm?.addEventListener(
    "submit",
    async (event) => {

        event.preventDefault();


        const email =
            $("#login-email").value.trim();

        const password =
            $("#login-password").value;


        if (!email || !password) {

            alert(
                "Please enter email and password."
            );

            return;
        }


        try {

            const button =
                loginForm.querySelector(
                    "button[type='submit']"
                );

            button.disabled = true;

            button.textContent =
                "Logging in...";


            const result =
                await apiRequest(
                    "/auth/login",
                    {
                        method: "POST",

                        body: JSON.stringify({
                            email,
                            password
                        })
                    }
                );


            saveAuth(
                result.token,
                result.user
            );


            closeAuthModal();


            announce(
                "Login successful"
            );


            await loadDashboard();


            alert(
                `Welcome back, ${
                    result.user?.name ||
                    "User"
                }!`
            );


        } catch (error) {

            alert(
                error.message ||
                "Login failed."
            );

        } finally {

            const button =
                loginForm.querySelector(
                    "button[type='submit']"
                );

            if (button) {

                button.disabled = false;

                button.textContent =
                    "Login";
            }
        }
    }
);


/* =========================================================
   REGISTER
   ========================================================= */

registerForm?.addEventListener(
    "submit",
    async (event) => {

        event.preventDefault();


        const name =
            $("#register-name").value.trim();

        const email =
            $("#register-email").value.trim();

        const password =
            $("#register-password").value;


        if (!name ||
            !email ||
            !password) {

            alert(
                "Please fill in all fields."
            );

            return;
        }


        if (password.length < 6) {

            alert(
                "Password must contain at least 6 characters."
            );

            return;
        }


        try {

            const button =
                registerForm.querySelector(
                    "button[type='submit']"
                );

            button.disabled = true;

            button.textContent =
                "Creating account...";


            const result =
                await apiRequest(
                    "/auth/register",
                    {
                        method: "POST",

                        body: JSON.stringify({
                            name,
                            email,
                            password
                        })
                    }
                );


            saveAuth(
                result.token,
                result.user
            );


            closeAuthModal();


            announce(
                "Account created successfully"
            );


            await loadDashboard();


            alert(
                `Welcome to MEDCARE, ${name}!`
            );


        } catch (error) {

            alert(
                error.message ||
                "Registration failed."
            );

        } finally {

            const button =
                registerForm.querySelector(
                    "button[type='submit']"
                );

            if (button) {

                button.disabled = false;

                button.textContent =
                    "Create Account";
            }
        }
    }
);


/* =========================================================
   DASHBOARD
   ========================================================= */

async function loadDashboard() {

    const dashboard =
        $("#dashboard-content");

    if (!dashboard) return;


    if (!authToken) {

        dashboard.innerHTML = `
            <div class="dashboard-empty">
                <h3>Login to view your dashboard</h3>
                <p>
                    Sign in to access your appointments,
                    medicines and prescriptions.
                </p>
            </div>
        `;

        return;
    }


    try {

        const data =
            await apiRequest(
                "/dashboard"
            );


        renderDashboard(data);


    } catch (error) {

        console.error(
            "Dashboard error:",
            error
        );


        dashboard.innerHTML = `
            <div class="dashboard-empty">
                <h3>Unable to load dashboard</h3>
                <p>
                    Please try again later.
                </p>
            </div>
        `;
    }
}


/* =========================================================
   DASHBOARD UI
   ========================================================= */

function renderDashboard(data) {

    const dashboard =
        $("#dashboard-content");

    if (!dashboard) return;


    const appointments =
        data.appointments || [];

    const reminders =
        data.reminders || [];

    const prescriptions =
        data.prescriptions || [];


    dashboard.innerHTML = `

        <div class="dashboard-card">

            <div class="dashboard-card-icon">
                📅
            </div>

            <h3>
                Appointments
            </h3>

            <strong>
                ${appointments.length}
            </strong>

            <p>
                Upcoming appointments
            </p>

        </div>


        <div class="dashboard-card">

            <div class="dashboard-card-icon">
                💊
            </div>

            <h3>
                Medicines
            </h3>

            <strong>
                ${reminders.length}
            </strong>

            <p>
                Active reminders
            </p>

        </div>


        <div class="dashboard-card">

            <div class="dashboard-card-icon">
                📋
            </div>

            <h3>
                Prescriptions
            </h3>

            <strong>
                ${prescriptions.length}
            </strong>

            <p>
                Saved prescriptions
            </p>

        </div>


        <div class="dashboard-card">

            <div class="dashboard-card-icon">
                ✨
            </div>

            <h3>
                Meera AI
            </h3>

            <strong>
                24/7
            </strong>

            <p>
                AI health assistance
            </p>

        </div>

    `;
}


/* =========================================================
   MEERA CHAT
   ========================================================= */

const chatInput =
    $("#chat-input");

const sendChat =
    $("#send-chat");

const chatMessages =
    $("#chat-messages");


function addChatMessage(
    message,
    sender = "user"
) {

    if (!chatMessages) return;


    const wrapper =
        document.createElement("div");


    wrapper.className =
        sender === "meera"
            ? "chat-message meera-message"
            : "chat-message user-message";


    wrapper.innerHTML = `

        ${
            sender === "meera"
                ? `<div class="message-avatar">✨</div>`
                : ""
        }

        <div class="message-bubble">
            ${escapeHTML(message)}
        </div>

    `;


    chatMessages.appendChild(
        wrapper
    );


    chatMessages.scrollTop =
        chatMessages.scrollHeight;
}


async function sendMessage() {

    if (!chatInput) return;


    const message =
        chatInput.value.trim();


    if (!message) return;


    addChatMessage(
        message,
        "user"
    );


    chatInput.value = "";


    chatHistory.push({
        role: "user",
        content: message
    });


    try {

        const response =
            await apiRequest(
                "/ai/chat",
                {
                    method: "POST",

                    body: JSON.stringify({
                        message,
                        history: chatHistory
                    })
                }
            );


        const reply =
            response.reply ||
            response.message ||
            "I'm sorry, I couldn't process that request.";


        addChatMessage(
            reply,
            "meera"
        );


        chatHistory.push({
            role: "assistant",
            content: reply
        });


        if (autoSpeak) {

            speakText(reply);
        }


    } catch (error) {

        console.error(
            "Meera error:",
            error
        );


        const fallback =
            "I'm having trouble connecting right now. Please try again.";


        addChatMessage(
            fallback,
            "meera"
        );
    }
}


/* =========================================================
   CHAT EVENTS
   ========================================================= */

sendChat?.addEventListener(
    "click",
    sendMessage
);


chatInput?.addEventListener(
    "keydown",
    (event) => {

        if (
            event.key === "Enter" &&
            !event.shiftKey
        ) {

            event.preventDefault();

            sendMessage();
        }
    }
);


/* =========================================================
   TEXT TO SPEECH
   ========================================================= */

function speakText(text) {

    if (!("speechSynthesis" in window)) {

        announce(
            "Text to speech is not supported by your browser."
        );

        return;
    }


    window.speechSynthesis.cancel();


    const utterance =
        new SpeechSynthesisUtterance(text);


    utterance.rate = 0.95;

    utterance.pitch = 1;

    utterance.volume = 1;


    window.speechSynthesis.speak(
        utterance
    );
}


/* =========================================================
   VOICE INPUT
   ========================================================= */

const voiceBtn =
    $("#voice-btn");


let recognition = null;


function setupVoiceRecognition() {

    const SpeechRecognition =
        window.SpeechRecognition ||
        window.webkitSpeechRecognition;


    if (!SpeechRecognition) {

        console.warn(
            "Speech recognition is not supported."
        );

        return;
    }


    recognition =
        new SpeechRecognition();


    recognition.continuous = false;

    recognition.interimResults = false;

    recognition.lang = "en-IN";


    recognition.onstart = () => {

        voiceBtn?.classList.add(
            "recording"
        );

        announce(
            "Listening"
        );
    };


    recognition.onresult =
        (event) => {

            const transcript =
                event.results[0][0].transcript;


            if (chatInput) {

                chatInput.value =
                    transcript;
            }
        };


    recognition.onerror =
        (event) => {

            console.error(
                "Speech recognition error:",
                event.error
            );
        };


    recognition.onend = () => {

        voiceBtn?.classList.remove(
            "recording"
        );
    };
}


voiceBtn?.addEventListener(
    "click",
    () => {

        if (!recognition) {

            alert(
                "Voice input is not supported in this browser."
            );

            return;
        }


        try {

            recognition.start();

        } catch (error) {

            console.log(
                "Voice recognition already active."
            );
        }
    }
);


setupVoiceRecognition();


/* =========================================================
   MOBILE NAVIGATION
   ========================================================= */

const hamburger =
    $("#hamburger");

const navLinks =
    $(".nav-links");


hamburger?.addEventListener(
    "click",
    () => {

        const expanded =
            hamburger.getAttribute(
                "aria-expanded"
            ) === "true";


        hamburger.setAttribute(
            "aria-expanded",
            String(!expanded)
        );


        navLinks?.classList.toggle(
            "open"
        );
    }
);


$$(".nav-links a").forEach(
    link => {

        link.addEventListener(
            "click",
            () => {

                navLinks?.classList.remove(
                    "open"
                );

                hamburger?.setAttribute(
                    "aria-expanded",
                    "false"
                );
            }
        );
    }
);


/* =========================================================
   SOS
   ========================================================= */

const sosButton =
    $("#sos-btn");


sosButton?.addEventListener(
    "click",
    () => {

        const confirmed =
            confirm(
                "Emergency SOS will attempt to contact emergency assistance. Continue?"
            );


        if (!confirmed) return;


        announce(
            "Emergency assistance requested."
        );


        /*
           Browser security prevents a website
           from automatically contacting emergency
           services without user interaction.

           You can replace this with your own
           backend/emergency-contact implementation.
        */


        window.location.href =
            "tel:112";
    }
);


/* =========================================================
   SCROLL REVEAL
   ========================================================= */

function setupScrollReveal() {

    const elements =
        $$(".reveal");


    if (!elements.length) return;


    if (!("IntersectionObserver" in window)) {

        elements.forEach(
            element =>
                element.classList.add(
                    "visible"
                )
        );

        return;
    }


    const observer =
        new IntersectionObserver(
            entries => {

                entries.forEach(
                    entry => {

                        if (
                            entry.isIntersecting
                        ) {

                            entry.target.classList.add(
                                "visible"
                            );

                            observer.unobserve(
                                entry.target
                            );
                        }
                    }
                );
            },
            {
                threshold: 0.12
            }
        );


    elements.forEach(
        element =>
            observer.observe(element)
    );
}


setupScrollReveal();


/* =========================================================
   KEYBOARD ACCESSIBILITY
   ========================================================= */

document.addEventListener(
    "keydown",
    (event) => {

        if (
            event.key === "Escape"
        ) {

            if (
                authModal &&
                !authModal.hidden
            ) {

                closeAuthModal();
            }


            navLinks?.classList.remove(
                "open"
            );


            hamburger?.setAttribute(
                "aria-expanded",
                "false"
            );
        }
    }
);


/* =========================================================
   SMOOTH SCROLL
   ========================================================= */

$$('a[href^="#"]').forEach(
    link => {

        link.addEventListener(
            "click",
            (event) => {

                const targetId =
                    link.getAttribute(
                        "href"
                    );


                if (
                    !targetId ||
                    targetId === "#"
                ) {

                    return;
                }


                const target =
                    document.querySelector(
                        targetId
                    );


                if (!target) return;


                event.preventDefault();


                target.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });
            }
        );
    }
);


/* =========================================================
   ESCAPE HTML
   ========================================================= */

function escapeHTML(value) {

    const div =
        document.createElement(
            "div"
        );


    div.textContent =
        String(value);


    return div.innerHTML;
}


/* =========================================================
   BACKEND CONNECTION CHECK
   ========================================================= */

async function checkBackend() {

    try {

        const response =
            await fetch(
                `${API}/health`
            );


        if (!response.ok) {

            throw new Error(
                "Backend unavailable"
            );
        }


        console.log(
            "✓ MEDCARE backend connected"
        );


    } catch (error) {

        console.warn(
            "MEDCARE backend is not running."
        );
    }
}


/* =========================================================
   INITIALIZATION
   ========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    async () => {

        console.log(
            "MEDCARE frontend loaded."
        );


        await checkBackend();


        if (authToken) {

            await loadDashboard();
        }


        /*
           Detect browser reduced-motion
           preference.
        */

        if (
            window.matchMedia(
                "(prefers-reduced-motion: reduce)"
            ).matches
        ) {

            document.documentElement
                .classList.add(
                    "reduced-motion"
                );
        }
    }
);