import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface DataProps {
    token: string;
}

const Data: React.FC<DataProps> = ({ token }) => {
    const [secureData, setSecureData] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('https://localhost:7294/data/GetSecureData', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                setSecureData(response.data);
            } catch (error) {
                console.error('Ошибка при получении защищенных данных:', error);
            }
        };

        fetchData();
    }, [token]);

    return (
        <div>
            <h2>Данные из запроса:</h2>
            <p>{secureData}</p>
        </div>
    );
};

export default Data;
