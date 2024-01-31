import axios from "axios";
import React, { useEffect, useState } from "react";
import OrderModel, { TypesStatus, statusMap } from "./OrdersPage";

export const SelectedOrder: React.FC<{ orderInput: OrderModel | null; closeModal: () => void }> = ({ orderInput, closeModal }) => {
    const [order, setOrder] = useState<OrderModel | null>(orderInput);
    const [selectedStatus, setSelectedStatus] = useState(null)
    useEffect(() => {
        setOrder(orderInput);
    }, [orderInput]);
    const [errorMessage, setErrorMessage] = useState(null);
    const updateStatus = async () => {
        try {
            if (order && selectedStatus !== undefined) {
                const tokenValue = localStorage.getItem("authToken");
                
                const status=selectedStatus 

                const response =await axios.put(
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

    return (
        <div>
            <p>ID: {order.id}</p>
            <p>Caption: {order.caption}</p>
            <td>Order status : {statusMap[order.statusModels.type]}</td>
            <label>
                Select Status:
                <select value={selectedStatus || ""} onChange={handleStatusChange}>
                    <option value="">Выберите статус</option>
                    <option value={TypesStatus.Start}>Start</option>
                    <option value={TypesStatus.Proccess}>Proccess</option>
                    <option value={TypesStatus.End}>End</option>
                </select>
            </label>
            {errorMessage && <div style={{ color: 'red' }}>{errorMessage}</div>}
            <button onClick={updateStatus}>Update Status</button>
            <button onClick={deleteOrder}>Delete Order</button>
        </div>
    );
};


