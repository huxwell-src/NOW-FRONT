// Importación de bibliotecas y componentes
import { Component } from 'react'
import Layout from '../../components/Layout'
import UserCrudTable from '../../components/Admin/UserCrudTable'
import Header from '../../components/Header'

// Declaración de la clase del componente
class TableProfesores extends Component {
    render() {
        return (
            <>
                <UserCrudTable userRole="Profesor" manyCarreras={false} />
            </>
        )
    }
}

// Exportación del componente para su uso en otras partes de la aplicación
export default TableProfesores