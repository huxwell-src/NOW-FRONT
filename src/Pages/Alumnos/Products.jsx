// Importación de bibliotecas y componentes
import { Component } from 'react'
import Layout from '../../components/Layout'
import ProductTable from '../../components/Alumno/ProductTable'

// Declaración de la clase del componente
class Products extends Component {
    render() {
        return (
            <>
                <Layout />
                <ProductTable/>
            </>
        )
    }
}

// Exportación del componente para su uso en otras partes de la aplicación
export default Products
