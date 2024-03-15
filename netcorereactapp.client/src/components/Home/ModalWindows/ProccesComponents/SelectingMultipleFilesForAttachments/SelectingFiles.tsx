import {useEffect, useState} from "react";

export default function SelectingFiles(props ) {
    const [selectedFiles, setSelectedFiles] = useState([]);
    useEffect(() => {
        //console.log("SelectingFiles useEffect selectedFiles :\n",selectedFiles)
        props.onSelectedFilesChange(selectedFiles);
    }, [selectedFiles]);
    const handleDragOver = (event) => {
        event.preventDefault();
    };

    const handleDrop = (event) => {
        event.preventDefault();
        const files = event.dataTransfer.files;
        setSelectedFiles(prevSelectedFiles => [...prevSelectedFiles, ...files]);

    };

    const onChangeLocal = (event) => {
        const files = event.target.files;
        console.log("files into SelectingFiles component :\n",files)
        setSelectedFiles(prevSelectedFiles => [...prevSelectedFiles, ...files]);

    };
    const removeFile = (indexToRemove) => {
        setSelectedFiles(prevSelectedFiles => prevSelectedFiles.filter((file, index) => index !== indexToRemove));

    };
    return (
        <div>
            {/* Область для перетаскивания */}
            <div
                style={{
                    border: '2px dashed #cccccc',
                    padding: '20px',
                    textAlign: 'center'
                }}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
            >
                Перетащите файлы сюда или нажмите для выбора
            </div>

            {/* Инпут для выбора файла */}
            <input type="file" multiple onChange={onChangeLocal} />

            {/* Список выбранных файлов */}
            <ul>
                {selectedFiles.map((file, index) => (
                    <li key={index}>
                        {file.name}
                        <button onClick={() => removeFile(index)}>-</button>
                    </li>
                ))}
            </ul>
        </div>
    );
}