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
                date_of_creature: new Date(),
                date_of_edited: new Date(),
                statusModels: {
                    type: TypesStatus.Start,
                    date_of_creature: new Date()
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
            <button onClick={handleAddOrder}>+</button>
        </div>
    );
};

export default AddOrderForm;
