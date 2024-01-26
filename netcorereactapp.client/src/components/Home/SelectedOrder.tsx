import axios from "axios";
import React, { useEffect, useState } from "react";
import OrderModel, { statusMap } from "./OrdersPage";
import TypesStatus from "./OrdersPage";

export const SelectedOrder: React.FC<{ orderInput: OrderModel | null }> = ({ orderInput }) => {
    const [order, setOrder] = useState<OrderModel | null>(orderInput);
    const [selectedStatus, setSelectedStatus] = useState<string | undefined>(undefined);

    useEffect(() => {
        setOrder(orderInput);
        setSelectedStatus(orderInput?.statusModels.type); // Устанавливаем начальное значение статуса при загрузке данных
    }, [orderInput]);

    const updateStatus = async () => {
        try {
            if (order && selectedStatus !== undefined) {
                const tokenValue = localStorage.getItem("authToken");

                // Предположим, что ваш сервер поддерживает обновление статуса через PUT-запрос
                await axios.put(
                    `https://localhost:7294/orders/${order.id}/updatestatus`,
                    { selectedStatus },
                    {
                        headers: {
                            Authorization: `Bearer ${tokenValue}`,
                        },
                    }
                );

                // Обновление статуса в локальном состоянии
                setOrder(prevOrder => ({ ...prevOrder, statusModels: { ...prevOrder.statusModels, type: selectedStatus } }));
            }
        } catch (error) {
            console.error(error);
        }
    };

    const handleStatusChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedStatus(event.target.value);
    };
    if (!order) {
        return <p>Invalid orderId or order data is not available</p>;
    }

    return (
        <div>
            <p>ID: {order.id}</p>
            <p>Caption: {order.caption}</p>
            <td>Order status : {statusMap[order.statusModels.type]}</td>
            <label>
                Select Status:
                <select value={selectedStatus || ""} onChange={handleStatusChange}>
                    <option value={TypesStatus.Start}>Start</option>
                    <option value={TypesStatus.Proccess}>Proccess</option>
                    <option value={TypesStatus.End}>End</option>
                </select>
            </label>
            <button onClick={updateStatus}>Update Status</button>
            {/* Additional fields */}
        </div>
    );
};


