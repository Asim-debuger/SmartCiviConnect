import { useState } from "react";
import { X } from "lucide-react";

const departments = [
  "Road Maintenance",
  "Public Infrastructure",
  "Water & Drainage",
  "Waste Management",
  "Electricity",
  "Traffic Management",
  "Sewage Management",
  "Other",
];

function AddOfficerModal({ onClose, onAddOfficer }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    department: "",
    status: "Active",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((currentData) => ({
      ...currentData,
      [name]: value,
    }));

    setErrors((currentErrors) => ({
      ...currentErrors,
      [name]: "",
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Officer name is required.";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required.";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required.";
    }

    if (!formData.department) {
      newErrors.department = "Please select a department.";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    onAddOfficer(formData);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-xl bg-white p-6 shadow-xl">
        {/* Header */}

        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">
              Add New Officer
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Create a new officer profile and assign a department.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
            aria-label="Close modal"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form */}

        <form
          onSubmit={handleSubmit}
          className="mt-8 space-y-5"
        >
          {/* Name */}

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Full Name
            </label>

            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter officer name"
              className={`w-full rounded-lg border px-4 py-3 outline-none focus:ring-2 ${
                errors.name
                  ? "border-red-500 focus:ring-red-100"
                  : "border-slate-300 focus:border-blue-600 focus:ring-blue-100"
              }`}
            />

            {errors.name && (
              <p className="mt-1 text-sm text-red-600">
                {errors.name}
              </p>
            )}
          </div>

          {/* Email */}

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Email
            </label>

            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter officer email"
              className={`w-full rounded-lg border px-4 py-3 outline-none focus:ring-2 ${
                errors.email
                  ? "border-red-500 focus:ring-red-100"
                  : "border-slate-300 focus:border-blue-600 focus:ring-blue-100"
              }`}
            />

            {errors.email && (
              <p className="mt-1 text-sm text-red-600">
                {errors.email}
              </p>
            )}
          </div>

          {/* Phone */}

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Phone Number
            </label>

            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Enter phone number"
              className={`w-full rounded-lg border px-4 py-3 outline-none focus:ring-2 ${
                errors.phone
                  ? "border-red-500 focus:ring-red-100"
                  : "border-slate-300 focus:border-blue-600 focus:ring-blue-100"
              }`}
            />

            {errors.phone && (
              <p className="mt-1 text-sm text-red-600">
                {errors.phone}
              </p>
            )}
          </div>

          {/* Department */}

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Department
            </label>

            <select
              name="department"
              value={formData.department}
              onChange={handleChange}
              className={`w-full rounded-lg border px-4 py-3 outline-none ${
                errors.department
                  ? "border-red-500"
                  : "border-slate-300 focus:border-blue-600"
              }`}
            >
              <option value="">
                Select a department
              </option>

              {departments.map((department) => (
                <option
                  key={department}
                  value={department}
                >
                  {department}
                </option>
              ))}
            </select>

            {errors.department && (
              <p className="mt-1 text-sm text-red-600">
                {errors.department}
              </p>
            )}
          </div>

          {/* Status */}

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Account Status
            </label>

            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-600"
            >
              <option value="Active">
                Active
              </option>

              <option value="Inactive">
                Inactive
              </option>
            </select>
          </div>

          {/* Actions */}

          <div className="flex justify-end gap-3 border-t pt-6">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-slate-300 px-5 py-2.5 font-medium text-slate-700 hover:bg-slate-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="rounded-lg bg-blue-600 px-5 py-2.5 font-medium text-white hover:bg-blue-700"
            >
              Add Officer
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddOfficerModal;