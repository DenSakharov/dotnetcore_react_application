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
import {AddingChildOperation} from "../../AddingChildOperation/AddingChildOperation.tsx";
import {Operation} from "../../../../../../../Models/ProccesOperation/Operation.tsx";
import {renderAttachments} from "../../../../../Services/AttachmentService.tsx";
import {Notifications} from "../../../../../../UniversalComponents/Notifications/Notifications.tsx";

export const OperationTableComponent = ({operations,update}) => {

    const [localOperations, setLocalOperations]
        = useState<Operation[]>([]);

    useEffect(() => {
        setLocalOperations(operations);
    }, [operations.operations]);

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
    const columns_Of_Operartions_From_Selected_Procces = useMemo<MRT_ColumnDef<Operation>[]>(
        () => [
            {
                accessorKey: 'id',
                header: 'Номер',
                size: 50,
                hidden: true // Указываем, что колонка должна быть скрытой
            },
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
                        event.stopPropagation();
                        handler_Add_Child_Operation_In_ParentOperation(value.cell.row._valuesCache)
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
        update()
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