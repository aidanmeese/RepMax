import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import { createUser, getUser } from './services/user-services.js';

dotenv.config();

const app = express();
const port = 8000;

app.use(cors());
app.use(express.json());

app.listen(process.env.PORT || port, () => {
    console.log(`App listening at http://localhost:${port}`);
});

app.get("/", (req, res) => {
    res.send("Hello World!");
});

// ================ User Routes ================
/**
 * creates a new user in the db
 * @param {string} req.body.username
 * @param {string} req.body.password
 * @returns {JSON} success message or error message
 */
app.post("/user", async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: "Username and password are required" });
  }

  try {
    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Check for existing user
    const exitingUser = await getUser(username);
    if (exitingUser) return res.status(409).send("Username taken");

    // Create a new user
    const newUser = await createUser({ username, password: hashedPassword});
    console.log("New User: ", newUser);
    if (!newUser) return res.status(500).send("Error with createUser()");
    return res.status(201).send("User created successfully");
  } catch (error) {
    console.error("Error creating user: ", error);
    return res.status(500).send("Error creating user");
  }
});

/**
 * get a single user from the db with username
 * @param {string} req.params.username
 * @returns {JSON} user object or error message
 */
app.get("/user/:username", async (req, res) => {
  const { username } = req.params;
  if (!username) {
    return res.status(400).send("Username is required");
  }
  
  try {
    const user = await getUser(username);
    if (!user) return res.status(404).send("User not found");
    return res.status(200).send(user);
  } catch (error) {
    console.error("Error getting user: ", error);
    return res.status(500).send("Error getting user");
  }
});