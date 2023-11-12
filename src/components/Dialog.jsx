import React, { useRef } from 'react';
import { ConfirmDialog } from 'primereact/confirmdialog';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';

export default function Delete() {
    const toast = useRef(null);

    const showToast = (severity, summary, detail) => {
        toast.current.show({ severity, summary, detail, life: 3000 });
    };

    const accept = () => {
        showToast('info', 'Confirmed', 'You have accepted');
    };

    const reject = () => {
        showToast('warn', 'Rejected', 'You have rejected');
    };

    const confirmDelete = () => {
        ConfirmDialog({
            message: 'Do you want to delete this record?',
            header: 'Delete Confirmation',
            icon: 'pi pi-info-circle',
            acceptClassName: 'p-button-danger',
            accept,
            reject
        });
    };

    return (
        <>
            <Toast ref={toast} />
            <div className="card flex flex-wrap gap-2 justify-content-center">
                <Button onClick={confirmDelete} icon="pi pi-times" label="Delete" />
            </div>
        </>
    );
}
