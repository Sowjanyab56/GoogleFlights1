import React, { useState } from 'react';
import axios from 'axios';
import { REACT_APP_RAPIDAPI_KEY } from "../Api";

const PriceCalendar = () => {
  const [originSkyId, setOriginSkyId] = useState('BOM');
  const [destinationSkyId, setDestinationSkyId] = useState('JFK');
  const [fromDate, setFromDate] = useState('');
  const [currency, setCurrency] = useState('USD');
  const [prices, setPrices] = useState([]);
  const [error, setError] = useState('');
  
  const [currentPage, setCurrentPage] = useState(1);
  const resultsPerPage = 5; 

  const fetchPriceCalendar = async () => {
    const options = {
      method: 'GET',
      url: 'https://sky-scrapper.p.rapidapi.com/api/v1/flights/getPriceCalendar',
      params: {
        originSkyId: originSkyId,
        destinationSkyId: destinationSkyId,
        fromDate: fromDate,
        currency: currency,
      },
      headers: {
        'x-rapidapi-key': REACT_APP_RAPIDAPI_KEY,
        'x-rapidapi-host': 'sky-scrapper.p.rapidapi.com',
      },
    };

    try {
      const response = await axios.request(options);
      setPrices(response.data.data.flights.days || []);
      setError('');
      setCurrentPage(1); 
    } catch (err) {
      setError('Failed to fetch the price calendar.');
    }
  };
  
  const indexOfLastPrice = currentPage * resultsPerPage;
  const indexOfFirstPrice = indexOfLastPrice - resultsPerPage;
  const currentPrices = prices.slice(indexOfFirstPrice, indexOfLastPrice);

  const nextPage = () => {
    if (currentPage < Math.ceil(prices.length / resultsPerPage)) {
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
      <h2 className="text-center text-primary mb-4">Flight Price Calendar</h2>
      
      <div className="row">
        <div className="col-md-6 mb-3">
          <input
            type="text"
            className="form-control"
            placeholder="Origin SkyId (e.g., BOM)"
            value={originSkyId}
            onChange={(e) => setOriginSkyId(e.target.value)}
            required
          />
        </div>
        <div className="col-md-6 mb-3">
          <input
            type="text"
            className="form-control"
            placeholder="Destination SkyId (e.g., JFK)"
            value={destinationSkyId}
            onChange={(e) => setDestinationSkyId(e.target.value)}
            required
          />
        </div>
      </div>

      <div className="row">
        <div className="col-md-6 mb-3">
          <input
            type="date"
            className="form-control"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            required
          />
        </div>
        <div className="col-md-6 mb-3">
          <input
            type="text"
            className="form-control"
            placeholder="Currency (e.g., USD)"
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
          />
        </div>
      </div>


      <button onClick={fetchPriceCalendar} className="btn btn-primary btn-block mb-4">
        Get Price Calendar
      </button>


      {error && <p className="text-danger text-center">{error}</p>}

      {prices.length > 0 ? (
        <div className="mt-4">
          <table className="table table-striped table-hover">
            <thead className="thead-dark">
              <tr>
                <th>Date</th>
                <th>Price</th>
                <th>Group</th>
              </tr>
            </thead>
            <tbody>
              {currentPrices.map((day, index) => (
                <tr key={index}>
                  <td>{day.day}</td>
                  <td>${day.price}</td>
                  <td>{day.group === 'low' ? 'Low' : day.group === 'medium' ? 'Medium' : 'High'}</td>
                </tr>
              ))}
            </tbody>
          </table>

          
          <div className="d-flex justify-content-between mt-3">
            <button className="btn btn-outline-primary" onClick={prevPage} disabled={currentPage === 1}>
              Previous
            </button>
            <button className="btn btn-outline-primary" onClick={nextPage} disabled={currentPage === Math.ceil(prices.length / resultsPerPage)}>
              Next
            </button>
          </div>
        </div>
      ) : (
        <p className="text-muted text-center">No prices available for the selected range.</p>
      )}
    </div>
  );
};

export default PriceCalendar;
