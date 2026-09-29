/*
=========================================================
MEDCARE - AI.JS
=========================================================

Purpose:
    Frontend AI assistant for the MedCare website.

Features:
    1. AI chat interface
    2. Send messages to backend
    3. Conversation history
    4. Loading state
    5. Error handling
    6. Clear conversation
    7. Authentication support
    8. Quick questions
    9. Typing indicator
    10. Message timestamps
    11. Character limit
    12. Basic input validation
    13. Markdown-like response formatting
    14. Emergency warning handling
    15. API timeout handling

IMPORTANT:
    NEVER put an OpenAI/Gemini/other AI API key in this file.

The browser should communicate with:

    /api/ai/chat

Your backend should communicate with the AI provider.

=========================================================
*/

"use strict";


/*
=========================================================
1. AI CONFIGURATION
=========================================================
*/

const AI_CONFIG = {

    /*
    Backend endpoint.

    If data.js is loaded before this file,
    getApiUrl() can be used.

    Example:

        http://localhost:5000/api/ai/chat
    */

    endpoint:
        "/ai/chat",


    /*
    Maximum characters allowed in one message.
    */

    maxMessageLength:
        2000,


    /*
    Maximum number of messages kept on frontend.
    */

    maxHistoryLength:
        30,


    /*
    Request timeout.

    30 seconds.
    */

    requestTimeout:
        30000,


    /*
    LocalStorage key.
    */

    storageKey:
        "medcare_ai_history",


    /*
    Number of quick questions displayed.
    */

    maxQuickQuestions:
        6,


    /*
    AI assistant name.
    */

    assistantName:
        "MedCare AI",


    /*
    Default greeting.
    */

    greeting:
        "Hello! I'm MedCare AI. I can help you navigate MedCare, understand how to use its features, manage appointments and reminders, and provide general health information. I cannot replace a qualified healthcare professional.",


    /*
    Emergency response message.
    */

    emergencyMessage:
        "If you are experiencing a medical emergency, please contact your local emergency service or seek immediate medical attention. MedCare AI should not be used for emergency diagnosis or treatment."


};


/*
=========================================================
2. QUICK QUESTIONS
=========================================================
*/

const AI_QUICK_QUESTIONS = [

    {
        id:
            "appointment",

        text:
            "How do I book an appointment?",

        icon:
            "fa-calendar-check"
    },


    {
        id:
            "doctor",

        text:
            "How do I find a doctor?",

        icon:
            "fa-user-doctor"
    },


    {
        id:
            "reminder",

        text:
            "How do I create a medicine reminder?",

        icon:
            "fa-bell"
    },


    {
        id:
            "prescription",

        text:
            "Where can I see my prescriptions?",

        icon:
            "fa-file-prescription"
    },


    {
        id:
            "dashboard",

        text:
            "What can I see on my dashboard?",

        icon:
            "fa-chart-line"
    },


    {
        id:
            "account",

        text:
            "How do I update my profile?",

        icon:
            "fa-user"
    }

];


/*
=========================================================
3. AI STATE
=========================================================
*/

const AI_STATE = {

    messages:
        [],


    isLoading:
        false,


    isInitialized:
        false,


    requestController:
        null,


    conversationId:
        null

};


/*
=========================================================
4. DOM ELEMENTS
=========================================================
*/

const AI_ELEMENTS = {

    container:
        null,

    messages:
        null,

    input:
        null,

    sendButton:
        null,

    clearButton:
        null,

    quickQuestions:
        null,

    typingIndicator:
        null,

    characterCounter:
        null,

    status:
        null

};


/*
=========================================================
5. INITIALIZE AI
=========================================================
*/

