import { Component } from "react";
import { getUserData } from "../../api/userService";
import { getProducts } from "../../api/productService";
import Tag from "../UI/Tag";
import axios from "axios";
import Cookies from "js-cookie";
import Header from "../UI/Header";
import Table from "../UI/Table";

class SolicitudTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: null,
      products: [],
      profesoresData: [],
      visible: false,
      selectedSolicitud: null,
      globalFilter: "",
      selectedRow: null,
      selectedNote: "",
      statuses: ["En Preparación", "En Revisión", "Rechazado"],
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

        const profesoresData = await axios.get(
          "http://127.0.0.1:8000/api/create"
        );
        this.setState({ profesoresData: profesoresData.data });
      } catch (error) {
        console.error("Error al obtener datos del usuario:", error);
      }
    }
  }

  getProductNameById(productId) {
    const product = this.state.products.find(
      (prod) => prod.id_producto === productId
    );
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
      case "En Revisión":
        return "warning";
      case "Rechazado":
        return "danger";
      case "En Preparación":
        return "success";
      default:
        return "text-gray-800";
    }
  }

  handleRowSelect = (selectedRows) => {
    if (selectedRows && selectedRows.length > 0) {
      const selectedRow = selectedRows[0];
      this.setState({
        selectedRow: selectedRow,
        selectedNote: selectedRow.nota,
      });
    }
  };

  render() {
    const { user, profesoresData, selectedRow, selectedNote } = this.state;

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

    const getColor = (estado) => {
      switch (estado) {
        case "reportado":
        case "rechazado":
          return "red";

        case "en revisión":
          return "yellow";

        case "Completado":
          return "green";

        default:
          return null;
      }
    };

    const columnsToShow = [
      {
        name: "ID de Solicitud",
        content: (row) => (
          <div>
            <div className="m-0 text-base leading-6">{row.id_solicitud}</div>
          </div>
        ),
      },
      {
        name: "Fecha de Creación",
        content: (row) => (
          <div>
            <div className="m-0 text-base leading-6">
              {new Date(row.fecha_creacion).toLocaleDateString("es-ES")}
            </div>
          </div>
        ),
      },
      {
        name: "Fecha de Entrega",
        content: (row) => (
          <div>
            <div className="m-0 text-base leading-6">
              {new Date(row.fecha_entrega).toLocaleDateString("es-ES")}
            </div>
          </div>
        ),
      },
      {
        name: "Entrega",
        content: (row) => {
          const fechaEntrega = new Date(row.fecha_entrega);
          const hoy = new Date();
          const timeDifference = fechaEntrega.getTime() - hoy.getTime();
          const diasFaltantes = Math.floor(
            timeDifference / (1000 * 60 * 60 * 24)
          );

          let message = "";

          if (
            row.estado === "Completado" ||
            row.estado === "reportado" ||
            row.estado === "Rechazado"
          ) {
            message = "-";
          } else if (diasFaltantes > 0) {
            message = `En ${diasFaltantes} día${
              diasFaltantes !== 1 ? "s" : ""
            }`;
          } else if (diasFaltantes === 0) {
            message = "Hoy";
          } else {
            message = `${Math.abs(diasFaltantes)} día${
              Math.abs(diasFaltantes) !== 1 ? "s" : ""
            } de atraso`;
          }

          return (
            <div>
              <div className="m-0 text-base leading-6">{message}</div>
            </div>
          );
        },
      },
      {
        name: "Estado",
        content: (row) => (
          <div className="flex flex-col">
            <Tag color={getColor(row.estado)}> {row.estado} </Tag>
          </div>
        ),
      },
      {
        name: "Profesor",
        content: (row) => (
          <div>
            <div className="m-0 text-base leading-6">
              {row.profesor.nombre} {row.profesor.apellido}
            </div>
          </div>
        ),
      },
    ];

    const columnsToShowSecondTable = [
      { name: "ID", content: (row) => row.id_producto },
      { name: "Nombre", content: (row) => row.nombre },
      { name: "Cantidad", content: (row) => row.cantidad },
    ];

    return (
      <>
        <Header
          title="Mis Solicitudes"
          subtitle="Mis solicitudes"
          imageUrl="https://modernize-react.adminmart.com/assets/ChatBc-d3c45db6.png"
        />
        <div className="flex">
          <div className="m-4 w-3/5 rounded-xl shadow-custom bg-white">
            <div className="w-full border border-b rounded-t-xl">
              <h3 className="p-4 text-xl font-medium text-slate-800">
                Solicitudes
              </h3>
            </div>
            <div className="p-4">
              <Table
                columns={columnsToShow}
                data={solicitudes}
                paginator
                onRowSelect={this.handleRowSelect}
              />
            </div>
          </div>

          <div className="m-4 w-2/5 rounded-xl shadow-custom bg-white">
            <div className="w-full border border-b rounded-t-xl">
              <h3 className="p-4 text-2xl font-medium text-slate-800">
                Detalle
              </h3>
            </div>
            <div className="p-4">
              {selectedNote && (
                <div className="my-4">
                  <h2 className="text-lg font-medium">Nota de la solicitud:</h2>
                  <span
                    className="w-full rounded-md inline-block"
                    style={{
                      backgroundColor: selectedNote ? "#fff" : "#f0f0f0",
                      display: "block",
                      width: "100%",
                      whiteSpace: "pre-line",
                    }}
                  >
                    {selectedNote || "No hay notas"}
                  </span>
                </div>
              )}
              {selectedRow &&
              selectedRow.productos &&
              selectedRow.productos.length > 0 ? (
                <Table
                  columns={columnsToShowSecondTable}
                  data={selectedRow.productos}
                />
              ) : (
                <div className="text-gray-500">
                  Ninguna solicitud seleccionada
                </div>
              )}
            </div>
          </div>
        </div>
      </>
    );
  }
}

export default SolicitudTable;
