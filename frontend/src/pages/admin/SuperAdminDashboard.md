Provides super admin system control, embedding analytics and displaying recent audit logs.

- **Data fetched**: Calls `getAuditLogs` on mount.
- **State**: Tracks `logs` for audit history.
- **Child components used**: Embeds `AnalyticsDashboard` for operational intelligence.
- **UI**: Renders a recent audit log section with action, target type, target ID, and timestamp for each entry.
