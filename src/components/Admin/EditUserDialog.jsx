import React, { Component } from 'react';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import axios from 'axios';
import Cookies from 'js-cookie';

class EditUserDialog extends Component {
  state = {
    ...this.props.user,
  };

  handleInputChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  }

  handleEditUser = () => {
    const { id, rut, nombre, apellido, email, rol } = this.state;
    const token = Cookies.get('token');
    const config = {
      headers: {
        Authorization: `Token ${token}`,
      },
    };

    axios.put(`http://127.0.0.1:8000/api/edit/${id}`, { rut, nombre, apellido, email, rol }, config)
      .then(() => {
        this.props.onUserUpdated();
        this.props.onHide();
      })
      .catch(error => {
        console.error('Error editing user:', error);
      });
  }

  render() {
    return (
      <Dialog
        header="Editar Usuario"
        visible={this.props.visible}
        onHide={this.props.onHide}
      >
        <div className="p-fluid">
          <div className="p-field">
            <label htmlFor="rut">Rut</label>
            <InputText id="rut" name="rut" value={this.state.rut} onChange={this.handleInputChange} />
          </div>
          <div className="p-field">
            <label htmlFor="nombre">Nombre</label>
            <InputText id="nombre" name="nombre" value={this.state.nombre} onChange={this.handleInputChange} />
          </div>
          <div className="p-field">
            <label htmlFor="apellido">Apellido</label>
            <InputText id="apellido" name="apellido" value={this.state.apellido} onChange={this.handleInputChange} />
          </div>
          <div className="p-field">
            <label htmlFor="email">Email</label>
            <InputText id="email" name="email" value={this.state.email} onChange={this.handleInputChange} />
          </div>
          <div className="p-field">
            <label htmlFor="rol">Rol</label>
            <InputText id="rol" name="rol" value={this.state.rol} onChange={this.handleInputChange} />
          </div>
          <div className="p-mt-2">
            <Button label="Guardar" onClick={this.handleEditUser} />
          </div>
        </div>
      </Dialog>
    );
  }
}

export default EditUserDialog;
