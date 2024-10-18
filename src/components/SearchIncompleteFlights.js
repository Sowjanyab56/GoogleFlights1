

import React, { useState } from 'react';
import axios from 'axios';
import { REACT_APP_RAPIDAPI_KEY } from "../Api";

const SearchIncompleteFlights = () => {
  const [flights, setFlights] = useState([]);
  const [error, setError] = useState(null); 
  const [sessionId, setSessionId] = useState('');
  const [message, setMessage] = useState(''); 
  const [noFlights, setNoFlights] = useState(false); 

  const searchIncompleteFlights = async () => {
    const options = {
      method: 'GET',
      url: 'https://sky-scrapper.p.rapidapi.com/api/v2/flights/searchIncomplete',
      params: {
        sessionId: sessionId,
        currency: 'USD',
        market: 'en-US',
        countryCode: 'US',
      },
      headers: {
        'x-rapidapi-key': REACT_APP_RAPIDAPI_KEY,
        'x-rapidapi-host': 'sky-scrapper.p.rapidapi.com',
      },
    };

try {
  const response = await axios.request(options);
  console.log('API Response:', response.data); 
  const flightData = response.data.data.itineraries || [];
  const successMessage = response.data.message || '';

  if (flightData.length === 0) {
    setNoFlights(true);
  } else {
    setNoFlights(false);
  }

  setFlights(flightData);
  setMessage(successMessage);
  setError(null);
} catch (error) {
  console.error('API Error:', error.response ? error.response.data : error.message);
  setError('Failed to fetch incomplete flight results');
}

  };

  return (
    <div className="container">
      <h2>Search Incomplete Flights</h2>
      <input
        type="text"
        className="form-control"
        placeholder="Enter Session ID"
        value={sessionId}
        onChange={(e) => setSessionId(e.target.value)}
        required
      />
      <button onClick={searchIncompleteFlights} className="btn btn-primary mt-2">
        Search Incomplete Flights
      </button>

      {message && <p className="text-success mt-3">{message}</p>}
      {error && <p className="text-danger mt-3">{error}</p>}
      
      {noFlights && (
        <div className="alert alert-info mt-3">
          No incomplete flights found.
        </div>
      )}

      <ul className="list-group mt-3">
        {flights.length > 0 ? (
          flights.map((flight, index) => (
            <li key={index} className="list-group-item">
              <h5>Flight #{index + 1}</h5>
              <p>
                <strong>Origin:</strong> {flight.legs[0].origin.name} (
                {flight.legs[0].origin.displayCode}) -{' '}
                <strong>Destination:</strong> {flight.legs[0].destination.name} (
                {flight.legs[0].destination.displayCode})
              </p>
              <p>
                <strong>Departure:</strong>{' '}
                {new Date(flight.legs[0].departure).toLocaleString()}
              </p>
              <p>
                <strong>Arrival:</strong>{' '}
                {new Date(flight.legs[0].arrival).toLocaleString()}
              </p>
              <p>
                <strong>Price:</strong> {flight.price ? flight.price.formatted : 'N/A'}
              </p>
            </li>
          ))
        ) : (
          !noFlights && (
            <p className="text-muted">Loading...</p>
          )
        )}
      </ul>
    </div>
  );
};

export default SearchIncompleteFlights;
