import './App.css';
import { useState, useEffect } from 'react'  //used state hook and effect fook


function App() {   //main functional component of this app
  const MOCK_API_URL = 'https://65d483ba3f1ab8c634355638.mockapi.io/6789/dancers'
  
  const [dancers, setDancers] = useState([]);   //set up the state variables using useState hook
  //post
  const [newDancerName, setNewDancerName] = useState('');
  const [newDancerDanceMusic, setNewDancerDanceMusic] = useState('');
  const [newDancerSchoolName, setNewDancerSchoolName] = useState('');
  //PUT
  const [updatedName, setUpdatedName] = useState('');
  const [updatedDanceMusic, setUpdatedDanceMusic] = useState('');
  const [updatedSchoolName, setUpdatedSchoolName] = useState('');

  useEffect(() => {    //useEffect hook to fetch the list of dancers from the mockAPI 
    getDancers();                                             //when the CMP mounts
  }, []);

  //API functions
  function getDancers() {     //fetch the list of dancers from the mAPI and update dancers state
    fetch(MOCK_API_URL)                                           //with retrieved data
    .then(data => data.json())
    .then(data => setDancers(data))
  }

  function deleteDancer(id){    //deletes a dancer w/ specific ID from mAPI
    fetch(`${MOCK_API_URL}/${id}`,{
      method: 'DELETE'          //delete request
    }).then(() => getDancers())   //then fetch the updated list of dancers
  }

  function postNewDancer(e){  //triggered when the (e)(new dancer is submitted) happenes
    e.preventDefault();       //method prevent a browser refresh

    fetch(MOCK_API_URL, {
      method: 'POST',         //send POST request to the mAPI w/ new dancer data
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({
        name: newDancerName,
        danceMusic: newDancerDanceMusic,
        schoolName: newDancerSchoolName,
      })
    }).then(() => {           //then RESET the form inputs w/ empty string
      getDancers();
      setNewDancerName('');
      setNewDancerDanceMusic('');
      setNewDancerSchoolName('');
    })
  }

  function updateDancer(e, dancerObject) {  //triggered when the updating dancer form was sbmtted
    e.preventDefault();         //method prevent a browser refresh
    
    const updatedDancerObject = {   //encapsulate all the updated info into single object
      ...dancerObject,              //to make it easier to manage and send updated data to the server
      name: updatedName,
      danceMusic: updatedDanceMusic,
      schoolName: updatedSchoolName,
    }                           //... is used to create a copy of the existing dancerObject
    
    fetch(`${MOCK_API_URL}/${dancerObject.id}`, {
      method: 'PUT',                      //send PUT request to the mAPI
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify(updatedDancerObject),
    }).then(() => {
      getDancers();           //then RESET the form inputs w/ empty string
      setUpdatedName('');
      setUpdatedDanceMusic('');
      setUpdatedSchoolName('');
    })
  }

  return (
    <div className="App">
      <form onSubmit={(e) => postNewDancer(e)}>  
        <h2>POST New Dancer Form</h2>
        <label>Name</label>
        <input value={newDancerName} onChange={(e) => setNewDancerName(e.target.value)}></input><br></br>

        <label>Dance Music</label>
        <input value={newDancerDanceMusic} onChange={(e) => setNewDancerDanceMusic(e.target.value)}></input><br></br>

        <label>School Name</label>
        <input value={newDancerSchoolName} onChange={(e) => setNewDancerSchoolName(e.target.value)}></input><br></br>
        
        <button onClick={(e) => postNewDancer(e)}>Submit</button>
      </form>  
      {dancers.map((dancer, index) => (
        <div className="dancerContainer" key={index}>
          <div className="items">
            Name: {dancer.name} <br></br>
            Dance Music: {dancer.danceMusic} <br></br>
            School Name: {dancer.schoolName}<br></br>
            <button onClick={() => deleteDancer(dancer.id)}>Delete</button>
          </div>
          <form onSubmit={(e) => updateDancer(e, dancer)}>
            <h3>Update This Dancer</h3>
            <label>Update Name</label>
            <input onChange={(e) => setUpdatedName(e.target.value)}></input><br></br>

            <label>Update Dance Music</label>
            <input onChange={(e) => setUpdatedDanceMusic(e.target.value)}></input><br></br>

            <label>Update School Name</label>
            <input onChange={(e) => setUpdatedSchoolName(e.target.value)}></input><br></br>
            
            <button onClick={(e) => updateDancer(e, dancer)}>Update</button>
          </form>
        </div>
      ))}
    </div>
  );
}

export default App;

