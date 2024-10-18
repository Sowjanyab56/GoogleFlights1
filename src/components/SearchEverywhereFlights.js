import React, { useState } from 'react';
import axios from 'axios';
import { REACT_APP_RAPIDAPI_KEY } from "../Api";

const SearchEverywhereFlights = () => {
  const [origin, setOrigin] = useState('95673322'); 
  const [flights, setFlights] = useState([]); 
  const [error, setError] = useState(null); 
  const [currentPage, setCurrentPage] = useState(1);
  const resultsPerPage = 10; 

  const searchEverywhereFlights = async () => {
    const options = {
      method: 'GET',
      url: 'https://sky-scrapper.p.rapidapi.com/api/v2/flights/searchFlightEverywhere',
      params: {
        originEntityId: origin,
        cabinClass: 'economy',
        journeyType: 'one_way',
        currency: 'USD',
      },
      headers: {
        'x-rapidapi-key': REACT_APP_RAPIDAPI_KEY,
        'x-rapidapi-host': 'sky-scrapper.p.rapidapi.com',
      },
    };

    try {
      const response = await axios.request(options);
      setFlights(response.data.data.results); 
      setError(null); 
      setCurrentPage(1); 
    } catch (error) {
      console.error(error);
      setError('Failed to fetch flights to everywhere');
    }
  };

  const indexOfLastFlight = currentPage * resultsPerPage;
  const indexOfFirstFlight = indexOfLastFlight - resultsPerPage;
  const currentFlights = flights.slice(indexOfFirstFlight, indexOfLastFlight);

  const totalPages = Math.ceil(flights.length / resultsPerPage);

  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prevPage) => prevPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prevPage) => prevPage - 1);
    }
  };

  return (
    <div className="container my-4">
      <h2 className="text-center text-primary mb-4">Search Flights to Everywhere</h2>
      
      <div className="form-group mb-4">
        <input
          type="text"
          className="form-control"
          placeholder="Enter origin entity ID (e.g., 95673322)"
          value={origin}
          onChange={(e) => setOrigin(e.target.value)}
        />
        <button onClick={searchEverywhereFlights} className="btn btn-primary mt-3">
          Search Flights
        </button>
      </div>

      {error && <p className="text-danger mt-3">{error}</p>}

      {currentFlights.length > 0 ? (
        <div className="row">
          {currentFlights.map((flight, index) => (
            <div key={index} className="col-md-6 mb-4">
              <div className="card h-100">
                <div className="row no-gutters">
                  <div className="col-md-4">
                    <img
                      src={flight.content.image.url}
                      alt={flight.content.location.name}
                      className="img-fluid rounded-start"
                      style={{ objectFit: 'cover', height: '100%', width: '100%' }}
                    />
                  </div>
                  <div className="col-md-8">
                    <div className="card-body">
                      <h5 className="card-title text-primary">
                        {flight.content.location.name}
                      </h5>
                      <p className="card-text">
                        <strong>Cheapest Price:</strong> ${flight.content.flightQuotes?.cheapest?.price || 'N/A'}
                      </p>
                      <p className="card-text">
                        <strong>Direct Flight Price:</strong> ${flight.content.flightQuotes?.direct?.price || 'N/A'}
                      </p>
                      <p className="card-text">
                        <strong>Direct Flights Available:</strong> {flight.content.flightRoutes?.directFlightsAvailable ? 'Yes' : 'No'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-muted">No flights found</p>
      )}

      {flights.length > resultsPerPage && (
        <div className="pagination mt-4 d-flex justify-content-center">
          <button className="btn btn-outline-primary mr-2" onClick={prevPage} disabled={currentPage === 1}>
            Previous
          </button>
          <span className="mx-3">Page {currentPage} of {totalPages}</span>
          <button className="btn btn-outline-primary" onClick={nextPage} disabled={currentPage === totalPages}>
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default SearchEverywhereFlights;
