import React, { useState } from 'react';
import axios from 'axios';
import { REACT_APP_RAPIDAPI_KEY } from "../Api";

const NearbyAirports = () => {
  const [airports, setAirports] = useState([]); 
  const [currentAirport, setCurrentAirport] = useState({}); 
  const [error, setError] = useState(null); 
  const [currentPage, setCurrentPage] = useState(1); 
  const airportsPerPage = 5; 

  const fetchNearbyAirports = async () => {
    const options = {
      method: 'GET',
      url: 'https://sky-scrapper.p.rapidapi.com/api/v1/flights/getNearByAirports',
      params: { lat: '19.242218017578125', lng: '72.85846156046128', locale: 'en-US' },
      headers: {
        'x-rapidapi-key': REACT_APP_RAPIDAPI_KEY,
        'x-rapidapi-host': 'sky-scrapper.p.rapidapi.com',
      },
    };

    try {
      const response = await axios.request(options);
      const { current, nearby } = response.data.data;
      setCurrentAirport(current);
      setAirports(nearby);
      setError(null);
      setCurrentPage(1); 
    } catch (error) {
      setError('Failed to fetch nearby airports');
    }
  };

  
  const indexOfLastAirport = currentPage * airportsPerPage;
  const indexOfFirstAirport = indexOfLastAirport - airportsPerPage;
  const currentAirports = airports.slice(indexOfFirstAirport, indexOfLastAirport);

  
  const totalPages = Math.ceil(airports.length / airportsPerPage);

  
  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div className="container" style={{ maxWidth: '600px', marginTop: '20px' }}>
      <h2 className="text-primary">Nearby Airports</h2>
      <button onClick={fetchNearbyAirports} className="btn btn-primary">
        Find Nearby Airports
      </button>

      {error && <p className="text-danger mt-3">{error}</p>}

  
      {currentAirport?.presentation && (
        <div className="mt-4">
          <h3>Current Airport:</h3>
          <div className="card mb-3" style={{ backgroundColor: '#f8f9fa', borderRadius: '10px' }}>
            <div className="card-body">
              <h5 className="card-title text-dark">
                {currentAirport.presentation.suggestionTitle}
              </h5>
              <p className="card-text text-muted">{currentAirport.presentation.subtitle}</p>
            </div>
          </div>
        </div>
      )}

  
      {airports.length > 0 && (
        <div className="mt-4">
          <h3 className="text-secondary">Nearby Airports:</h3>
          <ul className="list-group">
            {currentAirports.map((airport, index) => (
              <li
                key={index}
                className="list-group-item"
                style={{ backgroundColor: '#e9ecef', borderRadius: '5px', marginBottom: '10px' }}
              >
                <h5 className="text-info">{airport.presentation.suggestionTitle}</h5>
                <p className="text-dark">{airport.presentation.subtitle}</p>
              </li>
            ))}
          </ul>

          
          <div className="d-flex justify-content-between mt-3">
            <button
              className="btn btn-outline-primary"
              onClick={prevPage}
              disabled={currentPage === 1}
            >
              Previous
            </button>
            <span className="text-muted">
              Page {currentPage} of {totalPages}
            </span>
            <button
              className="btn btn-outline-primary"
              onClick={nextPage}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default NearbyAirports;
