import React, { useContext } from "react";
import classnames from "classnames";
import omit from "object.omit";
import { CONTEXT } from "../reducer";
import { SEQUENCE_NAME, DEFAULT_SELECT_SINGLE, DEFAULT_SELECT_COL, DEFAULT_SELECT_ROW,SORTER_ORDER } from "../../utils/GlobalVir";

function TBody() {

    const { state, dispatch } = useContext(CONTEXT);

    const { columns, displayDataSource, selectProps, selectable, resolveProps } = state;

    //------------------------------------左键选择单元格功能 START ------------------//
    const onMouseDown = (e, selectRow, selectCol) => {
        //0代表左键点击
        if (e.button === 0 && selectable && !selectProps.isEditStatus) {
            dispatch({
                type: "dataSelect",
                selectProps: {
                    selectType: DEFAULT_SELECT_SINGLE,
                    selectRow,
                    selectCol
                }
            })
        }
    }
    //------------------------------------左键选择单元格功能 END ------------------//

    //------------------------------------编辑单元格功能 START ------------------//
    const onBlur = (e) => {
        let value = e.nativeEvent.target.value;
        dispatch({
            type: "dataEditSave",
            value: value,
            selectProps: {
                isEditStatus: false,
            }
        })
        e.preventDefault();
    }

    const onKeyPress = (e) => {
        if (e.nativeEvent.keyCode === 13) {//按下回车键
            let value = e.nativeEvent.target.value;
            dispatch({
                type: "dataEditSave",
                value: value,
                selectProps: {
                    isEditStatus: false,
                }
            })
        }
    }
    //------------------------------------编辑单元格功能 END ------------------//
    return (
        <tbody>
            {displayDataSource.map((data, rowIndex) => {
                return (
                    <tr key={`edb-table-tbody-tr-${rowIndex}`}>
                        {
                            columns.map((item, colIndex) => {
                                const { left, right, width, height, className, align, dataIndex, render } = item;

                                let isSelect = false;//当前单元格是否被选中
                                let isEdit = false;//当前单元格是否可编辑
                                let renderChild = "";//单元格对象

                                let row = data[SEQUENCE_NAME] - 1, col = dataIndex;
                                const { selectType, selectRow, selectCol, isEditStatus } = selectProps;
                                switch (selectType) {
                                    case DEFAULT_SELECT_SINGLE: isSelect = row === selectRow && col === selectCol; isEdit = row === selectRow && col === selectCol && isEditStatus; break;
                                    case DEFAULT_SELECT_COL: isSelect = col === selectCol; break;
                                    case DEFAULT_SELECT_ROW: isSelect = row === selectRow; break;
                                    default: break;
                                }

                                //渲染单元格对象
                                if (isEdit) {
                                    renderChild = (
                                        <input autoFocus="autofocus" onBlur={onBlur} onKeyPress={onKeyPress} className="edb-table-tbody-tr-td-content-input" defaultValue={data[item["dataIndex"]]}></input>
                                    );
                                }else{
                                    if(render && typeof render === "function"){
                                        renderChild = render(data[item["dataIndex"]],omit(data,[SEQUENCE_NAME,SORTER_ORDER]),rowIndex);
                                    }else{
                                        renderChild = data[item["dataIndex"]];
                                    }
                                }
                                return (
                                    <td
                                        style={{ width, left, right }}
                                        className={classnames(className, {
                                            "edb-table-tbody-tr-selected": isSelect && !isEdit,
                                            'edb-table-tbody-tr-sticky': left != undefined || right != undefined,
                                            "edb-table-alignLeft": align == "left",
                                            "edb-table-alignRight": align == "right",
                                            "edb-table-alignCenter": align == "center",
                                        })}
                                        key={`edb-table-tbody-tr-td-${colIndex}`}
                                        onMouseDown={(e) => onMouseDown(e, row, col)}
                                    >
                                        <div
                                            className="edb-table-tbody-tr-td-content"
                                            style={{ width, height, lineHeight: height + "px" }}
                                            title={data[item["dataIndex"]]}
                                        >
                                            {renderChild}
                                        </div>
                                    </td>
                                )
                            })
                        }
                    </tr>
                )
            })}
        </tbody>
    )
}

export default TBody;