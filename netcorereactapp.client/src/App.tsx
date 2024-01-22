import Login from './components/login/login'
import { BrowserRouter, Routes, Route, Link, Navigate } from 'react-router-dom';
import Data from './components/data/data';

import './App.css';
// �����������, � ��� ���� �������, ������� ��������� �������������� ������������
const isAuthenticated = () => {
    // ���������� ���� ������ �������� ��������������, ��������, �������� ������� ������ � localStorage
    const authToken = localStorage.getItem('authToken');
    console.log("authToken : " + authToken)
    return authToken !== null; // ������ ������� ��������
};

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<MainPage />} />
                <Route path="login" element={<Login />} />
                <Route path="data" element={<CheckAccessToData />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
const CheckAccessToData = () => {
    // �������� �������������� ����� ������������ ����������� ��������
    if (!isAuthenticated()) {
        return <Navigate to="/login" />;
    }

    return (
        <div>
            <Data/>
        </div>
    );
};
export const MainPage = () => (
    <nav>
        <ul>
            <li>
                <Link to="/login">Login</Link>
            </li>
            <li>
                <Link to="/data">data</Link>
            </li>
        </ul>
    </nav>
);