import React, { useContext, useEffect, useState, useRef } from "react";
import { CONTEXT } from "./reducer";
import { TBody, THead, ScrollBar, ContextMenu } from "./components/index";
import classnames from "classnames";
import Empty from "../empty/index";

function Content() {
    const contentRef = useRef(null);

    const { state, dispatch } = useContext(CONTEXT);

    const { displayDataSource, columns, rowIndex, resolveProps, contextMenuProps, tableProps, scrollProps } = state;

    const [renderChild, setRenderChild] = useState();

    const { tableWidth, tableHeight } = tableProps;

    const { maxIndex } = scrollProps;
    //生成table对象
    useEffect(() => {
        let hasDataSource = displayDataSource.length > 0;//是否有数据
        let hasColumns = columns.length > 0;//是否有表头
        /**
         * 分情况渲染
         * 1.数据和表头都有
         * 2.有表头,没数据
         * 3.其他情况
         */
        if (hasDataSource && hasColumns) {
            setRenderChild(
                (
                    <table style={{ width: tableWidth}}  className={classnames({
                        "edb-table": !resolveProps.isResolve,
                        "edb-table-vertical": resolveProps.isResolve,
                    })}>
                        <THead></THead>
                        <TBody></TBody>
                    </table>
                )
            )
        } else if (!hasDataSource && hasColumns) {
            setRenderChild(
                (
                    <div>
                        <table style={{ width: tableWidth}} className={classnames({
                            "edb-table": !resolveProps.isResolve,
                            "edb-table-vertical": resolveProps.isResolve,
                        })}>
                            <THead></THead>
                        </table>
                        <div>
                            <Empty></Empty>
                        </div>
                    </div>
                )
            )
        } else {
            setRenderChild(
                (
                    <table style={{ width: tableWidth}} className={classnames({
                        "edb-table": !resolveProps.isResolve,
                        "edb-table-vertical": resolveProps.isResolve,
                    })}>
                        <thead>
                            <tr>
                                <th>
                                    <div style={{ width: tableWidth}} ></div>
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {displayDataSource.map((item, index) => {
                                return <tr key={`edb-table-empty-${index}`}>
                                    <td>
                                        <div style={{ width: tableWidth, height: tableHeight }} ></div>
                                    </td>
                                </tr>
                            })}
                        </tbody>
                    </table>
                )
            )
        }
    }, [columns, displayDataSource, resolveProps.isResolve, tableWidth, tableHeight])

    //----------------------------------------滚动条滚轮滚动功能 START----------------------------------//
    useEffect(() => {
        contentRef.current.addEventListener("wheel", onScroll, { passive: false });
        window.addEventListener("mousedown", onMouseDown)
        return () => {
            contentRef.current.removeEventListener("wheel", onScroll, { passive: false });
            window.removeEventListener("mousedown", onMouseDown)
        }
    }, [rowIndex, maxIndex])
    /**
     * 鼠标滚动事件
     * @param {*} e 
     */
    const onScroll = (e) => {
        let newRowIndex = rowIndex;
        if (e.deltaY > 0) {
            newRowIndex++;
        } else {
            newRowIndex--;
        }
        if (newRowIndex >= 0 && newRowIndex <= maxIndex) {
            dispatch(
                {
                    rowIndex: newRowIndex,
                    type: "updateRowIndex",
                }
            )
            e.preventDefault();//当自己需要滚动的时候,阻止浏览器的默认滚动
        }

    }
    //----------------------------------------滚动条滚轮滚动功能 END------------------------------------//

    //----------------------------------------菜单功能 START------------------------------------//
    const getOffsetTop = (obj) => {
        let temp = obj.offsetTop;
        let val = obj.offsetParent;
        while (val != null) {
            temp += val.offsetTop;
            val = val.offsetParent;
        }
        return temp;
    }

    const getOffsetLeft = (obj) => {
        let temp = obj.offsetLeft;
        let val = obj.offsetParent;
        while (val != null) {
            temp += val.offsetLeft;
            val = val.offsetParent;
        }
        return temp;
    }

    /**
     * 鼠标右击出菜单事件
     * @param {*} e 
     */
    const onContextMenu = (e) => {
        dispatch({
            type: "updateContextMenu",
            contextMenuProps: {
                contextMenuDisplay: true,
                contextMenuPosition: {
                    x: Math.abs(getOffsetLeft(contentRef.current) - e.pageX),
                    y: Math.abs(getOffsetTop(contentRef.current) - e.pageY)
                }
            }
        })
        if (contextMenuProps.hasContextMenu) {
            e.preventDefault();//有菜单的时候,阻止原生浏览器的菜单
        }
    }

    /**
     * 鼠标左击关闭菜单事件
     * @param {*} e 
     */
    const onMouseDown = (e) => {
        if (e.button === 0 && contextMenuProps.hasContextMenu) {
            dispatch({
                type: "updateContextMenu",
                contextMenuProps: {
                    contextMenuDisplay: false,
                    contextMenuPosition: {
                        x: 0,
                        y: 0
                    }
                }
            })
        }
    }
    //----------------------------------------菜单功能 END------------------------------------//

    return (
        <div
            className="edb-content"
            ref={contentRef}
            onContextMenu={onContextMenu}>
            {renderChild}
            <ScrollBar></ScrollBar>
            <ContextMenu></ContextMenu>
        </div>
    )
}

export default Content;