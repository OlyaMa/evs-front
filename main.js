/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
var __webpack_exports__ = {};

;// CONCATENATED MODULE: ./src/js/DomElements.js
class DomElements {
  static dateConverter(created) {
    const date = new Date(created);
    const timeFormatter = new Intl.DateTimeFormat("ru", {
      hour: "2-digit",
      minute: "2-digit"
    });
    const dateFormatter = new Intl.DateTimeFormat("ru", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric"
    });
    return `${timeFormatter.format(date)} ${dateFormatter.format(date)}`;
  }
  static scrollChatToBottom() {
    const chatWindow = document?.querySelector(".chat");
    chatWindow.scrollTop = chatWindow.scrollHeight;
  }
  static chatCreator() {
    document.body.innerHTML = `
      <div class="chat-container">
        <aside class="userlist"></aside>
        <div class="main-part">
          <div class="chat"></div>
          <input type="text" class="chat-message">
        </div>
      </div>`;
    document.querySelector(".chat-message").focus();
  }
  static showTooltip(message, element) {
    const tooltipElement = document.createElement("DIV");
    tooltipElement.classList.add("form-error");
    tooltipElement.textContent = message;
    document.body.appendChild(tooltipElement);
    const {
      right,
      top
    } = element.getBoundingClientRect();
    tooltipElement.style.left = right + 5 + "px";
    tooltipElement.style.top = top + element.offsetHeight / 2 - tooltipElement.offsetHeight / 2 + "px";
  }
  static messageBody(user, datestamp, message, chat, username) {
    const whoIsUser = user === username ? "You" : user;
    const elementForMessage = document.createElement("div");
    elementForMessage.classList.add("message");
    elementForMessage.innerHTML = `
      <div class="credentials">
        <span class="user-${whoIsUser}">${whoIsUser}</span>,
        <span class="date">${this.dateConverter(datestamp)}</span>
      </div>
      <div class="text">${message}</div>`;
    if (whoIsUser === "You") {
      elementForMessage.style.alignSelf = "flex-end";
      elementForMessage.firstElementChild.style.color = "red";
      elementForMessage.firstElementChild.style.textAlign = "right";
    }
    chat.prepend(elementForMessage);
  }
  static userListHandler(status, userData, username) {
    const userList = document.querySelector(".userlist");
    const userAppearance = userData === username ? "You" : userData;
    switch (status) {
      case "allowed":
        userData.forEach(user => {
          const elementForUser = document.createElement("div");
          elementForUser.classList.add("user");
          elementForUser.textContent = user === username ? "You" : user;
          if (elementForUser.textContent === "You") {
            elementForUser.style.color = "red";
          }
          userList.appendChild(elementForUser);
        });
        break;
      case "outgoing-user":
        const elementForDelete = Array.from(userList?.querySelectorAll(".user")).find(element => element.textContent === userAppearance);
        elementForDelete.remove();
        break;
      case "incoming-user":
        const elementExist = Array.from(userList.querySelectorAll(".user")).find(element => element.textContent === userAppearance);
        if (!elementExist) {
          const elementForUser = document.createElement("div");
          elementForUser.classList.add("user", `${userAppearance}`);
          elementForUser.textContent = userAppearance;
          userList.appendChild(elementForUser);
          break;
        }
    }
  }
}
;// CONCATENATED MODULE: ./src/js/User.js
class User {
  constructor(type, username) {
    this.type = type;
    this.username = username;
  }
}
;// CONCATENATED MODULE: ./src/js/NewMessage.js
class NewMessage {
  constructor(username, message) {
    this.type = "message";
    this.username = username;
    this.message = message;
  }
}
;// CONCATENATED MODULE: ./src/js/app.js



function app() {
  let username;
  let hasRespondedToPing = false;
  const input = document?.querySelector('input[name="username"]');
  document.querySelector(".form")?.addEventListener("submit", event => {
    event.preventDefault();
    if (!input.value.trim()) return;
    username = input.value.trim();
    const sendListener = event => {
      if (event.key === "Enter") {
        const chatMessage = document.querySelector(".chat-message");
        const message = chatMessage.value;
        if (!message.trim()) return;
        ws.send(JSON.stringify(new NewMessage(username, message)));
        chatMessage.value = "";
      }
    };
    const ws = new WebSocket("wss://ahj-sse-ws-1-server.onrender.com");
    // const ws = new WebSocket("ws://localhost:80");

    ws.addEventListener("open", event => {
      console.log(event);
      ws.send(JSON.stringify(new User("new-user", username)));
      console.log("we open");
    });
    ws.addEventListener("close", event => {
      console.log(event);
      console.log("we close");
    });
    ws.addEventListener("message", event => {
      console.log(event);
      const data = JSON.parse(event.data);
      switch (data.type) {
        case "user-response":
          switch (data.status) {
            case "allowed":
              DomElements.chatCreator(data.username);
              DomElements.userListHandler(data.status, data.users, username);
              document.querySelector(".chat-message").addEventListener("keydown", sendListener);
              break;
            case "denied":
              DomElements.showTooltip("Такой пользователь уже существует", input);
              break;
            case "outgoing-user":
              DomElements.userListHandler(data.status, data.username, username);
              break;
            case "incoming-user":
              DomElements.userListHandler(data.status, data.username, username);
              break;
          }
          break;
        case "message":
          if (data.chat) {
            const chat = document.querySelector(".chat");
            if (!chat) return;
            const messages = data.chat;
            messages.forEach(message => {
              DomElements.messageBody(message.user, message.date, message.message, chat, username);
            });
            DomElements.scrollChatToBottom();
          }
          break;
        default:
          break;
      }
      console.log("we message");
    });
    ws.addEventListener("error", event => {
      console.log(event);
      console.log("we error");
    });
    ws.addEventListener("ping", () => {
      if (!hasRespondedToPing) {
        ws.close();
      } else {
        hasRespondedToPing = false;
        ws.pong();
      }
    });
    ws.addEventListener("pong", () => {
      hasRespondedToPing = true;
    });
  });
}
app();
;// CONCATENATED MODULE: ./src/index.js


/******/ })()
;