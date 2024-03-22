import {useState} from "react";

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
            <select value={value} onChange={handlePageSizeChange}>
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
                {/*<option value={"custom"}>Желаемый размер страницы</option>*/}
                {/* <option value={() => {
                    setValueLocal("custom")
                }}>Введите желаемый размер страницы
                </option>*/}
                {/* Добавляем опцию для пользовательского значения */}
            </select>
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
