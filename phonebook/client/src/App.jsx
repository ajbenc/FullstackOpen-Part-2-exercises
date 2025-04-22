import usePhoneLogic from "./Components/PhoneLogic";
import Form from "./Components/Form";
import Search from "./Components/Search";
import Numbers from "./Components/Numbers";

const App = () => {
  const {
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
  } = usePhoneLogic();
  return (
    <>
      <h2>Phonebook</h2>
      <div>
        <Search filterName={filterName} setFilterName={setFilterName} />
      </div>
      <Form
        newName={newName}
        newNumber={newNumber}
        addPerson={addPerson}
        setNewName={setNewName}
        setNewNumber={setNewNumber}
      />
      <br />
      <Numbers  
      filterNames={filterNames}
      updatePerson={updatePerson}
      deletePerson={deletePerson}
      />
    </>
  );
};
console.log('App runs');


export default App;
