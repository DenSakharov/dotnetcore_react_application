import React from "react";
import {StatusModel} from "../../Models/StatusModel.tsx";
import renderStatus, {renderStatuses} from "./Services/RenderTable.tsx";

export default function BodyElementStatuses (props){
    return (
        <React.Fragment>
              {/*  {props.currentItems.map((status: StatusModel) => (
                    renderStatus(status, statusMap, props.handleDownload, props.handleAddChildStatus)
                ))}*/}
            {renderStatuses(props.currentItems, props.handleDownload, props.handleAddChildStatus)}
        </React.Fragment>
    )
}