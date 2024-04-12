import {useState} from "react";
import MainTemplateModal from "./MainTemplateModal.tsx";

export const Template=()=>{
    const [open, setOpen] = useState(false);

    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        if (window.confirm('Вы уверены, что хотите закрыть окно?')) {
            setOpen(false);
        }
    };
    return (
        <div className="container">
            <div>
                <button className="styled-button"
                        onClick={handleOpen}>
                    Добавить новый процесс
                </button>
                <MainTemplateModal open={open} handleClose={handleClose} />
            </div>
            {/* <div>
                <OldOrdersWithStatuses/>
            </div>*/}
        </div>
    );
}