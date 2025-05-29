import React from 'react';
import HomeNav from './HomeNav';

const Home = () => {
  return (
    <div>
      <HomeNav />
      <div style={{
        height: '100vh',
        margin: 0,
        padding: 0,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundImage: 'url(https://www.completecontroller.com/wp-content/uploads/to-do-list-Complete-Controller.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        position: 'relative',
      }}>
        <div style={{
          textAlign: 'center',
          color: '#fff',
          zIndex: 1,
          backgroundColor: 'rgba(0, 0, 0, 0.5)', 
          padding: '20px',
          borderRadius: '8px',
        }}>
          <h1 style={{
            fontSize: '48px',
            fontWeight: 'bold',
            marginBottom: '20px',
          }}>
            TaskTide
          </h1>
          <p style={{
            fontSize: '18px',
            marginBottom: '40px',
          }}>
            Stay on top of your day with TaskTide, your simple to-do list for managing daily tasks.
          </p>
        </div>
        <footer style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          width: '100%',
          backgroundColor: '#333',
          color: '#fff',
          padding: '10px',
          textAlign: 'center',
        }}>
          <p>© 2025 TaskTide. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
};

export default Home;