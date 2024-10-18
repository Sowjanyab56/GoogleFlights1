import React, { useState } from 'react';
import axios from 'axios';
import { REACT_APP_RAPIDAPI_KEY } from "../Api";

const SearchFlights = () => {
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
  const [sortBy, setSortBy] = useState('best');
  const [flights, setFlights] = useState([]);
  const [error, setError] = useState('');

 
  const [currentPage, setCurrentPage] = useState(1);
  const resultsPerPage = 5;

  const searchFlights = async () => {
    const options = {
      method: 'GET',
      url: 'https://sky-scrapper.p.rapidapi.com/api/v2/flights/searchFlights',
      params: {
        originSkyId: originSkyId,
        destinationSkyId: destinationSkyId,
        originEntityId: originEntityId,
        destinationEntityId: destinationEntityId,
        date: date,
        returnDate: returnDate || undefined,
        cabinClass: cabinClass,
        adults: adults.toString(),
        childrens: children.toString(),
        infants: infants.toString(),
        sortBy: sortBy,
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
      setFlights(response.data.data.itineraries || []);
      setError('');
      setCurrentPage(1);
    } catch (err) {
      setError('Failed to fetch flights');
    }
  };


  const indexOfLastFlight = currentPage * resultsPerPage;
  const indexOfFirstFlight = indexOfLastFlight - resultsPerPage;
  const currentFlights = flights.slice(indexOfFirstFlight, indexOfLastFlight);

  const nextPage = () => {
    if (currentPage < Math.ceil(flights.length / resultsPerPage)) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div className="container my-5" style={{ maxWidth: '1000px' }}>
      <h2 className="text-center text-primary mb-4">Find Your Flight</h2>

      
      <div className="row">
        <div className="col-md-6 mb-3">
          <input
            type="text"
            className="form-control"
            placeholder="Origin SkyId (e.g., LOND)"
            value={originSkyId}
            onChange={(e) => setOriginSkyId(e.target.value)}
            required
          />
        </div>
        <div className="col-md-6 mb-3">
          <input
            type="text"
            className="form-control"
            placeholder="Destination SkyId (e.g., NYCA)"
            value={destinationSkyId}
            onChange={(e) => setDestinationSkyId(e.target.value)}
            required
          />
        </div>
      </div>

      
      <div className="row">
        <div className="col-md-6 mb-3">
          <input
            type="text"
            className="form-control"
            placeholder="Origin EntityId (e.g., 27544008)"
            value={originEntityId}
            onChange={(e) => setOriginEntityId(e.target.value)}
            required
          />
        </div>

        <div className="col-md-6 mb-3">
          <input
            type="text"
            className="form-control"
            placeholder="Destination EntityId (e.g., 27537542)"
            value={destinationEntityId}
            onChange={(e) => setDestinationEntityId(e.target.value)}
            required
          />
        </div>
      </div>

      <div className="row">
        <div className="col-md-6 mb-3">
          <input
            type="date"
            className="form-control"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </div>

        <div className="col-md-6 mb-3">
          <input
            type="date"
            className="form-control"
            value={returnDate}
            onChange={(e) => setReturnDate(e.target.value)}
            placeholder="Return Date (optional)"
          />
        </div>
      </div>

     
      <div className="row">
        <div className="col-md-6 mb-3">
          <select
            className="form-control"
            value={cabinClass}
            onChange={(e) => setCabinClass(e.target.value)}
          >
            <option value="economy">Economy</option>
            <option value="premium_economy">Premium Economy</option>
            <option value="business">Business</option>
            <option value="first">First Class</option>
          </select>
        </div>

        <div className="col-md-6 mb-3">
          <select
            className="form-control"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="best">Best</option>
            <option value="price_high">Cheapest</option>
            <option value="fastest">Fastest</option>
          </select>
        </div>
      </div>

      
      <div className="row">
        <div className="col-md-4 mb-3">
          <input
            type="number"
            className="form-control"
            value={adults}
            onChange={(e) => setAdults(e.target.value)}
            placeholder="Adults (12+ years)"
            min="1"
          />
        </div>

        <div className="col-md-4 mb-3">
          <input
            type="number"
            className="form-control"
            value={children}
            onChange={(e) => setChildren(e.target.value)}
            placeholder="Children (2-12 years)"
            min="0"
          />
        </div>

        <div className="col-md-4 mb-3">
          <input
            type="number"
            className="form-control"
            value={infants}
            onChange={(e) => setInfants(e.target.value)}
            placeholder="Infants (Under 2 years)"
            min="0"
          />
        </div>
      </div>

      
      <button onClick={searchFlights} className="btn btn-primary btn-block my-3">
        Search Flights
      </button>

      
      {error && <p className="text-danger text-center">{error}</p>}

      
      {flights.length > 0 ? (
        <>
          <table className="table table-hover mt-3">
            <thead className="thead-dark">
              <tr>
                <th>#</th>
                <th>Price</th>
                <th>Origin</th>
                <th>Destination</th>
                <th>Departure</th>
                <th>Carrier</th>
                <th>Duration (mins)</th>
              </tr>
            </thead>
            <tbody>
              {currentFlights.map((flight, index) => (
                <tr key={index}>
                  <td>{indexOfFirstFlight + index + 1}</td>
                  <td>{flight.price.formatted}</td>
                  <td>{flight.legs[0].origin.name} ({flight.legs[0].origin.displayCode})</td>
                  <td>{flight.legs[0].destination.name} ({flight.legs[0].destination.displayCode})</td>
                  <td>{new Date(flight.legs[0].departure).toLocaleString()}</td>
                  <td>{flight.legs[0].carriers.marketing[0].name}</td>
                  <td>{flight.legs[0].durationInMinutes}</td>
                </tr>
              ))}
            </tbody>
          </table>

         
          <div className="d-flex justify-content-between mt-4">
            <button className="btn btn-outline-primary" onClick={prevPage} disabled={currentPage === 1}>
              Previous
            </button>
            <button className="btn btn-outline-primary" onClick={nextPage} disabled={currentPage === Math.ceil(flights.length / resultsPerPage)}>
              Next
            </button>
          </div>
        </>
      ) : (
        <p className="text-muted text-center mt-3">No flights found</p>
      )}
    </div>
  );
};

export default SearchFlights;
