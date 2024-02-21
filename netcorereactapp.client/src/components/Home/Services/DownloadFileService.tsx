import axios from "axios";

export default async function downloadFile(fileId) {

    try {
        const tokenValue = localStorage.getItem("authToken");
        //console.log(" - " + fileId)
        const response = await axios.get(`https://localhost:7294/filedownload/${fileId}`, {
            headers: {
                Authorization: `Bearer ${tokenValue}`,
            }
        });

        return response.data

    } catch (error) {
        console.error('Error downloading file:', error);
        throw error; // Пробрасывает ошибку для обработки в вызывающем коде
    }
}