import React from "react";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";

const EditUserDialog = ({ visible, userToEdit, onHide, onSaveChanges }) => {
  return (
    <Dialog
      visible={visible}
      onHide={onHide}
      header="Editar Usuario"
      breakpoints={{ "960px": "75vw", "641px": "100vw" }}
      style={{ width: "50vw" }}
      modal
    >
      {userToEdit && (
        <div className="">
          {/* ... (other fields) */}
          <div className="flex flex-col mb-4">
            <label htmlFor="rut">Rut</label>
            <InputText
              id="rut"
              value={userToEdit.rut}
              onChange={(e) => {
                const updatedUser = { ...userToEdit, rut: e.target.value };
                onSaveChanges(updatedUser);
              }}
            />
          </div>
          <div className="flex flex-col mb-4">
            <label htmlFor="nombre">Nombre</label>
            <InputText
              id="nombre"
              value={userToEdit.nombre}
              onChange={(e) => {
                const updatedUser = { ...userToEdit, nombre: e.target.value };
                onSaveChanges(updatedUser);
              }}
            />
          </div>
          <div className="flex flex-col mb-4">
            <label htmlFor="apellido">Apellido</label>
            <InputText
              id="apellido"
              value={userToEdit.apellido}
              onChange={(e) => {
                const updatedUser = { ...userToEdit, apellido: e.target.value };
                onSaveChanges(updatedUser);
              }}
            />
          </div>
          <div className="flex flex-col mb-4">
            <label htmlFor="email">Email</label>
            <InputText
              id="email"
              value={userToEdit.email}
              onChange={(e) => {
                const updatedUser = { ...userToEdit, email: e.target.value };
                onSaveChanges(updatedUser);
              }}
            />
          </div>
          <div className="flex flex-col mb-4">
            <label htmlFor="curso">Curso</label>
            <Dropdown
              id="curso"
              options={[
                { label: "3A", value: "3A" },
                { label: "3B", value: "3B" },
                { label: "3C", value: "3C" },
                { label: "4A", value: "4A" },
                { label: "4B", value: "4B" },
                { label: "4C", value: "4C" },
                // Add more options as needed
              ]}
              value={userToEdit.curso}
              onChange={(e) => {
                const updatedUser = { ...userToEdit, curso: e.value };
                onSaveChanges(updatedUser);
              }}
              placeholder="Select a Curso"
            />
          </div>
          <div className="flex flex-col mb-4">
            <label htmlFor="carrera">Carrera</label>
            <InputText
              id="carrera"
              value={userToEdit.carrera}
              onChange={(e) => {
                const updatedUser = { ...userToEdit, carrera: e.target.value };
                onSaveChanges(updatedUser);
              }}
            />
          </div>
          <div className="flex mt-4 w-full gap-2 items-end justify-end ">
            {/* Botón para cancelar la edición */}
            <Button
              label="Cancelar"
              rounded
              size="small"
              severity="danger"
              onClick={onHide}
            />
            {/* Botón para guardar los cambios */}
            <Button
              label="Guardar"
              onClick={onSaveChanges}
              rounded
              raised
              size="small"
              severity="success"
            />
          </div>
        </div>
      )}
    </Dialog>
  );
};

export default EditUserDialog;
