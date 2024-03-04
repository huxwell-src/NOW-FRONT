import { useState, useEffect } from "react";
import { Dialog } from "primereact/dialog";
import { validate, clean, format } from "rut.js";
import axios from "axios";
import { toast } from "react-hot-toast";
import Button from "../UI/Button";
import Cookies from "js-cookie";

const EditUserDialog = ({ visible, onClose, user }) => {
  const [fields] = useState([
    { name: "rut", label: "Rut", placeholder: "Rut" },
    { name: "nombre", label: "Nombre", placeholder: "Nombre" },
    { name: "apellido", label: "Apellido", placeholder: "Apellido" },
    { name: "email", label: "Email", placeholder: "Email" },
  ]);
  const [editedUserData, setEditedUserData] = useState({ ...user });
  const [rutError, setRutError] = useState(false);

  useEffect(() => {
    // Actualiza el estado al recibir un nuevo usuario
    setEditedUserData({ ...user });
    setRutError(false); // Reinicia el estado de error de RUT
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    let formattedValue = value;

    if (name === "rut") {
      formattedValue = format(clean(value));
      setRutError(!validate(clean(value)));
    }

    setEditedUserData((prevData) => ({
      ...prevData,
      [name]: formattedValue,
    }));
  };

  const handleClose = () => {
    setEditedUserData({ ...user }); // Revierte los cambios si se cancela
    onClose();
  };

  const handleEditUser = () => {
    const token = Cookies.get("token");
    const config = {
      headers: {
        Authorization: `Token ${token}`,
      },
    };

    if (!rutError) {
      const updatedUserData = { ...editedUserData };

      axios
        .put(`http://127.0.0.1:8000/api/edit/${user.id_user}`, updatedUserData, config)
        .then(() => {
          toast.success("Usuario actualizado exitosamente");
          onClose();
        })
        .catch((error) => {
          console.error("Error updating user:", error);
          toast.error("Error al actualizar usuario");
        });
    }
    
  };

  return (
    <Dialog
      header="Editar Usuario"
      visible={visible}
      onHide={handleClose}
      footer={
        <div>
          <Button
            onClick={handleClose}
            label="Cancelar"
            color="danger"
            size="sm"
          />
          <Button onClick={handleEditUser} label="Guardar" size="sm" />
        </div>
      }
    >
      <div className="p-fluid">
        {fields.map((field) => (
          <div key={field.name} className="flex flex-col mb-2">
            <label htmlFor={field.name}>{field.label}</label>
            <input
              id={field.name}
              placeholder={field.placeholder}
              className={`input ${
                field.name === "rut" && rutError ? "error" : ""
              }`}
              name={field.name}
              value={editedUserData[field.name] || ""}
              onChange={handleInputChange}
            />
            {field.name === "rut" && rutError && (
              <small className="text-red-500">RUT inválido</small>
            )}
          </div>
        ))}
      </div>
    </Dialog>
  );
};

export default EditUserDialog;
