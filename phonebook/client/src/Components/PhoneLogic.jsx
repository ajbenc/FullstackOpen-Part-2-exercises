import { useState, useEffect } from "react";
import PhoneServer from "../Services/PhoneServer";

// Phone number validation and normalization utilities
const isValidPhoneNumber = (number) => {
  const phoneRegex = /^\d{2,3}- ?\d{6,}$/;
  const digits = number.replace(/[-\s]/g, '');
  return phoneRegex.test(number) && digits.length >= 8;
};

const normalizePhoneNumber = (num) => num.replace(/[-\s]/g, '');

const usePhoneLogic = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [filterName, setFilterName] = useState("");
  const [notification, setNotification] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch Data from server
  useEffect(() => {
    const fetchPersons = async () => {
      setLoading(true);
      try {
        const data = await PhoneServer.getAll();
        setPersons(data);
        setError(null);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Server connection failed. Please try again later.");
        setNotification({ 
          message: "Connection error: Please check server status", 
          type: "error" 
        });
      } finally {
        setLoading(false);
      }
    };
    fetchPersons();
  }, []);

  // Adding person to phonebook directory
  const addPerson = async (event) => {
    event.preventDefault();

    // Input validation
    if (!newName.trim()) {
      setNotification({
        message: 'Name cannot be empty',
        type: 'error'
      });
      setTimeout(() => setNotification(null), 5000);
      return;
    }

    const sanitizedNumber = newNumber.replace(/\s+/g, '');
    if (!isValidPhoneNumber(sanitizedNumber)) {
      setNotification({
        message: 'Invalid format! Use: 09-12345678 or 040-1234567',
        type: 'error'
      });
      setTimeout(() => setNotification(null), 5000);
      return;
    }

    // Normalized duplicate checks
    const normalizedNewNumber = normalizePhoneNumber(sanitizedNumber);
    const existingPerson = persons.find(person => 
      person.name.toLowerCase() === newName.toLowerCase().trim() && 
      person.phoneNumbers?.some(num => 
        normalizePhoneNumber(num) === normalizedNewNumber
      )
    );

    if (existingPerson) {
      setNotification({
        message: `${newName} with this number already exists`,
        type: 'warning'
      });
      setTimeout(() => setNotification(null), 5000);
      return;
    }

    const numberConflict = persons.find(person =>
      person.phoneNumbers?.some(num => 
        normalizePhoneNumber(num) === normalizedNewNumber
      ) && person.name.toLowerCase() !== newName.toLowerCase().trim()
    );

    if (numberConflict) {
      setNotification({
        message: `Number already registered to ${numberConflict.name}`,
        type: 'warning'
      });
      setTimeout(() => setNotification(null), 5000);
      return;
    }

    const newPerson = {
      name: newName.trim(),
      phoneNumbers: [sanitizedNumber]
    };

    try {
      const createdPerson = await PhoneServer.createPerson(newPerson);
      setPersons(persons.concat(createdPerson));
      setNewName("");
      setNewNumber("");
      setNotification({ 
        message: `Added ${newPerson.name}`, 
        type: "success" 
      });
      setTimeout(() => setNotification(null), 5000);
    } catch (error) {
      console.error("Error saving contact:", error);
      setNotification({ 
        message: `Failed to add ${newPerson.name}`, 
        type: "error" 
      });
      setTimeout(() => setNotification(null), 5000);
    }
  };

  const deletePerson = async (id) => {
    if (!window.confirm("Confirm permanent deletion of this contact?")) return;

    try {
      await PhoneServer.deletePerson(id);
      setPersons(persons.filter(person => person._id !== id));
      setNotification({ 
        message: "Contact deleted successfully", 
        type: "success" 
      });
      setTimeout(() => setNotification(null), 5000);
    } catch (error) {
      console.error("Deletion error:", error);
      setNotification({ 
        message: "Failed to delete contact", 
        type: "error" 
      });
      setTimeout(() => setNotification(null), 5000);
    }
  };

  const updatePerson = async (person) => {
    const currentNumber = person.phoneNumbers?.[0] || "";
    const newNumberInput = window.prompt(
      `Update number for ${person.name}:`,
      currentNumber
    );

    if (!newNumberInput?.trim()) return;

    const sanitizedNumber = newNumberInput.trim().replace(/\s+/g, '');
    if (!isValidPhoneNumber(sanitizedNumber)) {
      setNotification({
        message: 'Invalid format! Use: 09-12345678 or 040-1234567',
        type: 'error'
      });
      setTimeout(() => setNotification(null), 5000);
      return;
    }

    try {
      const updatedPerson = { 
        ...person, 
        phoneNumbers: [sanitizedNumber] 
      };
      const returnedPerson = await PhoneServer.updatePerson(person._id, updatedPerson);
      setPersons(persons.map(p => p._id === person._id ? returnedPerson : p));
      setNotification({ 
        message: `Updated ${person.name}'s number`, 
        type: "success" 
      });
      setTimeout(() => setNotification(null), 5000);
    } catch (error) {
      console.error("Update error:", error);
      setNotification({ 
        message: `Failed to update ${person.name}`, 
        type: "error" 
      });
      setTimeout(() => setNotification(null), 5000);
    }
  };

  const filterNames = persons.filter(person =>
    person.name.toLowerCase().includes(filterName.toLowerCase().trim())
  );

  return {
    newName,
    newNumber,
    filterName,
    setNewName,
    setNewNumber,
    setFilterName,
    addPerson,
    deletePerson,
    updatePerson,
    filterNames,
    notification,
    loading,
    error
  };
};

export default usePhoneLogic;