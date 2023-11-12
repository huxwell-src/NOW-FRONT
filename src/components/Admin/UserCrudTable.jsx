// Importación de bibliotecas y componentes
import React, { Component } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';

class UserCrudTable extends Component {
  constructor(props) {
    super(props);
    // Estado local del componente
    this.state = {
      users: [], // Lista de usuarios
      globalFilter: '', // Filtro global de búsqueda
      deleteUserDialogVisible: false, // Visibilidad del diálogo de eliminación
      userToDeleteId: null, // ID del usuario a eliminar
      userRole: props.userRole, // Rol de usuario (propiedad)
      editUserDialogVisible: false, // Visibilidad del diálogo de edición
      userToEdit: null, // Datos del usuario que se está editando
    };
  }

  // Método que se ejecuta al cargar el componente
  componentDidMount() {
    this.fetchUsers();
  }

  // Método para obtener los usuarios
  fetchUsers() {
    const token = Cookies.get('token');
    const config = {
      headers: {
        Authorization: `Token ${token}`,
      },
    };

    // Llamada a la API para obtener la lista de usuarios
    axios.get('http://127.0.0.1:8000/api/create', config)
      .then(response => {
        let filteredUsers = response.data;

        // Filtrar usuarios por rol si se proporciona el rol en userRole
        if (this.state.userRole) {
          filteredUsers = response.data.filter(user => user.rol === this.state.userRole);
        }

        // Actualizar el estado local con los usuarios filtrados
        this.setState({ users: filteredUsers });
      })
      .catch(error => {
        console.error('Error fetching users:', error);
      });
  }

  // Mostrar el diálogo de eliminación de usuario
  showDeleteUserDialog = (id_user) => {
    this.setState({
      deleteUserDialogVisible: true,
      userToDeleteId: id_user,
    });
  }

  // Ocultar el diálogo de eliminación de usuario
  hideDeleteUserDialog = () => {
    this.setState({
      deleteUserDialogVisible: false,
      userToDeleteId: null,
    });
  }

  // Manejar la eliminación de un usuario
  handleDeleteUser = (id_user) => {
    this.showDeleteUserDialog(id_user);
  }

  // Confirmar la eliminación de un usuario
  handleDeleteUserConfirmed = (id_user) => {
    const token = Cookies.get('token');
    const config = {
      headers: {
        Authorization: `Token ${token}`,
      },
    };

    // Llamada a la API para eliminar un usuario
    axios.delete(`http://127.0.0.1:8000/api/delete/${id_user}`, config)
      .then(() => {
        // Actualizar la lista de usuarios después de la eliminación
        this.fetchUsers();
        this.hideDeleteUserDialog();
      })
      .catch(error => {
        console.error('Error deleting user:', error);
        this.hideDeleteUserDialog();
      });
  }

  // Mostrar el dialogo de la edicion de un usuario
  showEditUserDialog = (user) => {
  this.setState({
    editUserDialogVisible: true,
    userToEdit: user,
  });
};


  // Ocultar el dialogo de la edicion de un usuario
  hideEditUserDialog = () => {
    this.setState({
      editUserDialogVisible: false,
      userToEdit: null,
    });
  };

  // Manejar el filtro global de búsqueda
  handleGlobalFilter = (event) => {
    this.setState({ globalFilter: event.target.value });
  }

  // Limpiar el filtro global de búsqueda
  handleClearGlobalFilter = () => {
    this.setState({ globalFilter: '' });
  }

  // Método para guardar los cambios en la API
  saveChangesToApi = () => {
    const { userToEdit } = this.state;

    // Comprueba que haya un usuario para editar
    if (!userToEdit) {
      console.error('No se ha especificado un usuario para editar.');
      return;
    }

    const token = Cookies.get('token');
    const config = {
      headers: {
        Authorization: `Token ${token}`,
      },
    };

    // Enviar una solicitud PUT para actualizar el usuario
    axios.put(`http://127.0.0.1:8000/api/edit/${userToEdit.id}`, userToEdit, config)
      .then(() => {
        // Actualizar la lista de usuarios después de guardar los cambios
        this.fetchUsers();
        this.hideEditUserDialog();
      })
      .catch(error => {
        console.error('Error al guardar los cambios del usuario:', error);
        this.hideEditUserDialog();
      });
  }


