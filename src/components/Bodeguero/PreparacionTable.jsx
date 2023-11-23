import React, { Component } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import axios from "axios";
import Cookies from "js-cookie";
import { InputTextarea } from "primereact/inputtextarea";

class PreparacionTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      solicitudes: [],
      selectedSolicitud: null,
      visible: false,
      notaDialogVisible: false, // Nuevo estado para controlar la visibilidad del diálogo de la nota
      nota: "", // Nuevo estado para almacenar el contenido de la nota
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
  
      // Obtener todas las solicitudes desde el endpoint
      const solicitudesResponse = await axios.get(
        "http://127.0.0.1:8000/api/solicitudes",
        config
      );
  
      // Filtrar las solicitudes con estado "aprobado"
      const solicitudesAprobadas = solicitudesResponse.data.filter(
        (solicitud) => solicitud.estado === "en preparación"
      );
  
      // Establecer el estado del componente con las solicitudes aprobadas
      this.setState({
        solicitudes: solicitudesAprobadas,
      });
    } catch (error) {
      console.error("Error al obtener las solicitudes:", error);
    }
  }
  

  showDetailsDialog = (rowData) => {
    this.setState({ visible: true, selectedSolicitud: rowData });
  };

  hideDetailsDialog = () => {
    this.setState({ visible: false });
  };

  // Función para formatear las fechas en DD/MM/YYYY
  formatFecha(fecha) {
    const date = new Date(fecha);
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();

    const formattedDay = day < 10 ? `0${day}` : day;
    const formattedMonth = month < 10 ? `0${month}` : month;

    return `${formattedDay}/${formattedMonth}/${year}`;
  }

  handleCompletada = async () => {
    try {
      const { selectedSolicitud, nota } = this.state;
  
      // Verificar si hay una solicitud seleccionada
      if (!selectedSolicitud) {
        console.error("No hay solicitud seleccionada para completar");
        return;
      }
  
      // Obtener el token de las cookies
      const token = Cookies.get("token");
  
      // Configurar el encabezado de la solicitud con el token
      const config = {
        headers: {
          Authorization: `Token ${token}`,
        },
      };
  
      // Detalles de la solicitud a completar
      const solicitudData = {
        id_solicitud: selectedSolicitud.id_solicitud,
        usuario: selectedSolicitud.usuario.id_user, // Supongo que el id del usuario solicitante está en usuario.id
        estado: "Listo para retiro",
        nota: nota, // Agregar la nota al cuerpo de la solicitud
      };
  
      // Realizar la solicitud PUT
      const completadaResponse = await axios.put(
        `http://127.0.0.1:8000/api/solicitudes/${solicitudData.id_solicitud}`,
        solicitudData,
        config
      );
  
      // Imprimir la información en la consola
      console.log("Solicitud completada:", completadaResponse.data);

      this.componentDidMount();
  
      // Puedes realizar alguna lógica adicional después de completar la solicitud si es necesario
  
      // Cerrar el diálogo después de completar la solicitud
      this.hideDetailsDialog();
    } catch (error) {
      console.error("Error al completar la solicitud:", error);
    }
  };
  

  // Método para mostrar el diálogo de la nota
  showNotaDialog = () => {
    this.setState({ notaDialogVisible: true });
  };

  // Método para ocultar el diálogo de la nota
  hideNotaDialog = () => {
    this.setState({ notaDialogVisible: false });
  };

  render() {
    const { solicitudes, selectedSolicitud, visible, notaDialogVisible, nota } = this.state;
    

    const footerContent = (
      <div>
        <Button
          label="Cerrar"
          severity="danger"
          text
          rounded
          size="small"
          icon="pi pi-times"
          onClick={this.hideDetailsDialog}
        />
        <Button
          label="Completada"
          severity="success"
          rounded
          size="small"
          icon="pi pi-check"
          autoFocus
          onClick={this.handleCompletada} // Agrega esta línea para manejar la acción de completar
        />
      </div>
    );

    return (
      <>
        {/* Tabla de todas las solicitudes */}
        <DataTable
          value={solicitudes}
          emptyMessage="No hay solicitudes disponibles."
        >
          <Column field="id_solicitud" header="ID de solicitud" />
          <Column
            field="usuario"
            header="Alumno"
            body={(rowData) => (
              <span>
                {rowData.usuario.nombre} {rowData.usuario.apellido}
              </span>
            )}
          />
          <Column
            field="usuario"
            header="Alumno"
            body={(rowData) => <span>{rowData.usuario.curso}</span>}
          />
          <Column
            field="usuario"
            header="Carrera"
            body={(rowData) => (
              <span>
                {rowData.usuario.carreras.map((carrera) => (
                  <div key={carrera.id}>{carrera.nombre}</div>
                ))}
              </span>
            )}
          />
          <Column
            field="profesor"
            header="Profesor"
            body={(rowData) => (
              <span>
                {rowData.profesor.nombre} {rowData.profesor.apellido}
              </span>
            )}
          />

          {/* Botón para ver detalles de la solicitud */}
          <Column
            body={(rowData) => (
              <>
                <Button
                  size="small"
                  rounded
                  text
                  icon="pi pi-chevron-right"
                  iconPos="right"
                  label="Detalles"
                  className="text-sky-500"
                  onClick={() => this.showDetailsDialog(rowData)}
                />
              </>
            )}
          />
        </DataTable>

        {/* Diálogo para mostrar los detalles de la solicitud seleccionada */}
        <Dialog
          header="Detalles de la solicitud"
          visible={visible}
          onHide={this.hideDetailsDialog}
          breakpoints={{ "960px": "75vw", "641px": "100vw" }}
          style={{ width: "50vw" }}
          footer={footerContent}
          maximizable
        >
          {selectedSolicitud && (
            <>
              {/* Datos generales de la solicitud */}
              <div className="flex justify-between">
                <div className="my-4">
                  <h2 className="text-lg font-semibold">Datos generales: </h2>
                  <p className="font-medium text-base">
                    Fecha de creación:
                    <span className="font-normal mx-2">
                      {this.formatFecha(selectedSolicitud.fecha_creacion)}
                    </span>
                  </p>

                  <p className="font-medium text-base">
                    Fecha de devolución:
                    <span className="font-normal mx-2">
                      {this.formatFecha(selectedSolicitud.fecha_entrega)}
                    </span>
                  </p>
                </div>
                <div>
                  <Button
                    className="mt-4 mr-4"
                    label="Añadir nota"
                    icon="pi pi-plus"
                    rounded
                    onClick={this.showNotaDialog}

                  />
                </div>
              </div>
              {/* Tabla de productos */}
              {selectedSolicitud.productos &&
                selectedSolicitud.productos.length > 0 && (
                  <>
                    <h2 className="text-lg font-semibold">Productos:</h2>
                    <DataTable value={selectedSolicitud.productos}>
                      <Column field="id_producto" header="ID" />
                      <Column field="nombre" header="Producto" />
                      <Column field="cantidad" header="Cantidad" />
                    </DataTable>
                  </>
                )}

              {/* Nota de la solicitud */}
              <div className="my-4">
                <h2 className="text-lg font-semibold">Nota del profesor:</h2>
                <InputTextarea
                  rows={2}
                  className="w-full"
                  disabled
                  value={selectedSolicitud.nota || "No hay notas"}
                  style={{
                    backgroundColor: selectedSolicitud.nota
                      ? "#fff"
                      : "#f0f0f0",
                  }}
                />
              </div>
            </>
          )}
        </Dialog>

        {/* Diálogo para añadir la nota */}
        <Dialog
          header="Añadir Nota"
          visible={notaDialogVisible}
          onHide={this.hideNotaDialog}
          breakpoints={{ "960px": "50vw", "641px": "100vw" }}
          style={{ width: "30vw" }}
        >
          <div className="my-4">
            <h2 className="text-lg font-semibold">Añadir Nota:</h2>
            <InputTextarea
              rows={5}
              className="w-full"
              value={nota}
              onChange={(e) => this.setState({ nota: e.target.value })}
            />
          </div>
          <div className="flex justify-end">
            
            <Button
              label="Cancelar"
              icon="pi pi-times"
              rounded
              text
              severity="danger"
              className="mx-2"
              onClick={this.hideNotaDialog}
            />
            <Button
              label="Guardar"
              icon="pi pi-check"
              rounded
              severity="success"
              onClick={() => {
                // Agrega lógica para guardar la nota si es necesario
                // Aquí puedes enviar la nota a la API o realizar cualquier otra acción
                this.hideNotaDialog();
              }}
            />
          </div>
        </Dialog>
      </>
    );
  }
}

export default PreparacionTable;
