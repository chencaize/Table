import React, { useContext } from "react";
import { CONTEXT } from "../../reducer";
import "./index.less";

function ScrollBar() {
    const { state, dispatch } = useContext(CONTEXT);

    const { scrollProps, rowIndex, tableProps } = state;

    const { scrollWidth, perMoveHeight, scrollHeight, maxIndex } = scrollProps;

    const { clientWidth, tableWidth } = tableProps;

    let preNewRowIndex, preY, preIndex;//一次拖动事件里newrowIndex是否改变,不变不发送请求,减少性能消耗

    //----------------------------------------滚动条鼠标拖动功能 START----------------------------------//
    /**
     * 鼠标按下事件,增加事件监听器,监听页面的鼠标松开事件及鼠标拖动事件
     * @param {*} e 
     */
    const onMouseDown = (e) => {
        preY = e.pageY;
        preIndex = rowIndex;
        window.addEventListener("mouseup", onMouseUp);
        window.addEventListener("mousemove", onMouseMove);
        e.preventDefault();
    }

    /**
     * 鼠标松开事件,释放监听器
     */
    const onMouseUp = (e) => {
        window.removeEventListener("mouseup", onMouseUp);
        window.removeEventListener("mousemove", onMouseMove);
        e.preventDefault();
    }

    /**
     * 鼠标移动事件,更新rowIndex
     * @param {*} e 
     * @param {*} preY 
     * @param {*} preIndex 
     */
    const onMouseMove = (e) => {
        let newRowIndex = preIndex + Math.floor((e.pageY - preY) / perMoveHeight);
        if (preNewRowIndex !== newRowIndex && newRowIndex >= 0 && newRowIndex <= maxIndex) {
            preNewRowIndex = newRowIndex;
            dispatch(
                {
                    rowIndex: newRowIndex,
                    type: "updateRowIndex",
                }
            )
        }
        e.preventDefault();
    }
    //----------------------------------------滚动条鼠标拖动功能 END-------------------------------------//
    return (
        <div
            className="edb-table-scrollbar"
            onMouseDown={onMouseDown}
            style={{
                width: scrollWidth,
                height: scrollHeight * 100 + "%",
                left: Math.min(clientWidth, tableWidth) + "px",
                top: rowIndex * perMoveHeight + "px",
            }}
        ></div>
    )
}

export default ScrollBar