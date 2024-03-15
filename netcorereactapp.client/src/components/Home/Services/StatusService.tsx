import axios from "axios";
import config from '../../../config/config.json'

export default async function add_status_to_status(id_status: number,statusModel: FormData){

    try {
        const tokenValue = localStorage.getItem("authToken");

        const response = await axios.post(
            `${config.apiUrl}/status/${id_status}`,
            statusModel,
            {headers: {
                Authorization: `Bearer ${tokenValue}`,
                    'Content-Type': 'multipart/form-data',
                }
        });
        return response
    }
    catch (error) {
        console.error('Error downloading file:', error);
        throw error; // Пробрасывает ошибку для обработки в вызывающем коде
    }
    return ;
}