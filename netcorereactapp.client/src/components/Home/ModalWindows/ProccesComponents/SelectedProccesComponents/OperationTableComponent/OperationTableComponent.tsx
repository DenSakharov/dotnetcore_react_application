import {MaterialReactTable, type MRT_ColumnDef, useMaterialReactTable} from "material-react-table";
import React, {useEffect, useMemo, useState} from "react";
import {MRT_Localization_RU} from "material-react-table/locales/ru";
import {Operation} from "../../../../../../Models/ProccesOperation/Operation.tsx";
import {
    Button,
    Collapse,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    List,
    ListItem,
    ListItemText,
    Typography
} from "@mui/material";
import {fetchFile} from "../../../../Services/DownloadFileService.tsx";
import img from '../../../../../../assets/react.svg'
import {Attachment} from "../../../../../../Models/ProccesOperation/Attachment.tsx";
import {OperationEditor} from "../../EditingCurrentOperation/OperationEditor.tsx";
import {SeletedOperationEditor} from "./SelectedOperationEditor/SeletedOperationEditor.tsx";
import {Notifications} from "../../../../../UniversalComponents/Notifications/Notifications.tsx";
interface NestedListProps {
    items: string[];
}

const AttachmentsNestedList: React.FC<NestedListProps> = ({ items }: Attachment[]) => {
    let[local,setLocal]=useState(items)
    useEffect(() => {
        //console.info('NestedList',local)
    }, [local]);
    const handleDownload = async (attachment) => {
        console.info('attachment\n',attachment)
        const fileId = attachment.id;
        const extension = attachment.attachmentData.split('.').pop().toLowerCase();
        if (extension === 'xlsx') {
            window.location.href = `https://localhost:5173/#/excel/${fileId}`;
        }
        //function view pdf file
        else if (extension === 'pdf') {
            window.location.href = `https://localhost:5173/#/pdf/${fileId}`;
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
    return (
        <List>
            {items.map((item, index) => (
                <ListItem key={index}>
                    <ListItemText>
                        <Typography variant="body2">{item.attachmentData}</Typography>
                        <button onClick={() => handleDownload(item)}>
                            <img src={img} alt="Загрузить"/>
                        </button>
                    </ListItemText>
                </ListItem>
            ))}
        </List>
    );
};
const ChildOperationsNestedList: React.FC<NestedListProps> = ({ items }) => {
    let[local,setLocal]=useState(items)
    useEffect(() => {
        //console.info('NestedList',local)
    }, [local]);

    return (
        <List>
            {items.map((item, index) => (
                <ListItem key={index}>
                    <ListItemText>
                        <Typography variant="body2">{item}</Typography>
                    </ListItemText>
                </ListItem>
            ))}
        </List>
    );
};
export let OperationTableComponent = (operations) => {
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
            {
                accessorKey: 'attachments',
                header: 'Вложения',
                size: 50,
                Cell: (( value ) => {
                    let[attachments,setAttachments]=useState<Operation[]>()
                    useEffect(() => {
                        setAttachments(value.cell.row._valuesCache.attachments)
                    }, [value]);
                    //console.log('value\n',value.cell.row._valuesCache.attachments)
                    return(
                        <div>
                            <Collapse in={attachments
                                && attachments.length > 0} timeout="auto" unmountOnExit>
                                {attachments &&
                                    <AttachmentsNestedList
                                        items={attachments.map((attachment) => attachment)}/>}
                            </Collapse>
                        </div>
                    )
                }),
            },
           /* {
                accessorKey: 'childsOperations',
                header: 'Дочерние операции',
                size: 50,
                Cell: (( value ) => {
                    let[operations,setOperations]=useState<Operation[]>()
                    useEffect(() => {
                        setOperations(value.cell.row._valuesCache.childsOperations)
                    }, [value]);
                    //console.log('value\n',value.cell.row._valuesCache.childsOperations)
                    return(
                        operations!== undefined
                        &&
                        operations!== null &&
                        <Collapse in={operations
                            &&
                            operations.length> 0} timeout="auto" unmountOnExit>
                            {
                                operations&& <ChildOperationsNestedList items={operations.map((operation) => operation.caption)}/>
                            }
                        </Collapse>
                    )
                }),
            },*/

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
    return(
        <div>
            {openNotification &&
                <Notifications message='Операция обновленна успешно!' open={openNotification}/>}
            <Dialog open={open} onClose={handleClose}  PaperProps={{ sx: { backgroundColor: 'darkgreen' } }} >
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