import React, { useEffect, useState } from 'react';
import axios from 'axios';
import AddOrderForm from './AddOrderForm'
import { Modal } from './Modal';
interface StatusModel {
    id: number;
    type: TypesStatus;
    date_of_creature: string;
}

export enum TypesStatus {
    Start = "Start",
    Proccess = "Proccess",
    End = "End",
}
export const statusMap = {
    0: 'Start',
    1: 'Process',
    2: 'End',
};
interface OrderModel {
    id: number;
    caption: string;
    date_of_creature: string;
    date_of_edited: string;
    statusModels: StatusModel; // Используйте имя во множественном числе, так как это связь "многие к одному"
}


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
            } catch (error) {
                console.error('Error fetching orders:', error);
            }
        };

        fetchOrders();
    }, []);

    const [showAddForm, setShowAddForm] = useState(false);
    const handleOrderAdded = (newOrder) => {
        // Обновление списка заказов после добавления нового заказа
        setOrders([...orders, newOrder]);
        // Закрытие формы добавления
        setShowAddForm(false);
    };

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
    return (
        <div>
            <h1>Orders</h1>
            <button onClick={toggleAddForm}>Add Order</button>

            {showAddForm && <AddOrderForm onOrderAdded={handleOrderAdded} />}
            <table className="styled-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Caption</th>
                        <th>Date of Creation</th>
                        <th>Date of Editing</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    {orders.map(order => (
                        <tr key={order.id} onClick={() => onRowClick(order)}>
                            <td>{order.id}</td>
                            <td>{order.caption}</td>
                            <td>{order.date_of_creature}</td>
                            <td>{order.date_of_edited}</td>
                            <td>{statusMap[order.statusModels.type]}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
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
