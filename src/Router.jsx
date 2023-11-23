import Login from './Pages/Login'
import Dashboard from './Pages/Dashboard'
import TableAlumnos from './Pages/Admin/AlumnosCrudTables';
import TableProfesores from './Pages/Admin/ProfesoresCrudTable';
import Products from './Pages/Alumnos/Products'
import Solicitudes from './Pages/Alumnos/Solictudes';
import SolicitudesRevision from './Pages/Profesores/SolicitudesRevision';
import SolicitudesHistorial from './Pages/Profesores/SolicitudesHistorial';
import Preparacion from './Pages/Bodeguero/Preparacion';
import Entrega from './Pages/Bodeguero/Entrega';
import Pendientes from './Pages/Bodeguero/Pendientes';
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
        <Route path="/Solicitudes" element={token ? <Solicitudes /> : <Navigate to="/" />} />

        <Route path="/Revision" element={token ? <SolicitudesRevision /> : <Navigate to="/" />} />
        <Route path="/HistorialPrf" element={token ? <SolicitudesHistorial /> : <Navigate to="/" />} />

        <Route path="/Preparacion" element={token ? <Preparacion /> : <Navigate to="/" />} />
        <Route path="/Entrega" element={token ? <Entrega /> : <Navigate to="/" />} />
        <Route path="/Pendientes" element={token ? <Pendientes /> : <Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
};

export default Router;