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

function AddStaffModal({
  onClose,
  onAddStaff,
}) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    department: "",
    availability: "Available",
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
      newErrors.name = "Staff name is required.";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required.";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required.";
    }

    if (!formData.department) {
      newErrors.department =
        "Please select a department.";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    onAddStaff(formData);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-xl bg-white p-6 shadow-xl">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">
              Add New Staff
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Create a new field staff profile.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
          >
            <X size={20} />
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="mt-8 space-y-5"
        >
          <FormInput
            label="Full Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter staff name"
            error={errors.name}
          />

          <FormInput
            label="Email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter staff email"
            error={errors.email}
          />

          <FormInput
            label="Phone Number"
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="Enter phone number"
            error={errors.phone}
          />

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

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Availability
            </label>

            <select
              name="availability"
              value={formData.availability}
              onChange={handleChange}
              className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-600"
            >
              <option value="Available">
                Available
              </option>

              <option value="Busy">
                Busy
              </option>

              <option value="Offline">
                Offline
              </option>
            </select>
          </div>

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
              Add Staff
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function FormInput({
  label,
  type = "text",
  name,
  value,
  onChange,
  placeholder,
  error,
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-slate-700">
        {label}
      </label>

      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`w-full rounded-lg border px-4 py-3 outline-none focus:ring-2 ${
          error
            ? "border-red-500 focus:ring-red-100"
            : "border-slate-300 focus:border-blue-600 focus:ring-blue-100"
        }`}
      />

      {error && (
        <p className="mt-1 text-sm text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}

export default AddStaffModal;