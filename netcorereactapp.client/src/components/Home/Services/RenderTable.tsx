import React from "react";
import {statusMap} from "../../../Models/OderStatusLogicsRelationships/OrderModel.tsx";
export const renderStatus = (status, handleDownload, handleAddChildStatus) => {
    //console.log("status :\n"+status)
    return (
        <tr key={status.id}>
            <td>{status.id}</td>
            <td>{statusMap[status.type]}</td>
            <td>
                {status.dateOfCreature &&
                    new Date(status.dateOfCreature).toLocaleString('ru-RU', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                    })}
            </td>
            <td>
                {status.attachments &&
                    status.attachments.map((attachment) => (
                        <div key={attachment.id}>
                            <p>Data: {attachment.attachmentData}</p>
                            <div>
                                <button onClick={() => handleDownload(attachment)}>Download File</button>
                            </div>
                        </div>
                    ))}
            </td>
            <td>
                <button onClick={() => handleAddChildStatus(status.id)}>+</button>
            </td>
                </tr>);
};

export const renderChildStatuses = (childStatuses, handleDownload, handleAddChildStatus) =>{

    console.log("childStatuses :\n")
    return(
    childStatuses.map((childStatus) => (
        <React.Fragment key={childStatus.id}>
            {renderStatus(childStatus, handleDownload, handleAddChildStatus)}
            {childStatus.childStatuses && childStatus.childStatuses.length > 0 && (
                <tr>
                    <td colSpan="6">
                        <table>
                            <tbody>{renderChildStatuses(childStatus.childStatuses, handleDownload, handleAddChildStatus)}</tbody>
                        </table>
                    </td>
                </tr>
            )}
        </React.Fragment>
    ))
    );
};

export const renderStatuses = (statuses, statusMap, handleDownload, handleAddChildStatus) => (
    statuses.map((status) => (
        <React.Fragment key={status.id}>
            {renderStatus(status, statusMap, handleDownload, handleAddChildStatus)}
            {status.childStatuses && status.childStatuses.length > 0 && (
                <tr>
                    <td colSpan="5">
                        <table>
                            <tbody>{renderChildStatuses(status.childStatuses, statusMap, handleDownload, handleAddChildStatus)}</tbody>
                        </table>
                    </td>
                </tr>
            )}
        </React.Fragment>
    ))
);

/*
export default function renderStatus(status: StatusModel, statusMap, handleDownload, handleAddChildStatus) {
    console.log('Отладочные данные:'+JSON.stringify(status)); // Вывод отладочных данных в консоль
    return (
        <React.Fragment key={status.Id}>
                <tr>
                    <td>
                        {status.id}
                    </td>
                    <td>
                        {statusMap[status.type]}
                    </td>
                    <td>
                        {status.dateOfCreature &&
                            new Date(status.dateOfCreature).toLocaleString(
                                'ru-RU',
                                {year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'}
                            )
                        }
                    </td>
                    <td>
                        {status.attachments && status.attachments.map((attachment) => (
                            <div key={attachment.id}>
                                <p>Data: {attachment.attachmentData}</p>
                                <div>
                                    <button onClick={() => handleDownload(attachment)}>Download File</button>
                                </div>
                            </div>
                        ))}
                    </td>
                    <td>
                        <button onClick={() => {
                            handleAddChildStatus(status.id)
                        }}>
                            +
                        </button>
                    </td>
                     <td>
                {status.childStatuses.map((childStatus) => (
                    <div key={childStatus.Id}>
                        {
                            childStatus.childStatuses.map((subChildStatus, index) => (
                                <div key={index}>{JSON.stringify(subChildStatus)}</div>
                            ))
                        }
                    </div>
                ))}
            </td>
                </tr>
            {/!*{status.childStatuses[0].Id == 0 && (
                <tr>
                    <td colSpan="5">
                        <table>
                            <tbody>
                            {status.childStatuses.map((childStatus) => (
                                <tr key={childStatus.Id}>
                                    <td>{childStatus.Id}</td>
                                    <td>{statusMap[childStatus.Type]}</td>
                                     Обратите внимание на изменение здесь
                                    <td>
                                        {childStatus.dateOfCreature &&
                                            new Date(childStatus.dateOfCreature).toLocaleString(
                                                'ru-RU',
                                                {
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric',
                                                    hour: '2-digit',
                                                    minute: '2-digit'
                                                }
                                            )
                                        }
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </td>
                </tr>
            )}*!/}
        </React.Fragment>
    );
}*/
