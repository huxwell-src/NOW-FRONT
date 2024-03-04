import { useState } from "react";
import { Dialog } from "primereact/dialog";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import Button from "../UI/Button";
import { Dropdown } from "primereact/dropdown";
import { validate, clean, format } from "rut.js";
import axios from "axios";
import { toast, Toaster } from "react-hot-toast";

const AddUserDialog = () => {
  const rol = [{ rol: "Alumno" }, { rol: "Profesor" }];
  const [fields] = useState([
    { name: "rut", label: "Rut", placeholder: "Rut" },
    { name: "nombre", label: "Nombre", placeholder: "Nombre" },
    { name: "apellido", label: "Apellido", placeholder: "Apellido" },
    { name: "email", label: "Email", placeholder: "Email" },
  ]);
  const carrera = [
    { label: "Sin carrera", value: 1 },
    { label: "Construcción (edificación)", value: 2 },
    { label: "Construcciones Metálicas", value: 3 },
    { label: "Electricidad", value: 4 },
  ];
  const [userData, setUserData] = useState({});
  const [visible, setVisible] = useState(false);
  const [rutError, setRutError] = useState(false); // Estado para el error de RUT
  const [selectedRol, setSelectedRol] = useState(null);
  const [selectedCarrera, setSelectedCarrera] = useState(null);
  

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

  const handleAddUser = () => {
    // Verifica que todos los campos estén completos y que el RUT sea válido
    const allFieldsFilled = fields.every((field) => userData[field.name]);
    if (allFieldsFilled && !rutError) {
      // Genera la contraseña utilizando la primera letra del apellido en mayúscula y el RUT
      const apellidoInicialMayuscula = userData.apellido
        .charAt(0)
        .toUpperCase();
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
        solicitudes: [], // Array vacío de solicitudes
      };

      // Muestra el JSON del nuevo usuario en la consola
      console.log("JSON de usuario:", newUser);

      // Realiza la solicitud POST al backend usando Axios
      axios
        .post(`${import.meta.env.VITE_BACKEND_URL_BASE}/create`, newUser)
        .then((response) => {
          console.log("Usuario agregado exitosamente");
          toast.success("Usuario creado");

          // Llama a fetchUsers para actualizar la lista de usuarios
          fetchUsers();
        })
        .catch((error) => {
          console.error("Error al agregar el usuario:", error);
          toast.error("Error al crear usuario");
        });

      // Cierra el diálogo después de agregar el usuario
      closeDialog();
    }
  };

  return (
    <>
      <Toaster />
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
            className="w-full ring-gray-300 ring-1 duration-150 rounded-xl border border-gray-200  hover:border-primary-500 focus:outline-none focus:ring focus:ring-primary-500/70"
          />
          <label>Carrera</label>
          <Dropdown
            value={selectedCarrera}
            onChange={(e) => setSelectedCarrera(e.value)}
            options={carrera}
            optionLabel="label" // Nombre del campo que se mostrará en la lista desplegable
            placeholder="Seleccionar Carrera"
            severity="info"
            className="w-full ring-gray-300 ring-1 duration-150 rounded-xl border border-gray-200  hover:border-primary-500 focus:outline-none focus:ring focus:ring-primary-500/70"
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
