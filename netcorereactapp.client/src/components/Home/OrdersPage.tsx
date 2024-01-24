import React, { useEffect, useState } from 'react';
import axios from 'axios';
import AddOrderForm from './AddOrderForm'
interface StatusModel {
    id: number;
    type: string;
    date_of_creature: string; 
}

interface OrderModel {
    id: number;
    caption: string;
    date_of_creature: string; 
    date_of_edited: string; 
    status_model_id: number;
    statusModel: StatusModel; // ������ �� ��������� ������
}

const OrdersPage: React.FC = () => {
    const [orders, setOrders] = useState<OrderModel[]>([]);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const storedAuthToken = localStorage.getItem("authToken");
                const authTokenObject = JSON.parse(storedAuthToken);
                const tokenValue = authTokenObject.token;
                const response = await axios.get<OrderModel[]>('https://localhost:7294/orders/getorders', {
                    headers: {
                        Authorization: `Bearer ${tokenValue}`,
                    },
                });
                setOrders(response.data);
            } catch (error) {
                console.error('Error fetching orders:', error);
            }
        };

        fetchOrders();
    }, []);

    const [showAddForm, setShowAddForm] = useState(false);
    const handleOrderAdded = (newOrder) => {
        // ���������� ������ ������� ����� ���������� ������ ������
        setOrders([...orders, newOrder]);
        // �������� ����� ����������
        setShowAddForm(false);
    };

    const toggleAddForm = () => {
        // ������������ ��������� ����� ����������
        setShowAddForm(!showAddForm);
    };
    return (
        <div>
            <h1>Orders</h1>
            <button onClick={toggleAddForm}>Add Order</button>

            {showAddForm && <AddOrderForm onOrderAdded={handleOrderAdded} />}
            <table>
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
                        <tr key={order.id}>
                            <td>{order.id}</td>
                            <td>{order.caption}</td>
                            <td>{order.date_of_creature}</td>
                            <td>{order.date_of_edited}</td>
                            <td>{order.statusModel?.type}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default OrdersPage;
