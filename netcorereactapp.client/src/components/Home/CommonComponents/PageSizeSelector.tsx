import {useState} from "react";
import {MenuItem, Select} from "@mui/material";

export const PageSizeSelector = ({value, onChange}) => {
    const [customPageSize, setCustomPageSize] = useState("");
    const [valueLocal, setValueLocal] = useState("")
    const handlePageSizeChange = (event) => {
        const selectedValue = event.target.value;
        setValueLocal(selectedValue);
        if (selectedValue === "custom") {
            setValueLocal("custom")
            setCustomPageSize(""); // Сбрасываем пользовательский размер страницы при выборе опции "Custom"
        } else {
            onChange(parseInt(selectedValue)); // Вызываем onChange для обновления размера страницы
        }
    };
    const handleCustomPageSizeChange = (event) => {
        const newValue = parseInt(event.target.value);
        setCustomPageSize(newValue);
        onChange(newValue); // Вызываем обработчик onChange для обновления размера страницы
        setValueLocal("")
    };
    return (
        <div>
            <Select
                labelId="select-label"
                id="select"
                value={value}
                onChange={handlePageSizeChange}
                sx={{
                    bgcolor: 'background.paper',
                    boxShadow: 1,
                    borderRadius: 2,
                    p: 2,
                    height: '4px',
                    width: '120px',
                }}
            >
                <MenuItem value={5}>5</MenuItem>
                <MenuItem value={10}>10</MenuItem>
                <MenuItem value={20}>20</MenuItem>
                <MenuItem value={50}>50</MenuItem>
                <MenuItem value={100}>100</MenuItem>
                {/*<option value={"custom"}>Желаемый размер страницы</option>*/}
                {/* <option value={() => {
                    setValueLocal("custom")
                }}>Введите желаемый размер страницы
                </option>*/}
                {/* Добавляем опцию для пользовательского значения */}
            </Select>
            {valueLocal === "custom" && ( // Показываем текстовое поле только при выборе пользовательского значения
                <input
                    type="number"
                    value={customPageSize}
                    onChange={handleCustomPageSizeChange}
                    placeholder="Enter custom page size"
                />
            )}
        </div>
    );
};
