import { Component } from 'react'
import Navigation from '../components/Navigation'
import UserCrudTable from '../components/UserCrudTable'

class TableAlumnos extends Component {
    render() {
        return (
            <>
                <Navigation/>
                <UserCrudTable title="Usuarios"  />
            </>
        )
    }
}

export default TableAlumnos