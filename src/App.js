import React from 'react';
import './App.css';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { Users } from './components/Users';

function App() {
  return (
    <Router>
      <Route path='/' exact component={Users} />
    </Router>
  );
}

export default App;
