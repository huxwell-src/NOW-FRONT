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
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

class UserCrudTable extends Component {
  constructor(props) {
    super(props);
    // Estado local del componente
    this.state = {
      users: [], // Lista de usuarios
      oneCarrera: props.oneCarrera || false,
      globalFilter: "", // Filtro global de búsqueda
      deleteUserDialogVisible: false, // Visibilidad del diálogo de eliminación
      userToDeleteId: null, // ID del usuario a eliminar
      userRole: props.userRole, // Rol de usuario (propiedad)
      editUserDialogVisible: false, // Visibilidad del diálogo de edición
      userToEdit: null, // Datos del usuario que se está editando

      // Estados para el toast
      showToast: false,
      toastSeverity: "",
      toastSummary: "",
      toastDetail: "",
      newUserDialogVisible: false, // Visibilidad del diálogo de creación de usuario
      newUser: {
        rut: "",
        nombre: "",
        apellido: "",
        email: "",
        curso: "",
        carrera: [], // Cambiado a un array
        solicitudes: [], // Nuevo campo array vacío
      },
    };
    this.toast = React.createRef(); // Referencia al componente Toast
  }

  // Método que se ejecuta al cargar el componente
  componentDidMount() {
    this.fetchUsers();
  }

  // Método para obtener los usuarios
  fetchUsers() {
    const token = Cookies.get("token");
    const config = {
      headers: {
        Authorization: `Token ${token}`,
      },
    };

    // Llamada a la API para obtener la lista de usuarios
    axios
      .get("http://127.0.0.1:8000/api/create", config)
      .then((response) => {
        let filteredUsers = response.data;

        // Filtrar usuarios por rol si se proporciona el rol en userRole
        if (this.state.userRole) {
          filteredUsers = response.data.filter(
            (user) => user.rol === this.state.userRole
          );
        }

        // Actualizar el estado local con los usuarios filtrados
        this.setState({ users: filteredUsers });
      })
      .catch((error) => {
        console.error("Error fetching users:", error);
      });
  }

  // Mostrar el diálogo de eliminación de usuario
  showDeleteUserDialog = (id_user) => {
    this.setState({
      deleteUserDialogVisible: true,
      userToDeleteId: id_user,
    });
  };

  // Ocultar el diálogo de eliminación de usuario
  hideDeleteUserDialog = () => {
    this.setState({
      deleteUserDialogVisible: false,
      userToDeleteId: null,
    });
  };

  showEditUserDialog = (user) => {
    this.setState({
      editUserDialogVisible: true,
      userToEdit: user,
    });
  };

  hideEditUserDialog = () => {
    this.setState({
      editUserDialogVisible: false,
      userToEdit: null,
    });
  };

  // Guardar el usuario editado
  saveChangesToApi = () => {
    const { userToEdit } = this.state;

    if (!userToEdit) {
      console.error("No se ha especificado un usuario para editar.");
      return;
    }

    const token = Cookies.get("token");
    const config = {
      headers: {
        Authorization: `Token ${token}`,
      },
    };

    let carreraValue;

    if (this.props.oneCarrera) {
      // Si es un multiselect, el valor debería ser un array
      carreraValue = [userToEdit.carrera];
    } else {
      // Si es un dropdown, el valor es el propio valor del campo "carrera"
      carreraValue = userToEdit.carrera;
    }

    const updatedUser = {
      ...userToEdit,
      carrera: carreraValue,
    };

    axios
      .put(
        `http://127.0.0.1:8000/api/edit/${updatedUser.id_user}`,
        updatedUser,
        config
      )
      .then(() => {
        this.toast.current.show({
          severity: "success",
          summary: "Edicion",
          detail: "El usuario ha sido editado exitosamente",
          life: 3000,
        });
        this.fetchUsers();
        this.hideEditUserDialog();
      })
      .catch((error) => {
        console.error("Error al guardar los cambios del usuario:", error);

        // Mostrar detalles específicos del error en la consola
        if (error.response) {
          console.log("Respuesta del servidor:", error.response.data);
          console.log("Estado HTTP:", error.response.status);
          console.log("Cabeceras de respuesta:", error.response.headers);
        } else if (error.request) {
          console.log("La solicitud fue hecha pero no se recibió respuesta");
        } else {
          console.log("Error al configurar la solicitud", error.message);
        }

        this.hideEditUserDialog();
      });
  };

  // Manejar la eliminación de un usuario
  handleDeleteUser = (id_user) => {
    this.showDeleteUserDialog(id_user);
  };

  // Confirmar la eliminación de un usuario
  handleDeleteUserConfirmed = (id_user) => {
    const token = Cookies.get("token");
    const config = {
      headers: {
        Authorization: `Token ${token}`,
      },
    };

    // Llamada a la API para eliminar un usuario
    axios
      .delete(`http://127.0.0.1:8000/api/delete/${id_user}`, config)
      .then(() => {
        // Actualizar la lista de usuarios después de la eliminación
        this.fetchUsers();
        this.hideDeleteUserDialog();

        this.toast.current.show({
          severity: "success",
          summary: "Eliminacion",
          detail: "Usuario eliminado",
          life: 3000,
        });

        // Mostrar el toast de éxito
        this.showToast("success", "Usuario eliminado", "");
      })
      .catch((error) => {
        console.error("Error deleting user:", error);
        this.hideDeleteUserDialog();

        this.toast.current.show({
          severity: "error",
          summary: "error",
          detail: "Error al eliminar usuario",
          life: 3000,
        });
      });
  };