function initializeAI() {

    /*
    Find main AI container.

    Supported IDs:

        #aiChat
        #ai-chat
        #medcareAI
        #aiAssistant
    */

    AI_ELEMENTS.container =
        document.querySelector(
            "#aiChat, #ai-chat, #medcareAI, #aiAssistant"
        );


    /*
    If the page does not contain the AI interface,
    don't throw an error.

    This allows data.js and ai.js to be included
    globally on every page.
    */

    if (
        !AI_ELEMENTS.container
    ) {

        console.log(
            "MedCare AI: chat container not found on this page."
        );

        return;

    }


    /*
    Find elements.
    */

    AI_ELEMENTS.messages =
        AI_ELEMENTS.container.querySelector(
            "#aiMessages, .ai-messages, [data-ai-messages]"
        );


    AI_ELEMENTS.input =
        AI_ELEMENTS.container.querySelector(
            "#aiInput, #aiMessage, textarea[data-ai-input], input[data-ai-input]"
        );


    AI_ELEMENTS.sendButton =
        AI_ELEMENTS.container.querySelector(
            "#aiSend, #sendAI, [data-ai-send]"
        );


    AI_ELEMENTS.clearButton =
        AI_ELEMENTS.container.querySelector(
            "#aiClear, [data-ai-clear]"
        );


    AI_ELEMENTS.quickQuestions =
        AI_ELEMENTS.container.querySelector(
            "#aiQuickQuestions, .ai-quick-questions, [data-ai-quick]"
        );


    AI_ELEMENTS.typingIndicator =
        AI_ELEMENTS.container.querySelector(
            "#aiTyping, .ai-typing, [data-ai-typing]"
        );


    AI_ELEMENTS.characterCounter =
        AI_ELEMENTS.container.querySelector(
            "#aiCharacterCounter, [data-ai-character-count]"
        );


    AI_ELEMENTS.status =
        AI_ELEMENTS.container.querySelector(
            "#aiStatus, [data-ai-status]"
        );


    /*
    Set up event listeners.
    */

    setupAIEvents();


    /*
    Load previous conversation.
    */

    loadAIHistory();


    /*
    Render quick questions.
    */

    renderQuickQuestions();


    /*
    Render existing messages.
    */

    renderMessages();


    /*
    Show greeting if there is no history.
    */

    if (
        AI_STATE.messages.length === 0
    ) {

        addAssistantMessage(
            AI_CONFIG.greeting,
            {
                save: true
            }
        );

    }


    /*
    Initialize state.
    */

    AI_STATE.isInitialized =
        true;


    updateAIStatus(
        "Online"
    );

}


/*
=========================================================
6. SETUP EVENTS
=========================================================
*/

function setupAIEvents() {

    /*
    Send button.
    */

    if (
        AI_ELEMENTS.sendButton
    ) {

        AI_ELEMENTS.sendButton.addEventListener(
            "click",
            handleSendMessage
        );

    }


    /*
    Clear conversation.
    */

    if (
        AI_ELEMENTS.clearButton
    ) {

        AI_ELEMENTS.clearButton.addEventListener(
            "click",
            clearAIConversation
        );

    }


    /*
    Enter key.
    */

    if (
        AI_ELEMENTS.input
    ) {

        AI_ELEMENTS.input.addEventListener(
            "keydown",
            handleInputKeydown
        );


        AI_ELEMENTS.input.addEventListener(
            "input",
            handleInputChange
        );

    }

}


/*
=========================================================
7. INPUT KEYDOWN
=========================================================
*/

function handleInputKeydown(
    event
) {

    /*
    Enter = send.

    Shift + Enter = new line.
    */

    if (
        event.key === "Enter" &&
        !event.shiftKey
    ) {

        event.preventDefault();

        handleSendMessage();

    }

}


/*
=========================================================
8. INPUT CHANGE
=========================================================
*/

function handleInputChange() {

    if (
        !AI_ELEMENTS.input
    ) {

        return;

    }


    const value =
        AI_ELEMENTS.input.value;


    /*
    Update character counter.
    */

    updateCharacterCounter(
        value.length
    );


    /*
    Prevent excessive input.
    */

    if (
        value.length >
        AI_CONFIG.maxMessageLength
    ) {

        AI_ELEMENTS.input.value =
            value.substring(
                0,
                AI_CONFIG.maxMessageLength
            );

        updateCharacterCounter(
            AI_CONFIG.maxMessageLength
        );

    }

}


/*
=========================================================
9. CHARACTER COUNTER
=========================================================
*/

function updateCharacterCounter(
    length
) {

    if (
        !AI_ELEMENTS.characterCounter
    ) {

        return;

    }


    AI_ELEMENTS.characterCounter.textContent =
        `${length}/${AI_CONFIG.maxMessageLength}`;

}


