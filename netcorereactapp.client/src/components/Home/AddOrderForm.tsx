import React, { useState } from 'react';
import axios from 'axios';
interface OrderCreationData {
    caption: string;
    date_of_creature: Date;
    date_of_edited: Date;
    statusModels: {
        type: TypesStatus;
        date_of_creature: Date;
        attachments?: File;
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
        attachment: null, // Поле для хранения файла
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewOrder({ ...newOrder, [name]: value });
    };
    const handleAttachmentChange = (e) => {
        const file = e.target.files[0];
        setNewOrder({ ...newOrder, attachment: file });
    };
    const handleAddOrder = async () => {
        try {
            const tokenValue = localStorage.getItem("authToken");

            const formData = new FormData();
            formData.append('caption', newOrder.caption);
            formData.append('date_of_creature', new Date().toISOString());
            formData.append('date_of_edited', new Date().toISOString());
            formData.append('statusModels[type]', TypesStatus.Start);
            formData.append('statusModels[date_of_creature]', new Date().toISOString());
            formData.append('statusModels[attachments]', newOrder.attachment);


            const response = await axios.post('https://localhost:7294/orders/createorder', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${tokenValue}`,
                },
            });

            onOrderAdded(response.data);
            setNewOrder({
                caption: '',
                dateOfCreation: '',
                dateOfEdited: '',
                statusModelId: 0,
                attachment: null,
            });
        } catch (error) {
            console.error('Error adding order:', error);

            if (error.response) {
                // Вывести подробности об ошибке, если они доступны
                console.error('Response data:', error.response.data);
            }
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
                type="file"
                name="attachment"
                onChange={handleAttachmentChange}
            />
            <button onClick={handleAddOrder}>+</button>
        </div>
    );
};

export default AddOrderForm;
