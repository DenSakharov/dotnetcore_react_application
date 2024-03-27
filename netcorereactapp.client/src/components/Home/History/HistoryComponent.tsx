import React, {useState, useEffect, useMemo} from 'react';
import axios from 'axios';
import config from '../../../config/config.json'
import './History.css'
import {History} from "../../../Models/ProccesOperation/History.tsx";
import {MaterialReactTable, type MRT_ColumnDef, useMaterialReactTable} from "material-react-table";
import {MRT_Localization_RU} from "material-react-table/locales/ru";
import {Operation} from "../../../Models/ProccesOperation/Operation.tsx";
export const HistoryComponent =({ int }: { int: number })=>{
    const[proccesId,setProccesId]=useState<number>()
    useEffect(() => {
        get_curent_list_histories()
    }, [proccesId]);
    useEffect(() => {
        setProccesId(int)
    }, [int]);
    const[listHistories,setListHistories]=useState<History[]>([])
    useEffect(() => {
        //console.log('l\n',listHistories)
    }, [listHistories]);
    const get_curent_list_histories=async ()=>{
        try {
            const tokenValue = localStorage.getItem("authToken");
            const response = await axios.get(//`${config.apiUrl}/procces/all`
                `${config.apiUrl}/history/${proccesId}`
                ,
                {
                    headers: {
                        Authorization: `Bearer ${tokenValue}`,
                    }
                })
            //console.log(response.status)
            if(response.status==200){
                setListHistories(response.data);
            }else {
                console.error("request failed")
            }
        }
        catch (e){
            //console.error("Before request \n",e)
        }
    }
    return (
        <HistoryTable listHistories={listHistories} />
    )
}
const HistoryTable = ({ listHistories }) => {
    const columnsHistory = useMemo<MRT_ColumnDef<Operation>[]>(
        () => [
            {
                accessorKey: 'id',
                header: 'Номер',
                size: 'auto',
                hidden: true
            },
            {
                accessorKey: 'caption',
                header: 'Название',
                size: 'auto',
                hidden: true
            },
            {
                accessorKey: 'message',
                header: 'Сообщение',
                size: 'auto',

            },
            {
                accessorKey: 'dateOfCreture', //normal accessorKey
                header: 'Дата создания',
                size: 'auto',
            },

        ],
        [listHistories],
    );
    const tableHistory = useMaterialReactTable({
        //добавление только раскрытых колонок (id столбец скрыт)
        columns: columnsHistory.filter(column => !column?.hidden),
        data: listHistories,
        enablePagination: false,
        enableBottomToolbar: false,
        muiTableBodyRowProps: ({row}) => ({
            onClick: (event) => {
                //console.info( row.original);
                //selectedProcces(row.original.id);
            },
            sx: {
                cursor: 'pointer',
            },
        }),
        localization: MRT_Localization_RU, // Используем русскую локализацию
    });
    return (
        <MaterialReactTable table={tableHistory}/>
    );
};
interface HistoryItem {
    id: number;
}

export const OldHistoryComponent = ({orderId}) => {
    const [orderHistory, setOrderHistory] = useState<HistoryItem[]>([]);
    useEffect(() => {
        const fetchData = async () => {
            try {
                const tokenValue = localStorage.getItem("authToken");
                const response = await axios.get(`${config.apiUrl}/history/${orderId}`, {
                    headers: {
                        Authorization: `Bearer ${tokenValue}`,
                    },
                });

                if (response.status == 200) {
                    console.log("response.data -> ",response.data)
                    setOrderHistory(response.data);
                    console.log(orderHistory);
                } else {
                    console.error('Error get histories order. Unexpected status:', response ? response.status : 'unknown');
                }
            } catch (error) {
                console.error('Error get histories order:', error);
            }
        };

        fetchData(); // вызываем асинхронную функцию
    }, [orderId]);

    return (
        <div className="order-history">
            <h3>Order History:</h3>
            <table className="order-history-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        {/* Добавьте заголовки для других свойств */}
                    </tr>
                </thead>
                <tbody>
                    {orderHistory.map((historyItem, index) => (
                        <tr key={index}>
                            <td>{historyItem.id}</td>
                            {/* Добавьте ячейки для других свойств */}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};
