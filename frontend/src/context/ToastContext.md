# ToastContext.jsx

React context provider that manages toast notifications shown in a fixed corner of the viewport.

- **State**
  - `toasts` — array of active toast objects `{ id, message, tone }`.
- **Methods**
  - `dismiss(id)` — removes a toast by id.
  - `push(message, tone)` — appends a toast with `"info"`, `"success"`, or `"error"` tone; auto-dismisses after `4200` ms.
- **Rendered UI**
  - Fixed `right-4 top-4` container with pointer-events handling and tone-based color styling (emerald for success, rose for error, slate for info).
- **Consumers get**
  - `toast.success(message)`, `toast.error(message)`, `toast.info(message)`.
- **Helpers**
  - `useToast()` — returns the toast helpers, defaulting to no-ops if context is missing.
