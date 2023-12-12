import Login from "./Pages/Login";
import Dashboard from "./Pages/Dashboard";
import TableAlumnos from "./Pages/Admin/AlumnosCrudTables";
import TableProfesores from "./Pages/Admin/ProfesoresCrudTable";
import TableProducts from "./Pages/Admin/ProductCrudTable";
import Products from "./Pages/Alumnos/Products";
import Solicitudes from "./Pages/Alumnos/Solictudes";
import SolicitudesRevision from "./Pages/Profesores/SolicitudesRevision";
import SolicitudesHistorial from "./Pages/Profesores/SolicitudesHistorial";
import Preparacion from "./Pages/Bodeguero/Preparacion";
import Entrega from "./Pages/Bodeguero/Entrega";
import Pendientes from "./Pages/Bodeguero/Pendientes";
import Cookies from "js-cookie";
import NotFound from "./Pages/NotFound";
import { Sidebar } from "./components/Sidebar";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

const Router = () => {
  const token = Cookies.get("token");
  return (
    <BrowserRouter>
      <Routes>
        <Route path="*" element={<NotFound />} />
        <Route
          path="/"
          element={!token ? <Login /> : <Navigate to="/dashboard" />}
        />
        <Route
          path="/dashboard"
          element={
            token ? (
              <Sidebar>
                <Dashboard />
              </Sidebar>
            ) : (
              <Navigate to="/" />
            )
          }
        />
        <Route
          path="/Alumnos"
          element={
            token ? (
              <Sidebar>
                <TableAlumnos />
              </Sidebar>
            ) : (
              <Navigate to="/" />
            )
          }
        />
        <Route
          path="/Profesores"
          element={
            token ? (
              <Sidebar>
                <TableProfesores />
              </Sidebar>
            ) : (
              <Navigate to="/" />
            )
          }
        />
        <Route
          path="/Products"
          element={
            token ? (
              <Sidebar>
                <TableProducts />
              </Sidebar>
            ) : (
              <Navigate to="/" />
            )
          }
        />

        <Route
          path="/Productos"
          element={
            token ? (
              <Sidebar>
                <Products />
              </Sidebar>
            ) : (
              <Navigate to="/" />
            )
          }
        />
        <Route
          path="/Solicitudes"
          element={
            token ? (
              <Sidebar>
                <Solicitudes />
              </Sidebar>
            ) : (
              <Navigate to="/" />
            )
          }
        />
        <Route
          path="/Revision"
          element={
            token ? (
              <Sidebar>
                <SolicitudesRevision />
              </Sidebar>
            ) : (
              <Navigate to="/" />
            )
          }
        />
        <Route
          path="/HistorialPrf"
          element={
            token ? (
              <Sidebar>
                <SolicitudesHistorial />
              </Sidebar>
            ) : (
              <Navigate to="/" />
            )
          }
        />
        <Route
          path="/Preparacion"
          element={
            token ? (
              <Sidebar>
                <Preparacion />
              </Sidebar>
            ) : (
              <Navigate to="/" />
            )
          }
        />
        <Route
          path="/Entrega"
          element={
            token ? (
              <Sidebar>
                <Entrega />
              </Sidebar>
            ) : (
              <Navigate to="/" />
            )
          }
        />
        <Route
          path="/Pendientes"
          element={
            token ? (
              <Sidebar>
                <Pendientes />
              </Sidebar>
            ) : (
              <Navigate to="/" />
            )
          }
        />
      </Routes>
    </BrowserRouter>
  );
};

export default Router;
