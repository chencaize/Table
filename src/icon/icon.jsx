import React from "react";
import iconItems from "./config";

function Icon(props) {
    const { type, style } = props;
    return (
        <svg style={style} width="1em" height="1em" fill="currentColor" aria-hidden="true" focusable="false">
            <svg id={`icon-${type}`} viewBox="0 0 1024 1024">
                {iconItems[type].map((item, index) => {
                    return <path key={`icon-${index}`} d={item}></path>
                })}
            </svg>
        </svg>
    )
}

export default Icon;