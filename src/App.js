// Trigger Netlify redeploy: trivial change
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Home/Home';
import Login from './components/Auth/Login';
import SignUp from './components/Auth/SignUp';
import UserProfile from './UserProfile';
import RestaurantRegistration from './components/Restaurant/RestaurantRegistration';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/profile" element={<UserProfile />} />
        <Route path="/register-restaurant" element={<RestaurantRegistration />} />
        {/* Add other routes here */}
      </Routes>
    </Router>
  );
}

export default App; 