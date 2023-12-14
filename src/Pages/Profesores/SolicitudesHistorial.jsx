import { Component } from 'react';
import Header from '../../components/Header';
import AprobadosTable from '../../components/Profesores/AprobadosTable';

class SolicitudesHistorial extends Component {

  render() {

    const routeData = [
        {
            "id": 1,
            "name": "Solicitudes"
        },
        {
            "id": 2,
            "name": "Revision Solicitudes",
            "hidden": true
        }
    ];

    return (
      <>
        <Header title="Revision Solicitudes"  route={routeData} />
        <AprobadosTable/>
      </>
    );
  }
}

export default SolicitudesHistorial;
