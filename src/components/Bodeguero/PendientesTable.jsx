import { useState, useEffect, useRef } from "react";
import { Dialog } from "primereact/dialog";
import axios from "axios";
import Cookies from "js-cookie";
import { InputTextarea } from "primereact/inputtextarea";
import { Toast } from "primereact/toast";
import Table from "../UI/Table"; 
import Button from "../UI/Button";
import Header from "../UI/Header";

const PendientesTable = () => {
  const [solicitudes, setSolicitudes] = useState([]);
  const [selectedSolicitud, setSelectedSolicitud] = useState(null);
  const [visible, setVisible] = useState(false);
  const [notaDialogVisible, setNotaDialogVisible] = useState(false);
  const [nota, setNota] = useState("");
  const toast = useRef(null);

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
          (solicitud) => solicitud.estado === "Entregado"
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
      if (!token) {
        console.error("Token no encontrado en las cookies");
        return;
      }

      const config = {
        headers: {
          Authorization: `Token ${token}`,
        },
      };

      const solicitudData = {
        id_solicitud: selectedSolicitud.id_solicitud,
        usuario: selectedSolicitud.usuario.id_user,
        estado: "Completado",
        nota: nota,
      };

      const completadaResponse = await axios.put(
        `http://127.0.0.1:8000/api/solicitudes/${solicitudData.id_solicitud}`,
        solicitudData,
        config
      );

      console.log("Solicitud completada:", completadaResponse.data);

      hideDetailsDialog();
    } catch (error) {
      console.error("Error al completar la solicitud:", error);
    }
  };

  const handleGuardar = async () => {
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

      const solicitudData = {
        id_solicitud: selectedSolicitud.id_solicitud,
        usuario: selectedSolicitud.usuario.id_user,
        estado: "reportado",
        nota: nota,
      };

      const reportadoResponse = await axios.put(
        `http://127.0.0.1:8000/api/solicitudes/${solicitudData.id_solicitud}`,
        solicitudData,
        config
      );

      toast.current.show({
        severity: "success",
        summary: "Éxito",
        detail: "Reporte guardado exitosamente",
      });

      console.log("Solicitud reportada:", reportadoResponse.data);

      hideDetailsDialog();
      setNotaDialogVisible(false);
    } catch (error) {
      console.error("Error al reportar la solicitud:", error);
    }
  };

  const showNotaDialog = () => {
    setNotaDialogVisible(true);
  };

  const hideNotaDialog = () => {
    setNotaDialogVisible(false);
  };

  const columns = [
    {
      name: "Alumno",
      key: "usuario",
      content: (rowData) => (
        <span>{`${rowData.usuario.nombre} ${rowData.usuario.apellido}`}</span>
      ),
    },
    {
      name: "Curso",
      key: "usuario",
      content: (rowData) => rowData.usuario.curso,
    },
    {
      name: "Carrera",
      key: "usuario",
      content: (rowData) => (
        <span>
          {rowData.usuario.carreras.map((carrera) => (
            <div key={carrera.id}>{carrera.nombre}</div>
          ))}
        </span>
      ),
    },
    {
      name: "Profesor",
      key: "profesor",
      content: (rowData) => (
        <span>{`${rowData.profesor.nombre} ${rowData.profesor.apellido}`}</span>
      ),
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

  const footerContent = (
    <div>
      <Button
        label="Cerrar"
        color="danger"
        onClick={hideDetailsDialog}
      />
      <Button
        label="Recibido"
        onClick={handleCompletada}
      />
    </div>
  );

  return (
    <>
      <Toast ref={toast} />

      <Header
        title="Solictudes Pendientes"
        subtitle="Solicitudes de productos pendientes de ser entregados"
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
                  className="mt-4 mr-4"
                  label="Reportar"
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
        {selectedSolicitud && (
          <div className="">
            <p className="text-base mb-2">
              Generar reporte de{" "}
              <strong>{`${selectedSolicitud.usuario.nombre} ${selectedSolicitud.usuario.apellido} (${selectedSolicitud.usuario.rut})`}</strong>{" "}
              por la no entrega o entrega parcial de los productos relacionados
              a la solicitud número{" "}
              <strong>{selectedSolicitud.id_solicitud}</strong>, la cual debió
              ser entregada para el día{" "}
              <strong>{selectedSolicitud.fecha_entrega}</strong>.
            </p>
            <h2 className="text-lg font-semibold">Notas del reporte:</h2>
            <InputTextarea
              rows={3}
              className="w-full"
              value={nota}
              onChange={(e) => setNota(e.target.value)}
            />
          </div>
        )}
        <div className="flex justify-end mt-4 ">
          <Button
            label="Cancelar"
            className="mx-2"
            onClick={hideNotaDialog}
          />
          <Button
            label="Confirmar"
            onClick={handleGuardar}
          />
        </div>
      </Dialog>
    </>
  );
};

export default PendientesTable;
