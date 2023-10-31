import React, { Component } from 'react';

class UserProfile extends Component {
  render() {
    const { user } = this.props; // Asegúrate de pasar los datos del usuario como una prop

    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <div className="text-center">
            <h2 className="text-2xl font-semibold mb-4">Perfil de Usuario</h2>
            {user && (
              <div>
                <p className="text-xl">Nombre: {user.name}</p>
                <p className="text-xl">Email: {user.email}</p>
                <p className="text-xl">Rol: {user.rol}</p>
                {/* Agrega más detalles del usuario según tus necesidades */}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
}

export default UserProfile;
