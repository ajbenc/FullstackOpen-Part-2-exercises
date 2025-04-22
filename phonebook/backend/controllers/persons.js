import Person from '../models/Person.js';

// Get all persons
export const getPersons = async (req, res) => {
  try {
    const persons = await Person.find({});
    res.json(persons);
  } catch (err) {
    res.status(500).json({ error: 'Server error fetching contacts' });
  }
};

// Create new person
export const createPerson = async (req, res) => {
  try {
    const { name, phoneNumbers } = req.body;
    
    // Validation
    if (!name || !phoneNumbers || phoneNumbers.length === 0) {
      return res.status(400).json({ error: 'Name and at least one phone number are required' });
    }

    const newPerson = new Person({
      name,
      phoneNumbers
    });

    const savedPerson = await newPerson.save();
    res.status(201).json(savedPerson);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Update person
export const updatePerson = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, phoneNumbers } = req.body;

    // Validate input
    if (!name || !phoneNumbers || phoneNumbers.length === 0) {
      return res.status(400).json({ error: 'Name and at least one phone number are required' });
    }

    const updatedPerson = await Person.findByIdAndUpdate(
      id,
      { name, phoneNumbers },
      { new: true, runValidators: true }
    );

    if (!updatedPerson) {
      return res.status(404).json({ error: 'Contact not found' });
    }

    res.json(updatedPerson);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Delete person
export const deletePerson = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedPerson = await Person.findByIdAndDelete(id);

    if (!deletedPerson) {
      return res.status(404).json({ error: 'Contact not found' });
    }

    res.status(204).end();
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};