﻿import axios from "axios";
import { useState } from "react";
import OrderModel from "../../../../../Models/OderStatusLogicsRelationships/OrderModel.tsx";
import {TypesStatus} from "../../../../../Models/OderStatusLogicsRelationships/TypesStatus.tsx";
import config from '../../../../../config/config.json'

export default function AddStatus({ order, closeModal }: { order: OrderModel | null, closeModal: () => void }) {
    const [selectedStatus, setSelectedStatus] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [selectedFile, setSelectedFile]=useState(null)
    if (!order) {
       
        return <p>Invalid orderId or order data is not available</p>;
    }
    const updateStatus = async () => {
        try {
            if (order && selectedStatus !== undefined) {
                const tokenValue = localStorage.getItem("authToken");
                const status = selectedStatus
                // Создаем объект FormData для передачи данных файла
                const formData = new FormData();
                formData.append('status', status);
                formData.append('file', selectedFile); // Предположим, что selectedFile содержит выбранный файл

                const response = await axios.put(
                    `${config.apiUrl}/orders/${order.id}/updatestatus`,
                    formData, // Передаем FormData вместо обычного объекта
                    {
                        headers: {
                            'Content-Type': 'multipart/form-data', // Устанавливаем заголовок для FormData
                            Authorization: `Bearer ${tokenValue}`,
                        },
                    }
                );
                if (response.status === 200) {
                    closeModal();
                } else {
                    window.alert('Ошибка обновления заказа. Неожиданный статус: ' + response.status);
                    setErrorMessage('Ошибка обновления заказа. Неожиданный статус: ' + response.status);
                    console.error('Error updating order. Unexpected status:', response.status);
                }
            }
        }
        catch (error)
        {
            console.error(error);
        }
    };
    const handleStatusChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const newValue = event.target.value;
        setSelectedStatus((prevStatus) => {
            console.log(`selectedStatus => ${newValue}`);
            return newValue;
        });
    };
    const handleFileChange = (event) => {
        const file = event.target.files[0];
        setSelectedFile(file);
    };
    if (!order) {
        return <p>Invalid orderId or order data is not available</p>;
    }
    return (
        <div>
            <div className="select-status">
                <label>
                    Выберите статут для добалвения :
                    <select value={selectedStatus || ""} onChange={handleStatusChange}>
                        <option value="">Выберите статус</option>
                        <option value={TypesStatus.Start}>Start</option>
                        <option value={TypesStatus.Proccess}>Proccess</option>
                        <option value={TypesStatus.End}>End</option>
                    </select>
                </label>
            </div>
            <div className="file-upload">
                <label>
                    Выберите файл:
                    <input type="file" onChange={handleFileChange} />
                </label>
            </div>
            <div className="error-message">
                {errorMessage && <div>{errorMessage}</div>}
            </div>
            <div className="action-buttons">
                <button onClick={updateStatus}>Добавить статус</button>

            </div>
        </div>
    )
}