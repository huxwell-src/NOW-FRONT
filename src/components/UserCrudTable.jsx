import React, { Component } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';

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

  render() {
    return (
      <div>
        <h1 className="text-2xl font-bold mb-4">List of Users</h1>
        <table className="w-full border-collapse border">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-2 border">ID</th>
              <th className="p-2 border">Name</th>
              <th className="p-2 border">Email</th>
              <th className="p-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {this.state.users.map((user) => (
              <tr key={user.rut} className="bg-white">
                <td className="p-2 border">{user.rut}</td>
                <td className="p-2 border">{user.email}</td>
                <td className="p-2 border">{user.rol}</td>
                <td className="p-2 border">
                  <button
                    onClick={() => this.handleDeleteUser(user.id)}
                    className="bg-red-500 text-white px-2 py-1 rounded-md"
                  >
                    Delete
                  </button>
                  {/* Agregar botones para editar y otras acciones */}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    );
  }
}

export default UserCrudTable;
