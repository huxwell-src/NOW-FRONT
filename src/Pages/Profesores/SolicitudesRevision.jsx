import { Component } from 'react';
import RevisionTable from '../../components/Alumnos/RevisionTable';
import Layout from '../../components/Layout';
import Header from '../../components/Header';

class SolicitudesRevision extends Component {

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
        <Layout />
        <Header title="Revision Solicitudes"  route={routeData} />
        <RevisionTable/>
      </>
    );
  }
}

export default SolicitudesRevision;