/*
=========================================================
10. SEND MESSAGE
=========================================================
*/

async function handleSendMessage() {

    /*
    Prevent duplicate requests.
    */

    if (
        AI_STATE.isLoading
    ) {

        return;

    }


    if (
        !AI_ELEMENTS.input
    ) {

        return;

    }


    const message =
        AI_ELEMENTS.input.value.trim();


    /*
    Empty message.
    */

    if (
        !message
    ) {

        return;

    }


    /*
    Validate message length.
    */

    if (
        message.length >
        AI_CONFIG.maxMessageLength
    ) {

        showAIError(
            `Please keep your message under ${AI_CONFIG.maxMessageLength} characters.`
        );

        return;

    }


    /*
    Add user message to interface.
    */

    addUserMessage(
        message
    );


    /*
    Clear input.
    */

    AI_ELEMENTS.input.value =
        "";

    updateCharacterCounter(
        0
    );


    /*
    Send to backend.
    */

    await sendMessageToAI(
        message
    );

}


/*
=========================================================
11. SEND MESSAGE TO BACKEND
=========================================================
*/

async function sendMessageToAI(
    message
) {

    /*
    Set loading state.
    */

    setAILoading(
        true
    );


    updateAIStatus(
        "Thinking..."
    );


    /*
    Cancel previous request if necessary.
    */

    if (
        AI_STATE.requestController
    ) {

        AI_STATE.requestController.abort();

    }


    AI_STATE.requestController =
        new AbortController();


    /*
    Create timeout.
    */

    const timeoutId =
        setTimeout(
            () => {

                AI_STATE.requestController.abort();

            },

            AI_CONFIG.requestTimeout
        );


    try {

        /*
        ---------------------------------------------
        GET AUTH TOKEN
        ---------------------------------------------
        */

        let token = null;


        if (
            typeof getAuthToken ===
            "function"
        ) {

            token =
                getAuthToken();

        }

        else {

            token =
                localStorage.getItem(
                    "medcare_token"
                );

        }


        /*
        ---------------------------------------------
        PREPARE REQUEST
        ---------------------------------------------
        */

        const requestBody = {

            message:
                message,


            /*
            Send conversation history.

            Do NOT send sensitive information unless
            the user intentionally provided it and your
            backend is designed to process it.
            */

            conversation:
                getConversationForAPI(),


            conversationId:
                AI_STATE.conversationId

        };


        /*
        ---------------------------------------------
        HEADERS
        ---------------------------------------------
        */

        const headers = {

            "Content-Type":
                "application/json"

        };


        if (
            token
        ) {

            headers.Authorization =
                `Bearer ${token}`;

        }


        /*
        ---------------------------------------------
        BUILD API URL
        ---------------------------------------------
        */

        let apiURL;


        if (
            typeof getApiUrl ===
            "function"
        ) {

            apiURL =
                getApiUrl(
                    AI_CONFIG.endpoint
                );

        }

        else {

            apiURL =
                `/api${AI_CONFIG.endpoint}`;

        }


        /*
        ---------------------------------------------
        FETCH
        ---------------------------------------------
        */

        const response =
            await fetch(
                apiURL,
                {

                    method:
                        "POST",

                    headers:
                        headers,

                    body:
                        JSON.stringify(
                            requestBody
                        ),

                    signal:
                        AI_STATE
                            .requestController
                            .signal

                }
            );


        /*
        ---------------------------------------------
        PARSE RESPONSE
        ---------------------------------------------
        */

        let data;


        try {

            data =
                await response.json();

        }

        catch (
            parseError
        ) {

            throw new Error(
                "The AI server returned an invalid response."
            );

        }


        /*
        ---------------------------------------------
        HANDLE HTTP ERRORS
        ---------------------------------------------
        */

        if (
            !response.ok
        ) {

            const error =
                new Error(

                    data.message ||
                    "Unable to get an AI response."

                );


            error.status =
                response.status;


            error.data =
                data;


            throw error;

        }


        /*
        ---------------------------------------------
        UPDATE CONVERSATION ID
        ---------------------------------------------
        */

        if (
            data.conversationId
        ) {

            AI_STATE.conversationId =
                data.conversationId;

        }


        /*
        ---------------------------------------------
        GET AI RESPONSE
        ---------------------------------------------
        */

        const aiResponse =
            extractAIResponse(
                data
            );


        if (
            !aiResponse
        ) {

            throw new Error(
                "The AI server did not return a response."
            );

        }


        /*
        ---------------------------------------------
        ADD RESPONSE
        ---------------------------------------------
        */

        addAssistantMessage(
            aiResponse,
            {
                save: true
            }
        );


        updateAIStatus(
            "Online"
        );

    }

    catch (
        error
    ) {

        /*
        ---------------------------------------------
        REQUEST CANCELLED
        ---------------------------------------------
        */

        if (
            error.name ===
            "AbortError"
        ) {

            /*
            If the request was cancelled because of
            timeout, show timeout message.
            */

            showAIError(
                "The AI response took too long. Please try again."
            );

        }

        else {

            console.error(
                "MedCare AI Error:",
                error
            );


            handleAIRequestError(
                error
            );

        }

    }

    finally {

        clearTimeout(
            timeoutId
        );


        setAILoading(
            false
        );


        updateAIStatus(
            "Online"
        );


        AI_STATE.requestController =
            null;

    }

}


