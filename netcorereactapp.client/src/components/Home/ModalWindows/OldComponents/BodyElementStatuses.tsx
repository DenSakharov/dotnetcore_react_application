import React from "react";
import {renderStatuses} from "../../Services/RenderTable.tsx";

export default function BodyElementStatuses (props){
    return (
        <React.Fragment>
            {renderStatuses(props.currentItems, props.handleDownload, props.handleAddChildStatus)}
        </React.Fragment>
    )
}