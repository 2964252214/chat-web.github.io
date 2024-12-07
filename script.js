let room = null; // 当前房间号
let messages = []; // 存储当前房间的消息
let lastActivityTime = Date.now(); // 上次活动时间

// 进入房间
document.getElementById("enter-btn").onclick = function () {
  // 获取输入的房间号
  room = document.getElementById("room-input").value.trim();

  // 如果房间号不为空
  if (room) {
    console.log("房间号：", room); // 用于调试，检查是否能获取到房间号

    // 隐藏登录部分，显示聊天部分
    document.getElementById("login-section").style.display = "none";
    document.getElementById("chat-section").style.display = "block";
    document.getElementById("room-title").innerText = `智能AI聊天房间：${room}`;

    // 加载已保存的消息
    loadMessages();
  } else {
    alert("请输入有效的房间号！");
  }
};

// 发送消息
document.getElementById("send-btn").onclick = function () {
  const message = document.getElementById("message-input").value.trim();
  if (message) {
    processCommand(message); // 检查是否是命令
    messages.push(message);
    saveMessages();
    renderMessages();
    document.getElementById("message-input").value = "";
    lastActivityTime = Date.now();
  }
};

// 渲染消息
function renderMessages() {
  const chatBox = document.getElementById("chat-box");
  chatBox.innerHTML = messages.join("<br>");
  chatBox.scrollTop = chatBox.scrollHeight; // 自动滚动到底部
}

// 保存消息到 localStorage
function saveMessages() {
  localStorage.setItem(`chat_${room}`, JSON.stringify(messages));
}

// 加载消息
function loadMessages() {
  const savedMessages = localStorage.getItem(`chat_${room}`);
  if (savedMessages) {
    messages = JSON.parse(savedMessages);
    renderMessages();
  }
}

// 处理特殊命令
function processCommand(message) {
  if (message === "#隐藏") {
    document.getElementById("chat-box").style.visibility = "hidden";
  } else if (message === "#显示") {
    document.getElementById("recaptcha-container").style.display = "block";
  } else if (message === "#清空") {
    messages = [];
    saveMessages();
    renderMessages();
  }
}

// reCAPTCHA 验证成功后的回调
function onRecaptchaSuccess() {
  document.getElementById("chat-box").style.visibility = "visible";
  document.getElementById("recaptcha-container").style.display = "none";
  alert("验证成功，聊天记录已显示！");
}

// 10分钟无操作隐藏记录
setInterval(() => {
  if (Date.now() - lastActivityTime > 10 * 60 * 1000) { // 10分钟
    document.getElementById("chat-box").style.visibility = "hidden";
  }
}, 1000);
