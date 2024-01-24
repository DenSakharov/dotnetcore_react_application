import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

import './Navbar.css';

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

    const handleLogout = () => {
        localStorage.removeItem('authToken');

        setUserInfo(null);
        history.push('/login');
        window.location.reload();
    };

    return (
        <div className="navbar">
            <ul>
                <li><NavLink to="/">Home</NavLink></li>
                <li><NavLink to="/login">Login</NavLink></li>
                <li><NavLink to="/register">Register</NavLink></li>
                <li><NavLink to="/data">Data</NavLink></li>
                <li><NavLink to="/about">About</NavLink></li>

                {userInfo && (
                    <div className="user-info">
                        <span className="welcome">Welcome, {userInfo['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name']}</span>
                        <span className="role">Role: {userInfo['http://schemas.microsoft.com/ws/2008/06/identity/claims/role']}</span>
                    </div>
                )}
                {userInfo && (
                    <button className="logout-btn" onClick={handleLogout}>
                        Logout
                    </button>
                )}
            </ul>
        </div>
    );
}
