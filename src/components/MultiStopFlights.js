import React, { useState } from 'react';
import axios from 'axios';
import { REACT_APP_RAPIDAPI_KEY } from "../Api";

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
        'x-rapidapi-key': REACT_APP_RAPIDAPI_KEY,
        'x-rapidapi-host': 'sky-scrapper.p.rapidapi.com',
      },
    };

    try {
      const response = await axios.request(options);
      
      // Check if the response contains the expected data
      if (response.data && response.data.data && Array.isArray(response.data.data.itineraries)) {
        setFlights(response.data.data.itineraries);  // Assuming itineraries is an array
        setError(null);  // Clear any previous error
      } else {
        setError('No valid flights found.');
        setFlights([]);
      }
    } catch (error) {
      setError('Failed to fetch multi-stop flights');
      console.error(error);
    }
  };

  return (
    <div className="container">
      <h2>Search Multi-Stop Flights</h2>
      <button onClick={searchMultiStopFlights} className="btn btn-primary">
        Search Multi-Stop Flights
      </button>

      {error && <p className="text-danger">{error}</p>}

      {flights.length > 0 ? (
        <ul className="list-group mt-3">
          {flights.map((flight, index) => (
            <li key={index} className="list-group-item">
              <strong>Flight {index + 1}</strong> - {flight.legs[0].origin.name} to {flight.legs[0].destination.name}
              <p>Price: {flight.price.formatted}</p>
              <p>Carrier: {flight.legs[0].carriers.marketing[0].name}</p>
              <p>Departure: {new Date(flight.legs[0].departure).toLocaleString()}</p>
              <p>Arrival: {new Date(flight.legs[0].arrival).toLocaleString()}</p>
              <p>Duration: {flight.legs[0].durationInMinutes} mins</p>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-3 text-muted">No flights found</p>
      )}
    </div>
  );
};

export default MultiStopFlights;