  // Manejar el filtro global de búsqueda
  handleGlobalFilter = (event) => {
    this.setState({ globalFilter: event.target.value });
  };

  // Limpiar el filtro global de búsqueda
  handleClearGlobalFilter = () => {
    this.setState({ globalFilter: "" });
  };

  // Método para mostrar un toast
  showToast = (severity, summary, detail) => {
    this.setState({
      showToast: true,
      toastSeverity: severity,
      toastSummary: summary,
      toastDetail: detail,
    });
  };

  // Mostrar el diálogo de creación de usuario
  showNewUserDialog = () => {
    this.setState({
      newUserDialogVisible: true,
    });
  };

  // Ocultar el diálogo de creación de usuario
  hideNewUserDialog = () => {
    this.setState({
      newUserDialogVisible: false,
      newUser: {
        rut: "",
        nombre: "",
        apellido: "",
        email: "",
        curso: "",
        carrera: [], // Reiniciar a un array vacío
        solicitudes: [], // Reiniciar a un array vacío
      },
    });
  };

  // Guardar el nuevo usuario
  saveNewUserToApi = () => {
    const { newUser } = this.state;

    // Validar que todos los campos necesarios estén llenos
    if (
      !newUser.rut ||
      !newUser.nombre ||
      !newUser.apellido ||
      !newUser.email ||
      !newUser.curso ||
      newUser.carrera.length === 0
    ) {
      console.error("Por favor, complete todos los campos.");
      return;
    }

    const token = Cookies.get("token");
    const config = {
      headers: {
        Authorization: `Token ${token}`,
      },
    };

    // Generar la contraseña con la lógica dada
    const password = newUser.apellido.charAt(0).toUpperCase() + newUser.rut;

    // Agregar el campo 'rol' utilizando la prop 'userRole'
    const newUserWithRole = {
      ...newUser,
      rol: this.props.userRole,
      password: password,
    };

    console.log("JSON a enviar:", JSON.stringify(newUserWithRole));

    axios
      .post("http://127.0.0.1:8000/api/create", newUserWithRole, config)
      .then(() => {
        this.toast.current.show({
          severity: "success",
          summary: "Creación",
          detail: "El usuario ha sido creado exitosamente",
          life: 3000,
        });
        this.fetchUsers();
        this.hideNewUserDialog();
      })
      .catch((error) => {
        console.error("Error al crear el usuario:", error);
        this.hideNewUserDialog();
      });
  };

  exportCSV = (selectionOnly) => {
    this.dt.exportCSV({ selectionOnly });
  };

  exportExcel = () => {
    import("xlsx").then((xlsx) => {
      const worksheet = xlsx.utils.json_to_sheet(this.state.users);
      const workbook = { Sheets: { data: worksheet }, SheetNames: ["data"] };
      const excelBuffer = xlsx.write(workbook, {
        bookType: "xlsx",
        type: "array",
      });

      saveAs(
        new Blob([excelBuffer], { type: "application/octet-stream" }),
        "users.xlsx"
      );
    });
  };

  exportPDF = () => {
    import("jspdf").then((jsPDF) => {
      import("jspdf-autotable").then(() => {
        const doc = new jsPDF.default(0, 0);
        doc.autoTable(this.exportColumns, this.state.users);
        doc.save("users.pdf");
      });
    });
  };

  // Método de renderizado
  render() {
    const header = (
      <div className="flex gap-2 w-full align-items-center justify-between export-buttons">
        <Button
          label="Agregar"
          severity="success"
          size="small"
          raised
          rounded
          icon="pi pi-user-plus"
          onClick={this.showNewUserDialog}
        />
        {/* Botones de exportación */}
        <div>
          <Button
            type="button"
            icon="pi pi-file"
            rounded
            onClick={() => this.exportCSV(false)}
            data-pr-tooltip="CSV"
          />
          <Button
            type="button"
            icon="pi pi-file-excel"
            severity="success"
            rounded
            onClick={this.exportExcel}
            data-pr-tooltip="XLS"
          />
          <Button
            type="button"
            icon="pi pi-file-pdf"
            severity="warning"
            rounded
            onClick={this.exportPDF}
            data-pr-tooltip="PDF"
          />
        </div>
      </div>
    );

    // Función para definir las acciones en la tabla
    const actions = (user) => (
      <>
        <div className="flex">
          <Button
            icon="pi pi-pencil"
            rounded
            outlined
            severity="primary"
            aria-label="Editar Usuario"
            onClick={() => this.showEditUserDialog(user)}
          />
          <Button
            icon="pi pi-trash "
            rounded
            outlined
            severity="danger"
            aria-label="User"
            className="mx-2"
            onClick={() => this.handleDeleteUser(user.id_user)}
          />
        </div>
      </>
    );

    const scrollHeight = "calc(100vh - 330px)";

    return (
      <>
        <Toast ref={this.toast} />
        <div className="h-1/4">
          {/* Tabla de datos */}
          <DataTable
            header={header}
            scrollable
            scrollHeight={scrollHeight}
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

export default UserCrudTable;
