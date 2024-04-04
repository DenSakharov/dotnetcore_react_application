import {useEffect, useState} from "react";

export const Test=()=>{
    const [file, setFile] = useState(null);

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        setFile(selectedFile);
    }

    return (
        <div>
            <input type="file" onChange={handleFileChange} />
            {file && <ExcelCopyPaste file={file} />}
        </div>
    );
}
import ExcelJS from 'exceljs';

const ExcelCopyPaste = ({ file }) => {
    const [sourceRange] = useState('A34:DF64');
    const [destinationRange] = useState('A65');

    const handleCopyPaste = async () => {
        try {
            const reader = new FileReader();
            reader.onload = async (e) => {
                const data = new Uint8Array(e.target.result);
                const workbook = new ExcelJS.Workbook();
                await workbook.xlsx.load(data);
                const sheetName = "МК"; // Название листа
                const worksheet = workbook.getWorksheet(sheetName);

                const [sourceStart, sourceEnd] = sourceRange.split(':');
                const [destCol, destRow] = destinationRange.match(/[a-zA-Z]+|[0-9]+/g);
                const [sourceStartCol, sourceStartRow] = sourceStart.match(/[a-zA-Z]+|[0-9]+/g);

                const startColIndex = columnNameToIndex(sourceStartCol);
                const endColIndex = columnNameToIndex(sourceEnd.match(/[a-zA-Z]+/)[0]);
                const colCount = endColIndex - startColIndex + 1;
                const rowCount = Number(sourceEnd.match(/[0-9]+/)[0]) - Number(sourceStartRow) + 1;

                for (let row = 1; row <= rowCount; row++) {
                    for (let col = 1; col <= colCount; col++) {
                        const sourceCell = worksheet.getCell(`${columnNameFromIndex(startColIndex + col - 1)}${Number(sourceStartRow) + row - 1}`);
                        const destinationCell = worksheet.getCell(`${columnNameFromIndex(Number(destCol))}${Number(destRow) + row - 1}`);
                        destinationCell.value = sourceCell.value;
                        destinationCell.style = sourceCell.style;
                    }
                }

                const buffer = await workbook.xlsx.writeBuffer();
                const blob = new Blob([buffer], { type: 'application/octet-stream' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'modified.xlsx';
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
            };
            reader.readAsArrayBuffer(file);
        } catch (error) {
            console.error(error);
        }
    }

    const columnNameToIndex = (name) => {
        let index = 0;
        for (let i = 0; i < name.length; i++) {
            index = index * 26 + name.charCodeAt(i) - 64;
        }
        return index;
    }

    const columnNameFromIndex = (index) => {
        let name = '';
        while (index > 0) {
            let rem = index % 26;
            if (rem === 0) {
                name = 'Z' + name;
                index = Math.floor(index / 26) - 1;
            } else {
                name = String.fromCharCode(rem + 64) + name;
                index = Math.floor(index / 26);
            }
        }
        return name;
    }

    return (
        <div>
            <button onClick={handleCopyPaste}>Copy Paste</button>
        </div>
    );
}

export default ExcelCopyPaste;


