import React, { useState } from 'react';
import axios from 'axios';
import { REACT_APP_RAPIDAPI_KEY } from "../Api";

const FlightDetails = ({ flightId }) => {
  const [details, setDetails] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchFlightDetails = async () => {
    setLoading(true);
    setError('');

    const options = {
      method: 'GET',
      url: 'https://sky-scrapper.p.rapidapi.com/api/v1/flights/getFlightDetails',
      params: {
        legs: '[{"destination":"LOND","origin":"LAXA","date":"2024-04-11"}]', 
        adults: '1',
        currency: 'USD',
        locale: 'en-US',
      },
      headers: {
        'x-rapidapi-key': REACT_APP_RAPIDAPI_KEY,
        'x-rapidapi-host': 'sky-scrapper.p.rapidapi.com',
      },
    };

    try {
      const response = await axios.request(options);
      console.log("API Response:", response.data); 
      if (response.data && response.data.price) {
        setDetails(response.data);
      } else {
        setError('No flight details found');
      }
    } catch (error) {
      console.error(error);
      setError('Failed to fetch flight details');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h3>Flight Details</h3>
      <button className="btn btn-info" onClick={fetchFlightDetails} disabled={loading}>
        {loading ? 'Loading...' : 'Get Flight Details'}
      </button>
      {error && <p className="text-danger mt-3">{error}</p>}
      {details && (
        <div className="details mt-3">
          <p>Flight Price: ${details.price}</p>
          <p>Departure: {details.departure}</p>
          <p>Arrival: {details.arrival}</p>
        </div>
      )}
    </div>
  );
};

export default FlightDetails;
