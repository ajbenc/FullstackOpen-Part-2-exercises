
import 'dotenv/config';
import process from "process";
import express from "express";
import mongoose from "mongoose";
import crypto from "crypto";
import cors from "cors";

const app = express();
app.use(express.json());
app.use(cors());

// Load environment variables from .env file
const mongoUri = process.env.MONGO_URI;
const PORT = process.env.PORT || 3001;

if (!mongoUri) {
  console.error("Missing MongoDB connection string in .env (MONGO_URI)");
  process.exit(1);
}

// Connect to MongoDB
mongoose.connect(mongoUri)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
    process.exit(1);
  });

// Define the Mongoose schema and model for a Person
const personSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phoneNumbers: { type: [String], required: true },
  token: { type: String, default: "" }
});

const Person = mongoose.model("Person", personSchema);

/**
 * Generates a new token.
 */
function generateToken() {
  return crypto.randomBytes(16).toString("hex");
}

/**
 * GET /
 * Welcome route.
 */
app.get("/", (req, res) => {
  res.send("Welcome to the Phonebook API!");
});

/**
 * GET /api/persons
 * Retrieves all contacts from MongoDB.
 */
app.get("/api/persons", async (req, res) => {
  try {
    const persons = await Person.find({});
    res.json(persons);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
    console.log(error);
    
  }
});

/**
 * GET /api/persons/:id
 * Retrieves a single contact by its MongoDB _id.
 */
app.get("/api/persons/:id", async (req, res) => {
  try {
    const person = await Person.findById(req.params.id);
    if (!person) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json(person);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
    console.log(error);
  }
});

/**
 * POST /api/persons
 * Creates a new contact with the provided name and phoneNumbers.
 */
app.post("/api/persons", async (req, res) => {
  const { name, phoneNumbers } = req.body;
  if (!name || !phoneNumbers || !Array.isArray(phoneNumbers)) {
    return res.status(400).json({
      error: "Missing or invalid name and/or phoneNumbers. Ensure phoneNumbers is an array."
    });
  }

  const token = generateToken();

  const newPerson = new Person({
    name,
    phoneNumbers,
    token
  });

  try {
    const savedPerson = await newPerson.save();
    console.log("New contact added:", savedPerson);
    res.status(201).json(savedPerson);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
    console.log(error);
  }
});

/**
 * PUT /api/persons/:id
 * Updates the contact with the specified id.
 */
app.put("/api/persons/:id", async (req, res) => {
  const { name, phoneNumbers } = req.body;
  if (!name || !phoneNumbers || !Array.isArray(phoneNumbers)) {
    return res.status(400).json({
      error: "Missing or invalid name and/or phoneNumbers. Ensure phoneNumbers is an array."
    });
  }

  try {
    const updatedPerson = await Person.findByIdAndUpdate(
      req.params.id,
      { name, phoneNumbers },
      { new: true, runValidators: true }
    );
    if (!updatedPerson) {
      return res.status(404).json({ error: "User not found" });
    }
    console.log("Updated person:", updatedPerson);
    res.json(updatedPerson);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
    console.log(error);
  }
});

/**
 * DELETE /api/persons/:id
 * Deletes the contact with the specified id.
 */
app.delete("/api/persons/:id", async (req, res) => {
  try {
    const deletedPerson = await Person.findByIdAndRemove(req.params.id);
    if (!deletedPerson) {
      return res.status(404).json({ error: "User not found" });
    }
    console.log("Deleted person with id:", req.params.id);
    res.status(204).end();
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
    console.log(error);
  }
});

// Start the server on the specified PORT
app.listen(PORT, () => {
  console.log(`Express server running on port ${PORT}`);
});
