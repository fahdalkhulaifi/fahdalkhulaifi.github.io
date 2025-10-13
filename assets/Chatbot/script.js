const messageInput = document.querySelector('textarea');
const chatBody  = document.querySelector('.chat-area')
const sendBtn = document.getElementById('send-btn')
const chatbotToggleBtn = document.getElementById('chatbot-toggle-btn');
const removeChatbotBtn = document.getElementById('remove-chatbot');
let userData = {
    message: null
}

// Google Gemini API Key and URI
// Note: Replace with your actual API key
// Ensure you keep your API key secure and do not expose it in public repositories.
const API_KEY = "AIzaSyDtwlWpTQAGWcz8V3meawljIpRxGU7YPb8";
const API_URI = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`;

const createContent = (content, className) =>{
    const messageContainer = document.createElement('div');
    messageContainer.classList.add('message', className);
    messageContainer.innerHTML = content;

    return messageContainer;
}

// Here we generate the bot response
// This function will be called after the user sends a message
function generateBotReponse(createBotMessage) {
    const textMessageRes = createBotMessage.querySelector('.text');

const systemInstruction = `
🌟 أنت "مساعد وصل"، روبوت ذكي لطيف يساعد زوار متجر وصل في اختيار باقات الإنترنت المناسبة لهم.

💡 عن المتجر:
متجر "وصل" متخصص في بيع شرائح الإنترنت 5G من STC، Mobily، و Zain.
يتميّز بعروض بلا استخدام عادل، توصيل سريع وآمن، ودعم عملاء عبر واتساب لفحص التغطية قبل الطلب.

🎯 هدفك:
- ساعد المستخدم في إيجاد الباقة الأنسب له (مدة – سعر – شركة).
- قدم الإجابات بلغة بسيطة، ودودة، ومختصرة.
- استخدم نبرة لطيفة تشجع على الشراء، مثل: "✨ هذه الباقة تناسبك!" أو "🚀 سرعة بلا حدود بانتظارك!"
- ذكّر المستخدم أنه يمكنه التحقق من التغطية عبر واتساب قبل الطلب.
- لا تذكر الأسعار خارج القائمة التالية.

📦 قائمة الباقات:
1️⃣ شريحة STC 5G | إنترنت لا محدود شهرية متجددة – يبدأ من 199 ريال.
2️⃣ شريحة STC 5G | إنترنت لا محدود 100 يوم – 599 ريال (متجددة على نفس الشريحة).
3️⃣ شريحة STC 5G | إنترنت لا محدود 6 أشهر – 1099 ريال دفعة واحدة أو 549 ريال كل 3 أشهر.
4️⃣ شريحة STC 5G | إنترنت لا محدود سنة كاملة – 1999 ريال.
5️⃣ شريحة Mobily 5G | إنترنت لا محدود شهري – 239 ريال.
6️⃣ شريحة Mobily 5G | إنترنت لا محدود 6 أشهر – 1400 ريال.
7️⃣ شريحة Mobily 5G | إنترنت لا محدود سنة – 2400 ريال.
8️⃣ شريحة Zain 5G | إنترنت لا محدود شهرية متجددة – 249 ريال.
9️⃣ شريحة Zain 5G | إنترنت لا محدود 3 أشهر – 799 ريال.
🔟 شريحة Zain 5G | إنترنت لا محدود 6 أشهر – 1399 ريال.
🕛 شريحة Zain 5G | إنترنت لا محدود سنة – 2229 ريال.

💬 إذا سأل المستخدم عن:
- طريقة الطلب → قل له "يمكنك الطلب مباشرة من الموقع بالضغط على زر 'اطلب الآن' بجانب الباقة."
- التوصيل أو التفعيل → "التوصيل سريع وآمن، والتوثيق يتم عبر بوابة نفاذ بعد استلام المنتج."
- التغطية → "نخدمك بأمان، يمكنك فحص تغطية منطقتك عبر واتساب قبل الطلب."

🚫 لا تذكر أي منتجات أخرى غير هذه، ولا تذكر أن الأسعار قد تتغير.
كن مرحًا، دافئًا، وشبيهًا بمحادثة متجر ودي يساعد زواره باهتمام. ❤️`;
    const requestOptions = {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    contents: [
      {
        role: "model",
        parts: [{ text: systemInstruction }]
      },
      {
        role: "user",
        parts: [{ text: userData.message }]
      }
    ]
  })
};

    try{
      fetch(API_URI, requestOptions).then(res => res.json().then(dataOutput=> {
           if(!res.ok) throw new Error(dataOutput.error.message || "SOmething went wrong");
            const messageText = dataOutput.candidates[0].content.parts[0].text.replace(/\*\*([^*]+)\*\*/g, "$1").trim();
            textMessageRes.textContent = messageText;
            
      }))
    }catch(error){
      console.log(error.message);
      textMessageRes.style.color = "red";
      textMessageRes.textContent = "Error:" + error.message;
        
    }finally{
         chatBody.scrollTo({top : chatBody.scrollHeight, behavior : "smooth"});
    }
}


// This function handles the sending of messages
// It will be called when the user clicks the send button or presses Enter
const handleSendMessage = (e) => {
        e.preventDefault();
     if(!messageInput.value.trim()) return;   
    userData.message = messageInput.value.trim();
     messageInput.value = "";

    const messageContent = ` <div class="text"></div>`

    const createMessage = createContent(messageContent, "user-message");
    createMessage.querySelector('.text').textContent = userData.message;
    chatBody.appendChild(createMessage);
    chatBody.scrollTo({top : chatBody.scrollHeight, behavior : "smooth"});

    // Let Get Bot Response
    // We will use a timeout to simulate a delay in the bot's response
    // In a real application, you would call the API to get the bot's response
    setTimeout(()=> {

        const messageContent = ` <div class="message">
         <img src="move-logo.png" width="50" height="50" alt="logo">
                    <div class="text">
                        <div class="thinking-indicator">
                            <div class="dot"></div>
                            <div class="dot"></div>
                            <div class="dot"></div>
                        </div>
                    </div>
                                    </div>`

        const createBotMessage = createContent(messageContent, "bot-message");
        chatBody.appendChild(createBotMessage);
         chatBody.scrollTo({top : chatBody.scrollHeight, behavior : "smooth"});
        generateBotReponse(createBotMessage)
    },400);
}



// Event listeners for sending messages
// We will listen for the Enter key press and the send button click
messageInput.addEventListener('keydown', (e) => {
    const userMessage = messageInput.value.trim();

    // If the Enter key is pressed and the input is not empty, send the message
    // We also check if the Enter key is pressed without the Shift key to avoid new lines
    if(e.key === "Enter" && userMessage){
        handleSendMessage(e);
    }
})


// Event listener for the send button
// When the button is clicked, we will call the handleSendMessage function
sendBtn.addEventListener('click', (e) => handleSendMessage(e))


// Event listener for the remove chatbot button
// When the button is clicked, we will remove the chatbot from the DOM
chatbotToggleBtn.addEventListener('click', () => {
    document.body.classList.toggle('chatbot-active');
});


removeChatbotBtn.addEventListener("click", () => document.body.classList.remove('chatbot-active'));





