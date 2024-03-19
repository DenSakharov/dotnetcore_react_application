import {Collapse, List, ListItem, ListItemText} from "@mui/material";
import {useEffect, useState} from "react";
import {Operation} from "../../../../../../Models/ProccesOperation/Operation.tsx";
import {ExpandLess, ExpandMore} from "@mui/icons-material";

export default function OperationListComponent({ operations }: { operations: Operation[] }) {
    const [localOperations, setLocalOperations] = useState(operations);

   /* useEffect(() => {
        console.info(localOperations);
    }, [localOperations]);*/

    return (
        <div>
            {localOperations !== undefined && localOperations !== null && (
                <OperationList operations={localOperations}/>
            )}
        </div>
    );
}


const OperationList = ({ operations }: { operations: Operation[] }) => {
    const [localOperations, setLocalOperations] = useState(operations);
    /* useEffect(() => {
         console.info(localOperations);
     }, [localOperations]);*/
    return (
        <div>
            <List>
                {/* Отображение каждой операции в виде списка */}
                {localOperations.map(operation => (
                    <OperationListItem key={operation.id} operation={operation}/>
                ))}
            </List>
        </div>
    );
};

const OperationListItem = (operation) => {
    const [localOperation, setLocalOperation] = useState<Operation>(operation.operation);
     useEffect(() => {
         //console.info(localOperation);
     }, [localOperation]);
    const [open, setOpen] = useState(false);

    const handleClick = () => {
        setOpen(!open);
    };

    return (
        <div>
            <ListItem button onClick={handleClick}>
                {/*<ListItemText primary={`Номер : ${operation.id}`} />*/}
                <ListItemText primary={` ${localOperation.caption}`}/>
                {/* <ListItemText primary={`Parent Operation ID: ${operation.parentOperationId}`} />*/}
                <div>
                    {localOperation.attachments &&
                        localOperation.attachments.map(attachment => (
                            <li key={attachment.id}>
                                {attachment.attachmentData}
                            </li>
                        ))
                    }
                </div>
                {open ? <ExpandLess/> : <ExpandMore/>}
            </ListItem>
            <Collapse in={open} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                    {/* Рекурсивный вызов OperationListItem для вложенных операций */}
                    {localOperation.childsOperations &&
                        localOperation.childsOperations.map(childOperation => (
                            <OperationListItem key={childOperation.id} operation={childOperation}/>
                        ))
                    }
                </List>
            </Collapse>
        </div>
    );
};
