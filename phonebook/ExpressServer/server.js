
import express from "express";
import fs from "fs";
import path from "path";
import crypto from "crypto";
import cors from "cors";

const app = express();
app.use(express.json());
app.use(cors());

// Add a route for the root endpoint to respond with a welcome message
app.get("/", (req, res) => {
  res.send("Welcome to the Phonebook API!");
});

// Path to the db.json file that stores phonebook data
// eslint-disable-next-line no-undef
const DB_PATH = path.join(process.cwd(), "db.json");

/**
 * Reads the JSON database.
 * Returns an object which should contain a 'personsData' array.
 */
function readDB() {
  try {
    const data = fs.readFileSync(DB_PATH, "utf8");
    return JSON.parse(data);
  } catch (error) {
    console.log("Couldn't read data", error);
    // If the file doesn't exist or is corrupt, initialize with an empty personsData array.
    return { personsData: [] };
  }
}

/**
 * Writes the updated data into the database file.
 */
function writeDB(data) {
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
}

/**
 * Generates a new token.
 */
function generateToken() {
  return crypto.randomBytes(16).toString("hex");
}

/**
 * Generates a new unique id for a contact.
 * Uses crypto to generate a random hexadecimal string.
 */
function generateId() {
  return crypto.randomBytes(4).toString("hex");
}

/**
 * GET /api/persons
 * Returns all contacts.
 */
app.get("/api/persons", (req, res) => {
  const db = readDB();
  const persons = db.personsData || [];
  res.json(persons);
});

/**
 * GET /api/persons/:id
 * Returns a single contact for the specified id.
 */
app.get("/api/persons/:id", (req, res) => {
  const id = req.params.id;
  const db = readDB();
  const person = (db.personsData || []).find((p) => p.id === id);

  if (!person) {
    return res.status(404).json({ error: "User not found" });
  }
  res.json(person);
});

/**
 * POST /api/persons
 * Expects a request body with { name: string, phoneNumbers: Array }.
 * Generates a new token and id, appends the new contact into the personsData array in db.json,
 * and returns the created contact.
 */
app.post("/api/persons", (req, res) => {
  const { name, phoneNumbers } = req.body;

  // Validate input
  if (!name || !phoneNumbers || !Array.isArray(phoneNumbers)) {
    return res.status(400).json({
      error:
        "Missing or invalid name and/or phoneNumbers. Ensure phoneNumbers is an array.",
    });
  }

  const db = readDB();
  const persons = db.personsData || [];

  // Generate a unique id and token for the new contact
  const newId = generateId();
  const token = generateToken();

  const newContact = {
    id: newId,
    name,
    phoneNumbers,
    token,
  };

  persons.push(newContact);
  db.personsData = persons;
  writeDB(db);

  console.log("New contact added:", newContact);
  res.status(201).json(newContact);
});

/**
 * PUT /api/persons/:id
 * Expects a request body with { name: string, phoneNumbers: Array }.
 * Finds the person with the specified id, updates their details,
 * writes back the updated data to db.json, and returns the updated contact.
 */
app.put("/api/persons/:id", (req, res) => {
  const id = req.params.id;
  const { name, phoneNumbers } = req.body;

  // Validate new data
  if (!name || !phoneNumbers || !Array.isArray(phoneNumbers)) {
    return res.status(400).json({
      error:
        "Missing or invalid name and/or phoneNumbers. Ensure phoneNumbers is an array.",
    });
  }

  const db = readDB();
  const persons = db.personsData || [];
  const personIndex = persons.findIndex((p) => p.id === id);

  if (personIndex === -1) {
    return res.status(404).json({ error: "User not found" });
  }

  // Update the person's data while preserving any existing token or additional fields
  const updatedPerson = { ...persons[personIndex], name, phoneNumbers };
  persons[personIndex] = updatedPerson;
  db.personsData = persons;
  writeDB(db);

  console.log("Updated person:", updatedPerson);
  res.json(updatedPerson);
});

/**
 * DELETE /api/persons/:id
 * Removes the contact with the specified id from the database.
 */
app.delete("/api/persons/:id", (req, res) => {
  const id = req.params.id;
  console.log("Received DELETE request for id:", id);
  const db = readDB();
  const persons = db.personsData || [];
  console.log("Current persons in DB:", persons);
  const initialLength = persons.length;
  const updatedPersons = persons.filter((person) => person.id !== id);

  if (updatedPersons.length === initialLength) {
    console.log("No matching person found for id:", id);
    return res.status(404).json({ error: "User not found" });
  }

  db.personsData = updatedPersons;
  writeDB(db);
  console.log("Deleted person with id:", id);
  res.status(204).end();
});

// Start the server on port 3001
const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Express server running on port ${PORT}`);
});
