Displays the admin command center dashboard with city operations statistics and quick navigation.

- **Data fetched**: Calls `getAdminStats` on mount to load operational statistics.
- **State**: Tracks `stats` for dashboard metrics and `error` for fetch failures.
- **UI**: Renders stat cards (total complaints, pending verification, active operations, under verification, resolved complaints, active users), quick navigation links, and an operations pulse progress bar showing resolved percentage.
- **User actions**: Provides a Refresh button to reload stats and a Retry button on errors.
