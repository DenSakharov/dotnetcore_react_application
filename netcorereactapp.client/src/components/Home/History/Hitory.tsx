import React, { useState, useEffect } from 'react';
import axios from 'axios';
import config from '../../../config/config.json'
import './History.css'
interface HistoryItem {
    id: number;
}

export const History = ({ orderId }) => {
    const [orderHistory, setOrderHistory] = useState<HistoryItem[]>([]);
    useEffect(() => {
        const fetchData = async () => {
            try {
                const tokenValue = localStorage.getItem("authToken");
                const response = await axios.get(`${config.apiUrl}/history/${orderId}`, {
                    headers: {
                        Authorization: `Bearer ${tokenValue}`,
                    },
                });

                if (response.status == 200) {
                    console.log("response.data -> ",response.data)
                    setOrderHistory(response.data);
                    console.log(orderHistory);
                } else {
                    console.error('Error get histories order. Unexpected status:', response ? response.status : 'unknown');
                }
            } catch (error) {
                console.error('Error get histories order:', error);
            }
        };

        fetchData(); // вызываем асинхронную функцию
    }, [orderId]);

    return (
        <div className="order-history">
            <h3>Order History:</h3>
            <table className="order-history-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        {/* Добавьте заголовки для других свойств */}
                    </tr>
                </thead>
                <tbody>
                    {orderHistory.map((historyItem, index) => (
                        <tr key={index}>
                            <td>{historyItem.id}</td>
                            {/* Добавьте ячейки для других свойств */}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};
