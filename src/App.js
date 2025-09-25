import { useState, useEffect } from 'react';

import './App.css';

const API_URL = 'https://restcountries.com/v3.1/';

class Country {
  constructor(code, name) {
    this.code = code;
    this.name = name;
  }
}

function Header() {
  return (
      <header id="header-container" className='container'> 
        <div> 
            <h1>World Facts</h1>
        </div>
      </header>
  )
}

function sortCountries(data) {

  let transactions = data;
  transactions.sort((a, b) => {
    a = a.name;
    b = b.name;
    return a < b ? -1 : 1;
  });
  return transactions;
}

function App() {  
  const [countries, setCountries] = useState([]);
  const [country, setCountry] = useState([]);
  const [countryCode, setCountryCode] = useState('');


  function handleSelectCountry(event) {
    setCountryCode(event.target.value);
  }

  async function fetchCountryData() {
    const url = API_URL + 'alpha/' + countryCode;
    const response = await fetch(url);
    let data = await response.json();
    let objCountry = new Country(countryCode, data[0]["name"]["common"]);
    objCountry.population = data[0]["population"];
    setCountry(objCountry);
    objCountry.flag = data[0]["flags"]["png"];  
    objCountry.coatOfArms = data[0]['coatOfArms']['png'];
    objCountry.area = data[0]["area"];
    objCountry.capital = data[0]['capital'][0];
    objCountry.flagDescription = data[0]['flags']['alt'];
    let currencyKey = Object.keys(data[0]['currencies']);
    let currency = data[0]['currencies'][currencyKey];
    objCountry.currency = currencyKey + ' ' + currency['name'];
    console.log('COUNTRY DATA: ' + JSON.stringify(currency));
  }


  let blnCountriesFetched = false;
  async function fetchCountries() {
      blnCountriesFetched = true;
      const url = API_URL + 'all?fields=name,cca2';
      console.log('url: ' + url);
      const method = "GET";

      const response = await fetch(url, {headers: {
        'Content-Type' : 'application/json'
      }
      });
      const data = await response.json();

      let countriesData = [];
      //console.log(" data.length: " + data[1].length);
      //console.log(JSON.stringify(data));
      for (let i = 0; i < data.length; i++ ) {
          let country = [];
          country["ISOCode"] = data[i]['cca2'];
          country["name"] = data[i]['name']['common'];
          //console.log('name: '+ country.name);
          countriesData.push(country);
      }
      
      setCountries([...countriesData]);
  }

  async function fetchData() {
      if (!blnCountriesFetched) {
          await fetchCountries();
      }
  }    

  useEffect(() => {
    fetchData(); // Load initial data
      //console.log('countries length 2: ' + countries.length);
  }, []);


  useEffect(() => {
    if (countryCode != '') {
      fetchCountryData();
    }
  }, [countryCode]);

  const sortedCountries = sortCountries(countries);
  return (
    <>
    <Header />
    <div className='container'>
      <select onChange={handleSelectCountry}>
        <option>Select a country...</option>
        {sortedCountries.map( (item, index) => <option key={index} value={item.ISOCode}>{item.name}</option>)
        }
      </select>
    </div>

    {country.name && (<>

      <div className="container">
        <div>
          <h3>Population</h3>
          <p>
            {country.population.toLocaleString()}
          </p>
        </div>
      </div>
      <div className="container">
        <div>
          <h3>Capital City</h3>
          <p>
            {country.capital}
          </p>
        </div>
      </div>
      <div className="container">
        <div>
          <h3>Area</h3>
          <p>
            {country.area.toLocaleString()} m<sup>2</sup>
          </p>
        </div>
      </div>
      <div className="container">
        <div>
          <h3>Currency</h3>
          <p>
            {country.currency}
          </p>
        </div>
      </div>
        <div className="container image">
          <div>
            <p>
              <img src={country.flag} />  
            </p>
          </div>
        </div>
        { country.flagDescription && (
        <div className="container image">
          <div>
            <p>
              {country.flagDescription}  
            </p>
          </div>
        </div>
        )}
        { country.coatOfArms && (
          <div className="container">
            <div>
              <p>Coat of Arms </p>
                <img src={country.coatOfArms} />  
            </div>
          </div>
        )}
      </>
    )}
  </>
  )
}

export default App;
