import {useEffect, useMemo, useState} from 'react';
import {
    MaterialReactTable,
    useMaterialReactTable,
    type MRT_ColumnDef,
} from 'material-react-table';
import {Procces} from "../../../Models/ProccesOperation/Procces.tsx";
import axios from "axios";
import config from '../../../config/config.json'
import {MRT_Localization_RU} from "material-react-table/locales/ru";
import ModalViewSelectedProcces
    from "../ModalWindows/ProccesComponents/SelectedProccesComponents/ModalViewSelectedProcces.tsx";
import {Box} from "@mui/material";

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
            {
                accessorKey: 'dateOfCreture', //normal accessorKey
                header: 'Дата создания',
                size: 50,
            },
            {
                accessorKey: 'dateOfEdited',
                header: 'Дата редактирования',
                size: 50,
            },
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
                maxWidth: '800px',
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
export const PageSizeSelector = ({ value, onChange }) => {
    const [customPageSize, setCustomPageSize] = useState("");
    const [valueLocal,setValueLocal]=useState("")
    const handlePageSizeChange = (event) => {
        const selectedValue = event.target.value;
        setValueLocal(selectedValue);
        if (selectedValue === "Введите желаемый размер страницы") {
            setCustomPageSize(""); // Сбрасываем пользовательский размер страницы при выборе опции "Custom"
        } else {
            onChange(parseInt(selectedValue)); // Вызываем onChange для обновления размера страницы
        }
    };
    const handleCustomPageSizeChange = (event) => {
        const newValue = parseInt(event.target.value);
        setCustomPageSize(newValue);
        onChange(newValue); // Вызываем обработчик onChange для обновления размера страницы
        setValueLocal("")
    };
    return (
        <div>
            <select value={value} onChange={handlePageSizeChange}>
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
                <option value={() => {
                    setValueLocal("custom")
                }}>Введите желаемый размер страницы
                </option>
                {/* Добавляем опцию для пользовательского значения */}
            </select>
            {valueLocal === "Введите желаемый размер страницы" && ( // Показываем текстовое поле только при выборе пользовательского значения
                <input
                    type="number"
                    value={customPageSize}
                    onChange={handleCustomPageSizeChange}
                    placeholder="Enter custom page size"
                />
            )}
        </div>
    );
};
export const Pagination = ({totalPages, currentPage, onPageChange}) => {
    const handleClick = (pageNumber) => {
        onPageChange(pageNumber);
    };

    return (
        <div>
            <button onClick={() => handleClick(currentPage - 1)} disabled={currentPage === 1}>
                {'<'}
            </button>
            {Array.from({length: totalPages}, (_, index) => (
                <button key={index} onClick={() => handleClick(index + 1)} disabled={currentPage === index + 1}>
                    {index + 1}
                </button>
            ))}
            <button onClick={() => handleClick(currentPage + 1)} disabled={currentPage === totalPages}>
                {'>'}
            </button>
        </div>
    );
};