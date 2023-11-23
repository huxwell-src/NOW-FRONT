import React, { Component } from "react";
import { getUserData } from "../../api/userService";
import { getProducts } from "../../api/productService";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { Tag } from "primereact/tag";
import { Dropdown } from "primereact/dropdown";
import axios from "axios";
import Cookies from "js-cookie";
import { InputTextarea } from "primereact/inputtextarea";

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
      case "en revisión":
        return "warning";
      case "Rechazado":
        return "danger";
      case "en preparación":
        return "success";
      default:
        return "text-gray-800 ";
    }
  }

  render() {
    const { user, profesoresData, selectedSolicitud, statuses } = this.state;

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

    const getSeverity = (status) => {
      switch (status) {
        case "Rechazado":
          return "danger";

        case "Atrasado":
          return "danger";

        case "En Preparación":
          return "success";

        case "En Revisión":
          return "warning";

        case "renewal":
          return null;
      }
    };

    const statusItemTemplate = (option) => {
      return <Tag value={option} severity={getSeverity(option)} />;
    };

    const statusFilterTemplate = (options) => {
      return (
        <Dropdown
          value={options.value}
          options={statuses}
          onChange={(e) => options.filterCallback(e.value)}
          itemTemplate={statusItemTemplate}
          placeholder="Seleccionar estado"
          className="p-column-filter"
          showClear
          style={{ minWidth: "12rem" }}
        />
      );
    };

    return (
      <>
        <DataTable
          value={solicitudes}
          removableSort
          filterDisplay="row"
          emptyMessage="No hay solicitudes disponibles."
          paginator
          rows={10}
          sortOrder={-1}
          sortField="id_solicitud"
          rowsPerPageOptions={[10, 15, 25, 50]}
          tableStyle={{ minWidth: "50rem" }}
        >
          <Column
            field="id_solicitud"
            sortable
            header="ID de solicitud"
            filter
            filterPlaceholder="Buscar ID"
          ></Column>
          <Column
            field="fecha_creacion"
            sortable
            header="Fecha de creación"
            filter
            filterPlaceholder="Buscar fecha"
          ></Column>
          <Column
            field="fecha_entrega"
            sortable
            header="Fecha de entrega"
            filter
            filterPlaceholder="Buscar fecha"
          ></Column>
          <Column
            field="estado"
            header="Estado"
            sortable
            showFilterMenu={false}
            filterMenuStyle={{ width: "14rem" }}
            filterElement={statusFilterTemplate}
            filter
            filterPlaceholder="Buscar estado"
            body={(rowData) => (
              <span className="text-sm font-semibold">
                <Tag
                  value={rowData.estado}
                  className="capitalize"
                  severity={this.getEstadoStyleClass(rowData.estado)}
                />
              </span>
            )}
          ></Column>
          <Column
            field="profesor"
            header="Profesor"
            sortable
            body={(rowData) => (
              <span>
                {rowData.profesor.nombre} {rowData.profesor.apellido}
              </span>
            )}
            filter
            filterPlaceholder="Buscar profesor"
          ></Column>

          <Column
            body={(rowData) => (
              <Button
                size="small"
                sortable
                rounded
                text
                icon="pi pi-chevron-right"
                iconPos="right"
                label="Ver Detalles"
                className="text-sky-500"
                onClick={() =>
                  this.setState({ visible: true, selectedSolicitud: rowData })
                }
              />
            )}
          ></Column>
        </DataTable>

        {/* Dialog */}
        {/* Dialog */}
        <Dialog
          header="Detalles"
          modal
          breakpoints={{ "960px": "75vw", "641px": "100vw" }}
          style={{ width: "50vw" }}
          visible={this.state.visible}
          onHide={() => this.setState({ visible: false })}
        >
          {selectedSolicitud &&
            selectedSolicitud.productos &&
            selectedSolicitud.productos.length > 0 && (
              <DataTable value={selectedSolicitud.productos}>
                <Column field="id_producto" header="ID"></Column>
                <Column field="nombre" header="Nombre"></Column>
                <Column field="cantidad" header="Cantidad"></Column>
              </DataTable>
            )}
          {/* Nota de la solicitud */}
          {selectedSolicitud &&
            selectedSolicitud.estado === "Listo para retiro" && (
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
            )}
        </Dialog>
      </>
    );
  }
}

export default SolicitudTable;
