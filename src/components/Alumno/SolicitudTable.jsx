import React, { Component } from "react";
import { getUserData } from "../../api/userService";
import { getProducts } from "../../api/productService";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import Cookies from "js-cookie";
import { Chip } from "primereact/chip";
import axios from "axios";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";

class SolicitudTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: null,
      products: [],
      profesoresData: [],
      visible: false, // Agrega el estado para controlar la visibilidad del Dialog
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
  
        // Obtener datos de profesores desde la API
        const profesoresData = await axios.get('http://127.0.0.1:8000/api/create');
        this.setState({ profesoresData: profesoresData.data });
      } catch (error) {
        console.error("Error al obtener datos del usuario:", error);
      }
    }
  }
  

  // Función para obtener el nombre de un producto por su ID
  getProductNameById(productId) {
    const product = this.state.products.find(
      (prod) => prod.id_producto === productId
    );
    return product ? product.nombre : "Producto no encontrado";
  }

  addKeysToData() {
    const { user, profesoresData } = this.state;

    if (user && user.solicitudes) {
      let keyCount = 0;

      const solicitudes = user.solicitudes.map((solicitud) => {
        const key = `${keyCount}`;
        keyCount++;

        const productos = solicitud.productos.map((producto, index) => {
          const nombre = this.getProductNameById(producto.id_producto);
          const profesor = this.getProfesorById(
            producto.id_user,
            profesoresData
          );

          return {
            ...producto,
            key: `${key}-${index}`,
            nombre,
            profesor,
          };
        });

        return {
          ...solicitud,
          key,
          productos,
        };
      });

      return solicitudes;
    }

    return [];
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
      case "Completado":
        return "text-green-800";
      case "Cancelado":
        return "text-red-800 ";
      // Agrega más casos según los valores posibles de tu estado
      default:
        return "text-gray-800 "; // Estilo predeterminado para estados desconocidos
    }
  }

  render() {
    const solicitudes = this.addKeysToData();

    if (!solicitudes || solicitudes.length === 0) {
      return null; // Retorna null o algún componente de carga si es necesario
    }

    return (
      <>
        {/* Bloque para mostrar las solicitudes */}
        <div>
          {solicitudes.map((solicitud) => (
            <div key={solicitud.key} className="card">
              <DataTable value={[solicitud]}>
                <Column field="id_solicitud" header="ID de solicitud"></Column>
                <Column
                  field="fecha_creacion"
                  header="Fecha de creación"
                ></Column>
                <Column
                  field="fecha_entrega"
                  header="Fecha de entrega"
                ></Column>
                <Column
                  field="estado"
                  header="Estado"
                  body={(rowData) => (
                    <span className="text-sm font-semibold">
                      <Chip
                        label={rowData.estado}
                        className={`px-4 capitalize ${this.getEstadoStyleClass(
                          rowData.estado
                        )}`}
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
                        rowData.profesor, // Cambia esto de rowData.id_user a rowData.profesor
                        this.state.profesoresData
                      )}
                    </span>
                  )}
                ></Column>
                <Column
                  body={
                    <Button
                      size="small"
                      rounded
                      text
                      severity="info"
                      icon="pi pi-chevron-right"
                      iconPos="right"
                      label="Ver Detalles"
                      className="text-sky-500"
                      onClick={() => this.setState({ visible: true })}
                    />
                  }
                ></Column>
              </DataTable>

              {/* Dialog */}
              <Dialog
                header="Detalles"
                visible={this.state.visible}
                onHide={() => this.setState({ visible: false })}
              >
                {solicitud.productos && solicitud.productos.length > 0 && (
                  <DataTable value={solicitud.productos}>
                    <Column field="id_producto" header="ID"></Column>
                    <Column field="nombre" header="Nombre"></Column>
                    <Column filed="cantidad" header="Cantidad"></Column>
                    {/* Otros campos del producto que desees mostrar */}
                  </DataTable>
                )}
              </Dialog>
            </div>
          ))}
        </div>
      </>
    );
  }
}

export default SolicitudTable;
