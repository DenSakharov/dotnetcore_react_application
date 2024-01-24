import { Navigate } from 'react-router-dom';
import Data from './components/data/data';

import './styles/App.css';
import { MainPage } from './MainPage';
//�������� �������������� ������������
export const isAuthenticated = () => {
    const authToken = localStorage.getItem('authToken');
    //console.log("authToken : " + authToken)
    return authToken !== null; 
};

function App() {
    return (
        <MainPage></MainPage>
    );
}
export default App;

export const CheckAccessToData = () => {
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