  // Método de renderizado
  render() {
    const header = (
      <div className="flex gap-2 w-ful align-items-center justify-between">
        <span className="p-input-icon-left flex justify-between w-full">
          <i className="pi pi-search" />
          <InputText
            type="search"
            className=" w-full "
            value={this.state.globalFilter}
            onInput={this.handleGlobalFilter}
            placeholder="Buscar..."
          />
        </span>
        <Button
          label='Agregar'
          severity="success"
          size='small'
          raised
          icon="pi pi-user-plus"
        />
      </div>
    );

    // Función para definir las acciones en la tabla
    const actions = (user) => (
      <>
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
          className='mx-2'
          onClick={() => this.handleDeleteUser(user.id_user)} />
      </>
    );

    const scrollHeight = "calc(100vh - 330px)";

    return (
      <>
        <div className='h-1/4'>
          {/* Tabla de datos */}
          <DataTable header={header} scrollable scrollHeight={scrollHeight} className='100%' removableSort value={this.state.users} tableStyle={{ minWidth: '50rem' }} paginator rows={25} rowsPerPageOptions={[25, 50, 100, 200]}>
            <Column sortable field="rut" header="Rut"></Column>
            <Column sortable field="nombre" header="Nombre"></Column>
            <Column sortable field="apellido" header="Apellido"></Column>
            <Column sortable field="email" header="Email"></Column>
            <Column sortable field="curso" header="Curso"></Column>
            <Column sortable field="carrera" header="Carrera"></Column>
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
                label='Cancelar'
                severity="danger"
                rounded
                raised
                size="small"
              />
              {/* Botón para confirmar la eliminación del usuario */}
              <Button
                onClick={() => this.handleDeleteUserConfirmed(this.state.userToDeleteId)}
                label='Confirmar'
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
          modal
        >
          {this.state.userToEdit && (
            <div className="p-grid p-fluid">
              <div className="p-col-12">
                <label htmlFor="rut">Rut</label>
                <InputText
                  id="rut"
                  value={this.state.userToEdit.rut}
                  onChange={(e) => {
                    const updatedUser = { ...this.state.userToEdit, rut: e.target.value };
                    this.setState({ userToEdit: updatedUser });
                  }}
                />
              </div>
              <div className="p-col-12">
                <label htmlFor="nombre">Nombre</label>
                <InputText
                  id="nombre"
                  value={this.state.userToEdit.nombre}
                  onChange={(e) => {
                    const updatedUser = { ...this.state.userToEdit, nombre: e.target.value };
                    this.setState({ userToEdit: updatedUser });
                  }}
                />
              </div>
              <div className="p-col-12">
                <label htmlFor="apellido">Apellido</label>
                <InputText
                  id="apellido"
                  value={this.state.userToEdit.apellido}
                  onChange={(e) => {
                    const updatedUser = { ...this.state.userToEdit, apellido: e.target.value };
                    this.setState({ userToEdit: updatedUser });
                  }}
                />
              </div>
              <div className="p-col-12">
                <label htmlFor="email">Email</label>
                <InputText
                  id="email"
                  value={this.state.userToEdit.email}
                  onChange={(e) => {
                    const updatedUser = { ...this.state.userToEdit, email: e.target.value };
                    this.setState({ userToEdit: updatedUser });
                  }}
                />
              </div>
              <div className="p-col-12">
                <label htmlFor="curso">Curso</label>
                <InputText
                  id="curso"
                  value={this.state.userToEdit.curso}
                  onChange={(e) => {
                    const updatedUser = { ...this.state.userToEdit, curso: e.target.value };
                    this.setState({ userToEdit: updatedUser });
                  }}
                />
              </div>
              <div className="p-col-12">
                <label htmlFor="carrera">Carrera</label>
                <InputText
                  id="carrera"
                  value={this.state.userToEdit.carrera}
                  onChange={(e) => {
                    const updatedUser = { ...this.state.userToEdit, carrera: e.target.value };
                    this.setState({ userToEdit: updatedUser });
                  }}
                />
              </div>
              <div className="p-col-12">
                {/* Botón para guardar los cambios */}
                <Button
                  label="Guardar"
                  onClick={this.saveChangesToApi}
                  className="p-button-success"
                />
                {/* Botón para cancelar la edición */}
                <Button
                  label="Cancelar"
                  onClick={this.hideEditUserDialog}
                  className="p-button-secondary"
                />
              </div>
            </div>
          )}
        </Dialog>

      </>
    );
  }
}

export default UserCrudTable;
