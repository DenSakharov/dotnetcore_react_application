import axios from "axios";
import React, { useEffect, useState } from "react";
import {get_current_order} from "../../Services/GetCurrentOrder.tsx";
import {fetchFile} from "../../Services/DownloadFileService.tsx";
import OrderModel, {statusMap} from "../../../../Models/OderStatusLogicsRelationships/OrderModel.tsx";
import {AttachmentModel} from "../../../../Models/OderStatusLogicsRelationships/AttachmentModel.tsx";
import {ModalStatusWindow} from "./ModalStatusWindow.tsx";
import config from '../../../../config/config.json'
import '../../../../styles/SelectedOrder.css'
import AddStatus from "./StatusOfOrder/AddStatus.tsx";
import BodyElementStatuses from "./BodyElementStatuses.tsx";
export const SelectedOrder:
    React.FC<{ orderInput: OrderModel | null; closeModal: () => void }>
    = ({ orderInput, closeModal }) => {

    const [order, setOrder] = useState<OrderModel | null>(orderInput);
    const fetchOrder = async () => {
        try {
            const resp = await get_current_order(orderInput.id);
            //console.log(resp);
            setOrder(resp);
        } catch (error) {
            console.error('Error fetching order:', error);
        }
    };
    useEffect(() => {
        fetchOrder();
            /*
            console.log(`Order ID: ${order.id}`);
            console.log(`Caption: ${order.caption}`);
            console.log(`Date of Creation: ${order.dateOfCreature}`);
            console.log(`Date of Editing: ${order.dateOfEdited}`);
            if (order.statuses) {
                order.statuses.forEach(status => {
                    console.log(`Status ID: ${status.id}`);
                    console.log(`Status Type: ${status.type}`);
                    console.log(`Date of Creation: ${status.dateOfCreature}`);
                    if (status.attachments) {
                        status.attachments.forEach(attachment => {
                            console.log(`Attachment ID: ${attachment.id}`);
                            console.log(`Attachment Data: ${attachment.attachmentData}`);
                        });
                    }
                });
            }
            if (order.events) {
                order.events.forEach(event => {
                    console.log(`Event ID: ${event.id}`);
                    console.log(`Date of Change: ${event.dateOfChange}`);
                    console.log(`Message: ${event.message}`);
                });
            }
            console.log('---------------------------');
            //*/
        }, []);
    const handleDownload = async (attachment: AttachmentModel) => {
            const fileId = attachment.id;
            const extension = attachment.attachmentData.split('.').pop().toLowerCase();
            if (extension === 'xlsx') {
                window.location.href = `https://localhost:5173/#/excel/${fileId}`;
            }
            //function view pdf file
            else if (extension === 'pdf') {
                //window.location.href = `https://localhost:5173/#/pdf/${fileId}`;
                window.open(`https://localhost:5173/#/pdf/${fileId}`, '_blank');
            }
            else if (extension === 'doc' || extension === 'docx') {
                window.location.href = `https://localhost:5173/#/doc/${fileId}`;
               //await fetchFile(fileId)
            }
            else{
                await fetchFile(fileId, attachment.attachmentData)
                //alert("Невозможно открыть файл данного типа расширения !")
            }
        };
    const deleteOrder = async () => {
        try {
            const tokenValue = localStorage.getItem("authToken");
            const id = order.id;
            if (typeof closeModal === 'function') {
                const response = await axios.delete(`${config.apiUrl}/orders/${id}`, {
                    headers: {
                        Authorization: `Bearer ${tokenValue}`,
                    },
                });

                // Проверяем успешность удаления
                if (response.status === 200) {
                    closeModal();
                } else {
                    console.error('Error deleting order. Unexpected status:', response.status);
                }
            } else {
                console.log("no")
            }
        } catch (error) {
            console.error('Error deleting order:', error);
        }
    };

    const [isVisible, setIsVisible] = useState(false);
    const toggleVisibility = () => {
        setIsVisible(!isVisible);
    };

    // #region Блок 1: Pagination data
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(5); // Примерное количество элементов на странице

    // Функция для получения индексов элементов для текущей страницы
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = order.statuses
        ? order.statuses.slice(indexOfFirstItem, indexOfLastItem)
        : [];

    // Функции для переключения страниц
    const handleNextPage = () => {
        setCurrentPage(currentPage +  1);
    };
    const handlePrevPage = () => {
        if (currentPage >  1) {
            setCurrentPage(currentPage -  1);
        }
    };
    // #endregion

    // #region логика отображение модального окна для добавления дочернего  статуса
    const[selectedChildStatusId,setSelectedChildStatusId]=useState<number|null>()
    const [isMoadlStatusWindow, setMoadlStatusWindow] = useState(false)
    const onCloseMoadlStatusWindow = () => {
        setMoadlStatusWindow(false)
        //window.location.reload();
    }
    const handleAddChildStatus=(id: number)=>{
        //console.log("handleAddChildStatus -> "+id)
        setSelectedChildStatusId(id)
        setMoadlStatusWindow(true)
    }
    // #endregion
    return (
        <div className="order-container">
            <div className="order-details">
                <p>Идентификатор : {order.id}</p>
                <p>Название заказа : {order.caption}</p>
                <p>
                    Текущий статус заказа : {order.statuses && order.statuses.length > 0
                    ? statusMap[order.statuses.sort((a, b) =>
                        new Date(b.dateOfCreature).getTime() - new Date(a.dateOfCreature).getTime())[0]
                        .type]
                    : ''}
                </p>
                <button onClick={deleteOrder}>Удалить заказ</button>
            </div>
            <div className="add-status">
                <button onClick={toggleVisibility}>
                    {isVisible ? "-" : "Добавить статус заказа"}
                </button>
                {isVisible && order && typeof closeModal === 'function' && (
                    <AddStatus order={order} closeModal={closeModal}/>
                )}
            </div>
            <div className="table-container">
                <table className="styled-table">
                    <thead>
                    <tr>
                        <th>Номер статуса</th>
                        <th>Статус</th>
                        <th>Дата создания</th>
                        <th>Файл</th>
                        <th></th>
                    </tr>
                    </thead>
                    <tbody>
                    <BodyElementStatuses
                        currentItems={currentItems}
                        handleDownload={handleDownload}
                        handleAddChildStatus={handleAddChildStatus}
                    />
                    </tbody>
                </table>
            </div>
            <button onClick={handlePrevPage} disabled={currentPage === 1}>Назад</button>
            <button onClick={handleNextPage}
                    disabled={currentPage === Math.ceil(order.statuses.length / itemsPerPage)}>Вперед
            </button>
            {selectedChildStatusId && (
                <ModalStatusWindow
                    visible={isMoadlStatusWindow}
                    title='Добавление нового дочернего статуса'
                    selectedChildStatusId={selectedChildStatusId}
                    footer={<button onClick={onCloseMoadlStatusWindow}>Закрыть</button>}
                    onClose={onCloseMoadlStatusWindow}
                />
            )}
        </div>
    );
};






