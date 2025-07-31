const fs = require("fs");
const path = require("path");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const usersPath = path.join(__dirname, "..", "data", "users.json");
const jwtSecret = process.env.JWT_SECRET;

if (!jwtSecret) {
  throw new Error("JWT_SECRET is not defined in .env file");
}

function readUsers() {
  if (!fs.existsSync(usersPath)) fs.writeFileSync(usersPath, "[]");
  const data = fs.readFileSync(usersPath, "utf-8");
  return JSON.parse(data);
}

function writeUsers(users) {
  fs.writeFileSync(usersPath, JSON.stringify(users, null, 2));
}

exports.register = (req, res) => {
  const { username, password, name } = req.body;
  const users = readUsers();

  if (users.find((u) => u.username === username)) {
    return res.status(400).json({ message: "Username already exists" });
  }

  const hashed = bcrypt.hashSync(password, 10);
  const newUser = { id: Date.now(), username, name, password: hashed };
  users.push(newUser);
  writeUsers(users);

  const token = jwt.sign(
    { id: newUser.id, username: newUser.username, name: newUser.name },
    jwtSecret,
    { expiresIn: "1d" }
  );

  res
    .status(201)
    .json({ message: "User registered", token, name: newUser.name });
};

exports.login = (req, res) => {
  const { username, password } = req.body;
  const users = readUsers();

  const user = users.find((u) => u.username === username);
  if (!user || !bcrypt.compareSync(password, user.password)) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const token = jwt.sign(
    { id: user.id, username: user.username, name: user.name },
    jwtSecret,
    { expiresIn: "1d" }
  );

  res.json({ token, name: user.name });
};

exports.authMiddleware = (req, res, next) => {
  const auth = req.headers.authorization;
  if (!auth) return res.status(401).json({ message: "No token" });

  const token = auth.split(" ")[1];
  try {
    const decoded = jwt.verify(token, jwtSecret);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(403).json({ message: "Invalid token" });
  }
};
exports.getAllUsers = (req, res) => {
  const users = readUsers();
  const simplified = users.map((u) => ({
    id: u.id,
    username: u.username,
    name: u.name,
  }));
  res.json(simplified);
};
