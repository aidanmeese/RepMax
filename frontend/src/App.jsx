import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

// Importing components
import Root from './pages/root';
import Layout from './pages/Layout';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import Profile from './pages/Profile';
import Leaderboard from './pages/Leaderboard';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Root />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
        </Route>
      </Routes>
    </Router>
  );
}
