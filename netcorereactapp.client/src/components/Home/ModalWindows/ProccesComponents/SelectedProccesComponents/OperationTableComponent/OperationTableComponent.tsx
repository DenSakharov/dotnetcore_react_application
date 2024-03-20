import {MaterialReactTable, type MRT_ColumnDef, useMaterialReactTable} from "material-react-table";
import  {useEffect, useMemo, useState} from "react";
import {MRT_Localization_RU} from "material-react-table/locales/ru";
import {Operation} from "../../../../../../Models/ProccesOperation/Operation.tsx";
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    List,
} from "@mui/material";
import {SeletedOperationEditor} from "./SelectedOperationEditor/SeletedOperationEditor.tsx";
import {Notifications} from "../../../../../UniversalComponents/Notifications/Notifications.tsx";
import {renderAttachments} from "../../../../Services/AttachmentService.tsx";
export const OperationTableComponent = (operations) => {
    useEffect(() => {
        //console.info(operations)
    },[operations])
    const [localOperations,setLocalOperations]
        = useState<Operation[]>([]);

    useEffect(() => {
        setLocalOperations(operations.operations);
    }, [operations.operations]);

    useEffect(() => {
        //console.info("localOperations\n",localOperations)
    }, [localOperations]);
    const columns = useMemo<MRT_ColumnDef<Operation>[]>(
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
                Cell: (( value ) => {
                    const[attachments,setAttachments]
                        =useState<Operation[]>()
                    useEffect(() => {
                        setAttachments(value.cell.row._valuesCache.attachments)
                    }, [value]);
                    //console.log('value\n',value.cell.row._valuesCache.attachments)
                    return(
                        <div>
                        {attachments &&
                        <List>
                            {renderAttachments (attachments)}
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
    let [selectedOperation,setSelectedOperation]=useState<Operation>()
    const handleClose = () => {
        setOpen(false);
    };
    let editingSelectedOperation=(operation: Operation)=>{
        //console.info(operation)
        setSelectedOperation(operation)
        setOpen(true);
    }
    const table = useMaterialReactTable({
        columns,
        data: localOperations,
        enablePagination: true,
        enableBottomToolbar: false,
        enableExpanding: true,
        enableExpandAll: false,
        muiTableBodyRowProps: ({ row }) => ({
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
        getSubRows: (originalRow) => {
            //console.log('Original Row:', originalRow.childsOperations);
            return originalRow.childsOperations;
        },
    });
    const [openNotification, setOpenNotification] = useState(false);
    const handleClick = () => {
        setOpenNotification(true);
    };
    return (
        <div>
            {openNotification &&
                <Notifications message='Операция обновлена успешно!' open={openNotification}/>}

            <Dialog open={open} onClose={handleClose}
                    PaperProps={{
                        sx: {
                            backgroundColor: 'darkgreen',
                            color: 'white'
                        }
                    }}>
                <DialogTitle>Модальное окно</DialogTitle>
                <DialogContent>
                    {/*<p>Содержимое модального окна...</p>*/}
                    <SeletedOperationEditor operation={selectedOperation} onClose={handleClose} notif={handleClick}/>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Закрыть</Button>
                </DialogActions>
            </Dialog>

            <MaterialReactTable table={table}/>
        </div>
    )
}