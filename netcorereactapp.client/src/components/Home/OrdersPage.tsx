import React, {useEffect, useState} from 'react';
import axios from 'axios';
import AddOrderForm from './ModalWindows/AddOrderForm.tsx'
import {Modal} from './ModalWindows/Modal.tsx';
import OrderModel, {statusMap} from "../../Models/OderStatusLogicsRelationships/OrderModel.tsx";
import {ModalCreateOrderFromExcel} from "./ModalWindows/ProccesComponents/ModalCreateOrderFromExcel.tsx";

export const OrdersPage: React.FC = () => {
    const [orders, setOrders] = useState<OrderModel[]>([]);
    const fetchOrders = async () => {
        try {
            const tokenValue = localStorage.getItem("authToken");
            const response =
                await axios.get<OrderModel[]>('https://localhost:7294/orders/getorders', {
                    headers: {
                        Authorization: `Bearer ${tokenValue}`,
                    },
                });
            //console.log(response.data)
            setOrders(response.data);
            /*
            response.data.forEach(order => {
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
            });
            */
        } catch (error) {
            console.error('Error fetching orders:', error);
        }
    };
    useEffect(() => {
        fetchOrders();
    }, []);
    const handleOrderAdded = (newOrder) => {
        // Обновление списка заказов после добавления нового заказа
        setOrders([...orders, newOrder]);
        // Закрытие формы добавления
        setShowAddForm(false);
    };

    const [showAddForm, setShowAddForm] = useState(false);
    const toggleAddForm = () => {
        // Переключение видимости формы добавления
        setShowAddForm(!showAddForm);
    };

    const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null);
    const [isModal, setModal] = useState(false)
    const onRowClick = (order: OrderModel | null) => {
        setSelectedOrderId(order);
        setModal(true)
    };
    const onClose = () => {
        setModal(false)
        //window.location.reload();
    }
    //pagination data
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(5); // Примерное количество элементов на странице

    // Функция для получения индексов элементов для текущей страницы
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = orders.slice(indexOfFirstItem, indexOfLastItem);
    // #region Функции для переключения страниц

    const handleNextPage = () => {
        setCurrentPage(currentPage + 1);
    };

    const handlePrevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };
    //

    const [isModalExcelExport, setModalExcelExport] = useState(false)
    const clickExcelExport =(e)=>{
        setModalExcelExport(!isModalExcelExport);
    }
    return (
        <div>
            <h1>Заказы</h1>
            <div>
                <button onClick={toggleAddForm}>Добавить новый заказ</button>
                <button onClick={clickExcelExport}>Добавить новый заказ по Excel шаблону</button>
            </div>
            {showAddForm && (
                <Modal
                    visible={showAddForm}
                    title='Добавить новый заказ'
                    content={<AddOrderForm onOrderAdded={handleOrderAdded}/>}
                    footer={<button onClick={toggleAddForm}>Close</button>}
                    onClose={toggleAddForm}
                />
            )}
            {isModalExcelExport && (
                <ModalCreateOrderFromExcel
                    visible={isModalExcelExport}
                    title='Импорт процесса из Excel'
                    footer={<button onClick={clickExcelExport}>Close</button>}
                    onClose={clickExcelExport}
                />
            )}
            <div className="table-with-buttons">
                <table className="styled-table">
                    <thead>
                    <tr>
                        <th>№</th>
                        <th>Название</th>
                        <th>Дата создания</th>
                        <th>Дата редактирования</th>
                        <th>Статус</th>
                        <th>История</th>
                    </tr>
                    </thead>
                    <tbody>
                    {currentItems.map(order => (
                        <tr key={order.id} onClick={() => onRowClick(order)}>
                            <td>{order.id}</td>
                            <td>{order.caption}</td>

                            <td>
                                {/*корректное отображение даты создания*/}
                                {new Date(order.dateOfCreature).toLocaleString('ru-RU', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit'
                                })}
                            </td>
                            <td>
                                {order.dateOfEdited && new Date(order.dateOfEdited).toLocaleString('ru-RU', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit'
                                })}
                            </td>

                            <td>{order.statuses && order.statuses.length > 0
                                ? statusMap[order.statuses.sort((a, b) =>
                                    new Date(b.dateOfCreature).getTime() - new Date(a.dateOfCreature).getTime())[0]
                                    .type]
                                : ''}</td>
                            <td>
                                {order.events && order.events.length > 0 ?
                                    order.events[order.events.length - 1].message : ''}
                            </td>
                        </tr>

                    ))}
                    </tbody>
                </table>
                <button onClick={handlePrevPage} disabled={currentPage === 1}>Назад</button>
                <button onClick={handleNextPage}
                        disabled={currentPage === Math.ceil(orders.length / itemsPerPage)}>Вперед
                </button>
            </div>
            {selectedOrderId && (
                <Modal
                    visible={isModal}
                    title='Заголовок'
                    content={<p>Окно для показа информаци о выбранном заказе</p>}
                    footer={<button onClick={onClose}>Закрыть</button>}
                    onClose={onClose}
                    order={selectedOrderId}
                />
            )}
        </div>
    );
};
