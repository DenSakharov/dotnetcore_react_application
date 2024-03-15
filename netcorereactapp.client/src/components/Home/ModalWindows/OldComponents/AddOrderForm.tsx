import { useState } from 'react';
import axios from 'axios';
import config from '../../../../config/config.json'
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
            const formDataData = new FormData();
            const formDataFile = new FormData();

            // Добавляем данные в первый объект FormData
            formDataData.append('caption', newOrder.caption);

            // Добавляем файл во второй объект FormData
            formDataFile.append('StatusModels.Attachments', newOrder.attachment);

            // Объединяем два объекта FormData в один
            for (const [key, value] of formDataFile.entries()) {
                formDataData.append(key, value);
            }

            // Добавляем токен авторизации
            const tokenValue = localStorage.getItem("authToken");

            // Отправляем объединенный объект FormData
            const response = await axios.post(`${config.apiUrl}/orders/createorder`, formDataData, {
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
