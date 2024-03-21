import {MaterialReactTable, type MRT_ColumnDef, useMaterialReactTable} from "material-react-table";
import {useEffect, useMemo, useState} from "react";
import {MRT_Localization_RU} from "material-react-table/locales/ru";
import {Operation} from "../../../../../../Models/ProccesOperation/Operation.tsx";
import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle, IconButton,
    List, ListItemAvatar,
} from "@mui/material";
import {SeletedOperationEditor} from "./SelectedOperationEditor/SeletedOperationEditor.tsx";
import {Notifications} from "../../../../../UniversalComponents/Notifications/Notifications.tsx";
import {renderAttachments} from "../../../../Services/AttachmentService.tsx";
import AutoAwesomeMotionRoundedIcon from '@mui/icons-material/AutoAwesomeMotionRounded';
import {AddingChildOperation} from "../../AddingChildOperation/AddingChildOperation.tsx";
export const OperationTableComponent = (operations) => {

    const [localOperations, setLocalOperations]
        = useState<Operation[]>([]);

    useEffect(() => {
        setLocalOperations(operations.operations);
    }, [operations.operations]);

    const[parentOperation,setParenetOperation]=useState<Operation>()
    const [openModalWindowWithAddingChildOperation,
        setOpenModalWindowWithAddingChildOperation]=useState(false)
    const handler_Add_Child_Operation_In_ParentOperation = (oper: Operation) => {
        //alert(int)
        //console.log('oper\n',oper.caption)
        setParenetOperation(oper)
        setOpenModalWindowWithAddingChildOperation(true)
    }
    const closeModalWindowWithAddingChildOperation=()=>{
        setOpenModalWindowWithAddingChildOperation(false)
    }
    const[obj,setObj]=useState()
    const columns_Of_Operartions_From_Selected_Procces = useMemo<MRT_ColumnDef<Operation>[]>(
        () => [
            {
                accessorKey: 'caption',
                header: 'Название',
                size: 50,
            },
            /*{
                accessorKey: 'dateOfCreture', //normal accessorKey
                header: 'Дата создания',
                size: 50,
            },
            {
                accessorKey: 'dateOfEdited',
                header: 'Дата редактирования',
                size: 50,
            },*/
            {
                accessorKey: 'attachments',
                header: 'Вложения',
                size: 50,
                Cell: ((value) => {
                    const [attachments, setAttachments]
                        = useState<Operation[]>()
                    useEffect(() => {
                        setAttachments(value.cell.row._valuesCache.attachments)
                    }, [value]);
                    //console.log('value\n',value.cell.row._valuesCache.attachments)
                    const handleAddChildOperationClick = (event: React.MouseEvent<HTMLButtonElement>) => {
                        event.stopPropagation(); // Предотвращаем распространение события нажатия на строку
                        /*
                        Из за разных типов данных в ячейке таблицы вот такая хрень для ячейки строки и под строки
                         */
                        //console.log("value.cell.row\n",value.cell.row.originalSubRows[0] )
                        try {
                            console.log(value.cell.row)
                            setObj(value.cell.row.original);
                            {obj &&

                            handler_Add_Child_Operation_In_ParentOperation(obj//value.cell.row.original
                            )
                            }
                            /*if (typeof obj === 'undefined') {
                                console.log(obj)
                                handler_Add_Child_Operation_In_ParentOperation(value.cell.row.original)
                            }
                                else {
                                console.log(obj)
                                handler_Add_Child_Operation_In_ParentOperation(obj);
                            }*/
                        }
                        catch (e){
                            console.error(e)
                        }

                    };
                    return (

                        <div>
                            <ListItemAvatar>
                            <IconButton onClick={handleAddChildOperationClick}>
                                <AutoAwesomeMotionRoundedIcon/>
                            </IconButton>
                            </ListItemAvatar>
                            {attachments &&
                                <List>
                                    {renderAttachments(attachments)}
                                </List>
                            }
                        </div>

                    )
                }),
            },

        ],
        [localOperations],
    );
    const [open, setOpen] = useState(false);
    const handleClose = () => {
        setOpen(false);
    };
    const [selectedOperation, setSelectedOperation] = useState<Operation>()
    const editingSelectedOperation = (operation: Operation) => {
        //console.info(operation)
        setSelectedOperation(operation)
        setOpen(true);
    }

    const table_Of_Operartions_From_Selected_Procces = useMaterialReactTable({
        columns: columns_Of_Operartions_From_Selected_Procces,
        data: localOperations,
        enablePagination: true,
        enableBottomToolbar: false,
        enableExpanding: true,
        enableExpandAll: false,
        muiTableBodyRowProps: ({row}) => ({
            onClick: (event) => {
                //console.info( row.original);
                editingSelectedOperation(row.original)
                //selectedProcces(row.original.id);
            },
            sx: {
                cursor: 'pointer',
            },
        }),
        localization: MRT_Localization_RU, // Используем русскую локализацию
        getSubRows: getSubRows, // Передаем функцию getSubRows
    });

    const [openNotification, setOpenNotification] = useState(false);
    const handleClick = () => {
        setOpenNotification(true);
    };
    return (
        <div>
            {openNotification &&
                <Notifications message='Операция обновлена успешно!' open={openNotification}/>}
            {parentOperation &&
            <AddingChildOperation parentOperation={parentOperation}
                                  open={openModalWindowWithAddingChildOperation}
                                  onClose={closeModalWindowWithAddingChildOperation}/>
            }
            <Dialog open={open} onClose={handleClose}
                    PaperProps={{
                        sx: {
                            backgroundColor: 'darkgreen',
                            color: 'white'
                        }
                    }}>
                <DialogTitle>Выбранная операция</DialogTitle>
                <DialogContent>
                    {/*<p>Содержимое модального окна...</p>*/}
                    <SeletedOperationEditor operation={selectedOperation} onClose={handleClose} notif={handleClick}/>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Закрыть</Button>
                </DialogActions>
            </Dialog>
            <Box sx={{
                maxWidth: '700px',
                margin: '0 auto',
                borderRadius: '80px', // Применяем закругление границ
                boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)', // Добавляем тень для эффекта поднятости
                p: '50px', // Добавляем внутренние отступы для контента
            }}>
                <MaterialReactTable table={table_Of_Operartions_From_Selected_Procces}/>
            </Box>
        </div>
    )
}
export const getSubRows = (originalRow) => {
    if (originalRow.childsOperations && originalRow.childsOperations.length > 0) {
        return originalRow.childsOperations.map((child) => ({
            ...child,
            subRows: getSubRows(child) // Рекурсивный вызов для обработки вложенных операций
        }));
    }
    return [];
};