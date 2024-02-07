import axios from "axios";
import React, { useEffect, useState } from "react";
import OrderModel, { TypesStatus, statusMap } from "./OrdersPage";
import '../../styles/SelectedOrder.css'
import { History } from './History/Hitory'
import FileViewer from 'react-file-viewer';

export const SelectedOrder: React.FC<{ orderInput: OrderModel | null; closeModal: () => void }> = ({ orderInput, closeModal }) => {
    const [order, setOrder] = useState<OrderModel | null>(orderInput);
    const [selectedStatus, setSelectedStatus] = useState(null)
    useEffect(() => {
        setOrder(orderInput);
        
        console.log(`Order ID: ${order.id}`);
        console.log(`Caption: ${order.caption}`);
        console.log(`Date of Creation: ${order.dateOfCreature}`);
        console.log(`Date of Editing: ${order.dateOfEdited}`);
        if (order.statuses) {
            order.statuses.forEach(status => {
                console.log(`Status ID: ${status.id}`);
                console.log(`Status Type: ${status.type}`);
                console.log(`Date of Creation: ${status.dateOfCreature}`);
                if (status.attachments) {
                    status.attachments.forEach(attachment => {
                        console.log(`Attachment ID: ${attachment.id}`);
                        console.log(`Attachment Data: ${attachment.attachmentData}`);
                    });
                }
            });
        }
        if (order.events) {
            order.events.forEach(event => {
                console.log(`Event ID: ${event.id}`);
                console.log(`Date of Change: ${event.dateOfChange}`);
                console.log(`Message: ${event.message}`);
            });
        }
        console.log('---------------------------');
        //*/
    }, [orderInput]);
    const [errorMessage, setErrorMessage] = useState(null);
    const updateStatus = async () => {
        try {
            if (order && selectedStatus !== undefined) {
                const tokenValue = localStorage.getItem("authToken");

                const status = selectedStatus

                const response = await axios.put(
                    `https://localhost:7294/orders/${order.id}/updatestatus`,
                    { status },
                    {
                        headers: {
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
        } catch (error) {
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


    if (!order) {
        return <p>Invalid orderId or order data is not available</p>;
    }

    const deleteOrder = async () => {
        try {
            const tokenValue = localStorage.getItem("authToken");
            const response = await axios.delete(`https://localhost:7294/orders/${order.id}`, {
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
        } catch (error) {
            console.error('Error deleting order:', error);
        }
    };
    const handleDownload = async (fileId) => {
        const fileUrl = await downloadFile(fileId); // Ожидание получения ссылки на файл
        if (fileUrl) {
            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(fileContent, "text/xml");
            window.open(xmlDoc); // Открыть ссылку в новой вкладке
        } else {
            // В случае ошибки выводим сообщение
            console.error('Failed to download file');
        }
    };

    return (
        <div className="order-container">
            <div className="order-details">
                <p>Идентификатор : {order.id}</p>
                <p>Название заказа : {order.caption}</p>
                <p>
                    Текущий статус заказа : {order.statuses && order.statuses.length > 0
                        ? statusMap[order.statuses.sort((a, b) =>
                            new Date(b.dateOfCreature).getTime() - new Date(a.dateOfCreature).getTime())[0]
                            .type]
                        : ''}
                </p>

            </div>
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
            <div className="error-message">
                {errorMessage && <div>{errorMessage}</div>}
            </div>
            <div className="action-buttons">
                <button onClick={updateStatus}>Добавить статус</button>
                <button onClick={deleteOrder}>Удалить заказ</button>
            </div>
            <div>
                <table className="styled-table">
                    <thead>
                        <tr>
                            <th>Статус</th>
                            <th>Дата создания</th>
                            <th>Файл</th>
                        </tr>
                    </thead>
                    <tbody>
                        {order.statuses.map((status, index) => (
                            <tr key={index}>
                                <td>{statusMap[status.type]}</td>
                                <td>{status.dateOfCreature}</td>
                                <td>
                                    {status.attachments && status.attachments.map((attachment, attachmentIndex) => (
                                        <div key={attachmentIndex}>
                                            <p>Data: {attachment.attachmentData}</p>
                                            {/*<a href=*/}
                                            {/*    {`data:${attachment.attachmentType};base64,${attachment.attachmentData}`}*/}
                                            {/*    download={attachment.fileName}>Download</a>*/}
                                            <div>
                                                <button onClick={() => handleDownload(attachment.id)}>Download File</button>
                                            </div>
                                        </div>
                                    ))}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

            </div>
        </div>

    );
};
const downloadFile = async (fileId) => {
    try {
        const tokenValue = localStorage.getItem("authToken");
        console.log(" - " + fileId)
        const response = await axios.get(`https://localhost:7294/filedownload/${fileId}`, {
            headers: {
                Authorization: `Bearer ${tokenValue}`,
            },
            responseType: 'text'
        });
        console.log(response.data)
        return response.data; 
        
    } catch (error) {
        console.error('Error downloading file:', error);
    }
}
const FileViewerComponent = ({ fileType, filePath }) => {
    const [error, setError] = useState(null);

    const onError = (e) => {
        console.error('Error:', e);
        setError(e);
    };

    return (
        <div>
            <h2>File Viewer</h2>
            {error && <div>Error: {error.message}</div>}
            <FileViewer
                fileType={fileType}
                filePath={filePath}
                onError={onError}
            />
        </div>
    );
};


export default FileViewer;