/*
=========================================================
12. EXTRACT AI RESPONSE
=========================================================
*/

function extractAIResponse(
    data
) {

    /*
    Supports several backend response formats.

    Preferred:

    {
        success: true,
        response: "..."
    }

    Also supports:

    {
        message: "..."
    }

    {
        reply: "..."
    }

    {
        answer: "..."
    }
    */

    if (
        !data
    ) {

        return null;

    }


    if (
        typeof data.response ===
        "string"
    ) {

        return data.response.trim();

    }


    if (
        typeof data.reply ===
        "string"
    ) {

        return data.reply.trim();

    }


    if (
        typeof data.answer ===
        "string"
    ) {

        return data.answer.trim();

    }


    /*
    Some APIs return message as an object.

    Only use it if it is a string.
    */

    if (
        typeof data.message ===
        "string"
    ) {

        return data.message.trim();

    }


    /*
    OpenAI-style response support.

    This should normally be parsed on the backend,
    but this fallback allows a compatible response.
    */

    if (
        data.choices &&
        Array.isArray(
            data.choices
        ) &&
        data.choices.length > 0
    ) {

        const choice =
            data.choices[0];


        if (
            choice.message &&
            typeof choice.message.content ===
            "string"
        ) {

            return choice.message.content.trim();

        }

    }


    return null;

}


/*
=========================================================
13. ADD USER MESSAGE
=========================================================
*/

function addUserMessage(
    message
) {

    const messageObject = {

        id:
            generateMessageId(),

        role:
            "user",

        content:
            message,

        timestamp:
            new Date().toISOString()

    };


    AI_STATE.messages.push(
        messageObject
    );


    limitConversationHistory();


    saveAIHistory();


    renderSingleMessage(
        messageObject
    );


    scrollAIToBottom();

}


/*
=========================================================
14. ADD ASSISTANT MESSAGE
=========================================================
*/

function addAssistantMessage(
    message,
    options = {}
) {

    const messageObject = {

        id:
            generateMessageId(),

        role:
            "assistant",

        content:
            message,

        timestamp:
            new Date().toISOString()

    };


    AI_STATE.messages.push(
        messageObject
    );


    limitConversationHistory();


    if (
        options.save !== false
    ) {

        saveAIHistory();

    }


    renderSingleMessage(
        messageObject
    );


    scrollAIToBottom();

}


/*
=========================================================
15. RENDER ALL MESSAGES
=========================================================
*/

function renderMessages() {

    if (
        !AI_ELEMENTS.messages
    ) {

        return;

    }


    AI_ELEMENTS.messages.innerHTML =
        "";


    AI_STATE.messages.forEach(
        message => {

            renderSingleMessage(
                message
            );

        }
    );


    scrollAIToBottom();

}


/*
=========================================================
16. RENDER SINGLE MESSAGE
=========================================================
*/

