// Importación de bibliotecas y componentes
import { Component } from "react";
import Layout from "../../components/Layout";
import UserCrudTable from "../../components/Admin/UserCrudTable";
import Header from "../../components/Header";

// Declaración de la clase del componente
class TableAlumnos extends Component {
  render() {
    // Datos de la ruta para la navegación
    const routeData = [
      {
        id: 1,
        name: "Gestion de usuarios",
        hidden: false,
      },
      {
        id: 2,
        name: "Alumnos",
        hidden: true,
      },
    ];

    // Renderizado del componente
    return (
      <>
        {/* Componente de layout */}
                <Layout />
        
        {/* Componente de encabezado con título y datos de la ruta */}
        <Header title="Gestion de alumnos" route={routeData} />

        {/* Componente de tabla de usuarios con rol "Alumno" */}
        <UserCrudTable userRole="Alumno" oneCarrera={true} />
      </>
    );
  }
}

// Exportación del componente para su uso en otras partes de la aplicación
export default TableAlumnos;
