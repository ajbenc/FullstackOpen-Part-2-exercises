import { useState, useEffect } from "react";
import PhoneServer from "../Services/PhoneServer";

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
        console.log("Attempting to fetch data from server...");
        const data = await PhoneServer.getAll();
        console.log("Data successfully fetched:", data);
        setPersons(data);
        setError(null);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Failed to connect to the server. Please ensure your backend is running.");
        setNotification({ 
          message: "Connection error: Please check if the server is running", 
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

    // Checking if a person already exists
    const existingPerson = persons.find(
      (person) => 
        person.name === newName && 
        person.phoneNumbers &&
        person.phoneNumbers.includes(newNumber)
    );
    
    if (existingPerson) {
      alert(`${newName} with number ${newNumber} is already added to the directory`);
      return;
    }
    
    // Checking if a number already exists
    const numberAlreadyAdded = persons.find(
      (person) => 
        person.phoneNumbers && 
        person.phoneNumbers.includes(newNumber) &&
        person.name !== newName
    );
    
    if (numberAlreadyAdded) {
      alert(`The number ${newNumber} is already added to the name ${numberAlreadyAdded.name}`);
      return;
    }

    const newPerson = {
      name: newName,
      phoneNumbers: [newNumber]
    };

    try {
      // Use the correct method name from PhoneServer
      const createdPerson = await PhoneServer.createPerson(newPerson);
      console.log("Created person:", createdPerson);
      setPersons(persons.concat(createdPerson));
      setNewName("");
      setNewNumber("");
      setNotification({ message: `Added ${newName}`, type: "success" });
      setTimeout(() => setNotification(null), 5000);
    } catch (error) {
      console.error("Error saving new person:", error);
      setNotification({ message: `Error adding ${newName}`, type: "error" });
      setTimeout(() => setNotification(null), 5000);
    }
  };

  const deletePerson = async (id) => {
    console.log("Attempting to delete person with id:", id);
    
    // Confirm deletion
    if (!window.confirm("Are you sure you want to delete this contact?")) {
      return;
    }
    
    try {
      // Use the correct method name from PhoneServer
      await PhoneServer.deletePerson(id);
      setPersons(persons.filter((person) => person._id !== id));
      setNotification({ message: "Deleted successfully", type: "success" });
      setTimeout(() => setNotification(null), 5000);
      console.log("Successfully deleted person with id:", id);
    } catch (error) {
      console.error("Error deleting person:", error);
      setNotification({ message: "Error deleting person", type: "error" });
      setTimeout(() => setNotification(null), 5000);
    }
  };

  const updatePerson = async (person) => {
    const currentNumber = person.phoneNumbers && person.phoneNumbers.length > 0 
      ? person.phoneNumbers[0] 
      : "";
    
    const newNumberInput = window.prompt(
      `Enter a new number for ${person.name}:`,
      currentNumber
    );
    
    if (newNumberInput === null || newNumberInput.trim() === "") {
      return;
    }
    
    // Create an updated person object
    const updatedPerson = { 
      ...person, 
      phoneNumbers: [newNumberInput] 
    };

    console.log("Attempting to update person:", updatedPerson);

    try {
      // Use the correct method name from PhoneServer
      const returnedPerson = await PhoneServer.updatePerson(person._id, updatedPerson);
      // Update the local state - note we're using _id not id for MongoDB
      setPersons(persons.map((p) => (p._id === person._id ? returnedPerson : p)));
      setNotification({ 
        message: `Updated ${person.name}'s number successfully`, 
        type: "success" 
      });
      setTimeout(() => setNotification(null), 5000);
    } catch (error) {
      console.error("Error updating person:", error);
      setNotification({ 
        message: `Error: Information of ${person.name} couldn't be updated`, 
        type: "error" 
      });
      setTimeout(() => setNotification(null), 5000);
    }
  };

  const filterNames = persons.filter((person) =>
    person.name.toLowerCase().includes(filterName.toLowerCase())
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