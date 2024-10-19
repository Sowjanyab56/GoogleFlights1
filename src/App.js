import React from 'react';
import NearbyAirports from './components/NearbyAirports';
import SearchAirport from './components/SearchAirport';
import SearchFlights from './components/SearchFlights';
import PriceCalendar from './components/PriceCalendar';
import MultiStopFlights from './components/MultiStopFlights';
import SearchEverywhereFlights from './components/SearchEverywhereFlights';  
import SearchIncompleteFlights from './components/SearchIncompleteFlights';  
import SearchWebCompleteFlights from './components/SearchWebCompleteFlights';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="header">
        <h1>Google Flights</h1>
      </header>

      <div className="container mt-5">
        <NearbyAirports />
        <SearchAirport />
        <SearchFlights />
        <PriceCalendar origin="BOM" destination="JFK" />
        <MultiStopFlights />
        <SearchEverywhereFlights /> 
        <SearchIncompleteFlights /> 
        <SearchWebCompleteFlights />
      </div>
    </div>
  );
}

export default App;
