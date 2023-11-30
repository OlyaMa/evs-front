export class DomElements {
  static dateConverter(created) {
    const date = new Date(created);

    const timeFormatter = new Intl.DateTimeFormat("ru", {
      hour: "2-digit",
      minute: "2-digit",
    });

    const dateFormatter = new Intl.DateTimeFormat("ru", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
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

    const { right, top } = element.getBoundingClientRect();

    tooltipElement.style.left = right + 5 + "px";
    tooltipElement.style.top =
      top + element.offsetHeight / 2 - tooltipElement.offsetHeight / 2 + "px";
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
        userData.forEach((user) => {
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
        const elementForDelete = Array.from(
          userList?.querySelectorAll(".user"),
        ).find((element) => element.textContent === userAppearance);

        elementForDelete.remove();
        break;
      case "incoming-user":
        const elementExist = Array.from(
          userList.querySelectorAll(".user"),
        ).find((element) => element.textContent === userAppearance);
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
