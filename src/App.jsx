import Login from './Login'
import Dashboard from './Dashboard'
import TableAlumnos from './Pages/TableAlumnos';
import Cookies from 'js-cookie';
import Navigation from './components/Navigation';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'

const App = () => {
  const token = Cookies.get('token');
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={!token ? <Login /> : <Navigate to="/dashboard" />} />
        <Route path="/dashboard" element={token ? <Dashboard /> : <Navigate to="/" />} />
        
        <Route path="/Alumnos" element={token ? <TableAlumnos /> : <Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;