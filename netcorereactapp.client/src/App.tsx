import { Navigate } from 'react-router-dom';
import Data from './components/data/data';

import './styles/App.css';
import { Router} from './Router.tsx';
//�������� �������������� ������������
export const isAuthenticated = () => {
    const authToken = localStorage.getItem('authToken');
    //console.log("authToken : " + authToken)
    return authToken !== null; 
};

function App() {
    return (
        <div>
            <Router/>
        </div>
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