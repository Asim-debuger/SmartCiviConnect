Manages one-to-one messaging conversations between connected professionals, including real-time socket emits and message notifications.

- `listConversations` — Lists the current user's conversations (sorted by last activity) with each participant's public profile, per-conversation unread counts, and a total unread count.
- `openConversation` — Finds or creates a direct conversation between the user and a target; requires an existing "Accepted" connection and rejects messaging yourself; returns 403 if not connected.
- `listMessages` — Returns up to 200 messages for a conversation the user belongs to; marks messages from others as read and emits a `chat:read` socket event.
- `sendMessage` — Creates a message in a conversation the user belongs to (requires a body or attachments), updates conversation preview/timestamp, emits `chat:message` to the conversation and the other participant, and creates an in-app "message" notification.
