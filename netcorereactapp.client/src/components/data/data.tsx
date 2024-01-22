import React, { useState, useEffect, MouseEventHandler } from 'react';
import axios from 'axios';

interface DataProps {
    token:  string ;
}

const Data: React.FC<DataProps> = ({ token }) => {
    const [secureData, setSecureData] = useState('');
    /*
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('https://localhost:7294/data/GetSecureData', {
                    headers: {
                        Authorization: `${token.toString()}`,
                    },
                });

                setSecureData(response.data);
            } catch (error) {
                console.error('Ошибка при получении защищенных данных:', error);
            }
        };

        fetchData();
    }, [token]);
    */
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
    return (
        <div>
            <h2>Данные из запроса:</h2>
            {secureData}
            <div>
                <button onClick={click_send_request}>Запрос на данные</button>
            </div>
        </div>
    );
};

export default Data;
