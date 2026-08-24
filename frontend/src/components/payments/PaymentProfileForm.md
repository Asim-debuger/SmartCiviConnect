This file defines a form for users to manage their bank account details for payouts.

-   **Functionality**: It allows a user to add or update their payment information, such as bank account number and IFSC code.
-   **Props**:
    -   `loadProfile`: A function that is called on component mount to fetch the user's existing payment profile.
    -   `saveProfile`: A function that is called when the user submits the form to save the new details.
    -   `title`: An optional title for the form.
-   **State Management**: It manages the form's input data, loading/saving states, and displays success or error messages returned from the API.
-   **Data Flow**:
    -   On load, it calls `loadProfile` to populate the form.
    -   It displays the current verification status of the profile ("Verified", "Pending verification", or "Not on file").
    -   When the user clicks "Save", it calls `saveProfile` with the form data and updates the UI based on the response.
-   **UI**: It consists of standard input fields for account holder name, account number, IFSC code, bank name, and phone number.