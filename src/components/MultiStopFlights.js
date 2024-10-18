// getting  error  in  api  

import React, { useState } from 'react';
import axios from 'axios';
import {REACT_APP_RAPIDAPI_KEY} from "../Api"

const MultiStopFlights = () => {
  const [flights, setFlights] = useState([]);
  const [error, setError] = useState(null);

  const searchMultiStopFlights = async () => {
    const options = {
      method: 'GET',
      url: 'https://sky-scrapper.p.rapidapi.com/api/v1/flights/searchFlightsMultiStops',
      params: {
        legs: JSON.stringify([
          { origin: 'AMD', originEntityId: '95673366', destination: 'STV', destinationEntityId: '128667060', date: '2025-02-07' },
          { origin: 'STV', originEntityId: '128667060', destination: 'BOM', destinationEntityId: '95673320', date: '2025-02-12' }
        ]),
        cabinClass: 'economy',
        adults: '1',
        sortBy: 'best',
        currency: 'USD',
        countryCode: 'US',
        market: 'en-US',
      },
      headers: {
        'x-rapidapi-key':REACT_APP_RAPIDAPI_KEY,
        'x-rapidapi-host': 'sky-scrapper.p.rapidapi.com',
      },
    };

    try {
      const response = await axios.request(options);
      setFlights(response.data);
    } catch (error) {
      setError('Failed to fetch multi-stop flights');
    }
  };

  return (
    <div className="container">
      <h2>Search Multi-Stop Flights</h2>
      <button onClick={searchMultiStopFlights} className="btn btn-primary">Search Multi-Stop Flights</button>

      {error && <p className="text-danger">{error}</p>}

      <ul className="list-group mt-3">
        {flights.map((flight, index) => (
          <li key={index} className="list-group-item">
            {flight.origin} to {flight.destination} - ${flight.price}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MultiStopFlights;


