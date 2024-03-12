import axios from "axios";
import {StatusModel} from "../../../Models/OderStatusLogicsRelationships/StatusModel.tsx";

export default async function add_status_to_status(id_status: number,statusModel: FormData){

    try {
        const tokenValue = localStorage.getItem("authToken");

        const response = await axios.post(
            `https://localhost:7294/status/${id_status}`,
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