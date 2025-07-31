const fs = require("fs");
const path = require("path");

const staffPath = path.join(__dirname, "..", "data", "staff.json");
const usersPath = path.join(__dirname, "..", "data", "users.json");

// Ensure file exists and return parsed JSON
function readJsonFile(filePath, fallback = "[]") {
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, fallback);
  }
  return JSON.parse(fs.readFileSync(filePath, "utf-8"));
}

function writeJsonFile(filePath, data) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

// GET all staff
exports.getAllStaff = (req, res) => {
  const staff = readJsonFile(staffPath);
  const users = readJsonFile(usersPath);

  const enriched = staff.map((s) => {
    const user = users.find((u) => String(u.id) === String(s.userId));
    return {
      ...s,
      username: user?.username || "",
      name: user?.name || "",
    };
  });

  res.json(enriched);
};

// POST: Add or update staff
exports.addOrUpdateStaff = (req, res) => {
  const { userId, departmentId, sectionId, role, responsibilities } = req.body;

  if (!userId || !role) {
    return res.status(400).json({ message: "User ID and role are required." });
  }

  const staff = readJsonFile(staffPath);

  const entry = {
    userId,
    departmentId,
    sectionId,
    role,
    responsibilities,
  };

  const index = staff.findIndex((s) => s.userId === userId);

  if (index !== -1) {
    staff[index] = entry;
  } else {
    staff.push(entry);
  }

  writeJsonFile(staffPath, staff);

  res.json({ message: "Staff assigned successfully." });
};

// DELETE: Remove staff by userId
exports.deleteStaff = (req, res) => {
  const { userId } = req.params;
  let staff = readJsonFile(staffPath);

  const index = staff.findIndex((s) => s.userId === userId);
  if (index === -1) {
    return res.status(404).json({ message: "Staff not found." });
  }

  staff.splice(index, 1); // remove staff entry
  writeJsonFile(staffPath, staff);

  res.json({ message: "Staff deleted successfully." });
};
