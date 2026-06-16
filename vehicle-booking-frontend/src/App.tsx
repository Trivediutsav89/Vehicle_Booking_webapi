import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Dashboard from './pages/Dashboard';
import Users from './pages/Users';
import Vehicles from './pages/Vehicles';
import Drivers from './pages/Drivers';
import Bookings from './pages/Bookings';
import Payments from './pages/Payments';
import Profile from './pages/Profile';
import { DarkModeProvider } from './context/DarkModeContext';
import { UserProvider } from './context/UserContext';
import { SearchProvider } from './context/SearchContext';
import './App.css';

function App() {
  return (
    <DarkModeProvider>
      <UserProvider>
        <SearchProvider>
          <Router>
            <Layout>
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/users" element={<Users />} />
                <Route path="/vehicles" element={<Vehicles />} />
                <Route path="/drivers" element={<Drivers />} />
                <Route path="/bookings" element={<Bookings />} />
                <Route path="/payments" element={<Payments />} />
                <Route path="/profile" element={<Profile />} />
              </Routes>
            </Layout>
          </Router>
        </SearchProvider>
      </UserProvider>
    </DarkModeProvider>
  );
}

export default App;
