import {CenteredDivRow} from "./CenteredDivRow.tsx";
import {Button, IconButton} from "@mui/material";
import ArrowBackIosNewSharpIcon from '@mui/icons-material/ArrowBackIosNewSharp';
import ArrowForwardIosSharpIcon from '@mui/icons-material/ArrowForwardIosSharp';

export const Pagination = ({totalPages, currentPage, onPageChange}) => {
    const handleClick = (pageNumber) => {
        onPageChange(pageNumber);
    };

    return (
        <CenteredDivRow>
            <IconButton
                onClick={() => handleClick(currentPage - 1)}
                disabled={currentPage === 1}
                sx={{
                    margin: '15px',
                    bgcolor: 'background.paper',
                    boxShadow: 1,
                    borderRadius: 2,
                }}
            >
                <ArrowBackIosNewSharpIcon />
            </IconButton>
            {Array.from({length: totalPages}, (_, index) => (
                <Button
                    key={index}
                    onClick={() => handleClick(index + 1)}
                    disabled={currentPage === index + 1}
                    sx={{
                        margin: '15px',
                        bgcolor: 'background.paper',
                        boxShadow: 1,
                        borderRadius: 2,
                    }}
                >
                    {index + 1}
                </Button>
            ))}
            <IconButton
                onClick={() => handleClick(currentPage + 1)}
                disabled={currentPage === totalPages}
                sx={{
                    margin: '15px',
                    bgcolor: 'background.paper',
                    boxShadow: 1,
                    borderRadius: 2,
                }}
            >
                <ArrowForwardIosSharpIcon/>
            </IconButton>
        </CenteredDivRow>
    );
};