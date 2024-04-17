import {MaterialReactTable, type MRT_ColumnDef, useMaterialReactTable} from "material-react-table";
import {useEffect, useMemo, useRef, useState} from "react";
import {MRT_Localization_RU} from "material-react-table/locales/ru";
import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle, IconButton,
    List, ListItemAvatar, Typography,
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

export const OperationTableComponent = ({procces,operations,send_request}) => {

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
        send_request()
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
                send_request()
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
                size: 'auto',
                hidden: true // Указываем, что колонка должна быть скрытой
            },
            {
                accessorKey: 'caption',
                header: 'Название',
                size: 'auto',
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
                        <div >
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
            {
                accessorKey: 'equipments',
                header: 'Оборудование',
                size: 'auto',
                Cell: ((value) => {
                    const [ar,setAr]=useState()
                    useEffect(() => {
                        //console.log(value.cell.row.original.equipments)
                        setAr(value.cell.row.original.equipments)
                    }, [value]);
                    return(
                        <div>
                            {ar && (
                                ar.map((equipment, index) => (
                                    <li key={index}>{equipment.caption}</li>
                                ))
                            )}
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
                size: 'auto',
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
                        <div >
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
                                attachments.length!==0
                                &&
                                <RenderAttachmentsComponent
                                    attachments={attachments}
                                    send_request={send_request}
                                />
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
        send_request()
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

    const btnSX = {
        margin: '15px',
        color:'darkgreen',
        bgcolor: 'black',
        border: '2px solid #000',
        '&:hover': {
            color: 'white', // Изменение цвета текста при наведении
            bgcolor: 'green', // Изменение цвета фона при наведении
            border: '2px solid #000', // Изменение цвета границы при наведении
        },
    };

    const childRef = useRef(null);

    const callChildMethod = () => {
        if (childRef.current) {
            childRef.current.saveEdtingOper();
        }
    };
    return (
        <div>
            <MaterialReactTable table={table_Of_Operartions_From_Selected_Procces}/>
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
                            height:'950px',
                            width: 'auto',
                            borderRadius:'25px',
                           /* backgroundColor: 'rgba(0, 128, 0, 0.9)',*/
                            backgroundColor: 'rgba(0, 100, 0, 0.9)', /*'darkgreen',*/
                            border: '4px solid #000',
                            boxShadow: 24,
                        }
                    }}>
                <DialogTitle
                >
                    <Typography sx={{
                        fontSize:20,
                        color: 'white',
                        textShadow: '4px 4px 32px rgba(0, 0, 0, 1), -4px -4px 32px rgba(0, 0, 0, 1)'
                    }}>Выбранная операция</Typography>
                </DialogTitle>
                <DialogContent
                    sx={{
                        overflowY: 'auto',
                        height: '750px', // Максимальная высота контейнера
                        '&::-webkit-scrollbar': {
                            display: 'none', // Скрываем скроллбар для браузеров на основе WebKit (например, Chrome, Safari)
                        },
                        scrollbarWidth: 'none', // Скрываем скроллбар для остальных браузеров
                    }}
                >
                    {/*<p>Содержимое модального окна...</p>*/}
                    <SeletedOperationEditor
                                            operation={selectedOperation}
                                            ref={childRef}
                                            onClose={handleClose}
                                            notif={handleClick_openNotificationUpdateOperation}/>
                </DialogContent>
                <DialogActions
                >
                    <Button  sx={btnSX} onClick={callChildMethod}>Сохранить</Button>
                    <Button  sx={btnSX} onClick={handleClose}>Закрыть</Button>
                </DialogActions>
            </Dialog>
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