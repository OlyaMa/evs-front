import { DomElements } from "./DomElements";
import { User } from "./User";
import { NewMessage } from "./NewMessage";

function app() {
  let username;
  let hasRespondedToPing = false;

  const input = document?.querySelector('input[name="username"]');

  document.querySelector(".form")?.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!input.value.trim()) return;

    username = input.value.trim();

    const sendListener = (event) => {
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

    ws.addEventListener("open", (event) => {
      console.log(event);

      ws.send(JSON.stringify(new User("new-user", username)));

      console.log("we open");
    });

    ws.addEventListener("close", (event) => {
      console.log(event);

      console.log("we close");
    });

    ws.addEventListener("message", (event) => {
      console.log(event);

      const data = JSON.parse(event.data);

      switch (data.type) {
        case "user-response":
          switch (data.status) {
            case "allowed":
              DomElements.chatCreator(data.username);

              DomElements.userListHandler(data.status, data.users, username);

              document
                .querySelector(".chat-message")
                .addEventListener("keydown", sendListener);
              break;
            case "denied":
              DomElements.showTooltip(
                "Такой пользователь уже существует",
                input,
              );
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

            messages.forEach((message) => {
              DomElements.messageBody(
                message.user,
                message.date,
                message.message,
                chat,
                username,
              );
            });
            DomElements.scrollChatToBottom();
          }
          break;
        default:
          break;
      }

      console.log("we message");
    });

    ws.addEventListener("error", (event) => {
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
