import {Procces} from "../../../Models/ProccesOperation/Procces.tsx";
import {useEffect, useMemo, useState} from "react";
import axios from "axios";
import config from '../../../config/config.json';
import {MaterialReactTable, MRT_ColumnDef, useMaterialReactTable} from "material-react-table";
import {MRT_Localization_RU} from "material-react-table/locales/ru";
import ModalViewSelectedProcces
    from "./ModalWindows/ModalViewSelectedProcces.tsx";
import {Box} from "@mui/material";
import {PageSizeSelector} from "../CommonComponents/PageSizeSelector.tsx";
import {Pagination} from "../CommonComponents/Pagination.tsx";

export default function Table() {
    const [data, setData] = useState<Procces[]>([])

    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(5);
    const [totalPages, setTotalPages] = useState(1);
    /*const [pagination, setPagination] = useState({
        pageIndex: 0,
        pageSize: 2, //customize the default page size
    });*/
    useEffect(() => {
        //console.log('currentPage\n',currentPage)
        getData();
    }, [currentPage, pageSize]);
   /* useEffect(() => {
        console.log("Data changed:", data);
    }, [data]);*/
    const getData = async () => {
        try {
            const tokenValue = localStorage.getItem("authToken");
            const response = await axios.get(//`${config.apiUrl}/procces/all`
                `${config.apiUrl}/procces/all/${currentPage}/${pageSize}`
                ,
                {
                    headers: {
                        Authorization: `Bearer ${tokenValue}`,
                    }
                })
            //console.log(response.data)
            setData(response.data.procceses);
            setTotalPages(Math.ceil(response.data.totalCount / pageSize));
        }
        catch (e){
            console.error("Before request \n",e)
        }

    }
    const columns = useMemo<MRT_ColumnDef<Procces>[]>(
        () => [
            {
                accessorKey: 'id', //access nested data with dot notation
                header: 'Номер',
                size: 10,
            },
            {
                accessorKey: 'caption',
                header: 'Название',
                size: 50,
            },
           /* {
                accessorKey: 'dateOfCreture', //normal accessorKey
                header: 'Дата создания',
                size: 50,
            },
            {
                accessorKey: 'dateOfEdited',
                header: 'Дата редактирования',
                size: 50,
            },*/
        ],
        [],
    );

    const table = useMaterialReactTable({
        columns,
        data,
        enablePagination: true,
        enableBottomToolbar: false,
        muiTableBodyRowProps: ({ row }) => ({
            onClick: (event) => {
                //console.info( row.id);
                selectedProcces(row.original.id);
            },
            sx: {
                cursor: 'pointer', //you might want to change the cursor too when adding an onClick
            },
        }),
        localization: MRT_Localization_RU, // Используем русскую локализацию
    });
    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
    };
    const handleChangePageSize = (newPageSize) => {
        setPageSize(newPageSize);
    };
    const [isModalExcelExport, setModalExcelExport] = useState(false)
    const[selectedProccesId,setSelectedProccesId]=useState()
    const selectedProcces=(int: number)=>{
        //console.info(int)
        setSelectedProccesId(int)
        setModalExcelExport(true);
    }
    const clickExcelExport =(e)=>{
        getData();
        setModalExcelExport(!isModalExcelExport);
    }
    return (
        <div>
            {isModalExcelExport && (
            <ModalViewSelectedProcces
                visible={isModalExcelExport}
                title='Карточка выбранного процесса'
                footer={<button onClick={clickExcelExport}>Close</button>}
                proccesId={selectedProccesId}
                onClose={clickExcelExport}
            />
            )}
            <Box sx={{
                maxWidth: '400px',
                margin: '0 auto',
                borderRadius: '80px', // Применяем закругление границ
                boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)', // Добавляем тень для эффекта поднятости
                p: '50px', // Добавляем внутренние отступы для контента
            }}>
                <MaterialReactTable table={table}/>
                <PageSizeSelector value={pageSize} onChange={handleChangePageSize}/>
                <Pagination totalPages={totalPages} currentPage={currentPage} onPageChange={handlePageChange}/>
            </Box>
        </div>
    );
}

