import { useState, useEffect, useRef } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { Dialog } from "primereact/dialog";
import Header from "../UI/Header";
import Table from "../UI/Table";
import Button from "../UI/Button";
import {
  faFile,
  faFolderOpen,
  faPen,
  faPlus,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";

const UserCrudTable = (props) => {
  const [users, setUsers] = useState([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [deleteUserDialogVisible, setDeleteUserDialogVisible] = useState(false);
  const [userToDeleteId, setUserToDeleteId] = useState(null);
  const [selectedUserSolicitudes, setSelectedUserSolicitudes] = useState([]);
  const [solicitudesDialogVisible, setSolicitudesDialogVisible] =
    useState(false);

  const [newUserDialogVisible, setNewUserDialogVisible] = useState(false);
  const [newUser, setNewUser] = useState({
    rut: "",
    nombre: "",
    apellido: "",
    email: "",
    curso: "",
    carrera: [],
    solicitudes: [],
  });

  const toastRef = useRef(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = () => {
    const token = Cookies.get("token");
    const config = {
      headers: {
        Authorization: `Token ${token}`,
      },
    };

    axios
      .get("http://127.0.0.1:8000/api/create", config)
      .then((response) => {
        let filteredUsers = response.data;

        if (props.userRole) {
          filteredUsers = response.data.filter(
            (user) => user.rol === props.userRole
          );
        }

        setUsers(filteredUsers);
      })
      .catch((error) => {
        console.error("Error fetching users:", error);
      });
  };

  const handleDeleteUser = (id_user) => {
    setDeleteUserDialogVisible(true);
    setUserToDeleteId(id_user);
  };

  const handleDeleteUserConfirmed = (id_user) => {
    const token = Cookies.get("token");
    const config = {
      headers: {
        Authorization: `Token ${token}`,
      },
    };

    axios
      .delete(`http://127.0.0.1:8000/api/delete/${id_user}`, config)
      .then(() => {
        fetchUsers();
        hideDeleteUserDialog();

        toastRef.current.show({
          severity: "success",
          summary: "Eliminacion",
          detail: "Usuario eliminado",
          life: 3000,
        });
      })
      .catch((error) => {
        console.error("Error deleting user:", error);
        hideDeleteUserDialog();

        toastRef.current.show({
          severity: "error",
          summary: "error",
          detail: "Error al eliminar usuario",
          life: 3000,
        });
      });
  };

  const handleGlobalFilter = (event) => {
    setGlobalFilter(event.target.value);
  };

  const handleClearGlobalFilter = () => {
    setGlobalFilter("");
  };

  const showNewUserDialog = () => {
    setNewUserDialogVisible(true);
  };

  const hideNewUserDialog = () => {
    setNewUserDialogVisible(false);
    setNewUser({
      rut: "",
      nombre: "",
      apellido: "",
      email: "",
      curso: "",
      carrera: [],
      solicitudes: [],
    });
  };

  const saveNewUserToApi = () => {
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

    const password = newUser.apellido.charAt(0).toUpperCase() + newUser.rut;

    const newUserWithRole = {
      ...newUser,
      rol: props.userRole,
      password: password,
    };

    axios
      .post("http://127.0.0.1:8000/api/create", newUserWithRole, config)
      .then(() => {
        toastRef.current.show({
          severity: "success",
          summary: "Creación",
          detail: "El usuario ha sido creado exitosamente",
          life: 3000,
        });
        fetchUsers();
        hideNewUserDialog();
      })
      .catch((error) => {
        console.error("Error al crear el usuario:", error);
        hideNewUserDialog();
      });
  };

  const fetchUserSolicitudes = (userId) => {
    const token = Cookies.get("token");
    const config = {
      headers: {
        Authorization: `Token ${token}`,
      },
    };

    return axios
      .get(`http://127.0.0.1:8000/api/solicitudes?user_id=${userId}`, config)
      .then((response) => {
        return response.data;
      })
      .catch((error) => {
        console.error("Error fetching user solicitudes:", error);
        return [];
      });
  };

  const handleViewSolicitudes = (userId) => {
    fetchUserSolicitudes(userId)
      .then((solicitudes) => {
        // Filtrar las solicitudes por el ID del usuario
        const userSolicitudes = solicitudes.filter(
          (solicitud) => solicitud.usuario.id_user === userId
        );
        setSelectedUserSolicitudes(userSolicitudes);
        setSolicitudesDialogVisible(true);
      })
      .catch((error) => {
        console.error("Error handling view solicitudes:", error);
      });
  };

  const actions = (rowData) => {
    return (
      <div className="flex">
        <Button
          icon={faPen}
          color="text"
          className=" h-10 w-10 flex items-center justify-center"
          onClick={() => handleEditUser(rowData)}
        />
        <Button
          icon={faTrash}
          color="text"
          className=" h-10 w-10 flex items-center justify-center"
          onClick={() => handleDeleteUser(rowData.id)}
        />
        <Button
          icon={faFolderOpen}
          color="text"
          className=" h-10 w-10 flex items-center justify-center"
          onClick={() => handleViewSolicitudes(rowData.id_user)}
        />
      </div>
    );
  };

  const columns = [
    {
      name: "Rut",
      content: (rowData) => rowData.rut,
    },
    {
      name: "Nombre",
      content: (rowData) => rowData.nombre,
    },
    {
      name: "Apellido",
      content: (rowData) => rowData.apellido,
    },
    {
      name: "Email",
      content: (rowData) => rowData.email,
    },
    {
      name: "Curso",
      content: (rowData) => rowData.curso,
    },
    {
      name: "Carrera",
      content: (rowData) => rowData.carrera,
    },
    {
      name: "Acciones",
      content: (rowData) => actions(rowData),
    },
  ];

  return (
    <>
      <Header
        title="Solictudes Pendientes"
        subtitle="Solicitudes de productos pendientes de ser entregados"
        imageUrl="https://modernize-react.adminmart.com/assets/ChatBc-d3c45db6.png"
      />

      <div className="m-4">
        <div className="bg-white border flex-col sm:flex-row border-gray-200 rounded-lg my-2 flex justify-between">
          <input
            id="searchInput"
            type="text"
            placeholder="Buscar alumno..."
            className="sm:w-[75%] border rounded-lg px-4 m-2 py-2 duration-150 focus:outline-none focus:ring-4 focus:border-sky-700"
          />
          <div className="flex items-center justify-end">
            <Button
              label="Exportar"
              className="flex items-center m-2"
              icon={faFile}
              iconClassName="mr-2 text-lg"
              size="sm"
            />
            <Button
              label="Agregar"
              className="flex items-center m-2"
              icon={faPlus}
              iconClassName="mr-2 text-lg"
              size="sm"
            />
          </div>
        </div>
        <Table
          columns={columns}
          data={users}
          paginator
          onRowSelect={(selectedRows) => console.log(selectedRows)}
        />
      </div>
      {/* Diálogo para eliminar usuario */}
      <Dialog
        visible={deleteUserDialogVisible}
        onHide={() => setSolicitudesDialogVisible(false)}
        header="Confirmar Eliminación"
        modal
        footer={
          <div>
            <Button
              onClick={() => setDeleteUserDialogVisible(false)}
              label="Cancelar"
              size="small"
            />
            <Button
              onClick={() => handleDeleteUserConfirmed(userToDeleteId)}
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

      {/* Diálogo para mostrar las solicitudes del usuario */}
      <Dialog
        visible={solicitudesDialogVisible}
        onHide={() => setSolicitudesDialogVisible(false)}
        header="Solicitudes del Usuario"
        breakpoints={{ "1400px": "100vw" }}
        style={{ width: "65vw" }}
        modal
      >
        <Table
          columns={[
            {
              name: "ID Solicitud",
              content: (rowData) => rowData.id_solicitud,
            },
            {
              name: "Fecha de Creación",
              content: (rowData) => rowData.fecha_creacion,
            },
            {
              name: "Fecha de Entrega",
              content: (rowData) => rowData.fecha_entrega,
            },
            {
              name: "Fecha de Devolución",
              content: (rowData) => rowData.fecha_devolucion,
            },
            { name: "Estado", content: (rowData) => rowData.estado },
            { name: "Aprobación", content: (rowData) => rowData.aprobacion },
            {
              name: "Nombre del Profesor",
              content: (rowData) => rowData.profesor.nombre,
            },
          ]}
          data={selectedUserSolicitudes}
        />
      </Dialog>
    </>
  );
};

export default UserCrudTable;
