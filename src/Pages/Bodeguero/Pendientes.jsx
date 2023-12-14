// Importación de bibliotecas y componentes
import { Component } from 'react'
import Header from '../../components/Header'
import PendientesTable from '../../components/Bodeguero/PendientesTable';

// Declaración de la clase del componente
class Pendientes extends Component {
    render() {
 
        // Datos de la ruta para la navegación
        const routeData = [
            {
                "id": 1,
                "name": "Gestion de solicitudes"
            },
            {
                "id": 2,
                "name": "Pendientes de devolucion",
                "hidden": true
            }
        ];

        // Renderizado del componente
        return (
            <>
                {/* Componente de encabezado con título y datos de la ruta */}
                <Header title="Pendientes de devolucion"  route={routeData} />

                <PendientesTable></PendientesTable>

                
            </>
        )
    }
}

// Exportación del componente para su uso en otras partes de la aplicación
export default Pendientes