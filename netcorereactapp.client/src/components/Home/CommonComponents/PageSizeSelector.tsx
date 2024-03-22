import {useState} from "react";

export const PageSizeSelector = ({value, onChange}) => {
    const [customPageSize, setCustomPageSize] = useState("");
    const [valueLocal, setValueLocal] = useState("")
    const handlePageSizeChange = (event) => {
        const selectedValue = event.target.value;
        setValueLocal(selectedValue);
        if (selectedValue === "custom") {
            setValueLocal("custom")
            setCustomPageSize(""); // ���������� ���������������� ������ �������� ��� ������ ����� "Custom"
        } else {
            onChange(parseInt(selectedValue)); // �������� onChange ��� ���������� ������� ��������
        }
    };
    const handleCustomPageSizeChange = (event) => {
        const newValue = parseInt(event.target.value);
        setCustomPageSize(newValue);
        onChange(newValue); // �������� ���������� onChange ��� ���������� ������� ��������
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
                {/*<option value={"custom"}>�������� ������ ��������</option>*/}
                {/* <option value={() => {
                    setValueLocal("custom")
                }}>������� �������� ������ ��������
                </option>*/}
                {/* ��������� ����� ��� ����������������� �������� */}
            </select>
            {valueLocal === "custom" && ( // ���������� ��������� ���� ������ ��� ������ ����������������� ��������
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