function renderSingleMessage(
    message
) {

    if (
        !AI_ELEMENTS.messages
    ) {

        return;

    }


    /*
    Create message wrapper.
    */

    const wrapper =
        document.createElement(
            "div"
        );


    wrapper.className =
        `ai-message ai-message-${message.role}`;


    wrapper.dataset.messageId =
        message.id;


    /*
    Avatar.
    */

    const avatar =
        document.createElement(
            "div"
        );


    avatar.className =
        "ai-message-avatar";


    if (
        message.role ===
        "user"
    ) {

        avatar.textContent =
            "You";

    }

    else {

        avatar.textContent =
            "AI";

    }


    /*
    Message body.
    */

    const body =
        document.createElement(
            "div"
        );


    body.className =
        "ai-message-body";


    /*
    Message content.
    */

    const content =
        document.createElement(
            "div"
        );


    content.className =
        "ai-message-content";


    /*
    Format response safely.

    We don't use innerHTML directly with raw user
    input because that could introduce XSS.
    */

    content.innerHTML =
        formatAIMessage(
            message.content
        );


    /*
    Timestamp.
    */

    const timestamp =
        document.createElement(
            "div"
        );


    timestamp.className =
        "ai-message-time";


    timestamp.textContent =
        formatAITimestamp(
            message.timestamp
        );


    /*
    Build message.
    */

    body.appendChild(
        content
    );


    body.appendChild(
        timestamp
    );


    wrapper.appendChild(
        avatar
    );


    wrapper.appendChild(
        body
    );


    AI_ELEMENTS.messages.appendChild(
        wrapper
    );

}


/*
=========================================================
17. FORMAT AI MESSAGE
=========================================================

Basic safe formatting.

Supported:

    **bold**
    *italic*
    bullet lists
    numbered lists
    line breaks

Raw HTML is escaped first.
=========================================================
*/

function formatAIMessage(
    text
) {

    if (
        typeof text !==
        "string"
    ) {

        return "";

    }


    /*
    Escape HTML.
    */

    let formatted =
        escapeHTML(
            text
        );


    /*
    Bold.
    */

    formatted =
        formatted.replace(
            /\*\*(.*?)\*\*/g,
            "<strong>$1</strong>"
        );


    /*
    Italic.
    */

    formatted =
        formatted.replace(
            /(?<!\*)\*(.*?)\*(?!\*)/g,
            "<em>$1</em>"
        );


    /*
    Convert bullet points.

    Example:

    - First
    - Second
    */

    formatted =
        formatted.replace(
            /^\s*[-•]\s+(.+)$/gm,
            "• $1"
        );


    /*
    Numbered lists.
    */

    formatted =
        formatted.replace(
            /^\s*(\d+)\.\s+(.+)$/gm,
            "$1. $2"
        );


    /*
    New lines.
    */

    formatted =
        formatted.replace(
            /\n/g,
            "<br>"
        );


    return formatted;

}


/*
=========================================================
18. ESCAPE HTML
=========================================================
*/

function escapeHTML(
    value
) {

    const element =
        document.createElement(
            "div"
        );


    element.textContent =
        value;


    return element.innerHTML;

}


/*
=========================================================
19. FORMAT TIMESTAMP
=========================================================
*/

function formatAITimestamp(
    timestamp
) {

    const date =
        new Date(
            timestamp
        );


    if (
        Number.isNaN(
            date.getTime()
        )
    ) {

        return "";

    }


    return date.toLocaleTimeString(
        "en-IN",
        {

            hour:
                "2-digit",

            minute:
                "2-digit",

            hour12:
                true

        }
    );

}


/*
=========================================================
20. RENDER QUICK QUESTIONS
=========================================================
*/

