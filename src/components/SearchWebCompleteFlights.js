import React, { useState } from 'react';
import axios from 'axios';
import { REACT_APP_RAPIDAPI_KEY } from "../Api";

const SearchWebCompleteFlights = () => {
  const [originSkyId, setOriginSkyId] = useState('LOND');
  const [destinationSkyId, setDestinationSkyId] = useState('NYCA');
  const [originEntityId, setOriginEntityId] = useState('27544008');
  const [destinationEntityId, setDestinationEntityId] = useState('27537542');
  const [date, setDate] = useState('');
  const [returnDate, setReturnDate] = useState('');
  const [cabinClass, setCabinClass] = useState('economy');
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const [infants, setInfants] = useState(0);
  const [flights, setFlights] = useState([]);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const resultsPerPage = 5;

  const searchWebCompleteFlights = async () => {
    const options = {
      method: 'GET',
      url: 'https://sky-scrapper.p.rapidapi.com/api/v2/flights/searchFlightsWebComplete',
      params: {
        originSkyId,
        destinationSkyId,
        originEntityId,
        destinationEntityId,
        date,
        returnDate: returnDate || undefined,
        cabinClass,
        adults: adults.toString(),
        childrens: children.toString(),
        infants: infants.toString(),
        sortBy: 'best',
        currency: 'USD',
        market: 'en-US',
        countryCode: 'US'
      },
      headers: {
        'x-rapidapi-key': REACT_APP_RAPIDAPI_KEY,
        'x-rapidapi-host': 'sky-scrapper.p.rapidapi.com',
      },
    };

    try {
      const response = await axios.request(options);
      const flightData = Array.isArray(response.data?.data?.itineraries) ? response.data.data.itineraries : [];
      setFlights(flightData);
      setError(null);
    } catch (error) {
      console.error(error);
      setError('Failed to fetch complete flight results for web');
    }
  };

  const indexOfLastFlight = currentPage * resultsPerPage;
  const indexOfFirstFlight = indexOfLastFlight - resultsPerPage;
  const currentFlights = flights.slice(indexOfFirstFlight, indexOfLastFlight);
  const totalPages = Math.ceil(flights.length / resultsPerPage);

  const nextPage = () => {
    if (currentPage < totalPages) setCurrentPage((prevPage) => prevPage + 1);
  };

  const prevPage = () => {
    if (currentPage > 1) setCurrentPage((prevPage) => prevPage - 1);
  };

  return (
    <div className="container" style={{ color: '#ffffff', padding: '20px', borderRadius: '8px' }}>
      <h2>Search Complete Flights (Web)</h2>

      {/* Origin SkyId */}
      <div className="form-group">
        <label htmlFor="originSkyId">Origin SkyId</label>
        <input
          type="text"
          id="originSkyId"
          className="form-control"
          placeholder="Enter origin SkyId (e.g., LOND)"
          value={originSkyId}
          onChange={(e) => setOriginSkyId(e.target.value)}
          required
        />
        <small className="form-text text-muted">The originSkyId code can be extracted from the Search Airport API in the Flights collection.</small>
      </div>

      {/* Destination SkyId */}
      <div className="form-group">
        <label htmlFor="destinationSkyId">Destination SkyId</label>
        <input
          type="text"
          id="destinationSkyId"
          className="form-control"
          placeholder="Enter destination SkyId (e.g., NYCA)"
          value={destinationSkyId}
          onChange={(e) => setDestinationSkyId(e.target.value)}
          required
        />
        <small className="form-text text-muted">DestinationSkyId</small>
      </div>

      {/* Origin EntityId */}
      <div className="form-group">
        <label htmlFor="originEntityId">Origin EntityId</label>
        <input
          type="text"
          id="originEntityId"
          className="form-control"
          placeholder="Enter origin EntityId (e.g., 27544008)"
          value={originEntityId}
          onChange={(e) => setOriginEntityId(e.target.value)}
          required
        />
        <small className="form-text text-muted">OriginEntityId</small>
      </div>

      {/* Destination EntityId */}
      <div className="form-group">
        <label htmlFor="destinationEntityId">Destination EntityId</label>
        <input
          type="text"
          id="destinationEntityId"
          className="form-control"
          placeholder="Enter destination EntityId (e.g., 27537542)"
          value={destinationEntityId}
          onChange={(e) => setDestinationEntityId(e.target.value)}
          required
        />
        <small className="form-text text-muted">DestinationEntityId</small>
      </div>

      {/* Travel Date */}
      <div className="form-group">
        <label htmlFor="date">Travel Date</label>
        <input
          type="date"
          id="date"
          className="form-control"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
        />
        <small className="form-text text-muted">Departure or travel date</small>
      </div>

      {/* Return Date */}
      <div className="form-group">
        <label htmlFor="returnDate">Return Date (optional)</label>
        <input
          type="date"
          id="returnDate"
          className="form-control"
          value={returnDate}
          onChange={(e) => setReturnDate(e.target.value)}
        />
        <small className="form-text text-muted">Return date</small>
      </div>

      {/* Cabin Class */}
      <div className="form-group">
        <label htmlFor="cabinClass">Cabin Class</label>
        <select
          id="cabinClass"
          className="form-control"
          value={cabinClass}
          onChange={(e) => setCabinClass(e.target.value)}
        >
          <option value="economy">Economy</option>
          <option value="premium_economy">Premium Economy</option>
          <option value="business">Business</option>
          <option value="first">First</option>
        </select>
        <small className="form-text text-muted">Choose your cabin class.</small>
      </div>

      {/* Adults */}
      <div className="form-group">
        <label htmlFor="adults">Adults</label>
        <input
          type="number"
          id="adults"
          className="form-control"
          value={adults}
          onChange={(e) => setAdults(e.target.value)}
          min="1"
          required
        />
        <small className="form-text text-muted">Number of adults (12+ years).</small>
      </div>

      {/* Children */}
      <div className="form-group">
        <label htmlFor="children">Children</label>
        <input
          type="number"
          id="children"
          className="form-control"
          value={children}
          onChange={(e) => setChildren(e.target.value)}
          min="0"
        />
        <small className="form-text text-muted">Number of children (2-12 years).</small>
      </div>

      {/* Infants */}
      <div className="form-group">
        <label htmlFor="infants">Infants</label>
        <input
          type="number"
          id="infants"
          className="form-control"
          value={infants}
          onChange={(e) => setInfants(e.target.value)}
          min="0"
        />
        <small className="form-text text-muted">Number of infants (under 2 years).</small>
      </div>

      <button onClick={searchWebCompleteFlights} className="btn btn-primary mt-2">
        Search Complete Flights
      </button>

      {error && <p className="text-danger mt-3">{error}</p>}

      <div className="mt-3">
        {currentFlights.length > 0 ? (
          <div className="table-responsive">
            <table className="table table-dark table-striped">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Price</th>
                  <th>Origin</th>
                  <th>Destination</th>
                  <th>Departure</th>
                  <th>Arrival</th>
                  <th>Carrier</th>
                  <th>Duration</th>
                </tr>
              </thead>
              <tbody>
                {currentFlights.map((flight, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{flight?.price?.formatted || 'N/A'}</td>
                    <td>{flight?.legs?.[0]?.origin?.name || 'N/A'} ({flight?.legs?.[0]?.origin?.displayCode || 'N/A'})</td>
                    <td>{flight?.legs?.[0]?.destination?.name || 'N/A'} ({flight?.legs?.[0]?.destination?.displayCode || 'N/A'})</td>
                    <td>{flight?.legs?.[0]?.departure ? new Date(flight.legs[0].departure).toLocaleString() : 'N/A'}</td>
                    <td>{flight?.legs?.[0]?.arrival ? new Date(flight.legs[0].arrival).toLocaleString() : 'N/A'}</td>
                    <td>{flight?.legs?.[0]?.carriers?.marketing?.[0]?.name || 'N/A'}</td>
                    <td>{flight?.legs?.[0]?.durationInMinutes || 'N/A'} mins</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-muted">No flights found</p>
        )}
      </div>

      {flights.length > resultsPerPage && (
        <div className="pagination mt-3">
          <button className="btn btn-secondary" onClick={prevPage} disabled={currentPage === 1}>
            Previous
          </button>
          <span className="mx-3">
            Page {currentPage} of {totalPages}
          </span>
          <button className="btn btn-secondary" onClick={nextPage} disabled={currentPage === totalPages}>
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default SearchWebCompleteFlights;
