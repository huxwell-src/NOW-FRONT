import React, { Component } from "react";
import { getUserData } from "../../api/userService";
import { getProducts } from "../../api/productService";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Chip } from "primereact/chip";
import axios from "axios";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import Cookies from "js-cookie";

class SolicitudTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: null,
      products: [],
      profesoresData: [],
      visible: false,
      selectedSolicitud: null, // Nuevo estado para almacenar la solicitud seleccionada
    };
  }

  async componentDidMount() {
    const token = Cookies.get("token");

    if (token) {
      try {
        const userData = await getUserData(token);
        this.setState({ user: userData });

        const productsData = await getProducts();
        this.setState({ products: productsData });

        const profesoresData = await axios.get("http://127.0.0.1:8000/api/create");
        this.setState({ profesoresData: profesoresData.data });
      } catch (error) {
        console.error("Error al obtener datos del usuario:", error);
      }
    }
  }

  getProductNameById(productId) {
    const product = this.state.products.find((prod) => prod.id_producto === productId);
    return product ? product.nombre : "Producto no encontrado";
  }

  getProfesorById(userId, profesoresData) {
    const profesor = profesoresData.find((prof) => prof.id_user === userId);

    if (profesor) {
      const { nombre, apellido } = profesor;
      return `${nombre} ${apellido}`;
    } else {
      return "Profesor no encontrado";
    }
  }

  getEstadoStyleClass(estado) {
    switch (estado) {
      case "en revisión":
        return "text-yellow-900 bg-yellow-300 ";
      case "Rechazado":
        return "text-red-900 bg-red-300 ";
      case "en preparación":
        return " text-green-700 bg-green-300 ";
      default:
        return "text-gray-800 ";
    }
  }

  render() {
    const { user, profesoresData, selectedSolicitud } = this.state;

    if (!user || !user.solicitudes || user.solicitudes.length === 0) {
      return null;
    }

    const solicitudes = user.solicitudes.map((solicitud) => {
      const productos = solicitud.productos.map((producto, index) => {
        const nombre = this.getProductNameById(producto.id_producto);
        const profesor = this.getProfesorById(producto.id_user, profesoresData);

        return {
          ...producto,
          key: `${solicitud.id_solicitud}-${index}`,
          nombre,
          profesor,
        };
      });

      return {
        ...solicitud,
        key: `${solicitud.id_solicitud}`,
        productos,
      };
    });

    return (
      <>
        <DataTable value={solicitudes} emptyMessage="No hay solicitudes disponibles.">
          <Column field="id_solicitud" header="ID de solicitud"></Column>
          <Column field="fecha_creacion" header="Fecha de creación"></Column>
          <Column field="fecha_entrega" header="Fecha de entrega"></Column>
          <Column
            field="estado"
            header="Estado"
            body={(rowData) => (
              <span className="text-sm font-semibold">
                <Chip
                  label={rowData.estado}
                  className={`px-4 capitalize ${this.getEstadoStyleClass(rowData.estado)}`}
                />
              </span>
            )}
          ></Column>
           <Column
                  field="profesor"
                  header="Profesor"
                  body={(rowData) => (
                    <span>
                      {this.getProfesorById(
                        rowData.profesor, 
                        this.state.profesoresData
                      )}
                    </span>
                  )}
                ></Column>
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
                onClick={() => this.setState({ visible: true, selectedSolicitud: rowData })}
              />
            )}
          ></Column>
        </DataTable>

        {/* Dialog */}
        <Dialog
          header="Detalles"
          visible={this.state.visible}
          onHide={() => this.setState({ visible: false })}
        >
          {selectedSolicitud && selectedSolicitud.productos && selectedSolicitud.productos.length > 0 && (
            <DataTable value={selectedSolicitud.productos}>
              <Column field="id_producto" header="ID"></Column>
              <Column field="nombre" header="Nombre"></Column>
              <Column field="cantidad" header="Cantidad"></Column>
            </DataTable>
          )}
        </Dialog>
      </>
    );
  }
}

export default SolicitudTable;
