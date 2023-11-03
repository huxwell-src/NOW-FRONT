import Login from './Pages/Login'
import Dashboard from './Pages/Dashboard'
import TableAlumnos from './Pages/CrudTables';
import Cookies from 'js-cookie';
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