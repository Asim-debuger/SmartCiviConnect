const CATEGORY_DEPARTMENT = {
  "Road Damage": "Road Maintenance",
  Potholes: "Road Maintenance",
  "Traffic Problems": "Road Maintenance",
  "Electricity Problems": "Electricity",
  "Street Light Problems": "Electricity",
  "Water Leakage": "Water Supply",
  "Drainage Problems": "Water Supply",
  "Sewage Issues": "Water Supply",
  Garbage: "Waste Management",
  Other: "Public Safety",
};

const DEFAULT_DEPARTMENTS = [
  { name: "Road Maintenance", description: "Roads, potholes, and traffic infrastructure", categories: ["Road Damage", "Potholes", "Traffic Problems"] },
  { name: "Electricity", description: "Power supply and street lighting", categories: ["Electricity Problems", "Street Light Problems"] },
  { name: "Water Supply", description: "Water leakage, drainage, and sewage", categories: ["Water Leakage", "Drainage Problems", "Sewage Issues"] },
  { name: "Waste Management", description: "Garbage collection and sanitation", categories: ["Garbage"] },
  { name: "Public Safety", description: "General civic safety and uncategorized issues", categories: ["Other"] },
];

function departmentForCategory(category) {
  return CATEGORY_DEPARTMENT[category] || "Public Safety";
}

module.exports = { CATEGORY_DEPARTMENT, DEFAULT_DEPARTMENTS, departmentForCategory };
