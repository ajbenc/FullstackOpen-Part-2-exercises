import { useState, useEffect } from "react";
import PhoneServer from "../Services/PhoneServer";

const usePhoneLogic = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [filterName, setFilterName] = useState("");
  const [notification, setNotification] = useState(null);

  //Fetch Data from server
  useEffect(() => {
    PhoneServer.getAll()
      .then((data) => {
        setPersons(data);
      })
      .catch((error) => {
        console.error("Error fetching data: ", error);
      });
    console.log("server and data runs as expected");
  }, []);

  //Adding person to phonebook directory
  const addPerson = async (event) => {
    event.preventDefault();

    //checking if a person already exist and prevent it
    const existingPerson = persons.find(
      (person) => person.name === newName && person.number === newNumber
    );
    if (existingPerson) {
      alert(
        `${newName} with number ${newNumber} is already added to the directory`
      );
      return;
    }
    //checking if a number already exist and prevent it
    const numberAlreadyAdded = persons.find(
      (person) => person.number === newNumber && person.name !== newName
    );
    if (numberAlreadyAdded) {
      alert(`The number ${newNumber} is already added to the name ${newName}`);
    }

    const newPerson = {
      name: newName,
      number: newNumber,
    };

    try {
      const createdPerson = await PhoneServer.create(newPerson);
      console.log("Created person:", createdPerson);
      setPersons(persons.concat(createdPerson));
      setNewName("");
      setNewNumber("");
      setTimeout(() => setNotification(null), 5000);
    } catch (error) {
      console.error("Error saving new person: ", error);
      setNotification({ message: `Error adding ${newName}`, type: "error"});
      setTimeout(() => setNotification(null), 5000);
    }
  };

  const deletePerson = async (id) => {
    console.log("Attempting to delete person with id:", id);
    try {
      await PhoneServer.remove(id);
      setPersons(persons.filter((person) => person.id !== id));
      setNotification({ message: "Deleted successfully", type: "error"});
      setTimeout(() => setNotification(null), 5000);
      console.log("Successfully deleted person with id:", id);
    } catch (error) {
      console.error("Error deleting person: ", error);
      setNotification({ message: "Error deleting person", type: "error" });
      setTimeout(() => setNotification(null), 5000);
    }
  };

  const updatePerson = async (person) => {
    const newNumberInput = window.prompt(
      `Enter a new number for ${person.name}:`,
      person.number
    );
    if (newNumberInput === null || newNumberInput.trim() === "") {
      return;
    }
    const updatedPerson = { ...person, number: newNumberInput };

    console.log("Attempting to update person:", updatedPerson);

    try {
      const returnedPerson = await PhoneServer.update(person.id, updatedPerson);
      setPersons(persons.map((p) => (p.id === person.id ? returnedPerson : p)));
      setNotification({ message: `Updated ${person.name}'s number successfully`, type: "success" });
      setTimeout(() => setNotification(null), 5000);
    } catch (error) {
      console.error("Error updating person:", error);
      setNotification({ message: `Error: Information of ${person.name} has already been removed from server`, type: "error" });
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
  };
};

export default usePhoneLogic;
