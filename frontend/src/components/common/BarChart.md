This file defines a simple, reusable component for rendering horizontal bar charts.

-   **Functionality**: It visualizes an array of data items as labeled horizontal bars.
-   **Props**:
    -   `items` (array): The array of data objects to display. Defaults to an empty array.
    -   `labelKey` (string): The property name in each item object to use for the label. Defaults to `_id`.
    -   `valueKey` (string): The property name in each item object to use for the bar's value. Defaults to `count`.
-   **Logic**:
    -   It first calculates the maximum value from all items to set the scale for the bars.
    -   It then maps over the `items` array, rendering a label, a value, and a `div` for each.
    -   The width of each bar `div` is set as a percentage relative to the maximum value, creating the chart effect.
    -   If no items are provided, it displays a "No data yet" message.