

const baseUrl = "http://localhost:3001/api/persons";

//Obtain all persons data from the server

const getAll = async () => {
   const response = await fetch(baseUrl);
   if (!response.ok){
       throw new Error('Failed to fetch persons data');
    }
    return await response.json();
};

//Create new persons for the directory
const create = async (newPerson) => {
    const response = await fetch(baseUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(newPerson)
    });
    if (!response.ok){
        throw new Error('Failed to create new person');
    }

    return await response.json();
}

//Update the phonedirectory numbers and names this details inside the server
const update = async (id, updatedPerson) => {
     const response = await fetch(`${baseUrl}/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedPerson)
     });
     if (!response.ok){
        throw new Error('Failed to update person');
     }
     return await response.json();
}

//Delete the existing person entry from server
const remove = async (id) => {
    const response = await fetch(`${baseUrl}/${id}`, {
      method: "DELETE"
    });
    if (!response.ok) {
      throw new Error("Failed to delete person");
    }
    if (response.status === 204) {
      return {};
    }
    return await response.json();
  };
export default { getAll, create, update, remove };