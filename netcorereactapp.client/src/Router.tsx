import Login from './components/login/login';
import { Routes, Route, HashRouter } from 'react-router-dom';
import { Navbar }  from './components/Navbar/Navbar';
import { CheckAccessToData } from './App';
import { About } from './About';
import { Home } from './components/Home/Home';
import Register from './components/login/register';
import  ExcelPage  from './components/Home/Document/ExcelPage';
import PDFViewer from './components/Home/Document/PDFViewer';
import WordViewer from './components/Home/Document/WordViewer';

import './styles/MainPage.css';
import {Notifications} from "./components/UniversalComponents/Notifications/Notifications.tsx";


export function Router() {
    return (
        <div className="main-container"> {/* Добавьте класс для основного контейнера */}
         
            <HashRouter>
                <Navbar />
                <div className="content">
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/data" element={<CheckAccessToData />} />
                        <Route path="/about" element={<About />} />
                        <Route path="/excel/:fileId" element={<ExcelPage />} />
                        <Route path="/pdf/:fileId" element={<PDFViewer />} />
                        <Route path="/doc/:fileId" element={<WordViewer />} />

                    </Routes>
                </div>
                <Notifications />
            </HashRouter>
        </div>
    );
}
