import React, { useState } from 'react';
import * as XLSX from 'xlsx'; // Try importing XLSX like this

import './ExcelViewer.css';

const ExcelViewer = ({ base64Data }) => {
    const [excelData, setExcelData] = useState([]);

    const handleViewExcel = () => {
        try {
            // Decode base64 string to binary data
            const binaryData = atob(base64Data);

            // Convert binary data to byte array
            const byteNumbers = new Array(binaryData.length);
            for (let i = 0; i < binaryData.length; i++) {
                byteNumbers[i] = binaryData.charCodeAt(i);
            }
            const byteArray = new Uint8Array(byteNumbers);

            // Read Excel file from byte array
            const workbook = XLSX.read(byteArray, { type: 'array' });

            // Get data from the first sheet of the Excel file
            const worksheet = workbook.Sheets[workbook.SheetNames[0]];
            const data = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

            setExcelData(data);
        } catch (error) {
            console.error('Error reading Excel file:', error);
        }
    };

    return (
        <div className = "excel-container">
            <h2>Excel Viewer</h2>
            <button onClick={handleViewExcel}>View Excel</button>
            {excelData.length > 0 && (
                <table>
                    <tbody>
                        {excelData.map((row, rowIndex) => (
                            <tr key={rowIndex}>
                                {row.map((cell, cellIndex) => (
                                    <td key={`${rowIndex}-${cellIndex}`}>{cell}</td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default ExcelViewer;
