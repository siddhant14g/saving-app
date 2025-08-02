import { useState, useEffect } from 'react';
import Header from './components/Header';
import MainForm from './components/MainForm';
import PinScreen from './components/PinScreen'; // You'll create this component

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const pinTimestamp = localStorage.getItem('pinTimestamp');
    const now = Date.now();
    if (pinTimestamp && now - parseInt(pinTimestamp) < 60 * 10 * 1000) {
      setIsAuthenticated(true); // If within 1 hour, grant access
    }
  }, []);

  return (
    <div className="min-h-screen bg-rose-200">
      <Header />
      {isAuthenticated ? (
        <>
          <MainForm />
        </>
      ) : (
        
        <PinScreen onSuccess={() => setIsAuthenticated(true)} />
      )}
    </div>
  );
}

export default App;
