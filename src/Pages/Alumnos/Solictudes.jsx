import { Component } from 'react';
import SolicitudTable from '../../components/Alumno/SolicitudTable';
import Layout from '../../components/Layout';
import Header from '../../components/Header';

class Solicitudes extends Component {

  render() {

    const routeData = [
        {
            "id": 1,
            "name": "Solicitudes"
        },
        {
            "id": 2,
            "name": "Mis Solicitudes",
            "hidden": true
        }
    ];

    return (
      <>
        <Layout />
        <Header title="Mis Solicitudes"  route={routeData} />
        <SolicitudTable/>
      </>
    );
  }
}

export default Solicitudes;
