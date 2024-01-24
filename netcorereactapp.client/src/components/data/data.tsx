import React, { useState, useEffect, MouseEventHandler } from 'react';
import axios from 'axios';
import './data.css'
const Data=() => {
    const [secureData, setSecureData] = useState('');
    const click_send_request: MouseEventHandler<HTMLButtonElement> = async () => {
        try {
            try {
                const storedAuthToken = localStorage.getItem("authToken");
                const authTokenObject = JSON.parse(storedAuthToken);
                const tokenValue = authTokenObject.token;
                const response = await axios.get('https://localhost:7294/data/GetSecureData', {
                    headers: {
                        Authorization: `Bearer ${tokenValue }`,
                    },
                });

                setSecureData(response.data);
            } catch (error) {
                console.error('Ошибка при получении защищенных данных:', error);
            }        } catch (error) {
            // Обработка ошибок
            console.error('Ошибка во время запроса авторизации:', error);
        }
    };

    const [secureDataAdmin, setSecureDataAdmin] = useState([]);
    const [viewTable, setViewTable] = useState(false)
    const click_send_request_for_get_admin_data: MouseEventHandler<HTMLButtonElement> = async () => {
        try {
            try {
                const storedAuthToken = localStorage.getItem("authToken");
                const authTokenObject = JSON.parse(storedAuthToken);
                const tokenValue = authTokenObject.token;
                const response = await axios.get('https://localhost:7294/data/GetSecureDataForAdmin', {
                    headers: {
                        Authorization: `Bearer ${tokenValue}`,
                    },
                });

                setSecureDataAdmin(response.data);
                setViewTable(true);
            } catch (error) {
                console.error('Ошибка при получении защищенных данных:', error);
            }
        } catch (error) {
            // Обработка ошибок
            console.error('Ошибка во время запроса авторизации:', error);
        }
    }
    return (
        <div>
            <h2>Данные из запроса:</h2>
            {secureData}
            <div>
                <button onClick={click_send_request}>Запрос на данные</button>
            </div>
            <h2>Данные из запроса для админа:</h2>
            {viewTable &&
                <table className="styled-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Login</th>
                            <th>Role</th>
                        </tr>
                    </thead>
                    <tbody>
                        {secureDataAdmin.map(item => (
                            <tr key={item.id}>
                                <td>{item.id}</td>
                                <td>{item.login}</td>
                                <td>{item.role}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            }
            <div>
                <button onClick={click_send_request_for_get_admin_data}>Запрос на данные для админа</button>
            </div>
        </div>
    );
};

export default Data;
