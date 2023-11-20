import { Component } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import axios from "axios";
import Cookies from "js-cookie";
import { getProducts } from "../../api/productService";
import { InputTextarea } from "primereact/inputtextarea";

class RevisionTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      solicitudes: [],
      products: [],
      visible: false,
      selectedSolicitud: null,
      currentUser: null,
      allButtonsActivated: false,
      rowStates: {},
      nota: "", // Nuevo estado para almacenar la nota
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
      const userDataResponse = await axios.get(
        "http://127.0.0.1:8000/api/user",
        config
      );
      const currentUser = userDataResponse.data.user;

      // Obtener todas las solicitudes desde el endpoint
      const solicitudesResponse = await axios.get(
        "http://127.0.0.1:8000/api/solicitudes",
        config
      );

      // Filtrar las solicitudes para mostrar solo las del usuario actual
      const solicitudesUsuarioActual = solicitudesResponse.data.filter(
        (solicitud) => solicitud.profesor === currentUser.id_user
      );

      // Filtrar las solicitudes para mostrar solo las que NO están en revisión
      const solicitudesNoEnRevision = solicitudesUsuarioActual.filter(
        (solicitud) => solicitud.estado !== "en revisión"
      );

      // Obtener datos de productos mediante la función getProductsData
      const productsData = await this.getProductsData();

      this.setState({
        solicitudes: solicitudesNoEnRevision,
        products: productsData, // Actualizar el estado de los productos
        currentUser: currentUser,
      });
    } catch (error) {
      console.error(
        "Error al obtener las solicitudes o datos del usuario:",
        error
      );
    }
  }

  // Función para obtener datos de productos
  async getProductsData() {
    try {
      return await getProducts(); // Utiliza tu función getProducts existente
    } catch (error) {
      console.error("Error al obtener datos de productos:", error);
      return [];
    }
  }

  // Función para mostrar los detalles de un producto en un diálogo
  showDetailsDialog = (rowData) => {
    this.setState({ visible: true, selectedSolicitud: rowData });
  };

  // Función para cerrar el diálogo de detalles
  hideDetailsDialog = () => {
    this.setState({ visible: false, nota: "" });
  };

  handleNotaChange = (e) => {
    this.setState({ nota: e.target.value });
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

  // Función para obtener el nombre del producto por ID
  getProductNameById(productId) {
    const product = this.state.products.find(
      (prod) => prod.id_producto === productId
    );
    return product ? product.nombre : "Producto no encontrado";
  }

  getToggleButtonClass(isChecked) {
    if (isChecked) {
      // Clases para el botón activado
      return "rounded-full border-none focus:shadow-sky-500! focus:shadow-none bg-sky-500 clases-para-botón-activado";
    } else {
      // Clases para el botón desactivado
      return "rounded-full border-none focus:shadow-sky-500! focus:shadow-none clases-para-botón-desactivado";
    }
  }

  enviarFormulario = async () => {
    try {
      const { selectedSolicitud, currentUser, nota, rowStates } = this.state;

      // Verificar que haya una solicitud seleccionada
      if (!selectedSolicitud) {
        console.error("No hay solicitud seleccionada para enviar.");
        return;
      }

      // Verificar que todos los ToggleButtons estén activados
      const allButtonsActivated = selectedSolicitud.productos.every(
        (producto) => rowStates[producto.id_producto]
      );

      if (!allButtonsActivated) {
        console.error("No todos los ToggleButtons están activados.");
        return;
      }

      // Obtener el token de las cookies
      const token = Cookies.get("token");

      // Verificar si el token está presente
      if (!token) {
        console.error("Token no encontrado en las cookies");
        return;
      }

      // Construir el objeto de datos a enviar
      const dataToSend = {
        id_solicitud: selectedSolicitud.id_solicitud,
        usuario: currentUser.id_user,
        nota: nota,
        estado: "en preparación", // Puedes ajustar el estado según tu lógica
        aprobacion: true, // Establecer aprobación en true ya que todos los ToggleButtons están activados
      };

      // Imprimir el JSON que se enviará
      console.log("JSON a enviar:", JSON.stringify(dataToSend, null, 2));

      // Configurar el encabezado de la solicitud con el token
      const config = {
        headers: {
          Authorization: `Token ${token}`,
        },
      };

      // Enviar los datos al servidor utilizando el método PUT y el token en el encabezado
      const response = await axios.put(
        `http://127.0.0.1:8000/api/solicitudes/${selectedSolicitud.id_solicitud}`,
        dataToSend,
        config
      );

      // Imprimir la respuesta del servidor en la consola
      console.log("Respuesta del servidor:", response.data);

      // Opcional: Puedes realizar otras acciones después de enviar el formulario

      // Cerrar el diálogo después de enviar el formulario
      this.hideDetailsDialog();
    } catch (error) {
      console.error("Error al enviar el formulario:", error);
    }
  };

  checkAllButtonsActivated() {
    const { selectedSolicitud, rowStates } = this.state;
    if (selectedSolicitud && selectedSolicitud.productos) {
      const allButtonsActivated = selectedSolicitud.productos.every(
        (producto) => rowStates[producto.id_producto]
      );
      this.setState({ allButtonsActivated });
    }
  }

  render() {
    const { solicitudes, selectedSolicitud, visible } =
      this.state;

    return (
      <>
        {/* Tabla de revisiones */}
        <DataTable
          value={solicitudes}
          emptyMessage="No hay solicitudes disponibles."
        >
          <Column field="id_solicitud" header="ID de solicitud" />
          <Column field="usuario" header="Alumno" />
          <Column field="aprobacion" header="Decisión" />
          <Column field="fecha_creacion" header="Fecha de creación" />
          <Column field="fecha_entrega" header="Fecha de entrega" />
          <Column
            field="estado"
            header="Estado"
            body={(rowData) => (
              <span
                className={`text-sm font-semibold ${this.getEstadoStyleClass(
                  rowData.estado
                )}`}
              >
                {rowData.estado}
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
                  severity="info"
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
          maximizable
        >
          {/* Mostrar tabla de productos si hay productos en la solicitud seleccionada */}
          {selectedSolicitud &&
            selectedSolicitud.productos &&
            selectedSolicitud.productos.length > 0 && (
              <>
                <DataTable value={selectedSolicitud.productos}>
                  <Column field="id_producto" header="ID" />

                  <Column
                    field="nombre"
                    header="Nombre"
                    body={(rowData) => (
                      <span>
                        {this.getProductNameById(rowData.id_producto)}
                      </span>
                    )}
                  />
                  <Column field="cantidad" header="Cantidad" />
                </DataTable>

                {/* Mostrar la nota de la solicitud */}
                <div className="my-4">
                  <h2 className="text-lg font-semibold">
                    Nota de la solicitud:
                  </h2>
                  <InputTextarea
                    rows={5}
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
      </>
    );
  }
}

export default RevisionTable;
