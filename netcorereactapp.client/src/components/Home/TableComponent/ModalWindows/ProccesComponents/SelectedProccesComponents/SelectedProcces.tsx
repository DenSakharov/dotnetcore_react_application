import {SyntheticEvent, useEffect, useRef, useState} from "react";
import {Procces} from "../../../../../../Models/ProccesOperation/Procces.tsx";
import {Operation} from "../../../../../../Models/ProccesOperation/Operation.tsx";
import axios from "axios";
import config from '../../../../../../config/config.json'
import {
    addingAttachmentsToProcces,
    RenderAttachmentsComponent
} from "../../../../Services/AttachmentService.tsx";
import {CenteredDivColumn, CenteredDivRow} from "../../../../CommonComponents/CenteredDivRow.tsx";
import {Box, CircularProgress, Grid, IconButton, ListItemAvatar, Tab, Tabs, TextField, Typography} from "@mui/material";
import AddSharpIcon from '@mui/icons-material/AddSharp';
import RemoveSharpIcon from '@mui/icons-material/RemoveSharp';
import AssignmentTurnedInSharpIcon from '@mui/icons-material/AssignmentTurnedInSharp';
import SelectingFilesComponents from "../../../../CommonComponents/SelectingFilesComponents.tsx";
import {styled} from "@mui/system";
import {OperationTableComponent} from "./OperationTableComponent/OperationTableComponent.tsx";
import AutoAwesomeMotionRoundedIcon from "@mui/icons-material/AutoAwesomeMotionRounded";
import {AddChildOperToProc} from "../AddingChildOperationToProcces/AddChildOperToProc.tsx";
import DeleteIcon from "@mui/icons-material/Delete";
import {HistoryComponent} from "../../../../History/HistoryComponent.tsx";
import '../../../../../../styles/CustomTabs.scss'
import ProccesFields from "../../../../../Template/FiledSet/ProccesFields.tsx";
import {ProccesMobXStore} from "../../../../../../store/ProccesMobXStore.ts";
import {reaction, toJS} from "mobx";

