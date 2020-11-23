import React, { useReducer, useEffect, useRef } from "react";
import { STORE, CONTEXT, reducer } from "./reducer";
import { DEFAULT_ROW_COUNT, DEFAULT_ROW_HEIGHT } from "../utils/GlobalVir";
import ProTypes from "prop-types";
import useSize from "ahooks/es/useSize";
import Content from "./content.jsx";
import './style';
import { isEmpty } from "../utils/CommHelper";

function EDBTable(props) {

    const edbTableRef = useRef(null);

    const [state, dispatch] = useReducer(reducer, STORE);

    const { width } = useSize(edbTableRef);

    const API = { state, dispatch };

    useEffect(() => {
        if (!isEmpty(width)) {
            dispatch(
                {
                    ...props,
                    type: "initialize",
                    tableProps: {
                        clientWidth: width,
                    },
                }
            )
        }
    }, [props, width])

    return (
        <CONTEXT.Provider value={API}>
            <div ref={edbTableRef} className="EDBTable" >
                <Content></Content>
            </div>
        </CONTEXT.Provider>
    )
}

EDBTable.defaultProps = {
    dataSource: [],
    columns: [],
    sequence: false,
    rowHeight: DEFAULT_ROW_HEIGHT,
    rowCount: DEFAULT_ROW_COUNT,
    colDraggable: false,
    colResizable: false,
    selectable: false,
    copyable: false,
    deleteable: false,
    revolveable: false,
    editable:false,
}

EDBTable.propTypes = {
    dataSource: ProTypes.array,
    columns: ProTypes.array,
    sequence: ProTypes.bool,
    rowHeight: ProTypes.number,
    rowCount: ProTypes.number,
    colDraggable: ProTypes.bool,
    colResizable: ProTypes.bool,
    selectable: ProTypes.bool,
    copyable: ProTypes.bool,
    deleteable: ProTypes.bool,
    revolveable: ProTypes.bool,
    editable:ProTypes.bool,
}

export default EDBTable;