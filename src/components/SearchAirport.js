import React, { useState } from 'react';
import axios from 'axios';
import { REACT_APP_RAPIDAPI_KEY } from "../Api";

const SearchAirport = () => {
  const [query, setQuery] = useState('');
  const [airports, setAirports] = useState([]);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1); 
  const airportsPerPage = 5; 

  const searchAirports = async () => {
    const options = {
      method: 'GET',
      url: 'https://sky-scrapper.p.rapidapi.com/api/v1/flights/searchAirport',
      params: { query, locale: 'en-US' },
      headers: {
        'x-rapidapi-key': REACT_APP_RAPIDAPI_KEY,
        'x-rapidapi-host': 'sky-scrapper.p.rapidapi.com',
      },
    };

    try {
      const response = await axios.request(options);
      if (response.data && response.data.data) {
        setAirports(response.data.data);
        setError(null);
        setCurrentPage(1); 
      } else {
        setAirports([]);
        setError('No airports found');
      }
    } catch (error) {
      setError('Failed to fetch airports');
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
      <h2 className="text-primary mb-4">Search Airports</h2>
      <div className="input-group mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Enter airport or city"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <div className="input-group-append">
          <button onClick={searchAirports} className="btn btn-primary">
            Search
          </button>
        </div>
      </div>

      {error && <p className="text-danger">{error}</p>}

      {airports.length > 0 ? (
        <>
          <ul className="list-group mt-3">
            {currentAirports.map((airport, index) => (
              <li
                key={index}
                className="list-group-item d-flex justify-content-between align-items-center"
                style={{ backgroundColor: '#f8f9fa', marginBottom: '10px' }}
              >
                <div>
                  <h5 className="mb-1 text-info">{airport.presentation?.suggestionTitle}</h5>
                  <small className="text-muted">{airport.presentation?.subtitle}</small>
                </div>
              </li>
            ))}
          </ul>

          
          <div className="d-flex justify-content-between align-items-center mt-4">
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
        </>
      ) : (
        <p className="text-muted mt-3">No airports found.</p>
      )}
    </div>
  );
};

export default SearchAirport;
