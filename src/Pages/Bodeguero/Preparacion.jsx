// Importación de bibliotecas y componentes
import { Component } from 'react'
import Layout from '../../components/Layout'
import Header from '../../components/Header'
import PreparacionTable from '../../components/Bodeguero/PreparacionTable';

// Declaración de la clase del componente
class Preparacion extends Component {
    render() {
 
        // Datos de la ruta para la navegación
        const routeData = [
            {
                "id": 1,
                "name": "Gestion de solicitudes"
            },
            {
                "id": 2,
                "name": "Pendientes de entrega",
                "hidden": true
            }
        ];

        // Renderizado del componente
        return (
            <>
                {/* Componente de layout */}
                <Layout />

                {/* Componente de encabezado con título y datos de la ruta */}
                <Header title="Pendientes de entrega"  route={routeData} />

                <PreparacionTable></PreparacionTable>

                
            </>
        )
    }
}

// Exportación del componente para su uso en otras partes de la aplicación
export default Preparacion