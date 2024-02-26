import React, { useEffect, useState } from 'react';
import axios from 'axios';
import AddOrderForm from './AddOrderForm'
import { Modal } from './Modal';
export interface AttachmentModel {
    id: number;
    attachmentData: string;
}

export interface StatusModel {
    Id: number;
    Type: TypesStatus;
    dateOfCreature: string;
    attachments: AttachmentModel[];
}

export enum TypesStatus {
    Start = "Start",
    Proccess = "Proccess",
    End = "End",
}

interface OrderModel {
    id: number;
    caption: string;
    dateOfCreature: string;
    dateOfEdited: string;
    statuses: StatusModel[];
}
export const statusMap = {
    0: 'Start',
    1: 'Process',
    2: 'End',
};
export default OrderModel;

const OrdersPage: React.FC = () => {
    const [orders, setOrders] = useState<OrderModel[]>([]);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const tokenValue = localStorage.getItem("authToken");
                const response = await axios.get<OrderModel[]>('https://localhost:7294/orders/getorders', {
                    headers: {
                        Authorization: `Bearer ${tokenValue}`,
                    },
                });
                //console.log(response.data)
                setOrders(response.data);
                /*
                response.data.forEach(order => {
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
                });
                */
            } catch (error) {
                console.error('Error fetching orders:', error);
            }
        };

        fetchOrders();
    }, []);
    const handleOrderAdded = (newOrder) => {
        // Обновление списка заказов после добавления нового заказа
        setOrders([...orders, newOrder]);
        // Закрытие формы добавления
        setShowAddForm(false);
    };

    const [showAddForm, setShowAddForm] = useState(false);
    const toggleAddForm = () => {
        // Переключение видимости формы добавления
        setShowAddForm(!showAddForm);
    };

    const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null);
    const [isModal, setModal] = useState(false)
    const onRowClick = (order: OrderModel | null) => {
        setSelectedOrderId(order);
        setModal(true)
    };
    const onClose = () => {
        setModal(false)
        window.location.reload();
    }
    //pagination data
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(5); // Примерное количество элементов на странице

    // Функция для получения индексов элементов для текущей страницы
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = orders.slice(indexOfFirstItem, indexOfLastItem);

    // Функции для переключения страниц
    const handleNextPage = () => {
        setCurrentPage(currentPage +  1);
    };

    const handlePrevPage = () => {
        if (currentPage >  1) {
            setCurrentPage(currentPage -  1);
        }
    };
    return (
        <div>
            <h1>Orders</h1>
            <button onClick={toggleAddForm}>Add Order</button>

            {showAddForm && (
                <Modal
                    visible={showAddForm}
                    title='Add Order'
                    content={<AddOrderForm onOrderAdded={handleOrderAdded}/>}
                    footer={<button onClick={toggleAddForm}>Close</button>}
                    onClose={toggleAddForm}
                />
            )}
            <table className="styled-table">
                <thead>
                <tr>
                    <th>№</th>
                    <th>Название</th>
                    <th>Дата создания</th>
                    <th>Дата редактирования</th>
                    <th>Статус</th>
                    <th>История</th>
                </tr>
                </thead>
                <tbody>
                {currentItems.map(order => (
                    <tr key={order.id} onClick={() => onRowClick(order)}>
                        <td>{order.id}</td>
                        <td>{order.caption}</td>
                        <td>{order.dateOfCreature}</td>
                        <td>{order.dateOfEdited}</td>
                        <td>{order.statuses && order.statuses.length > 0
                            ? statusMap[order.statuses.sort((a, b) =>
                                new Date(b.dateOfCreature).getTime() - new Date(a.dateOfCreature).getTime())[0]
                                .type]
                            : ''}</td>
                        <td>
                            {order.events && order.events.length > 0 ?
                                order.events[order.events.length - 1].message : ''}
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
            <button onClick={handlePrevPage} disabled={currentPage === 1}>Назад</button>
            <button onClick={handleNextPage}
                    disabled={currentPage === Math.ceil(orders.length / itemsPerPage)}>Вперед
            </button>
            {selectedOrderId && (
                <Modal
                    visible={isModal}
                    title='Заголовок'
                    content={<p>Окно для показа информаци о выбранном заказе</p>}
                    footer={<button onClick={onClose}>Закрыть</button>}
                    onClose={onClose}
                    order={selectedOrderId}
                />
            )}
        </div>
    );
};

export default OrdersPage;
