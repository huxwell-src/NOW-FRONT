import React, { Component } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';

class UserCrudTable extends Component {
  state = {
    users: [],
  };

  componentDidMount() {
    const token = Cookies.get('token');
    const config = {
      headers: {
        Authorization: `Token ${token}`,
      },
    };

    axios.get('http://127.0.0.1:8000/api/users', config)
      .then(response => {
        // Filtrar usuarios por rol deseado
        const filteredUsers = this.props.desiredRole
          ? response.data.filter(user => user.rol === this.props.desiredRole)
          : response.data;
        this.setState({ users: filteredUsers });
      })
      .catch(error => {
        console.error('Error fetching users:', error);
      });
  }

  handleDeleteUser = (userId) => {
    const token = Cookies.get('token');
    const config = {
      headers: {
        Authorization: `Token ${token}`,
      },
    };

    axios.delete(`http://127.0.0.1:8000/users/${userId}`, config)
      .then(() => {
        this.fetchUsers(); // Recargar la lista de usuarios después de eliminar uno
      })
      .catch(error => {
        console.error('Error deleting user:', error);
      });
  }

  handleGlobalFilter = (event) => {
    this.setState({ globalFilter: event.target.value }); // Manejar el cambio en la cadena de búsqueda global
  }

  handleClearGlobalFilter = () => {
    this.setState({ globalFilter: '' });
  }

  render() {

    const header = (
      <div className="flex flex-wrap gap-2 align-items-center justify-between">
        <h4 className=" text-2xl text-gray-900 font-bold ">Gestion de {this.props.title}</h4>
        <span className="p-input-icon-left flex justify-between">
          <i className="pi pi-search" />
          <InputText
            type="search"
            className="appearance-none bg-gray-50 border rounded-md py-2 w-full focus:outline-none focus:ring focus:border-sky-500 px-10 "
            value={this.state.globalFilter} // Bind el valor de la cadena de búsqueda global al estado
            onInput={this.handleGlobalFilter} // Maneja el cambio en la cadena de búsqueda global
            placeholder="Buscar..."
          />
        </span>
      </div>
    )

    const actions = (
      <button
        onClick={() => this.handleDeleteUser(user.id)}
        className="bg-red-500 text-white px-2 py-1 rounded-md"
      >
        Delete
      </button>
    );

    return (
      <>
        <DataTable header={header} removableSort value={this.state.users} tableStyle={{ minWidth: '50rem' }} paginator rows={25} rowsPerPageOptions={[25, 50, 100, 200]}>
          <Column sortable field="rut" header="Rut"></Column>
          <Column sortable field="nombre" header="Nombre"></Column>
          <Column sortable field="email" header="Email"></Column>
          <Column body={actions}></Column>
        </DataTable>
      </>
    );
  }
}

export default UserCrudTable;