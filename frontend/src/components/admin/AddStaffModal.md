This file defines a modal component for adding a new staff member.

-   **Functionality**: It provides a form for administrators to create a new field staff profile.
-   **Components**:
    -   A reusable `FormInput` component is used for text-based inputs (Full Name, Email, Phone Number).
    -   Dropdown menus (`select`) are used for selecting the staff's `Department`, `Availability`, and `Account Status`.
-   **State Management**: It uses `useState` to manage the form's data (`formData`) and validation errors (`errors`).
-   **Validation**: A `validateForm` function ensures that the name, email, phone, and department fields are not empty before submission.
-   **Actions**: When the form is submitted and passes validation, it invokes the `onAddStaff` function passed in as a prop. The modal can be closed using the `onClose` prop.