export class NewMessage {
  constructor(username, message) {
    this.type = "message";
    this.username = username;
    this.message = message;
  }
}
