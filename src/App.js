import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Navigation from './components/Navigation';
import Home from './pages/Home';
import LocationDetail from './pages/LocationDetail';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Navigation />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/location/:locationName" element={<LocationDetail />} />
            <Route path="/about" element={
              <div style={{padding: "40px", textAlign: "center"}}>
                <h1>About This Project</h1>
                <p>Disaster Alert System for Sri Lanka - Mini Project</p>
              </div>
            } />
          </Routes>
        </main>
        <footer className="footer">
          <p>Disaster Alert System for Sri Lanka | Mini Project Submission</p>
          <p>This is a demonstration project. For real emergencies, contact 1990</p>
        </footer>
      </div>
    </Router>
  );
}

export default App;