function renderQuickQuestions() {

    if (
        !AI_ELEMENTS.quickQuestions
    ) {

        return;

    }


    AI_ELEMENTS.quickQuestions.innerHTML =
        "";


    AI_QUICK_QUESTIONS
        .slice(
            0,
            AI_CONFIG.maxQuickQuestions
        )
        .forEach(
            question => {

                const button =
                    document.createElement(
                        "button"
                    );


                button.type =
                    "button";


                button.className =
                    "ai-quick-question";


                button.dataset.questionId =
                    question.id;


                button.innerHTML =
                    `
                    <i class="fa-solid ${escapeHTML(question.icon)}"></i>
                    <span>${escapeHTML(question.text)}</span>
                    `;


                button.addEventListener(
                    "click",
                    () => {

                        sendQuickQuestion(
                            question.text
                        );

                    }
                );


                AI_ELEMENTS.quickQuestions.appendChild(
                    button
                );

            }
        );

}


/*
=========================================================
21. SEND QUICK QUESTION
=========================================================
*/

function sendQuickQuestion(
    question
) {

    if (
        AI_STATE.isLoading
    ) {

        return;

    }


    if (
        AI_ELEMENTS.input
    ) {

        AI_ELEMENTS.input.value =
            question;


        updateCharacterCounter(
            question.length
        );


        handleSendMessage();

    }

}


/*
=========================================================
22. TYPING INDICATOR
=========================================================
*/

function showTypingIndicator() {

    if (
        !AI_ELEMENTS.typingIndicator
    ) {

        return;

    }


    AI_ELEMENTS.typingIndicator.classList.remove(
        "hidden"
    );


    AI_ELEMENTS.typingIndicator.setAttribute(
        "aria-hidden",
        "false"
    );

}


/*
=========================================================
23. HIDE TYPING INDICATOR
=========================================================
*/

function hideTypingIndicator() {

    if (
        !AI_ELEMENTS.typingIndicator
    ) {

        return;

    }


    AI_ELEMENTS.typingIndicator.classList.add(
        "hidden"
    );


    AI_ELEMENTS.typingIndicator.setAttribute(
        "aria-hidden",
        "true"
    );

}


/*
=========================================================
24. LOADING STATE
=========================================================
*/

function setAILoading(
    loading
) {

    AI_STATE.isLoading =
        loading;


    if (
        loading
    ) {

        showTypingIndicator();

    }

    else {

        hideTypingIndicator();

    }


    /*
    Disable send button while processing.
    */

    if (
        AI_ELEMENTS.sendButton
    ) {

        AI_ELEMENTS.sendButton.disabled =
            loading;

    }


    /*
    Disable input while processing.

    If you want users to type while AI is responding,
    remove this section.
    */

    if (
        AI_ELEMENTS.input
    ) {

        AI_ELEMENTS.input.disabled =
            loading;

    }

}


/*
=========================================================
25. AI STATUS
=========================================================
*/

function updateAIStatus(
    status
) {

    if (
        !AI_ELEMENTS.status
    ) {

        return;

    }


    AI_ELEMENTS.status.textContent =
        status;

}


/*
=========================================================
26. SHOW ERROR
=========================================================
*/

function showAIError(
    message
) {

    /*
    Don't store temporary errors in conversation history.
    */

    const errorObject = {

        id:
            generateMessageId(),

        role:
            "assistant",

        content:
            message,

        timestamp:
            new Date().toISOString(),

        temporary:
            true

    };


    renderSingleMessage(
        errorObject
    );


    scrollAIToBottom();

}


/*
=========================================================
27. HANDLE REQUEST ERRORS
=========================================================
*/

function handleAIRequestError(
    error
) {

    if (
        error.status ===
        401
    ) {

        showAIError(
            "Your session has expired. Please log in again."
        );

        return;

    }


    if (
        error.status ===
        403
    ) {

        showAIError(
            "You are not authorized to use this AI feature."
        );

        return;

    }


    if (
        error.status ===
        429
    ) {

        showAIError(
            "The AI service is temporarily busy. Please try again shortly."
        );

        return;

    }


    if (
        error.status >=
        500
    ) {

        showAIError(
            "The MedCare AI service is temporarily unavailable. Please try again later."
        );

        return;

    }


    showAIError(
        error.message ||
        "Something went wrong while contacting MedCare AI."
    );

}


/*
=========================================================
28. SCROLL TO BOTTOM
=========================================================
*/

function scrollAIToBottom() {

    if (
        !AI_ELEMENTS.messages
    ) {

        return;

    }


    requestAnimationFrame(
        () => {

            AI_ELEMENTS.messages.scrollTop =
                AI_ELEMENTS.messages.scrollHeight;

        }
    );

}


