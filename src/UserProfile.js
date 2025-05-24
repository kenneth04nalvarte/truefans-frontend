import React, { useEffect, useState } from 'react';

function UserProfile({ isLoggedIn, onLogout }) {
  const [user, setUser] = useState(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setUser(null);
      setMessage('Please log in to view your profile.');
      return;
    }
    setMessage('');
    fetch(`${process.env.REACT_APP_API_URL}/api/auth/me`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        if (data.error) {
          setUser(null);
          setMessage(data.error);
        } else {
          setUser(data);
          setMessage('');
        }
      })
      .catch(() => {
        setUser(null);
        setMessage('Error fetching profile.');
      });
  }, [isLoggedIn]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setMessage('Logged out.');
    if (onLogout) onLogout();
  };

  if (message) return <div className="error">{message}</div>;
  if (!user) return <div>Loading profile...</div>;

  return (
    <div style={{ marginTop: 32 }}>
      <h2>User Profile</h2>
      <p><b>Name:</b> {user.firstName} {user.lastName}</p>
      <p><b>Email:</b> {user.email}</p>
      <p><b>Phone:</b> {user.phone}</p>
      <p><b>Birthday:</b> {user.birthday && user.birthday.slice(0, 10)}</p>
      <p><b>Referral Source:</b> {user.referralSource}</p>
      <button onClick={handleLogout}>Log Out</button>
    </div>
  );
}

export default UserProfile; 