import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

// Importing components
import Root from './pages/Root';
import Layout from './pages/Layout';
import Login from './pages/Login';
import SignUp from './pages/SignUp';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Root />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          {/* Add more routes here as needed */}
        </Route>
      </Routes>
    </Router>
  );
}
