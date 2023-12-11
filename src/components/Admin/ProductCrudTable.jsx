// Importación de bibliotecas y componentes
import React, { Component } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { Dropdown } from "primereact/dropdown"; // Import Dropdown component
import { MultiSelect } from "primereact/multiselect";
import { saveAs } from "file-saver"; // Importar saveAs desde file-saver
import { Toolbar } from "primereact/toolbar";
import { SplitButton } from "primereact/splitbutton";

class ProductCrudTable extends Component {
  constructor(props) {
    super(props);

    this.state = {
      productos: [], // Lista de productos
      deleteProductoDialogVisible: false, // Visibilidad del diálogo de eliminación
      productoToDeleteId: null, // ID del producto a eliminar
      userRole: props.userRole, // Rol de usuario (propiedad)
      editProductoDialogVisible: false, // Visibilidad del diálogo de edición
      productoToEdit: null, // Datos del producto que se está editando
      // Otros estados permanecen sin cambios...
      newUser: {
        id_producto: null,
        nombre: "",
        stock: 0,
        medida_stock: "",
        disponibilidad: 0,
        descripcion: "",
        carrera: [],
      },
    };

    this.toast = React.createRef(); // Referencia al componente Toast
  }

  componentDidMount() {
    this.fetchProductos();
  }

  fetchProductos() {
    const token = Cookies.get("token");
    const config = {
      headers: {
        Authorization: `Token ${token}`,
      },
    };

    axios
      .get("http://127.0.0.1:8000/api/productos", config)
      .then((response) => {
        let filteredProductos = response.data;
        this.setState({ productos: filteredProductos });
      })
      .catch((error) => {
        console.error("Error fetching productos:", error);
      });
  }

  showDeleteProductoDialog = (id_producto) => {
    this.setState({
      deleteProductoDialogVisible: true,
      productoToDeleteId: id_producto,
    });
  };

  hideDeleteProductoDialog = () => {
    this.setState({
      deleteProductoDialogVisible: false,
      productoToDeleteId: null,
    });
  };

  showEditProductoDialog = (producto) => {
    this.setState({
      editProductoDialogVisible: true,
      productoToEdit: producto,
    });
  };

  hideEditProductoDialog = () => {
    this.setState({
      editProductoDialogVisible: false,
      productoToEdit: null,
    });
  };

  saveChangesToApi = () => {
    const { productoToEdit } = this.state;

    if (!productoToEdit) {
      console.error("No se ha especificado un producto para editar.");
      return;
    }

    const token = Cookies.get("token");
    const config = {
      headers: {
        Authorization: `Token ${token}`,
      },
    };

    const updatedProducto = {
      ...productoToEdit,
      // Actualizar otros campos según sea necesario
    };

    axios
      .put(
        `http://127.0.0.1:8000/api/edit/${updatedProducto.id_producto}`,
        updatedProducto,
        config
      )
      .then(() => {
        this.toast.current.show({
          severity: "success",
          summary: "Edicion",
          detail: "El producto ha sido editado exitosamente",
          life: 3000,
        });
        this.fetchProductos();
        this.hideEditProductoDialog();
      })
      .catch((error) => {
        console.error("Error al guardar los cambios del producto:", error);
        // Resto del método permanece sin cambios...
      });
  };

  handleDeleteProducto = (id_producto) => {
    this.showDeleteProductoDialog(id_producto);
  };

  handleDeleteProductoConfirmed = (id_producto) => {
    const token = Cookies.get("token");
    const config = {
      headers: {
        Authorization: `Token ${token}`,
      },
    };

    axios
      .delete(`http://127.0.0.1:8000/api/delete/${id_producto}`, config)
      .then(() => {
        this.fetchProductos();
        this.hideDeleteProductoDialog();

        this.toast.current.show({
          severity: "success",
          summary: "Eliminacion",
          detail: "Producto eliminado",
          life: 3000,
        });
      })
      .catch((error) => {
        console.error("Error deleting producto:", error);
        this.hideDeleteProductoDialog();

        this.toast.current.show({
          severity: "error",
          summary: "error",
          detail: "Error al eliminar producto",
          life: 3000,
        });
      });
  };

