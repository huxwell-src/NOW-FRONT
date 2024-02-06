import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTimes } from "@fortawesome/free-solid-svg-icons";
import Table from "../UI/Table";
import Button from "../UI/Button";
import axios from "axios";
import Cookies from "js-cookie";
import { InputTextarea } from "primereact/inputtextarea";
import { Dialog } from "primereact/dialog";
import Header from "../UI/Header";
import toast, { Toaster } from "react-hot-toast";

const PreparacionTable = () => {
  const [solicitudes, setSolicitudes] = useState([]);
  const [selectedSolicitud, setSelectedSolicitud] = useState(null);
  const [visible, setVisible] = useState(false);
  const [notaDialogVisible, setNotaDialogVisible] = useState(false);
  const [nota, setNota] = useState("");

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

      const solicitudesEnPreparacion = solicitudesResponse.data.filter(
        (solicitud) => solicitud.estado === "en preparación"
      );

      setSolicitudes(solicitudesEnPreparacion);
    } catch (error) {
      console.error("Error al obtener las solicitudes:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const showDetailsDialog = (rowData) => {
    setSelectedSolicitud(rowData);
    setVisible(true);
  };

  const formatFecha = (fecha) => {
    const date = new Date(fecha);
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();

    const formattedDay = day < 10 ? `0${day}` : day;
    const formattedMonth = month < 10 ? `0${month}` : month;

    return `${formattedDay}/${formattedMonth}/${year}`;
  };

  const hideDetailsDialog = (shouldHide = true) => {
    setVisible(!shouldHide);
    if (shouldHide) {
      fetchData();
    }
  };

  const handleCompletada = async () => {
    try {
      if (!selectedSolicitud) {
        console.error("No hay solicitud seleccionada para completar");
        return;
      }

      const token = Cookies.get("token");

      const config = {
        headers: {
          Authorization: `Token ${token}`,
        },
      };

      const solicitudData = {
        id_solicitud: selectedSolicitud.id_solicitud,
        usuario: selectedSolicitud.usuario.id_user,
        estado: "Listo para retiro",
        nota: nota,
      };

      const completadaResponse = await axios.put(
        `http://127.0.0.1:8000/api/solicitudes/${solicitudData.id_solicitud}`,
        solicitudData,
        config
      );

      console.log("Solicitud completada:", completadaResponse.data);

      setNotaDialogVisible(false);
      setNota(""); // Limpia el contenido de la nota
      toast.success("Solicitud preparada correctamente");
      hideDetailsDialog(); // Cierra el diálogo de detalles
    } catch (error) {
      toast.success("Solicitud no actualizada :c");
      console.error("Error al completar la solicitud:", error);
    }
  };

  const showNotaDialog = () => {
    setNotaDialogVisible(true);
  };

  const hideNotaDialog = () => {
    setNotaDialogVisible(false);
  };

  const handleGuardarNota = () => {
    setNotaDialogVisible(false);
  };

  const columns = [
    {
      name: "ID de solicitud",
      content: (row) => row.id_solicitud,
    },
    {
      name: "Alumno",
      content: (row) => `${row.usuario.nombre} ${row.usuario.apellido}`,
    },
    {
      name: "Curso",
      content: (row) => row.usuario.curso,
    },
    {
      name: "Carrera",
      content: (row) => (
        <span>
          {row.usuario.carreras.map((carrera) => (
            <div key={carrera.id}>{carrera.nombre}</div>
          ))}
        </span>
      ),
    },
    {
      name: "Profesor",
      content: (row) => `${row.profesor.nombre} ${row.profesor.apellido}`,
    },
    {
      name: "Acciones",
      content: (row) => (
        <Button
          label="Detalles"
          color="text"
          className="text-sky-700 font-semibold"
          onClick={() => showDetailsDialog(row)}
        />
      ),
    },
  ];

  return (
    <>
      <Toaster />
      <Header
        title="Solictudes Por Preparar"
        subtitle="Solicitudes de productos pendientes de preparar"
        imageUrl="https://modernize-react.adminmart.com/assets/ChatBc-d3c45db6.png"
      />
      <div className="m-4">
        <Table
          columns={columns}
          data={solicitudes}
          paginator
          className="hidden sm:block"
        />


        {/* Diálogo para mostrar los detalles de la solicitud seleccionada */}
        <Dialog
          header="Detalles de la solicitud"
          visible={visible}
          onHide={hideDetailsDialog}
          breakpoints={{ "960px": "75vw", "641px": "100vw" }}
          style={{ width: "50vw" }}
          footer={
            <div>
              <Button
                label="Cerrar"
                color="danger"
                onClick={hideDetailsDialog}
              />
              <Button label="Completada" onClick={handleCompletada} />
            </div>
          }
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
                    className="mt-4 mr-4"
                    label="Añadir nota"
                    icon={faPlus}
                    iconClassName="mx-2"
                    onClick={showNotaDialog}
                  />
                </div>
              </div>
              {selectedSolicitud.productos &&
                selectedSolicitud.productos.length > 0 && (
                  <>
                    <h2 className="text-lg font-semibold">Productos:</h2>
                    <Table
                      columns={[
                        {
                          name: "ID",
                          content: (producto) => producto.id_producto,
                        },
                        {
                          name: "Producto",
                          content: (producto) => producto.nombre,
                        },
                        {
                          name: "Cantidad",
                          content: (producto) => producto.cantidad,
                        },
                      ]}
                      data={selectedSolicitud.productos}
                    />
                  </>
                )}

              <div className="my-4">
                <h2 className="text-lg font-semibold">Nota del profesor:</h2>
                <InputTextarea
                  rows={2}
                  className="w-full"
                  disabled
                  value={selectedSolicitud.nota || "No hay notas"}
                  style={{
                    backgroundColor: selectedSolicitud.nota
                      ? "#fff"
                      : "#f0f0f0",
                  }}
                />
              </div>
            </>
          )}
        </Dialog>

        {/* Diálogo para añadir la nota */}
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
          <div className="flex justify-end">
            <Button
              label="Cancelar"
              icon={<FontAwesomeIcon icon={faTimes} />}
              rounded
              severity="danger"
              className="mx-2"
              onClick={hideNotaDialog}
            />
            <Button label="Guardar" onClick={handleGuardarNota} />
          </div>
        </Dialog>
      </div>
    </>
  );
};

export default PreparacionTable;
