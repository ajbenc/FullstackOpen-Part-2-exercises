import React from "react";

const Numbers = ({ filterNames, deletePerson, updatePerson }) => {
  return (
    <div className="numbers-container">
      <h2>Numbers</h2>
      {filterNames.map((person) => (
        <div key={person.id} style={{ marginBottom: "8px" }}>
          <span>
            {person.name} : {person.phoneNumbers}
          </span>
          <button
            onClick={() => updatePerson(person)}
            style={{ marginLeft: "8px" }}
          >
            Update
          </button>
          <button
            onClick={() => deletePerson(person.id)}
            style={{ marginLeft: "4px" }}
          >
            Delete
          </button>
        </div>
      ))}
    </div>
  );
};

export default Numbers;
