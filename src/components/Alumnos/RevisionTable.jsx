import React, { Component } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import axios from "axios";
import Cookies from "js-cookie";

class RevisionTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      solicitudes: [],
      visible: false,
      selectedSolicitud: null,
      currentUser: null,
    };
  }

  async componentDidMount() {
    try {
      // Obtener el token de las cookies
      const token = Cookies.get("token");

      // Verificar si el token está presente
      if (!token) {
        console.error("Token no encontrado en las cookies");
        return;
      }

      // Configurar el encabezado de la solicitud con el token
      const config = {
        headers: {
          Authorization: `Token ${token}`,
        },
      };

      // Obtener datos del usuario
      const userDataResponse = await axios.get("http://127.0.0.1:8000/api/user", config);
      const currentUser = userDataResponse.data.user;

      // Obtener todas las solicitudes desde el endpoint
      const solicitudesResponse = await axios.get("http://127.0.0.1:8000/api/solicitudes", config);

      // Filtrar las solicitudes para mostrar solo las del usuario actual
      const solicitudesUsuarioActual = solicitudesResponse.data.filter(
        (solicitud) => solicitud.profesor === currentUser.id_user
      );

      this.setState({
        solicitudes: solicitudesUsuarioActual,
        currentUser: currentUser,
      });
    } catch (error) {
      console.error("Error al obtener las solicitudes o datos del usuario:", error);
    }
  }

  // Función para mostrar los detalles de un producto en un diálogo
  showDetailsDialog = (rowData) => {
    this.setState({ visible: true, selectedSolicitud: rowData });
  };

  // Función para cerrar el diálogo de detalles
  hideDetailsDialog = () => {
    this.setState({ visible: false });
  };

  // Función para obtener la clase de estilo CSS basada en el estado de la solicitud
  getEstadoStyleClass(estado) {
    switch (estado) {
      case "en revisión":
        return "text-yellow-900 bg-yellow-300";
      case "Completado":
        return "text-green-800";
      case "Cancelado":
        return "text-red-800";
      default:
        return "text-gray-800";
    }
  }

  render() {
    const { solicitudes, selectedSolicitud, visible } = this.state;

    return (
      <>
        {/* Tabla de revisiones */}
        <DataTable value={solicitudes}>
          <Column field="id_solicitud" header="ID de solicitud" />
          <Column field="fecha_creacion" header="Fecha de creación" />
          <Column field="fecha_entrega" header="Fecha de entrega" />
          <Column
            field="estado"
            header="Estado"
            body={(rowData) => (
              <span className={`text-sm font-semibold ${this.getEstadoStyleClass(rowData.estado)}`}>
                {rowData.estado}
              </span>
            )}
          />
          {/* Botón para ver detalles de la solicitud */}
          <Column
            body={(rowData) => (
              <Button
                size="small"
                rounded
                text
                severity="info"
                icon="pi pi-chevron-right"
                iconPos="right"
                label="Ver Detalles"
                className="text-sky-500"
                onClick={() => this.showDetailsDialog(rowData)}
              />
            )}
          />
        </DataTable>

        {/* Diálogo para mostrar los detalles de la solicitud seleccionada */}
        <Dialog
          header="Detalles"
          visible={visible}
          onHide={this.hideDetailsDialog}
        >
          {/* Mostrar tabla de productos si hay productos en la solicitud seleccionada */}
          {selectedSolicitud && selectedSolicitud.productos && selectedSolicitud.productos.length > 0 && (
            <DataTable value={selectedSolicitud.productos}>
              <Column field="id_producto" header="ID" />
              <Column field="nombre" header="Nombre" />
              <Column field="cantidad" header="Cantidad" />
            </DataTable>
          )}
        </Dialog>
      </>
    );
  }
}

export default RevisionTable;
