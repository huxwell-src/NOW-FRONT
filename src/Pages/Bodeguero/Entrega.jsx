// Importación de bibliotecas y componentes
import { Component } from 'react'
import Layout from '../../components/Layout'
import Header from '../../components/Header'
import EntregaTable from '../../components/Bodeguero/EntregasTable';

// Declaración de la clase del componente
class Entrega extends Component {
    render() {
 
        // Datos de la ruta para la navegación
        const routeData = [
            {
                "id": 1,
                "name": "Gestion de solicitudes"
            },
            {
                "id": 2,
                "name": "Por entregar",
                "hidden": true
            }
        ];

        // Renderizado del componente
        return (
            <>
                {/* Componente de layout */}
                <Layout />

                {/* Componente de encabezado con título y datos de la ruta */}
                <Header title="Por entregar"  route={routeData} />

                <EntregaTable></EntregaTable>

                
            </>
        )
    }
}

// Exportación del componente para su uso en otras partes de la aplicación
export default Entrega