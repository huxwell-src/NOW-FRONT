// Importación de bibliotecas y componentes
import { Component } from 'react'
import EntregaTable from '../../components/Bodeguero/EntregasTable';

// Declaración de la clase del componente
class Entrega extends Component {
    render() {
        return (
            <>

                <EntregaTable></EntregaTable>

                
            </>
        )
    }
}

// Exportación del componente para su uso en otras partes de la aplicación
export default Entrega