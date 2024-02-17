import { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { Dialog } from "primereact/dialog";
import Header from "../UI/Header";
import Table from "../UI/Table";
import Button from "../UI/Button";
import AddUserDialog from "./AddUserDialog";
import { toast, Toaster } from "react-hot-toast";
import {
  faFile,
  faFolderOpen,
  faPen,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { IoIosArrowForward, IoIosArrowDown } from "react-icons/io";

const UserCrudTable = (props) => {
  const [users, setUsers] = useState([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [deleteUserDialogVisible, setDeleteUserDialogVisible] = useState(false);
  const [userToDeleteId, setUserToDeleteId] = useState(null);
  const [selectedUserSolicitudes, setSelectedUserSolicitudes] = useState([]);
  const [solicitudesDialogVisible, setSolicitudesDialogVisible] =
    useState(false);
  const [expandedRows, setExpandedRows] = useState([]);

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
        setDeleteUserDialogVisible(false);
        toast.success("Usuario Eliminado");
      })
      .catch((error) => {
        console.error("Error deleting user:", error);
        setDeleteUserDialogVisible(false);
        toast.error("Error al Eliminar");
      });
  };

  const handleGlobalFilter = (event) => {
    setGlobalFilter(event.target.value);
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
        const userSolicitudes = solicitudes.filter(
          (solicitud) =>
            solicitud.usuario.id_user === userId ||
            solicitud.profesor.id_user === userId
        );
        setSelectedUserSolicitudes(userSolicitudes);
        setSolicitudesDialogVisible(true);
      })
      .catch((error) => {
        console.error("Error handling view solicitudes:", error);
      });
  };

  const handleRowToggle = (userId) => {
    if (expandedRows.includes(userId)) {
      setExpandedRows(expandedRows.filter((id) => id !== userId));
    } else {
      setExpandedRows([...expandedRows, userId]);
    }
  };

  const actions = (rowData) => {
    return (
      <div className="flex">
        <Button
          icon={faPen}
          color="text"
          size="sm"
          className=" h-10 w-10 flex items-center justify-center"
          onClick={() => handleEditUser(rowData)}
        />
        <Button
          icon={faTrash}
          color="text"
          size="sm"
          className=" h-10 w-10 flex items-center justify-center"
          onClick={() => handleDeleteUser(rowData.id)}
        />
        <Button
          icon={faFolderOpen}
          color="text"
          size="sm"
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
      name: "Tipo",
      content: (rowData) => rowData.rol,
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
      content: (rowData) => rowData.curso || "-",
    },
    {
      name: "Carrera",
      content: (rowData) =>
        rowData.carrera.length > 0 ? rowData.carrera.join(", ") : "-",
    },
    {
      name: "Acciones",
      content: (rowData) => actions(rowData),
    },
  ];

  const filteredUsers = users.filter(
    (user) =>
      user.nombre.toLowerCase().includes(globalFilter.toLowerCase()) ||
      user.apellido.toLowerCase().includes(globalFilter.toLowerCase()) ||
      user.rut.toLowerCase().includes(globalFilter.toLowerCase())
  );

  return (
    <>
      <Toaster />
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
            className="sm:w-[75%] input m-2 "
            value={globalFilter}
            onChange={handleGlobalFilter}
          />
          <div className="flex items-center justify-end">
            <Button
              label="Exportar"
              className="flex items-center m-2"
              icon={faFile}
              iconClassName="mr-2 text-lg"
              size="sm"
            />
            <AddUserDialog />
          </div>
        </div>
        <Table
          columns={columns}
          data={filteredUsers}
          paginator
          onRowSelect={(selectedRows) => console.log(selectedRows)}
        />
      </div>
      {/* Diálogo para eliminar usuario */}
      <Dialog
        visible={deleteUserDialogVisible}
        onHide={() => setDeleteUserDialogVisible(false)}
        header="Confirmar Eliminación"
        modal
        footer={
          <div>
            <Button
              onClick={() => setDeleteUserDialogVisible(false)}
              label="Cancelar"
              color="danger"
              size="sm"
            />
            <Button
              onClick={() => handleDeleteUserConfirmed(userToDeleteId)}
              label="Confirmar"
              size="sm"
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
        {selectedUserSolicitudes.length === 0 ? (
          <div className="text-center text-gray-500">
            Sin solicitudes del usuario
          </div>
        ) : (
          <Table
            columns={[
              {
                name: "",
                content: (rowData) => (
                  <>
                    <button onClick={() => handleRowToggle(rowData.id_user)}>
                      {expandedRows.includes(rowData.id_user) ? (
                        <button className="p-2 hover:bg-gray-300/70 transition-150  rounded-full ">
                          <IoIosArrowDown />
                        </button>
                      ) : (
                        <button className="p-2 hover:bg-gray-300/70 transition-150  rounded-full ">
                          <IoIosArrowForward />
                        </button>
                      )}
                    </button>
                  </>
                ),
              },
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
                name: "Profesor",
                content: (rowData) => rowData.profesor.nombre,
              },
            ]}
            data={selectedUserSolicitudes}
          />
        )}
      </Dialog>
    </>
  );
};

export default UserCrudTable;