  // Método de renderizado
  render() {
    // Función para definir las acciones en la tabla
    const actions = (user) => (
      <>
        <div className="flex">
          <Button
            icon="pi pi-pencil"
            rounded
            outlined
            severity="primary"
            className="mx-1"
            onClick={() => this.showEditUserDialog(user)}
          />
          {this.state.userRole === "Alumno" && (
            <Button
              icon="pi pi-folder"
              rounded
              outlined
              severity="warning"
              className="mx-1"
              onClick={() => this.showSolicitudesDialog(user)}
            />
          )}
          <Button
            icon="pi pi-trash "
            rounded
            outlined
            severity="danger"
            className="mx-1"
            onClick={() => this.handleDeleteUser(user.id_user)}
          />
        </div>
      </>
    );

    const report = (user) => (
      <>
        <Button
          label="Reporte"
          outlined
          icon="pi pi-file-pdf"
          onClick={() => this.exportPDFUserSolicitudes(user)}
          className="p-button-success p-button-rounded"
        />
      </>
    );

    const scrollHeight = "calc(100vh - 295px)";

    const leftToolbarTemplate = () => {
      return (
        <div className="flex flex-wrap gap-2">
          <Button
            label="Agregar"
            severity="success"
            size="small"
            raised
            rounded
            icon="pi pi-user-plus"
            onClick={this.showNewUserDialog}
          />
        </div>
      );
    };

    const rightToolbarTemplate = () => {
      const items = [
        {
          label: "Exportar a XLS",
          icon: "pi pi-file-excel",
          command: this.exportExcel,
        },
        {
          label: "Exportar a PDF",
          icon: "pi pi-file-pdf",
          command: this.exportPDF,
        },
      ];

      return (
        <SplitButton
          model={items}
          iconPos="right"
          label="Exportar"
          text
          className="p-button-success p-button-rounded"
        />
      );
    };

    return (
      <>
        <Toast ref={this.toast} />
        <Toolbar
          className="!border-none !py-0.5 "
          left={leftToolbarTemplate}
          right={rightToolbarTemplate}
        ></Toolbar>

        <div className="h-1/4">
          {/* Tabla de datos */}
          <DataTable
            scrollable
            scrollHeight={scrollHeight}
            filterDisplay="row"
            className="100%"
            removableSort
            value={this.state.users}
            tableStyle={{ minWidth: "50rem" }}
            paginator
            rows={25}
            rowsPerPageOptions={[25, 50, 100, 200]}
          >
            <Column
              sortable
              filter
              filterMatchMode="contains"
              field="rut"
              header="Rut"
              filterPlaceholder="Buscar por Rut"
            ></Column>
            <Column
              sortable
              filter
              field="nombre"
              header="Nombre"
              filterPlaceholder="Buscar Nombre"
            ></Column>
            <Column
              sortable
              filter
              field="apellido"
              header="Apellido"
              filterPlaceholder="Buscar Apellido"
            ></Column>
            <Column
              sortable
              filter
              field="email"
              header="Email"
              filterPlaceholder="Buscar Email"
            ></Column>
            <Column
              sortable
              filter
              field="curso"
              header="Curso"
              filterPlaceholder="Buscar Curso"
            ></Column>
            <Column
              sortable
              filter
              field="carrera"
              header="Carrera"
              filterPlaceholder="Buscar Carrera"
            ></Column>
            <Column body={actions}></Column>
          </DataTable>
        </div>

        {/* Diálogo para mostrar las solicitudes del usuario */}
        <Dialog
          visible={this.state.solicitudesDialogVisible}
          onHide={this.hideSolicitudesDialog}
          header="Solicitudes del Usuario"
          breakpoints={{ "1400px": "100vw" }}
          style={{ width: "65vw" }}
          modal
        >
          <Toolbar
            className="!border-none !py-3 !bg-white "
            right={report}
          ></Toolbar>
          {/* Tabla de solicitudes del usuario */}
          <DataTable
            value={this.state.selectedUserSolicitudes}
            className="100%"
            scrollable
            scrollHeight="calc(100vh - 295px)"
          >
            {/* Columna para el ID de la solicitud */}
            <Column field="id_solicitud" header="ID Solicitud" />

            {/* Columna para la fecha de creación */}
            <Column field="fecha_creacion" header="Fecha de Creación" />

            {/* Columna para la fecha de entrega */}
            <Column field="fecha_entrega" header="Fecha de Entrega" />

            {/* Columna para la fecha de devolución */}
            <Column field="fecha_devolucion" header="Fecha de Devolución" />

            {/* Columna para el estado de la solicitud */}
            <Column field="estado" header="Estado" />

            {/* Columna para la aprobación de la solicitud */}
            <Column field="aprobacion" header="Aprobación" />

            {/* Columna para el nombre del profesor */}
            <Column field="profesor.nombre" header="Nombre del Profesor" />
          </DataTable>
        </Dialog>

        <Dialog
          visible={this.state.deleteUserDialogVisible}
          onHide={this.hideDeleteUserDialog}
          header="Confirmar Eliminación"
          modal
          footer={
            <div>
              {/* Botón para cancelar la eliminación del usuario */}
              <Button
                onClick={this.hideDeleteUserDialog}
                label="Cancelar"
                severity="danger"
                rounded
                raised
                size="small"
              />
              {/* Botón para confirmar la eliminación del usuario */}
              <Button
                onClick={() =>
                  this.handleDeleteUserConfirmed(this.state.userToDeleteId)
                }
                label="Confirmar"
                severity="success"
                rounded
                raised
                size="small"
              />
            </div>
          }
        >
          ¿Estás seguro de que deseas eliminar este usuario?
        </Dialog>

        <Dialog
          visible={this.state.editUserDialogVisible}
          onHide={this.hideEditUserDialog}
          header="Editar Usuario"
          breakpoints={{ "960px": "75vw", "641px": "100vw" }}
          style={{ width: "50vw" }}
          modal
        >
          {this.state.userToEdit && (
            <div className="">
              <div className="flex flex-col mb-4">
                <label htmlFor="rut">Rut</label>
                <InputText
                  id="rut"
                  value={this.state.userToEdit.rut}
                  onChange={(e) => {
                    const updatedUser = {
                      ...this.state.userToEdit,
                      rut: e.target.value,
                    };
                    this.setState({ userToEdit: updatedUser });
                  }}
                />
              </div>
              <div className="flex flex-col mb-4">
                <label htmlFor="nombre">Nombre</label>
                <InputText
                  id="nombre"
                  value={this.state.userToEdit.nombre}
                  onChange={(e) => {
                    const updatedUser = {
                      ...this.state.userToEdit,
                      nombre: e.target.value,
                    };
                    this.setState({ userToEdit: updatedUser });
                  }}
                />
              </div>
              <div className="flex flex-col mb-4">
                <label htmlFor="apellido">Apellido</label>
                <InputText
                  id="apellido"
                  value={this.state.userToEdit.apellido}
                  onChange={(e) => {
                    const updatedUser = {
                      ...this.state.userToEdit,
                      apellido: e.target.value,
                    };
                    this.setState({ userToEdit: updatedUser });
                  }}
                />
              </div>
              <div className="flex flex-col mb-4">
                <label htmlFor="email">Email</label>
                <InputText
                  id="email"
                  value={this.state.userToEdit.email}
                  onChange={(e) => {
                    const updatedUser = {
                      ...this.state.userToEdit,
                      email: e.target.value,
                    };
                    this.setState({ userToEdit: updatedUser });
                  }}
                />
              </div>
              <div className="flex flex-col mb-4">
                <label htmlFor="curso">Curso</label>
                <Dropdown
                  options={[
                    { label: "3A", value: "3A" },
                    { label: "3B", value: "3B" },
                    { label: "3C", value: "3C" },
                    { label: "4A", value: "4A" },
                    { label: "4B", value: "4B" },
                    { label: "4C", value: "4C" },
                    // Add more options as needed
                  ]}
                  value={this.state.userToEdit.curso}
                  onChange={(e) => {
                    const updatedUser = {
                      ...this.state.userToEdit,
                      curso: e.value,
                    };
                    this.setState({ userToEdit: updatedUser });
                  }}
                  placeholder="Selecciona el Curso"
                />
              </div>
              <div className="flex flex-col mb-4">
                <label htmlFor="carrera">Carrera</label>
                {this.props.oneCarrera ? (
                  <Dropdown
                    options={[
                      { label: "Construcción (edificación)", value: 2 },
                      { label: "Construcciones Metálicas", value: 3 },
                      { label: "Electricidad", value: 4 },
                    ]}
                    value={this.state.userToEdit.carrera}
                    onChange={(e) => {
                      const updatedUser = {
                        ...this.state.userToEdit,
                        carrera: e.value,
                      };
                      this.setState({ userToEdit: updatedUser });
                    }}
                    placeholder="Selecciona la carrera"
                  />
                ) : (
                  <MultiSelect
                    display="chip"
                    options={[
                      { label: "Construcción (edificación)", value: 2 },
                      { label: "Construcciones Metálicas", value: 3 },
                      { label: "Electricidad", value: 4 },
                      // Agrega más opciones según sea necesario
                    ]}
                    placeholder="Selecciona las carreras"
                    value={this.state.userToEdit.carrera}
                    onChange={(e) => {
                      const updatedUser = {
                        ...this.state.userToEdit,
                        carrera: e.value,
                      };
                      this.setState({ userToEdit: updatedUser });
                    }}
                  />
                )}
              </div>
              <div className="flex mt-4 w-full gap-2 items-end justify-end ">
                {/* Botón para cancelar la edición */}
                <Button
                  label="Cancelar"
                  rounded
                  size="small"
                  severity="danger"
                  onClick={this.hideEditUserDialog}
                />
                {/* Botón para guardar los cambios */}
                <Button
                  label="Guardar"
                  onClick={this.saveChangesToApi}
                  rounded
                  raised
                  size="small"
                  severity="success"
                />
              </div>
            </div>
          )}
        </Dialog>

        {/* Diálogo para agregar nuevo usuario */}
        <Dialog
          visible={this.state.newUserDialogVisible}
          onHide={this.hideNewUserDialog}
          header="Agregar Nuevo Usuario"
          breakpoints={{ "960px": "75vw", "641px": "100vw" }}
          style={{ width: "50vw" }}
          modal
        >
          <div className="">
            {/* Campos del formulario para crear un nuevo usuario */}
            <div className="flex flex-col mb-4">
              <label htmlFor="rut">Rut</label>
              <InputText
                id="rut"
                value={this.state.newUser.rut}
                onChange={(e) => {
                  this.setState({
                    newUser: {
                      ...this.state.newUser,
                      rut: e.target.value,
                    },
                  });
                }}
              />
            </div>
            <div className="flex flex-col mb-4">
              <label htmlFor="nombre">Nombre</label>
              <InputText
                id="nombre"
                value={this.state.newUser.nombre}
                onChange={(e) => {
                  this.setState({
                    newUser: {
                      ...this.state.newUser,
                      nombre: e.target.value,
                    },
                  });
                }}
              />
            </div>
            <div className="flex flex-col mb-4">
              <label htmlFor="apellido">Apellido</label>
              <InputText
                id="apellido"
                value={this.state.newUser.apellido}
                onChange={(e) => {
                  this.setState({
                    newUser: {
                      ...this.state.newUser,
                      apellido: e.target.value,
                    },
                  });
                }}
              />
            </div>
            <div className="flex flex-col mb-4">
              <label htmlFor="email">Email</label>
              <InputText
                id="email"
                value={this.state.newUser.email}
                onChange={(e) => {
                  this.setState({
                    newUser: {
                      ...this.state.newUser,
                      email: e.target.value,
                    },
                  });
                }}
              />
            </div>
            <div className="flex flex-col mb-4">
              <label htmlFor="curso">Curso</label>
              <Dropdown
                id="curso"
                options={[
                  { label: "3A", value: "3A" },
                  { label: "3B", value: "3B" },
                  { label: "3C", value: "3C" },
                  { label: "4A", value: "4A" },
                  { label: "4B", value: "4B" },
                  { label: "4C", value: "4C" },
                  // Add more options as needed
                ]}
                value={this.state.newUser.curso}
                onChange={(e) => {
                  this.setState({
                    newUser: {
                      ...this.state.newUser,
                      curso: e.value,
                    },
                  });
                }}
                placeholder="Selecciona el Curso"
              />
            </div>
            <div className="flex flex-col mb-4">
              <label htmlFor="carrera">Carrera</label>
              {this.props.oneCarrera ? (
                <Dropdown
                  options={[
                    { label: "Construcción (edificación)", value: 2 },
                    { label: "Construcciones Metálicas", value: 3 },
                    { label: "Electricidad", value: 4 },
                    // Add more options as needed
                  ]}
                  placeholder="Selecciona la Carrera"
                  value={this.state.newUser.carrera}
                  onChange={(e) => {
                    this.setState({
                      newUser: {
                        ...this.state.newUser,
                        carrera: [e.value], // Enviar como un array
                      },
                    });
                  }}
                />
              ) : (
                <MultiSelect
                  display="chip"
                  id="carrera"
                  options={[
                    { label: "Construcción (edificación)", value: 2 },
                    { label: "Construcciones Metálicas", value: 3 },
                    { label: "Electricidad", value: 4 },
                    // Add more options as needed
                  ]}
                  value={this.state.newUser.carrera}
                  onChange={(e) => {
                    this.setState({
                      newUser: {
                        ...this.state.newUser,
                        carrera: e.value,
                      },
                    });
                  }}
                />
              )}
            </div>
            <div className="flex mt-4 w-full gap-2 items-end justify-end ">
              {/* Botón para cancelar la creación del usuario */}
              <Button
                label="Cancelar"
                rounded
                size="small"
                severity="danger"
                onClick={this.hideNewUserDialog}
              />
              {/* Botón para guardar el nuevo usuario */}
              <Button
                label="Guardar"
                onClick={this.saveNewUserToApi}
                rounded
                raised
                size="small"
                severity="success"
              />
            </div>
          </div>
        </Dialog>
      </>
    );
  }
}

export default ProductCrudTable;
