// Trigger Netlify redeploy: trivial change
import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Home/Home';
import Login from './components/Auth/Login';
import SignUp from './components/Auth/SignUp';
<<<<<<< HEAD
import Navbar from './components/Navigation/Navbar';
import DigitalPassManager from './components/Restaurant/DigitalPassManager';
import PrivateRoute from './components/Auth/PrivateRoute';
=======
import UserProfile from './UserProfile';
import RestaurantRegistration from './components/Restaurant/RestaurantRegistration';
import Dashboard from './components/Dashboard/Dashboard';
import ProximityNotifier from './components/Proximity/ProximityNotifier';
import { useAuth } from './contexts/AuthContext';
import { getDoc, doc } from 'firebase/firestore';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Navbar from './components/Navigation/Navbar';
import PrivateRoute from './components/Auth/PrivateRoute';
import DinerRegistration from './components/Diner/DinerRegistration';
import DigitalPassManager from './components/DigitalPass/DigitalPassManager';
import PassManagement from './components/PassManagement/PassManagement';
import Settings from './components/Settings/Settings';
import Subscription from './components/Subscription/Subscription';
>>>>>>> 6baeda84d6d481312cff2b81f318948772dd6972

function App() {
  const { currentUser } = useAuth();
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const fetchUserRole = async () => {
      if (currentUser) {
        const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
        if (userDoc.exists()) {
          setUserRole(userDoc.data().role);
        }
      }
    };
    fetchUserRole();
  }, [currentUser]);

  return (
    <Router>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/profile" element={<UserProfile />} />
          <Route path="/register-restaurant" element={<RestaurantRegistration />} />
          <Route path="/register-diner/:restaurantId" element={<DinerRegistration />} />
          <Route path="/dashboard" element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          } />
          <Route path="/digital-passes" element={
            <PrivateRoute>
              <DigitalPassManager />
            </PrivateRoute>
          } />
          <Route path="/passes" element={
            <PrivateRoute>
              <PassManagement />
            </PrivateRoute>
          } />
          <Route path="/settings" element={
            <PrivateRoute>
              <Settings />
            </PrivateRoute>
          } />
          <Route path="/subscription" element={
            <PrivateRoute>
              <Subscription />
            </PrivateRoute>
          } />
        </Routes>
        {currentUser && userRole === 'diner' && (
          <ProximityNotifier dinerId={currentUser.uid} />
        )}
      </ThemeProvider>
    </Router>
  );
}

export default App; 
