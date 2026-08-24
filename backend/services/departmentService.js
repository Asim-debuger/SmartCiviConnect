const Department = require("../models/Department");
const { DEFAULT_DEPARTMENTS, departmentForCategory } = require("../utils/departments");

async function ensureDefaultDepartments() {
  await Promise.all(
    DEFAULT_DEPARTMENTS.map((department) =>
      Department.updateOne({ name: department.name }, { $setOnInsert: department }, { upsert: true }),
    ),
  );
}

async function resolveDepartment(category) {
  const name = departmentForCategory(category);
  const department = await Department.findOne({ name, active: true }).lean();
  return department || { name, _id: null, officerIds: [] };
}

module.exports = { ensureDefaultDepartments, resolveDepartment };
