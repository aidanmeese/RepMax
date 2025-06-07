import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { getUser } from './services/user-services.js';
import { createNewUser, loginUser, authenticateUser } from './services/auth.js';
import { createLift, getLifts, updateLift, deleteLift, getTopLifts } from './services/lift-services.js';

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
 * signup a new user in the db
 * @param {string} req.body.username
 * @param {string} req.body.password
 * @returns {JSON} auth token or error message
 */
app.post("/signup", createNewUser);

/**
 * login a user in the db
 * @param {string} req.body.username
 * @param {string} req.body.password
 * @returns {JSON} auth token or error message
 */
app.post("/login", loginUser);

/**
 * get current user info
 * This route is protected by the authenticateUser middleware.
 * @returns {Promise<User?>}
 */
app.get("/user/me", authenticateUser, async (req, res) => {
  try {
    console.log("Getting user:", req.user.username);

    const user = await getUser(req.user.username);
    // Check for not found
    if (user === undefined || user === null) {
      res.status(404).send("Unable to find the user with that email.");
    } else {
      res.send(user);
    }
  } catch (error) {
    console.log(error);
    res.status(500).send("An error occurred in the server.");
  }
});

/**
 * get a single user from the db with username
 * @param {string} req.params.username
 * @returns {JSON} user object or error message
 */
app.get("/user/:username", async (req, res) => {
  console.log("Getting user:", req.params.username);  
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

// ================ Lift Routes ================
/**
 * creates a new lift in the db
 * @param {string} req.body.user_id
 * @param {string} req.body.type
 * @param {number} req.body.reps
 * @param {number} req.body.weight
 * @param {string} req.body.weight_type - kg or lbs
 * @returns {JSON} success message or error message
 */
app.post("/lift", authenticateUser, async (req, res) => {
  const { type, reps, weight, weight_type } = req.body;
  const user_id = req.user.id; // Get user_id from authenticated user
  if (!user_id || !type || !reps || !weight || !weight_type) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    // Create a new lift
    const newLift = await createLift({ user_id, type, reps, weight, weight_type });
    console.log("New Lift: ", newLift);
    if (!newLift) return res.status(500).send("Error with createLift()");
    return res.status(201).send("Lift created successfully");
  } catch (error) {
    console.error("Error creating lift: ", error);
    return res.status(500).send("Error creating lift");
  }
});

/**
 * get all lifts from the db with user_id
 * @param {string} req.params.user_id
 * @returns {JSON} array of lift objects or error message
 */
app.get("/lifts/:user_id", async (req, res) => {
  const { user_id } = req.params;
  if (!user_id) {
    return res.status(400).send("User ID is required");
  }
  
  try {
    const lifts = await getLifts(user_id);
    if (!lifts) return res.status(404).send("No lifts found for this user");
    return res.status(200).send(lifts);
  } catch (error) {
    console.error("Error getting lifts: ", error);
    return res.status(500).send("Error getting lifts");
  }
});

/**
 * update a single lift in the db
 * @param {string} req.body._id
 * @param {string} req.body.user_id
 * @param {string} req.body.type
 * @param {number} req.body.reps
 * @param {number} req.body.weight
 * @param {string} req.body.weight_type - kg or lbs
 * @returns {JSON} success message or error message
 */
app.put("/lift", authenticateUser, async (req, res) => {
  const { _id, user_id, type, reps, weight, weight_type } = req.body;
  if (!_id || !user_id || !type || !reps || !weight || !weight_type) {
    return res.status(400).json({ error: "All fields are required" });
  }

  if (! req.user || req.user.id !== user_id) {
    return res.status(403).send("You do not have permission to update this lift");
  }

  try {
    // Update the lift
    const updatedLift = await updateLift({ _id, user_id, type, reps, weight, weight_type }, req.user.id);
    console.log("Updated Lift: ", updatedLift);
    if (!updatedLift) return res.status(500).send("Error with updateLift()");
    return res.status(200).send("Lift updated successfully");
  } catch (error) {
    console.error("Error updating lift: ", error);
    return res.status(500).send("Error updating lift");
  }
});

/**
 * delete a single lift in the db
 * @param {string} req.params._id
 * @returns {JSON} success message or error message
 */
app.delete("/lift/:_id", authenticateUser, async (req, res) => {
  const { _id } = req.params;
  if (!_id) {
    return res.status(400).send("Lift ID is required");
  }

  console.log("Deleting lift with ID:", _id, "for user_id:", req.user.id);

  if (!req.user.id) {
    return res.status(403).send("You do not have permission to delete this lift");
  }

  try {
    const deletedLift = await deleteLift(_id, req.user.id);
    if (!deletedLift) return res.status(404).send("Lift not found");
    return res.status(200).send("Lift deleted successfully");
  } catch (error) {
    console.error("Error deleting lift: ", error);
    return res.status(500).send("Error deleting lift");
  }
});

/**
 * get top lifts by type
 * @param {string} req.query.weight_type - kg or lbs (optional, defaults to lbs)
 * @returns {JSON} array of top lifts or error message
 */
app.get("/leaderboard", async (req, res) => {
  const { weight_type } = req.query;
  if (weight_type && !['kg', 'lbs'].includes(weight_type)) {
    return res.status(400).send("Invalid weight type. Use 'kg' or 'lbs'.");
  }

  try {
    const topLifts = await getTopLifts(weight_type);
    if (!topLifts) return res.status(404).send("No top lifts found");
    return res.status(200).send(topLifts);
  } catch (error) {
    console.error("Error getting top lifts: ", error);
    return res.status(500).send("Error getting top lifts");
  }
});