import { useState } from "react";
import { Dialog } from "primereact/dialog";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import Button from "../UI/Button";
import { Dropdown } from "primereact/dropdown";
import { validate, clean, format } from "rut.js";

const AddUserDialog = () => {
  const [fields] = useState([
    { name: "rut", label: "Rut", placeholder: "Rut" },
    { name: "nombre", label: "Nombre", placeholder: "Nombre" },
    { name: "apellido", label: "Apellido", placeholder: "Apellido" },
    { name: "email", label: "Email", placeholder: "Email" },
  ]);
  const [userData, setUserData] = useState({});
  const [visible, setVisible] = useState(false);
  const [rutError, setRutError] = useState(false); // Estado para el error de RUT
  const [selectedRol, setSelectedRol] = useState(null);
  const rol = [{ rol: "Alumno" }, { rol: "Profesor" }];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    let formattedValue = value;

    // Formatea el valor del campo de RUT antes de establecerlo en el estado
    if (name === "rut") {
      formattedValue = format(clean(value));
      setRutError(!validate(clean(value)));
    }

    setUserData((prevState) => ({
      ...prevState,
      [name]: formattedValue,
    }));
  };

  const openDialog = () => {
    setVisible(true);
  };

  const closeDialog = () => {
    setVisible(false);
    setRutError(false);
    setUserData({}); // Restablece el estado userData a un objeto vacío al cerrar el diálogo
  };

  // Supongamos que tienes una función llamada `Solicitud()` que crea una nueva solicitud
// y toma como argumentos el usuario y el objeto de solicitud
const Solicitud = (usuario, solicitud) => {
  // Código para crear la solicitud
  console.log("Solicitud creada:", solicitud);
};

const handleAddUser = () => {
  // Verifica que todos los campos estén completos y que el RUT sea válido
  const allFieldsFilled = fields.every((field) => userData[field.name]);
  if (allFieldsFilled && !rutError) {
    // Genera la contraseña utilizando la primera letra del apellido en mayúscula y el RUT
    const apellidoInicialMayuscula = userData.apellido.charAt(0).toUpperCase();
    const rutSinGuion = userData.rut.replace("-", "");
    const password = apellidoInicialMayuscula + rutSinGuion;
    
    // Crea un nuevo objeto JSON con los datos ingresados, incluyendo la contraseña y el array "solicitudes"
    const newUser = {
      rut: userData.rut,
      nombre: userData.nombre,
      apellido: userData.apellido,
      email: userData.email,
      rol: selectedRol.rol, // Asegúrate de que selectedRol no sea null
      password: password,
      solicitudes: [] // Array vacío de solicitudes
    };
    
    // Muestra el JSON del nuevo usuario en la consola
    console.log("JSON de usuario:", newUser);
    
    // Llama a la función para agregar el usuario con el nuevo objeto JSON
    // Supongamos que tienes una función llamada `onUserAdded` que agrega el usuario
    onUserAdded(newUser);

    // También crea una solicitud para el nuevo usuario
    const nuevaSolicitud = {
      // Datos de la solicitud, por ejemplo:
      motivo: "Nuevo usuario registrado",
      usuario: newUser.rut // Puedes usar el RUT del usuario como referencia en la solicitud
    };
    
    // Llama a la función para crear la solicitud
    Solicitud(newUser, nuevaSolicitud);
    
    // Cierra el diálogo después de agregar el usuario
    closeDialog();
  }
};


  return (
    <>
      <Button
        label="Agregar"
        className="flex items-center m-2"
        icon={faPlus}
        iconClassName="mr-2 text-lg"
        size="sm"
        onClick={openDialog}
      />
      <Dialog header="Agregar Usuario" visible={visible} onHide={closeDialog}>
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
                value={userData[field.name] || ""}
                onChange={handleInputChange}
              />
              {field.name === "rut" && rutError && (
                <small className="text-red-500">RUT inválido</small>
              )}
            </div>
          ))}
          <label>Tipo</label>
          <Dropdown
            value={selectedRol}
            onChange={(e) => setSelectedRol(e.value)}
            options={rol}
            optionLabel="rol"
            placeholder="Seleccionar rol"
            severity="info"
            className="w-full ring-gray-300 ring-1 duration-150 rounded-xl border border-gray-200 p-0 hover:border-primary-500 focus:outline-none focus:ring focus:ring-primary-500/70"
          />
          <div className="flex w-full justify-end duration-200">
            <Button
              label="Agregar"
              onClick={handleAddUser}
              severity="success"
              className="duration-[2000ms] bg-emerald-500 w-28 mt-8 text-white px-4 py-2 hover-bg-blue-600 active:outline-none rounded-full hover:scale-105 active:scale-100 hover:drop-shadow-md active:drop-shadow-none drop-shadow-sm"
            />
          </div>
        </div>
      </Dialog>
    </>
  );
};

export default AddUserDialog;
