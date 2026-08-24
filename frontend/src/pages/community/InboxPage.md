The real-time direct messaging inbox where users chat with accepted connections over a websocket connection.

**Page purpose**
- Lists conversations (accepted connections only) and shows the active message thread with send/typing/read indicators.

**Data fetched**
- `listInbox()` loads the user's conversations.
- `listMessages(conversationId)` loads the messages for the selected thread.
- `sendMessage` posts a message; `uploadComplaintMedia` uploads file attachments.

**State**
- `conversations`, `messages`, `activeId` (from `?c=` query param), `body`, `typing`, `online` presence map, `error`.

**Real-time (socket)**
- Uses `useSocket()` to listen for `chat:message`, `chat:typing`, `chat:read`, `presence:online`, `presence:offline`.
- Joins a thread with `socket.emit("chat:join", id)` and emits typing state while writing.

**Child components**
- `Avatar` (common); routes to `/inbox?c=<id>` via `openConversation`.

**Navigation**
- Selecting a conversation updates the `?c=` search param and opens the thread; clicking "Message" elsewhere navigates here from Network/Profile.