export const SelectedProcces = ({int, onClose}: { int: string, onClose: void }) => {
    const [selectedProcces, setSelectedProcces] = useState<Procces>()
    const [operations, setOperations] = useState<Operation[]>()

    useEffect(() => {
        getCurrentProcces()
    }, [])
    useEffect(() => {
        //console.log("selectedProcces changed:", selectedProcces);
        setOperations(selectedProcces?.operations)
        ProccesMobXStore.setProcces(selectedProcces)
    }, [selectedProcces]);
   /* reaction(
        () => ProccesMobXStore.procces,
        (procces) => {
            //console.log('materials:', toJS(procces) );
        }
    );*/
    useEffect(() => {
        //console.log('operations\n',operations);
    }, [operations]);
    const getCurrentProcces = async () => {
        try {
            const tokenValue = localStorage.getItem("authToken");
            //console.log('Request sending in procces')
            const response = await axios.get(//`${config.apiUrl}/procces/all`
                `${config.apiUrl}/procces/${int}`
                ,
                {
                    headers: {
                        Authorization: `Bearer ${tokenValue}`,
                    }
                })
            if (response) {
                console.log('Ответ запроса на получение выбранного процесса с операциями :\n',response.data)
                setSelectedProcces(response.data);

            } else {
                console.error('requset faild')
            }
        } catch (e) {
            console.error("Before request \n", e)
        }
    }
    const inputRef = useRef(null);
    const handleTextFieldChange = (event) => {
        const {name, value} = event.target;
        const valu = inputRef.current.value;
        //console.log('Value changed:', valu);
        setSelectedProcces(prevProcces => ({
            ...prevProcces,
            [name]: value
        }));
    };
    const [selectedFiles, setSelectedFiles] = useState([]);
    const addAttachments = async (files) => {
        //console.log("Files after added :\n",files)
        setSelectedFiles(files);
    }
    const confirmEditedOperation = async () => {
        const tokenValue = localStorage.getItem("authToken");
        try {
            console.log('ProccesMobXStore.procces before request : ',toJS(ProccesMobXStore.procces))
            const response = await axios.put(
                `${config.apiUrl}/procces/updatemodel`, // URL для обновления операции по ее идентификатору
                toJS(ProccesMobXStore.procces), // Передаем отредактированный объект
                {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${tokenValue}`,
                    },
                }
            );
            //console.log("Response from confirmEditedOperation:", response.data);
            if (response.status == 200) {
                const res = await addingAttachmentsToProcces(selectedProcces?.id, selectedFiles, onClose)
                ProccesMobXStore.resetProcces()
            }
            // Возможно, здесь вы захотите обновить состояние приложения или выполнить другие действия
        } catch (error) {
            console.error("Error while confirming edited operation:", error);
            // Обработка ошибки
        }
    };
    const [view, setView] = useState(false);
    const click_view_table = (e: any) => {
        if (view)
            setView(false)
        else
            setView(true)
    }
    const [infoVisible, setInfoVisible] = useState(false);

    const toggleInfoVisibility = () => {
        setInfoVisible(!infoVisible);
    };

    const update_dependencies_selected_procces = () => {
        //console.log('update')
        getCurrentProcces()
    }

    const [openModalWindowWithAddingChildOperation,
        setOpenModalWindowWithAddingChildOperation] = useState(false)
    const handleClick_addOperation_To_Procces = async () => {
        setOpenModalWindowWithAddingChildOperation(true)
    }
    const [openNotificationAddingOperation, setOpenNotificationAddingOperation] =
        useState(false);
    const handleClick_openNotificationAddingOperation = () => {
        setOpenNotificationAddingOperation(true);
    };
    const closeModalWindowWithAddingChildOperation = async () => {
        setOpenModalWindowWithAddingChildOperation(false)
        update_dependencies_selected_procces()
    }
    const delete_procces = async () => {
        try {
            const tokenValue = localStorage.getItem("authToken");
            const response = await axios.delete(
                `${config.apiUrl}/procces/${selectedProcces?.id}`,
                {
                    headers: {
                        Authorization: `Bearer ${tokenValue}`,
                    },
                }
            );
            //console.log("Response from confirmEditedOperation:", response.data);
            if (response.status == 200) {
                onClose()
                ProccesMobXStore.resetProcces()
            }
        } catch (e) {

        }
    }
    const [value, setValue] = useState(0);

    const handleChange = (event: SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };
    return (
        <div>
            {selectedProcces &&
                <AddChildOperToProc procces={selectedProcces}
                                    open={openModalWindowWithAddingChildOperation}
                                    notif={handleClick_openNotificationAddingOperation}
                                    onClose={closeModalWindowWithAddingChildOperation}/>
            }
            {!selectedProcces && (
                <CenteredDivRow>
                    <CircularProgress/>
                </CenteredDivRow>)}
            {selectedProcces && (
                <CenteredDivColumn>
                    <CenteredDivRow
                        sx={{
                            display:'center',
                            backgroundColor: 'green',
                            border: '4px solid ',
                            borderRadius: '25px',
                            padding: '1px',
                        }}
                    >
                        <CenteredDivColumn
                            sx={{
                                width: '30%',
                            }}
                        >
                            <IconButton onClick={confirmEditedOperation} style={{color: 'white'}}>
                                <CenteredDivColumn>
                                    <AssignmentTurnedInSharpIcon style={{fontSize: 50, color: 'white'}}/>
                                    <Typography>Сохранить</Typography>
                                </CenteredDivColumn>
                            </IconButton>
                            <IconButton onClick={delete_procces} style={{color: 'white'}}>
                                <CenteredDivColumn>
                                    <DeleteIcon style={{fontSize: 60, color: 'white'}}/>
                                    <Typography>Удалить</Typography>
                                </CenteredDivColumn>
                            </IconButton>
                        </CenteredDivColumn>

                        {ProccesMobXStore.procces &&
                        <ProccesFields />}

                        {/*<CenteredDivColumn>
                            <StyledTextField
                                ref={inputRef}
                                id="outlined-helperText"
                                label="Название процесса"
                                defaultValue={selectedProcces.caption}
                                variant="outlined"
                                name="caption"
                                onChange={handleTextFieldChange}
                                autoFocus
                            />
                            <StyledTextField
                                ref={inputRef}
                                id="outlined-helperText"
                                label="Номер"
                                defaultValue={selectedProcces.number}
                                variant="outlined"
                                name="number"
                                onChange={handleTextFieldChange}
                                autoFocus
                            />
                            <StyledTextField
                                ref={inputRef}
                                id="outlined-helperText"
                                label="Материал"
                                defaultValue={selectedProcces.material}
                                variant="outlined"
                                name="material"
                                onChange={handleTextFieldChange}
                                autoFocus
                            />
                        </CenteredDivColumn>

                        <CenteredDivColumn>
                            <StyledTextField
                                ref={inputRef}
                                id="outlined-helperText"
                                label="М3"
                                defaultValue={selectedProcces.m3}
                                variant="outlined"
                                name="m3"
                                onChange={handleTextFieldChange}
                                autoFocus
                            />
                            <StyledTextField
                                ref={inputRef}
                                id="outlined-helperText"
                                label="КД"
                                defaultValue={selectedProcces.kd}
                                variant="outlined"
                                name="kd"
                                onChange={handleTextFieldChange}
                                autoFocus
                            />
                            <StyledTextField
                                ref={inputRef}
                                id="outlined-helperText"
                                label="Профиль и размеры"
                                defaultValue={selectedProcces.profile_size}
                                variant="outlined"
                                name="profile_size"
                                onChange={handleTextFieldChange}
                                autoFocus
                            />
                        </CenteredDivColumn>*/}

                        {/*{selectedProcces.attachments &&
                                <List>
                                    {renderAttachments(selectedProcces.attachments)}
                                </List>
                            }*/}
                        {/* {selectedProcces.attachments &&
                                renderAttachments(selectedProcces.attachments)
                            }*/}
                    </CenteredDivRow>

                    <Tabs
                        className="custom-tabs"
                        value={value}
                        onChange={handleChange}
                        aria-label="simple tabs example"
                        variant="scrollable"
                        scrollButtons
                        allowScrollButtonsMobile
                        sx={{
                            width: '100%',
                        }}
                    >
                        <Tab label="Операции выбранного процесса"/>
                        <Tab label="Прикрепленные вложения процесса"/>
                        <Tab label="История изменений"/>
                        {/* Добавьте другие вкладки по аналогии */}
                    </Tabs>
                    <TabPanel sx={{
                        width: '100%',
                    }}
                              value={value} index={0}>
                        <ListItemAvatar>
                            <IconButton style={{color: 'white'}} onClick={handleClick_addOperation_To_Procces}>
                                Добавить операцию
                                <AutoAwesomeMotionRoundedIcon style={{fontSize: 30, color: 'white'}}/>
                            </IconButton>
                        </ListItemAvatar>
                        {operations && <OperationTableComponent procces={selectedProcces} operations={operations}
                                                                send_request={update_dependencies_selected_procces}/>}

                    </TabPanel>
                    <TabPanel value={value} index={1}>
                        <CenteredDivColumn>
                            {selectedProcces.attachments &&
                                selectedProcces.attachments.length!==0
                                &&
                                    <RenderAttachmentsComponent
                                        attachments={selectedProcces.attachments}
                                        send_request={update_dependencies_selected_procces}
                                    />
                                }
                            <CenteredDivColumn >
                                <IconButton onClick={toggleInfoVisibility}>
                                    {infoVisible ? <RemoveSharpIcon sx={{color:'white',}}/> : <AddSharpIcon sx={{color:'white',}}/>}
                                </IconButton>
                                {infoVisible && (
                                    <SelectingFilesComponents onSelectedFilesChange={addAttachments}/>
                                )}
                            </CenteredDivColumn>
                        </CenteredDivColumn>
                    </TabPanel>
                    <TabPanel value={value} index={2}>
                        <Typography variant="body1">
                            История процесса :
                        </Typography>
                        <HistoryComponent int={selectedProcces?.id}/>
                    </TabPanel>
                </CenteredDivColumn>
            )}
        </div>
    )
}

function TabPanel(props) {
    const {children, value, index, ...other} = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`tabpanel-${index}`}
            aria-labelledby={`tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{p: 3}}>
                    <div>{children}</div>
                </Box>
            )}
        </div>
    );
}


export const StyledTextField = styled(TextField)({
    margin: '5px',
    width: '40ch',
    color:'white',
    '& .MuiInputBase-input, & .MuiInputBase-multiline, & .MuiInputLabel-root, & .MuiFormHelperText-root': {
        color: 'white',
    },
});

