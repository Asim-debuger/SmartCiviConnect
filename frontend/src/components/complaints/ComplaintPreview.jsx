import { LocationBlock } from "../../utils/formatValue";

function ComplaintPreview({ form }) {
  return (
    <div className="rounded-xl bg-slate-50 p-5">
      <h3 className="font-semibold text-slate-900">Complaint Preview</h3>
      <div className="mt-4 space-y-2 text-sm">
        <p><b>Category:</b> {form.category}</p>
        <p><b>Priority:</b> {form.priority}</p>
        <p><b>Description:</b> {form.description}</p>
        <div>
          <b>Location:</b>
          <div className="mt-1"><LocationBlock value={form.location} /></div>
        </div>
      </div>
    </div>
  );
}

export default ComplaintPreview;
