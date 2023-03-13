This microservice facilitates one-to-one voice and text chat between survivors and moderators.

[Socket.IO](https://socket.io/) is used to create a WebSocket connection between moderators/survivors and the server.

Survivors must "request a chat" with a moderator via the Chat page, and moderators must "accept chat requests" to engage in a chat. Survivors cannot request chats unless a moderator is available (i.e., has the page open), to prevent them from potentially waiting a long time until a moderator comes online.
