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
export const fetchFile = async (fileId) => {
    try {
        const base64String = await downloadFile(parseInt(fileId));
        const link = document.createElement('a');
        link.href = 'data:application/vnd.openxmlformats-officedocument.wordprocessingml.document;base64,' + base64String;
        link.download = 'document.docx';
        link.click();
    } catch (error) {
        console.error('Error fetching file:', error);
    }
};
export const load_convetered_doc_in_pdf=async (fileId)=>{
    try {
        const tokenValue = localStorage.getItem("authToken");
        //console.log(" - " + fileId)
        const response = await axios.get(`https://localhost:7294/converter/${fileId}`, {
            headers: {
                Authorization: `Bearer ${tokenValue}`,
            }
        });
        //console.log("data 1 "+JSON.stringify(response.data))
        return response.data;

    } catch (error) {
        console.error('Error downloading file:', error);
        throw error; // Пробрасывает ошибку для обработки в вызывающем коде
    }
}