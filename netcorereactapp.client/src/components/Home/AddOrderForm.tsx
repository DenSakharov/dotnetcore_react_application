import React, { useState } from 'react';
import axios from 'axios';
interface OrderCreationData {
    caption: string;
    date_of_creature: Date;
    date_of_edited: Date;
    statusModels: {
        type: TypesStatus;
        date_of_creature: Date;
    };
}

enum TypesStatus {
    Start,
    Proccess,
    End
}

const AddOrderForm = ({ onOrderAdded }) => {
    const [newOrder, setNewOrder] = useState({
        caption: '',
        dateOfCreation: '',
        dateOfEdited: '',
        statusModelId: 0,
        // Добавьте другие поля заказа здесь
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewOrder({ ...newOrder, [name]: value });
    };

    const handleAddOrder = async () => {
        try {
            const storedAuthToken = localStorage.getItem("authToken");
            const authTokenObject = JSON.parse(storedAuthToken);
            const tokenValue = authTokenObject.token;

            const order: OrderCreationData = {
                caption: newOrder.caption,
                date_of_creature: new Date(1), // Здесь нужно уточнить, откуда брать дату
                date_of_edited: new Date(1),   // То же самое, уточнить, откуда брать дату
                statusModels: {
                    type: TypesStatus.Start,
                    date_of_creature: new Date(1) // И снова, уточнить, откуда брать дату
                }
            };
            const response = await axios.post('https://localhost:7294/orders/createorder', order, {
                headers: {
                    Authorization: `Bearer ${tokenValue}`,
                },
            });

            onOrderAdded(response.data);
            setNewOrder({
                caption: '',
                dateOfCreation: '',
                dateOfEdited: '',
                statusModelId: 0,
            });
        } catch (error) {
            console.error('Error adding order:', error);
        }
    };

    return (
        <div>
            <input
                type="text"
                name="caption"
                value={newOrder.caption}
                onChange={handleInputChange}
                placeholder="Order Caption"
            />
            <input
                type="text"
                name="dateOfCreation"
                value={newOrder.dateOfCreation}
                onChange={handleInputChange}
                placeholder="Date of Creation"
            />
            <input
                type="text"
                name="dateOfEdited"
                value={newOrder.dateOfEdited}
                onChange={handleInputChange}
                placeholder="Date of Edited"
            />
            <input
                type="number"
                name="statusModelId"
                value={newOrder.statusModelId}
                onChange={handleInputChange}
                placeholder="Status Model ID"
            />
            <button onClick={handleAddOrder}>+</button>
        </div>
    );
};

export default AddOrderForm;
