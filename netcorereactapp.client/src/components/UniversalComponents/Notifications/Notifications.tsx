import { Snackbar} from "@mui/material";
import  {useState} from "react";

export const Notifications=(props)=>{
    const [open, setOpen] = useState(props.open);
    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpen(false);
    };
    return(
        <div>
            <Snackbar
                open={open}
                autoHideDuration={3000}
                onClose={handleClose}
                message={props.message}
                sx={{ zIndex: 2000 }}
            />
        </div>
    )
}