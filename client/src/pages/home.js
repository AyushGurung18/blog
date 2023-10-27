import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
 

function Home() {
  const [username , setUserName] = useState(null);
  const [message, setMessage] = useState(null);
  const navigate = useNavigate();


  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:5000/home', {
          method: 'GET',
          credentials: 'include', // Send cookies with the request
        });
    
        if (response.ok) {
          const data = await response.json();
          setMessage(data.message);

        } else if (response.status === 401) {
          navigate('/signin');
        } else {
          throw new Error('Error fetching data');
        }
      } catch (error) {
        console.error('Error:', error);  
        navigate('/signin');
      }
    };
    
    const fetchUserInfo = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/auth/user-info', { credentials: 'include' });
        if (response.ok) {
          const data = await response.json();
          setUserName(data.username);
        } else {
          throw new Error('Error fetching user information');
        }
      } catch (error) {
        console.error('Error fetching user information:', error);
      }
    };
  
    fetchData();
    fetchUserInfo();
  }, [navigate]);


  return (
    <div>
      <h2>Welcome to the Home Page {username}</h2>
      {message && <p>{message}</p>}
    </div>
  );
}

export default Home;
