import axios from "axios";
import { useState } from "react";
import OrderModel, { TypesStatus } from "../OrdersPage";

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
                    `https://localhost:7294/orders/${order.id}/updatestatus`,
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

    const deleteOrder = async () => {
        try {
            const tokenValue = localStorage.getItem("authToken");
            const id = order.id;
            if (typeof closeModal === 'function') {
                const response = await axios.delete(`https://localhost:7294/orders/${id}`, {
                    headers: {
                        Authorization: `Bearer ${tokenValue}`,
                    },
                });

                // Проверяем успешность удаления
                if (response.status === 200) {
                    closeModal();
                } else {
                    console.error('Error deleting order. Unexpected status:', response.status);
                }
            } else {
                console.log("no")
            }
        } catch (error) {
            console.error('Error deleting order:', error);
        }
    };
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
                <button onClick={deleteOrder}>Удалить заказ</button>
            </div>
        </div>
    )
}