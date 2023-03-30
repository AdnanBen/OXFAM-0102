This microservice facilitates one-to-one voice and text chat between survivors and moderators.

[Socket.IO](https://socket.io/) is used to create a WebSocket connection between moderators/survivors and the server.

Survivors must "request a chat" with a moderator via the Chat page, and moderators must "accept chat requests" to engage in a chat. Survivors cannot request chats unless a moderator is available (i.e., has the page open), to prevent them from potentially waiting a long time until a moderator comes online.

[PeerJS](https://peerjs.com/) is used for peer-to-peer (P2P) voice calling between moderators and survivors. This uses the WebRTC API, and calls are initiated through the Socket.IO server.

## Tests

Due to the complicated nature of WebSockets and Socket.IO, the chat is not unit-tested, but is rather tested holistically via the [end-to-end (E2E) tests](/.e2e-testing.md). The E2E tests enable us to ensure socket messages are handled and sent in the correct order, and test real-time live chat with moderators and survivors by using multiple browser instances at the same time.
