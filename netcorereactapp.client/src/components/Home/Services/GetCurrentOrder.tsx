import OrderModel from "../ExcelImportProccesLogic/HomeComponent.tsx";
import axios from "axios";
import config from '../../../config/config.json'
export const get_current_order=async (id: number): Promise<OrderModel>=>{
    try {
        const tokenValue = localStorage.getItem("authToken");
        //console.log(" - " + fileId)
        const response =
            await axios.get(`${config.apiUrl}/orders/${id}`, {
            headers: {
                Authorization: `Bearer ${tokenValue}`,
            }
        });
        //console.log("response.data : "+ JSON.stringify(response.data))
        // Проверяем, есть ли данные в ответе
        if (response.data) {
            const newObject = {
                id: response.data.id,
                caption: response.data.caption,
                dateOfCreature: response.data.dateOfCreature,
                dateOfEdited: response.data.dateOfEdited,
                statuses: response.data.statuses,
            };
            //console.log(newObject);
            return newObject;
        } else {
            throw new Error('No data returned from server');
        }

    } catch (error) {
        console.error('Error downloading file:', error);
        throw error; // Пробрасывает ошибку для обработки в вызывающем коде
    }
}