import Login from './Pages/Login'
import Dashboard from './Pages/Dashboard'
import TableAlumnos from './Pages/Admin/AlumnosCrudTables';
import TableProfesores from './Pages/Admin/ProfesoresCrudTable';
import Products from './Pages/Alumnos/Products'
import Cookies from 'js-cookie';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'

const Router = () => {
  const token = Cookies.get('token');
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={!token ? <Login /> : <Navigate to="/dashboard" />} />
        <Route path="/dashboard" element={token ? <Dashboard /> : <Navigate to="/" />} />
        
        <Route path="/Alumnos" element={token ? <TableAlumnos /> : <Navigate to="/" />} />
        <Route path="/Profesores" element={token ? <TableProfesores /> : <Navigate to="/" />} />

        <Route path="/Productos" element={token ? <Products /> : <Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
};

export default Router;