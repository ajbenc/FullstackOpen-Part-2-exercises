

const Form = ({ newName, newNumber, addPerson, setNewName, setNewNumber}) => {
    return (<form onSubmit={addPerson}>
        <div>
          <h4>name:{" "}</h4>
          <input
            value={newName}
            onChange={(event) => setNewName(event.target.value)}
          />
        </div>
        <div>
          <h4>number:{" "}</h4>
          <input
            value={newNumber}
            onChange={(event) => setNewNumber(event.target.value)}
          />
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
    );
  
    
}
console.log('form is running...');
export default Form;