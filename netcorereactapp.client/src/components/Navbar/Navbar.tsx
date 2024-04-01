import React, { useEffect, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

import '../../styles/Navbar.css';
import {Box, Button, Typography} from "@mui/material";

export const Navbar = () => {
    const [userInfo, setUserInfo] = useState(null);

    useEffect(() => {
        const authToken = localStorage.getItem('authToken');

        if (authToken) {
            try {
                const decodedToken = jwtDecode(authToken);
                setUserInfo(decodedToken);
            } catch (error) {
                console.error('Ошибка при раскодировании токена:', error);
            }
        }
    }, []);
    const navigate = useNavigate();
    const handleLogout = () => {
        localStorage.removeItem('authToken');

        setUserInfo(null);
        navigate("/login");
        window.location.reload();
    };

    return (
        <div className="navbar">
            <ul>
                <NavLink to="/" className="styled-button">
                        <Typography variant="body1">Главная</Typography>
                    </NavLink>
                    <NavLink to="/login" className="styled-button">
                        <Typography variant="body1">Вход</Typography>
                    </NavLink>
                    <NavLink to="/register" className="styled-button">
                        <Typography variant="body1">Регистрация</Typography>
                    </NavLink>
                {/* <li>
        <NavLink to="/data" className="nav-link">
            <Typography variant="body1">Data</Typography>
        </NavLink>
    </li> */}
                    <NavLink to="/about" className="styled-button">
                        <Typography variant="body1">О программе</Typography>
                    </NavLink>

                {userInfo && (
                    <Box className="user-info" sx={{display: 'flex', alignItems: 'center'}}>
                        <Typography variant="body1" className="welcome">
                            Welcome, {userInfo['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name']}
                        </Typography>
                        <Typography variant="body1" className="role">
                            Role: {userInfo['http://schemas.microsoft.com/ws/2008/06/identity/claims/role']}
                        </Typography>
                    </Box>
                )}
                {userInfo && (
                    <Button variant="contained" className="logout-btn" onClick={handleLogout}>
                        Logout
                    </Button>
                )}
            </ul>
        </div>
    );
}
