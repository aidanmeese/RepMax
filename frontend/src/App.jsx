import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

// Importing components
import Root from './pages/Root';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Root />} />
      </Routes>
    </Router>
  );
}
