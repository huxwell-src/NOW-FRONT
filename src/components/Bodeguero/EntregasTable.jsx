import { useState, useEffect  } from "react";
import toast, { Toaster } from "react-hot-toast";
import { Dialog } from "primereact/dialog";
import Button from "../UI/Button";
import axios from "axios";
import Table from "../UI/Table";
import Header from "../UI/Header";
import Cookies from "js-cookie";
import { InputTextarea } from "primereact/inputtextarea";
import { faPlus } from "@fortawesome/free-solid-svg-icons";

const EntregaTable = () => {
  const [solicitudes, setSolicitudes] = useState([]);
  const [selectedSolicitud, setSelectedSolicitud] = useState(null);
  const [visible, setVisible] = useState(false);
  const [notaDialogVisible, setNotaDialogVisible] = useState(false);
  const [nota, setNota] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = Cookies.get("token");
        if (!token) {
          console.error("Token no encontrado en las cookies");
          return;
        }
        const config = {
          headers: {
            Authorization: `Token ${token}`,
          },
        };
        const solicitudesResponse = await axios.get(
          "http://127.0.0.1:8000/api/solicitudes",
          config
        );
        const solicitudesAprobadas = solicitudesResponse.data.filter(
          (solicitud) => solicitud.estado === "Listo para retiro"
        );
        setSolicitudes(solicitudesAprobadas);
      } catch (error) {
        console.error("Error al obtener las solicitudes:", error);
      }
    };

    fetchData();
  }, []);

  const formatFecha = (fecha) => {
    const date = new Date(fecha);
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();

    const formattedDay = day < 10 ? `0${day}` : day;
    const formattedMonth = month < 10 ? `0${month}` : month;

    return `${formattedDay}/${formattedMonth}/${year}`;
  };

  const showDetailsDialog = (rowData) => {
    setSelectedSolicitud(rowData);
    setVisible(true);
  };

  const hideDetailsDialog = () => {
    setVisible(false);
  };

  const handleCompletada = async () => {
    try {
      const token = Cookies.get("token");
      const config = {
        headers: {
          Authorization: `Token ${token}`,
        },
      };
      const solicitudData = {
        id_solicitud: selectedSolicitud.id_solicitud,
        usuario: selectedSolicitud.usuario.id_user,
        estado: "Entregado",
        nota: nota,
      };
      const completadaResponse = await axios.put(
        `http://127.0.0.1:8000/api/solicitudes/${solicitudData.id_solicitud}`,
        solicitudData,
        config
      );
      console.log("Solicitud completada:", completadaResponse.data);
      toast.success("Entrega Exitosa")
      const fetchData = async () => {
        try {
          const solicitudesResponse = await axios.get(
            "http://127.0.0.1:8000/api/solicitudes",
            config
          );
          const solicitudesAprobadas = solicitudesResponse.data.filter(
            (solicitud) => solicitud.estado === "Listo para retiro"
          );
          setSolicitudes(solicitudesAprobadas);
        } catch (error) {
          console.error("Error al obtener las solicitudes:", error);
        }
      };
      fetchData();
      hideDetailsDialog();
    } catch (error) {
      console.error("Error al completar la solicitud:", error);
    }
  };

  const showNotaDialog = () => {
    setNotaDialogVisible(true);
  };

  const hideNotaDialog = () => {
    setNotaDialogVisible(false);
  };

  const footerContent = (
    <div>
      <Button
        label="Cerrar"
        color="danger"
        onClick={hideDetailsDialog}
      />
      <Button
        label="Entregado"
        onClick={handleCompletada}
      />
    </div>
  );

  const columns = [
    {
      name: "Alumno",
      key: "usuario",
      content: (rowData) =>
        `${rowData.usuario.nombre} ${rowData.usuario.apellido}`,
    },
    {
      name: "Curso",
      key: "usuario",
      content: (rowData) => rowData.usuario.curso,
    },
    {
      name: "Carrera",
      key: "usuario",
      content: (rowData) =>
        rowData.usuario.carreras.map((carrera) => carrera.nombre),
    },
    {
      name: "Profesor",
      key: "profesor",
      content: (rowData) =>
        `${rowData.profesor.nombre} ${rowData.profesor.apellido}`,
    },
    {
      name: "Acciones",
      key: "acciones",
      content: (rowData) => (
        <Button
          label="Detalles"
          color="text"
          className="text-sky-700 font-semibold"
          onClick={() => showDetailsDialog(rowData)}
        />
      ),
    },
  ];

  const detail = [
    {
      name: "ID",
      key: "id_producto",
      content: (rowData) => rowData.id_producto,
    },
    {
      name: "Producto",
      key: "nombre",
      content: (rowData) => rowData.nombre,
    },
    {
      name: "Cantidad",
      key: "cantidad",
      content: (rowData) => rowData.cantidad,
    },
  ];

  return (
    <>
      <Toaster/>
      <Header
        title="Solictudes Por Entregar"
        subtitle="Solicitudes de productos pendientes de entregar"
        imageUrl="https://modernize-react.adminmart.com/assets/ChatBc-d3c45db6.png"
      />
      <div className="m-4">
        <Table
          columns={columns}
          data={solicitudes}
          emptyMessage="No hay solicitudes disponibles."
        />
      </div>

      <Dialog
        header="Detalles de la solicitud"
        visible={visible}
        onHide={hideDetailsDialog}
        breakpoints={{ "960px": "75vw", "641px": "100vw" }}
        style={{ width: "50vw" }}
        footer={footerContent}
        maximizable
      >
        {selectedSolicitud && (
          <>
            <div className="flex justify-between">
              <div className="my-4">
                <h2 className="text-lg font-semibold">Datos generales: </h2>
                <p className="font-medium text-base">
                  Fecha de creación:
                  <span className="font-normal mx-2">
                    {formatFecha(selectedSolicitud.fecha_creacion)}
                  </span>
                </p>

                <p className="font-medium text-base">
                  Fecha de devolución:
                  <span className="font-normal mx-2">
                    {formatFecha(selectedSolicitud.fecha_entrega)}
                  </span>
                </p>
              </div>
              <div>
                <Button
                  label="Añadir nota"
                  icon={faPlus}
                  iconClassName="ml-2"
                  rounded
                  onClick={showNotaDialog}
                />
              </div>
            </div>
            {selectedSolicitud.productos &&
              selectedSolicitud.productos.length > 0 && (
                <>
                  <h2 className="text-lg font-semibold">Productos:</h2>
                  <Table columns={detail} data={selectedSolicitud.productos} />
                </>
              )}
          </>
        )}
      </Dialog>

      <Dialog
        header="Añadir Nota"
        visible={notaDialogVisible}
        onHide={hideNotaDialog}
        breakpoints={{ "960px": "50vw", "641px": "100vw" }}
        style={{ width: "30vw" }}
      >
        <div className="my-4">
          <h2 className="text-lg font-semibold">Añadir Nota:</h2>
          <InputTextarea
            rows={5}
            className="w-full"
            value={nota}
            onChange={(e) => setNota(e.target.value)}
          />
        </div>
        <div className="flex justify-end gap-2">
          <Button
            label="Cancelar"
            onClick={hideNotaDialog}
          />
          <Button
            label="Guardar"
            onClick={hideNotaDialog}
          />
        </div>
      </Dialog>
    </>
  );
};

export default EntregaTable;
