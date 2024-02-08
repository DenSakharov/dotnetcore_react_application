import { useParams } from 'react-router-dom';
import ExcelViewer from './ExcelViewer';
import { useEffect, useState } from 'react';
import { downloadFile } from '../SelectedOrder';

const ExcelPage =()=> {
    const { fileId } = useParams(); // Получаем fileId из параметров маршрута
    const fileIdNumber = parseInt(fileId); // Преобразуем fileId в число

    //console.log('fileId -> ' + fileIdNumber);

    const [base64doc, setBase64doc] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function fetchData() {
            try {
                const base64Data = await downloadFile(fileIdNumber); // Ожидание получения строки base64
                if (base64Data) {
                    //console.log('response - \n' + base64Data);
                    setBase64doc(base64Data);
                    setLoading(false); // Устанавливаем состояние загрузки в false
                } else {
                    // В случае ошибки выводим сообщение
                    console.error('Failed to download file');
                    setError('Failed to download file');
                    setLoading(false); // Устанавливаем состояние загрузки в false
                }
            } catch (error) {
                console.error('Error downloading file:', error);
                setError(error.message);
                setLoading(false); // Устанавливаем состояние загрузки в false
            }
        }

        fetchData();

        return () => {
            // Очистка эффекта, если это необходимо
        };
    }, [fileIdNumber]);

    if (loading) {
        return <div>Loading...</div>; // Отображаем загрузочное сообщение
    }

    if (error) {
        return <div>Error: {error}</div>; // Отображаем сообщение об ошибке
    }

    // Если данные загружены успешно, рендерим компонент ExcelViewer
    return (
        <div >
            {/* Компонент ExcelViewer */}
            <ExcelViewer base64Data={base64doc} />
        </div>
    );
}

export default ExcelPage;
