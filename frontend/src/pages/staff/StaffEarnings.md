The staff earnings page showing Razorpay settlement history, totals, and payment profile management.

**Page purpose**
- Displays the staff member's payment/earnings records, summary totals, invoice access, and their payment profile form.

**Data fetched**
- `listPayments()` (platformApi) returns payments and `totals` ({ paid, monthly, count }).
- `getPaymentInvoice(id)` returns invoice HTML for printing.
- Payment profile via `getMyPaymentProfile` / `updateMyPaymentProfile` (userApi) through `PaymentProfileForm`.

**State**
- `payments`, `totals`, `error`, `selected` (transaction detail view).

**Display**
- Three summary cards: Paid total, Paid this month, In pipeline (Pending/Approved/OrderCreated/Initiated).
- Payment rows show amount, complaint/purpose, transaction/Razorpay ids, date, status, and Details/Invoice actions.
- `selected` expands a transaction detail panel (status, amount, complaint, internal/Razorpay ids).

**Child components**
- `PaymentProfileForm` (payments), invoice print via `printInvoiceHtml`.