/*
=========================================================
29. SAVE AI HISTORY
=========================================================
*/

function saveAIHistory() {

    try {

        /*
        Save only the allowed number of messages.
        */

        const history =
            AI_STATE.messages.slice(
                -AI_CONFIG.maxHistoryLength
            );


        localStorage.setItem(

            AI_CONFIG.storageKey,

            JSON.stringify(
                history
            )

        );

    }

    catch (
        error
    ) {

        console.warn(
            "Unable to save AI history:",
            error
        );

    }

}


/*
=========================================================
30. LOAD AI HISTORY
=========================================================
*/

function loadAIHistory() {

    try {

        const saved =
            localStorage.getItem(
                AI_CONFIG.storageKey
            );


        if (
            !saved
        ) {

            AI_STATE.messages =
                [];

            return;

        }


        const parsed =
            JSON.parse(
                saved
            );


        if (
            !Array.isArray(
                parsed
            )
        ) {

            AI_STATE.messages =
                [];

            return;

        }


        /*
        Validate message objects.
        */

        AI_STATE.messages =
            parsed
                .filter(
                    message => {

                        return (

                            message &&

                            typeof message.content ===
                                "string" &&

                            (
                                message.role ===
                                    "user" ||

                                message.role ===
                                    "assistant"
                            )

                        );

                    }
                )
                .slice(
                    -AI_CONFIG.maxHistoryLength
                );

    }

    catch (
        error
    ) {

        console.warn(
            "Unable to load AI history:",
            error
        );


        AI_STATE.messages =
            [];

    }

}


/*
=========================================================
31. CLEAR AI CONVERSATION
=========================================================
*/

function clearAIConversation() {

    /*
    Cancel active request.
    */

    if (
        AI_STATE.requestController
    ) {

        AI_STATE.requestController.abort();

    }


    /*
    Clear memory.
    */

    AI_STATE.messages =
        [];


    AI_STATE.conversationId =
        null;


    /*
    Clear localStorage.
    */

    try {

        localStorage.removeItem(
            AI_CONFIG.storageKey
        );

    }

    catch (
        error
    ) {

        console.warn(
            "Unable to clear AI history:",
            error
        );

    }


    /*
    Clear UI.
    */

    if (
        AI_ELEMENTS.messages
    ) {

        AI_ELEMENTS.messages.innerHTML =
            "";

    }


    /*
    Add new greeting.
    */

    addAssistantMessage(
        AI_CONFIG.greeting,
        {
            save: true
        }
    );


    updateAIStatus(
        "Online"
    );

}


/*
=========================================================
32. GET CONVERSATION FOR API
=========================================================

Only send useful conversation data to backend.

=========================================================
*/

function getConversationForAPI() {

    return AI_STATE.messages

        .filter(
            message =>
                !message.temporary
        )

        .slice(
            -AI_CONFIG.maxHistoryLength
        )

        .map(
            message => ({

                role:
                    message.role,

                content:
                    message.content

            })
        );

}


/*
=========================================================
33. LIMIT CONVERSATION
=========================================================
*/

function limitConversationHistory() {

    if (
        AI_STATE.messages.length >
        AI_CONFIG.maxHistoryLength
    ) {

        AI_STATE.messages =
            AI_STATE.messages.slice(
                -AI_CONFIG.maxHistoryLength
            );

    }

}


/*
=========================================================
34. GENERATE MESSAGE ID
=========================================================
*/

function generateMessageId() {

    /*
    crypto.randomUUID is preferred.

    Fallback is provided for older browsers.
    */

    if (
        window.crypto &&
        typeof window.crypto.randomUUID ===
            "function"
    ) {

        return window.crypto.randomUUID();

    }


    return (

        Date.now()
        .toString(36)

        +

        Math.random()
            .toString(36)
            .substring(2, 10)

    );

}


/*
=========================================================
35. CHECK FOR EMERGENCY LANGUAGE
=========================================================

This is NOT a medical diagnosis system.

It simply identifies some emergency-related terms
so the UI can display an additional safety message.

The backend should also have appropriate safeguards.
=========================================================
*/

