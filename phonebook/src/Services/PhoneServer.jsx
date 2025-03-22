import axios from "axios";

const baseUrl = "http://localhost:3001/personsData";

//Obtain all persons data from the server

const getAll = async () => {
    const response = await axios.get(baseUrl);
    return response.data;
};

//Create new persons for the directory
const create = async (newPerson) => {
    const response = await axios.post(baseUrl, newPerson);
    return response.data;
}

//Update the phonedirectory numbers and names this details inside the server
const update = async (id, updatedPerson) => {
    const response = await axios.put(`${baseUrl}/${id}`, updatedPerson);
    return response.data;
}

//Delete the existing person entry from server
const remove = async (id) => {
    const response = await axios.delete(`${baseUrl}/${id}`);
    return response.data;
}

export default { getAll, create, update, remove };