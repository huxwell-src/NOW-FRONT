import { Component } from 'react'
import Navigation from '../components/Navigation'
import UserCrudTable from '../components/UserCrudTable'

class TableAlumnos extends Component {
    render() {
        return (
            <>
                <Navigation/>
                <UserCrudTable ></UserCrudTable>
                TableAlumnos
            </>
        )
    }
}

export default TableAlumnos