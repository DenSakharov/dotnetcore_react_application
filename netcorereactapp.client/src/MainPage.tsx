import Login from './components/login/login';
import { Routes, Route, HashRouter } from 'react-router-dom';
import { Navbar }  from './components/Navbar/Navbar';
import { CheckAccessToData } from './App';
import { About } from './About';
import { Home } from './components/Home/Home';
import Register from './components/login/register';
import  ExcelPage  from './components/Home/Document/ExcelPage';
import DocumnetViewer from './components/Home/Document/DocumentViewer';

import './styles/MainPage.css';

export function MainPage() {
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
                        <Route path="/pdf/:fileId" element={<DocumnetViewer />} />
                    </Routes>
                </div>
            </HashRouter>
        </div>
    );
}
