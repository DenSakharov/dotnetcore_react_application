import React, { MouseEventHandler, useState } from 'react';
import axios from 'axios';
import Data from '../data/data';

const Login = () => {
    const [login, setLogin] = useState('');
    const [password, setPassword] = useState('');
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    const handleLoginChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setLogin(event.target.value);
    };

    const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(event.target.value);
    };

    const [token, setToken] = useState('');
    const click_send_request: MouseEventHandler<HTMLButtonElement> = async () => {
        try {
            const login_url = "https://localhost:7294/authentication/login";
            const response = await axios.post(login_url, {
                login,
                password,
            }, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.status === 200) {
                // Успешная аутентификация
                setIsAuthenticated(true);
                setToken(response.data)
                console.log('Авторизация успешна:', response.data);
            } else {
                // Обработка других статусов ответа
                console.error('Авторизация не удалась:', response.statusText);
            }
        } catch (error) {
            // Обработка ошибок
            console.error('Ошибка во время запроса авторизации:', error);
        }
    };

    return (
        <div>
            <h1>Аутентификация пользователя:</h1>
            <div>
                <label>Логин</label>
                <input type="text" value={login} onChange={handleLoginChange} />
            </div>
            <div>
                <label>Пароль</label>
                <input type="password" value={password} onChange={handlePasswordChange} />
            </div>
            <div>
                <button onClick={click_send_request}>Войти</button>
            </div>
            {isAuthenticated && (
                <div>
                    <p>Пользователь аутентифицирован</p>
                    <div>
                        <Data token={token} />
                    </div>
                </div>

            )}
        </div>
    );
};

export default Login;




