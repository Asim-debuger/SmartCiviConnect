Presents analytics and reports for complaint volume, department load, and workforce completion.

- **Data fetched**: Calls `getAnalytics` on mount.
- **State**: Tracks `analytics` data and `error`.
- **UI**: Renders summary cards (completion rate, officers, staff, available staff) and multiple `BarChart` components for complaints by status, by category, department load, monthly volume, and worker performance.
- **Child components used**: `BarChart`.
