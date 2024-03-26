import {MaterialReactTable, type MRT_ColumnDef, useMaterialReactTable} from "material-react-table";
import {useEffect, useMemo, useState} from "react";
import {MRT_Localization_RU} from "material-react-table/locales/ru";
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
import AutoAwesomeMotionRoundedIcon from '@mui/icons-material/AutoAwesomeMotionRounded';
import {AddingChildOperation} from "../../AddingChildOperationToParentOperation/AddingChildOperation.tsx";
import {Operation} from "../../../../../../../Models/ProccesOperation/Operation.tsx";
import {RenderAttachmentsComponent, renderAttachments} from "../../../../../Services/AttachmentService.tsx";
import {Notifications} from "../../../../../../UniversalComponents/Notifications/Notifications.tsx";
import DeleteIcon from "@mui/icons-material/Delete";
import axios from "axios";
import config from "../../../../../../../config/config.json";

export const OperationTableComponent = ({procces,operations,update}) => {

    const [localOperations, setLocalOperations]
        = useState<Operation[]>([]);

    useEffect(() => {
        setLocalOperations(operations);
        //console.log(localOperations)
    }, [operations]);

    const[parentOperation,setParenetOperation]=useState()
    const [openModalWindowWithAddingChildOperation,
        setOpenModalWindowWithAddingChildOperation]=useState(false)
    const handler_Add_Child_Operation_In_ParentOperation = (oper) => {
        //alert(int)
        //console.log('oper\n',oper)
        setParenetOperation(oper)
        setOpenModalWindowWithAddingChildOperation(true)
    }
    const [openNotificationAddingOperation, setOpenNotificationAddingOperation] = useState(false);
    const handleClick_openNotificationAddingOperation = () => {
        setOpenNotificationAddingOperation(true);
    };
    const closeModalWindowWithAddingChildOperation=()=>{
        setParenetOperation()
        update()
        setOpenModalWindowWithAddingChildOperation(false)
    }
    const delete_operation=async (int: number)=>{
        try{
            const tokenValue = localStorage.getItem("authToken");
            const response = await axios.delete(
                `${config.apiUrl}/operation/${int}`,
                {
                    headers: {
                        Authorization: `Bearer ${tokenValue}`,
                    },
                }
            );
            //console.log("Response from confirmEditedOperation:", response.data);
            if(response.status==200)
            {
                update()
            }
        }
        catch (e) {

        }
    }
    const columns_Of_Operartions_From_Selected_Procces = useMemo<MRT_ColumnDef<Operation>[]>(
        () => [
            {
                accessorKey: 'id',
                header: 'Номер',
                size: 10,
                hidden: true // Указываем, что колонка должна быть скрытой
            },
            {
                accessorKey: 'caption',
                header: 'Название',
                size: 10,
                Cell: ((value) => {
                    const[id,setId]
                        =useState()
                    useEffect(() => {
                        setId(value.cell.row.original.id)
                    }, [value]);
                    const handleDeletingOperation = async (event: React.MouseEvent<HTMLButtonElement>) => {
                        event.stopPropagation();
                        await delete_operation(id)
                    };
                    return(
                        <div style={{ maxWidth: '20px' }}>
                            <IconButton
                                onClick={handleDeletingOperation}
                                style={{ color: 'green' }}>
                                <DeleteIcon style={{ fontSize: 20, color: 'green' }} />
                            </IconButton>
                            {value.cell.row._valuesCache.caption}
                        </div>
                    )
                }),
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
                size: 10,
                Cell: ((value) => {
                    const [attachments, setAttachments]
                        = useState<Operation[]>()
                    useEffect(() => {
                        setAttachments(value.cell.row._valuesCache.attachments)
                    }, [value]);
                    //console.log('value\n',value.cell.row._valuesCache.attachments)
                    const handleAddChildOperationClick = (event: React.MouseEvent<HTMLButtonElement>) => {
                        event.stopPropagation();
                        //console.log('value.cell.row.original :\n',value.cell.row.original)
                        handler_Add_Child_Operation_In_ParentOperation(value.cell.row.original)
                    };
                    return (
                        <div style={{ maxWidth: '100px' }}>
                            <ListItemAvatar>
                            <IconButton onClick={handleAddChildOperationClick}>
                                <AutoAwesomeMotionRoundedIcon/>
                            </IconButton>
                            </ListItemAvatar>

                               {/* <List>
                                    {renderAttachments(attachments)}
                                </List>*/}
                           {/* {attachments &&
                                renderAttachments(attachments)
                            }*/}
                            {attachments &&
                                <RenderAttachmentsComponent attachments={attachments}/>
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
        update()
    };
    const [selectedOperation, setSelectedOperation] = useState<Operation>()
    const editingSelectedOperation = (operation: Operation) => {
        //console.info(operation)
        setSelectedOperation(operation)
        setOpen(true);
    }

    const table_Of_Operartions_From_Selected_Procces = useMaterialReactTable({
        //добавление только раскрытых колонок (id столбец скрыт)
        columns: columns_Of_Operartions_From_Selected_Procces.filter(column => !column?.hidden),
        data: localOperations,
        enablePagination: false,
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

    const [openNotificationUpdateOperation, setOpenNotificationUpdateOperation] = useState(false);
    const handleClick_openNotificationUpdateOperation = () => {
        setOpenNotificationUpdateOperation(true);
    };
    return (
        <div>
            {openNotificationAddingOperation &&
                <Notifications message='Операция добавлена успешно!' open={openNotificationAddingOperation}/>}
            {openNotificationUpdateOperation &&
                <Notifications message='Операция обновлена успешно!' open={openNotificationUpdateOperation}/>}
            {parentOperation &&
            <AddingChildOperation parentOperation={parentOperation}
                                  open={openModalWindowWithAddingChildOperation}
                                  notif={handleClick_openNotificationAddingOperation}
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
                    <SeletedOperationEditor operation={selectedOperation}
                                            onClose={handleClose}
                                            notif={handleClick_openNotificationUpdateOperation}/>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Закрыть</Button>
                </DialogActions>
            </Dialog>
            <Box sx={{
                maxWidth: '800px',
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