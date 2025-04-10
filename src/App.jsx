//The map method I was using to display the list of starships was not working with this API.
//since I was running out of time I used Chat GPT to help problem solve.
//GPT said something was 'Paginated' which means my method was not getting results from
//the second & further pages of the API.
//Anyway some of the code is from Chat GPT to help me figure out the error after the class ended 
// and display the ships.
//Theoretically some of it could be commented out to get back to only what I wrote.
//However I lack the confidence to do so.
//I am a weak man....
//Specifically the try, catch section of handle submit and the useEffect section.
//I did attempt useEffect before, and while I got it to render the find a ship option.
//I couldn't get it to display any ships.

import { useState, useEffect } from 'react';

// src/App.jsx

const App = () => {
  const [force, setForce] = useState(''); //Stores input field value
  const [name, setName] = useState(''); // stores starship details
  const [model, setModel] = useState(''); // stores starship details
  const [starshipClass, setStarshipClass] = useState(''); // stores starship details
  const [manufacturer, setManufacturer] = useState(''); // stores starship details
  const [error, setError] = useState(''); //GPT item helped me log issues.
  const [starshipsList, setStarshipsList] = useState([]); //stores ships from API in array.
    //The array tripped me up.  I should have known items could be stored in arrays.

  const useTheForce = (event) => {
    setForce(event.target.value);
  }; //setForce updates input value whenever user types in the field.
  // event.target.value captures value of input field.

  const handleSubmit = async (event) => {
    //triggered when the form is submiteed.
    event.preventDefault();
    //prevents default form submission behavior (reloading)
    setError('');
    //Clears any previous error messages before starting a new search.

    //Here there be GPT code for handling errors.  I'm studying it to understand.
    try {
      let url = 'https://swapi.dev/api/starships/';
      let found = null;
      //Base url for star wars API.
      //found holds starship that matches user input.

      //Loop continues fetching pages of starships from API as long as 
      //There's a url to fetch and a match hasn't been found.
      // '!' means NOT so this makes the loop keep going until the found variable has a 
      // property that is no longer Null.
      while (url && !found) {
        const response = await fetch(url);
        //'fetches' data from url.  
        //Await allows for async coding.
        const data = await response.json();
        //waits for response to be converted to JSON.


        //searches for a starship that matches the input (force)
        //I wish I had named it something other than force. 
        //I was trying to be cute.
        found = data.results.find(ship =>
          ship.name.toLowerCase() === force.toLowerCase()
        );
        //toLowerCase ignores case giving us a little leeway on all the silly ship names
        //like TIE Advanced x1 or H-type Nubian yacht.


        //If there's PAGINATION, learned that word today. this updates the url to 
        //fetch the next page.
        url = data.next;
      }

      //Error message to let me know 'hey something's working, but that starship doesn't exist.
      //Possibly because you forgot the second n in Millennium again jackass'.
      if (!found) {
        throw new Error("Starship not found");
      }
      setName(found.name); //Updates name with found starship.
      setModel(found.model); // Updates model with found starship.
      setStarshipClass(found.starship_class); // same but class.
      setManufacturer(found.manufacturer); // same but manufacturer.
    } catch (err) { //here there be chat GPT error messaging.
      console.error(err);
      setError("Couldn't find that starship. Try another name!");
      setName('');
      setModel('');
      setStarshipClass('');
      setManufacturer('');
    }
  }; 
  //This hook runs once when the component mounts.
  useEffect(() => {
    const getData = async () => { //handles fetching the starships through PAGINATION
      let url = `https://swapi.dev/api/starships/`; //API URL
      let allStarships = [];// this array holds the starships from the API
  
      while (url) {//fetches data until all the pages are retrieved.
        //and there was much rejoicing.
        const response = await fetch(url);
        const data = await response.json();
        console.log("Fetched data:", data); // Log each page of data
  
        allStarships = [...allStarships, ...data.results]; // Append results from each page
  
        url = data.next;  // Move to the next page (if available)
      }
  
      setStarshipsList(allStarships);  // Once all pages are fetched, set the list
      //with the combined list of all starships
    };
  
    getData();
  }, []);//this thing is weird, apparently this empty array makes the useEffect hook
  //only run once.

  return (
    <form onSubmit={handleSubmit}> 
    {/* {/* form is wrapped around the input field & submit button to call 'handle submit  */}
      A long time ago, in a galaxy far far away: {force}
      <br />
      <input type="text" value={force} onChange={useTheForce} />
      <input type="submit" value="Search your Feelings" />
      <hr />
      <h3>Starship Info</h3>
      <p>Name: {name}</p>
      <p>Model: {model}</p>
      <p>Class: {starshipClass}</p>
      <p>Manufacturer: {manufacturer}</p>
      <hr />
      <h4>List of Starships:</h4>
      <ul>
        {starshipsList.map((ship, index) => (
          <li key={index}>{ship.name}</li>
        ))}
      </ul>
    </form>
  );
};

export default App;