function containsEmergencyLanguage(
    message
) {

    if (
        typeof message !==
        "string"
    ) {

        return false;

    }


    const text =
        message
            .toLowerCase()
            .trim();


    const emergencyTerms = [

        "can't breathe",

        "cannot breathe",

        "difficulty breathing",

        "severe chest pain",

        "chest pain",

        "unconscious",

        "not responding",

        "heavy bleeding",

        "severe bleeding",

        "stroke",

        "seizure",

        "overdose",

        "poisoning",

        "suicide",

        "self harm",

        "self-harm",

        "major accident"

    ];


    return emergencyTerms.some(
        term =>
            text.includes(
                term
            )
    );

}


/*
=========================================================
36. EMERGENCY HANDLING
=========================================================
*/

function checkEmergencyMessage(
    message
) {

    if (
        containsEmergencyLanguage(
            message
        )
    ) {

        /*
        We do not block the AI request here.

        We display emergency guidance while allowing
        the backend to handle the conversation according
        to its own safety logic.
        */

        showAIError(
            AI_CONFIG.emergencyMessage
        );


        return true;

    }


    return false;

}


/*
=========================================================
37. AI PAGE VISIBILITY
=========================================================
*/

function toggleAIVisibility(
    visible
) {

    if (
        !AI_ELEMENTS.container
    ) {

        return;

    }


    if (
        visible
    ) {

        AI_ELEMENTS.container.classList.remove(
            "hidden"
        );

        AI_ELEMENTS.container.setAttribute(
            "aria-hidden",
            "false"
        );

    }

    else {

        AI_ELEMENTS.container.classList.add(
            "hidden"
        );

        AI_ELEMENTS.container.setAttribute(
            "aria-hidden",
            "true"
        );

    }

}


/*
=========================================================
38. OPEN AI CHAT
=========================================================
*/

function openAIChat() {

    toggleAIVisibility(
        true
    );


    if (
        AI_ELEMENTS.input
    ) {

        AI_ELEMENTS.input.focus();

    }


    scrollAIToBottom();

}


/*
=========================================================
39. CLOSE AI CHAT
=========================================================
*/

function closeAIChat() {

    toggleAIVisibility(
        false
    );

}


/*
=========================================================
40. GET AI STATE
=========================================================
*/

function getAIState() {

    return {

        isLoading:
            AI_STATE.isLoading,

        messageCount:
            AI_STATE.messages.length,

        conversationId:
            AI_STATE.conversationId,

        initialized:
            AI_STATE.isInitialized

    };

}


/*
=========================================================
41. DESTROY AI
=========================================================
*/

function destroyAI() {

    /*
    Cancel request.
    */

    if (
        AI_STATE.requestController
    ) {

        AI_STATE.requestController.abort();

    }


    /*
    Reset state.
    */

    AI_STATE.messages =
        [];

    AI_STATE.isLoading =
        false;

    AI_STATE.isInitialized =
        false;

    AI_STATE.conversationId =
        null;

    AI_STATE.requestController =
        null;

}


/*
=========================================================
42. GLOBAL EXPORTS
=========================================================
*/

window.AI_CONFIG =
    AI_CONFIG;

window.AI_QUICK_QUESTIONS =
    AI_QUICK_QUESTIONS;

window.AI_STATE =
    AI_STATE;

window.initializeAI =
    initializeAI;

window.sendMessageToAI =
    sendMessageToAI;

window.handleSendMessage =
    handleSendMessage;

window.addUserMessage =
    addUserMessage;

window.addAssistantMessage =
    addAssistantMessage;

window.clearAIConversation =
    clearAIConversation;

window.openAIChat =
    openAIChat;

window.closeAIChat =
    closeAIChat;

window.toggleAIVisibility =
    toggleAIVisibility;

window.getAIState =
    getAIState;

window.checkEmergencyMessage =
    checkEmergencyMessage;


/*
=========================================================
43. AUTO INITIALIZATION
=========================================================
*/

document.addEventListener(
    "DOMContentLoaded",
    () => {

        initializeAI();

    }
);


/*
=========================================================
END OF AI.JS
=========================================================
*/