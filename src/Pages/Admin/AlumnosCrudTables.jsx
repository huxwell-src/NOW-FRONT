// Importación de bibliotecas y componentes
import { Component } from "react";
import UserCrudTable from "../../components/Admin/UserCrudTable";

// Declaración de la clase del componente
class TableAlumnos extends Component {
  render() {
    return (
      <>
        {/* Componente de tabla de usuarios con rol "Alumno" */}
        <UserCrudTable userRole="" oneCarrera={true} />
      </>
    );
  }
}

// Exportación del componente para su uso en otras partes de la aplicación
export default TableAlumnos;
