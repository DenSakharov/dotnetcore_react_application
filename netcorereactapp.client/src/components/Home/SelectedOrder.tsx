import axios from "axios";
import React, { useEffect, useState } from "react";
import OrderModel, { TypesStatus, statusMap } from "./OrdersPage";
import DocumnetViewer from '../Home/Document/DocumentViewer'
import ExcelViewer from '../Home/Document/ExcelViewer'

import '../../styles/SelectedOrder.css'
import AddStatus from "./StatusOfOrder/AddStatus";

export const SelectedOrder: React.FC<{ orderInput: OrderModel | null; closeModal: () => void }>
    = ({ orderInput, closeModal }) => {
        const [order, setOrder] = useState<OrderModel | null>(orderInput);
        useEffect(() => {
            setOrder(orderInput);
            /*
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
        const [base64doc, setBase64doc] = useState('')
        const [showDocument, setShowDocument] = useState(false);

        const handleDownload = async (attachment) => {
            const fileId = attachment.id;
            const extension = attachment.attachmentData.split('.').pop().toLowerCase();
            if (extension === 'xlsx') {
                window.location.href = `https://localhost:5173/#/excel/${fileId}`;
            } else if (extension === 'pdf') {
                window.location.href = `https://localhost:5173/#/pdf/${fileId}`;
            } else {
                // Действия при неизвестном формате файла
            }
        };

        const renderDocument = () => {
            const extension = attachment.attachmentData.split('.').pop().toLowerCase();
            if (extension === 'xlsx') {
                return <ExcelViewer base64Data={base64doc} />;
            } else if (extension === 'pdf') {
                return <DocumentViewer base64String={base64doc} />;
            } else {
                return <p>Unsupported file format</p>;
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
                {
                     order && typeof closeModal === 'function' && (
                        <AddStatus order={order} closeModal={closeModal} />
                    )}
                <div className="divTable">
                    <table className="styled-table">
                        <thead>
                            <tr>
                                <th>Статус</th>
                                <th>Дата создания</th>
                                <th>Файл</th>
                            </tr>
                        </thead>
                        <tbody>
                            {order.statuses.map((status) => (
                                <tr key={status.Id}> 
                                    <td>{statusMap[status.type]}</td>
                                    <td>{status.dateOfCreature}</td>
                                    <td>
                                        {status.attachments && status.attachments.map((attachment) => (
                                            <div key={attachment.id}> {/* Или используйте уникальный идентификатор */}
                                                <p>Data: {attachment.attachmentData}</p>
                                                <div>
                                                    <button onClick={() => handleDownload(attachment)}>Download File</button>
                                                    {showDocument && renderDocument()}
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




