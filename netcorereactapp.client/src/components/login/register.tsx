﻿import React, { MouseEventHandler, useState } from 'react';
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import Data from '../data/data';
import config from '../../config/config.json'

const Register = () => {
    const [login, setLogin] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('user')

    const [isAuthenticated, setIsAuthenticated] = useState(false);

    const navigate = useNavigate();

    const handleLoginChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setLogin(event.target.value);
    };

    const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(event.target.value);
    };

    const handleRoleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRole(event.target.value);
    };

    const click_send_request: MouseEventHandler<HTMLButtonElement> = async () => {
        try {
            const login_url = `${config.apiUrl}/authentication/register`;
            const response = await axios.post(login_url, {
                login,
                role,
                password,
            }, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.status === 200) {
                // Успешная аутентификация
                setIsAuthenticated(true);

                localStorage.setItem("authToken", String(response.data));

                navigate("/");
                window.location.reload();
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
            <h1>Регистрация нового пользователя:</h1>
            <div>
                <label>Логин</label>
                <input type="text" value={login} onChange={handleLoginChange} />
            </div>
            <div>
                <label>Роль</label>
                <select id="roles" type="text" defaultValue={role} onChange={handleRoleChange}>
                    <option value="admin">Admin</option>
                    <option value="user">User</option>
                </select>
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
                        <Data />
                    </div>
                </div>

            )}
        </div>
    );
};

export default Register;




