// Importación de bibliotecas y componentes
import { Component } from 'react'
import PendientesTable from '../../components/Bodeguero/PendientesTable';

// Declaración de la clase del componente
class Pendientes extends Component {
    render() {
        // Renderizado del componente
        return (
            <>
                <PendientesTable></PendientesTable>

                
            </>
        )
    }
}

// Exportación del componente para su uso en otras partes de la aplicación
export default Pendientes