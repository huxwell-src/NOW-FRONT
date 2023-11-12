// Importación de bibliotecas y componentes
import React, { Component } from 'react';
import { Dialog } from 'primereact/dialog'; // Componente de cuadro de diálogo de PrimeReact
import { InputText } from 'primereact/inputtext'; // Componente de entrada de texto de PrimeReact
import { Button } from 'primereact/button'; // Componente de botón de PrimeReact
import axios from 'axios'; // Biblioteca para hacer solicitudes HTTP
import Cookies from 'js-cookie'; // Biblioteca para manejar cookies

class AddUserDialog extends Component {
  // Estado inicial del componente
  state = {
    fields: [
      { "name": "rut", "label": "Rut", "placeholder": "Rut" },
      { "name": "nombre", "label": "Nombre", "placeholder": "Nombre" },
      { "name": "apellido", "label": "Apellido", "placeholder": "Apellido" },
      { "name": "email", "label": "Email", "placeholder": "Email" },
      { "name": "rol", "label": "Rol", "placeholder": "Rol" }
    ],
    userData: {} // Datos del usuario a ser agregado
  };

  // Método para manejar cambios en los campos de entrada
  handleInputChange = (e) => {
    const { name, value } = e.target;
    this.setState(prevState => ({
      userData: {
        ...prevState.userData,
        [name]: value
      }
    }));
  }

  // Método para agregar un usuario
  handleAddUser = () => {
    const { userData } = this.state;
    console.log('JSON de usuario:', userData); // Imprime los datos del usuario en la consola
    this.props.onUserAdded(); // Llama a la función proporcionada cuando se agrega un usuario
    this.props.onHide(); // Oculta el cuadro de diálogo
  }

  render() {
    const { fields } = this.state;
    return (
      <Dialog
        header="Agregar Usuario" // Título del cuadro de diálogo
        visible={this.props.visible} // Propiedad para mostrar u ocultar el cuadro de diálogo
        onHide={this.props.onHide} // Función para manejar el evento de cierre del cuadro de diálogo
      >
        <div className="p-fluid">
          {fields.map(field => (
            <div key={field.name} className="flex flex-col mb-2">
              <label htmlFor={field.name}>{field.label}</label>
              {/* Campo de entrada de texto */}
              <InputText
                id={field.name}
                placeholder={field.placeholder}
                className="input"
                name={field.name}
                value={this.state.userData[field.name] || ''}
                onChange={this.handleInputChange}
              />
            </div>
          ))}
          <div className="flex w-full justify-end duration-200">
            {/* Botón para agregar un usuario */}
            <Button 
                label="Agregar"  
                onClick={this.handleAddUser} 
                severity="success"
                className="duration-[2000ms] bg-emerald-500 w-28 mt-8 text-white px-4 py-2 hover-bg-blue-600 active:outline-none rounded-full hover:scale-105 active:scale-100 hover:drop-shadow-md active:drop-shadow-none drop-shadow-sm"
            />
          </div>
        </div>
      </Dialog>
    );
  }
}

// Exportación del componente para su uso en otras partes de la aplicación
export default AddUserDialog;
