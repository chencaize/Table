import React, { useContext, useState } from "react";
import classnames from "classnames";
import { CONTEXT } from "../reducer";
import Icon from "../../icon/index";
import { isEmpty } from "../../utils/CommHelper";
import { DEFAULT_SORT_ASCEND, DEFAULT_SORT_DESCEND } from "../../utils/GlobalVir";

function THead() {

    const { dispatch, state } = useContext(CONTEXT);

    const { columns, colDraggable, colResizable, tableProps, sortProps } = state;

    const [selectResizeCol, setSelectResizeCol] = useState(null);//需要重置宽度的列

    const [selectResizeColRight, setSelectResizeColRightPosi] = useState(0);//重置线位置

    //----------------------------------------列顺序可调整(拖拽)功能 START-----------------------//
    let startDataIndex, endDataIndex;
    /**
     * 拖动开始事件,记录拖动者
     * @param {*} dataIndex 
     */
    const onDragStart = (dataIndex) => {
        startDataIndex = dataIndex;
    }

    /**
     * 拖动结束,发送position信息,进行column位置互换
     */
    const onDragEnd = () => {
        if (startDataIndex !== endDataIndex) {
            dispatch({
                type: "updateColPosition",
                dataIndexs: {
                    startDataIndex,
                    endDataIndex
                }
            })
        }
    }

    /**
     * 拖动进入事件,更新被进入者
     * @param {*} dataIndex 
     */
    const onDragEnter = (dataIndex) => {
        endDataIndex = dataIndex;
    }

    const clearDrag = () => {
        startDataIndex = 0;
        endDataIndex = 0;
    }
    //----------------------------------------列顺序可调整(拖拽)功能 END-----------------------//


    //----------------------------------------列宽可调整 START--------------------------------//
    let preX, endX, tempDataIndex;//当前X轴位置以及松开鼠标后X轴位置

    /**
     * 鼠标按下,改变样式,保存当前选中列
     * @param {*} e 
     * @param {*} dataIndex 
     */
    const onMouseDown = (e, dataIndex) => {
        preX = e.pageX;
        setSelectResizeCol(dataIndex);
        tempDataIndex = dataIndex;
        window.addEventListener("mouseup", onMouseUp);
        window.addEventListener("mousemove", onMouseMove);
        e.preventDefault();
    }

    /**
     * 鼠标松开
     */
    const onMouseUp = (e) => {
        let deltaWidth = preX - endX;
        if (!isNaN(deltaWidth)) {
            dispatch({
                type: "updateColWidth",
                resizeObj: {
                    dataIndex: tempDataIndex,
                    deltaWidth: deltaWidth,
                },
            });
        }
        setSelectResizeCol(null);
        setSelectResizeColRightPosi(0);
        window.removeEventListener("mouseup", onMouseUp);
        window.removeEventListener("mousemove", onMouseMove);
        e.preventDefault();
    }

    /**
     * 鼠标移动
     * @param {*} e 
     */
    const onMouseMove = (e) => {
        endX = e.pageX;
        setSelectResizeColRightPosi(preX - endX);//更改
        e.preventDefault();
    }
    //----------------------------------------列宽可调整 END----------------------------------//

    //----------------------------------------列排序功能 START--------------------------------//
    const onSortClick = (e, sortDataIndex, sortDirection, sorter) => {
        dispatch({
            type: "dataSorter",
            sortProps: {
                sortDataIndex,
                sortDirection,
                sorter
            }
        });
        dispatch({
            type: "dataSelect",
            selectProps: {
                selectType: "",//选择类型
            },
        });
        e.preventDefault();
    }
    //----------------------------------------列排序功能 END--------------------------------//

    return (
        <thead>
            <tr>
                {
                    columns.map((item, colIndex) => {
                        const { left, right, width, height, className, headerAlign, dataIndex, sorter, sortDirection, fixed } = item;
                        let canDrag = isEmpty(fixed);//当前列是否允许拖动以及被进入 ps:固定与拖拽冲突,禁止固定列进行拖动
                        let isResizeSelect = selectResizeCol === dataIndex;//当前列是否处于改变列宽状态
                        let canSort = sorter && typeof sorter === "function";//当前列是否允许排序

                        let sortIconRender = "";//排序图标
                        if (canSort && sortProps.sortDataIndex === dataIndex) {
                            let { sortDirection, sortDirectionIndex } = sortProps;
                            switch (sortDirection[sortDirectionIndex]) {
                                case DEFAULT_SORT_ASCEND: sortIconRender = (<Icon type="arrow-up"></Icon>); break;
                                case DEFAULT_SORT_DESCEND: sortIconRender = (<Icon type="arrow-down"></Icon>); break;
                                default: break;
                            };
                        }

                        return (
                            <th
                                style={{ width, left, right }}
                                className={classnames(className, {
                                    "edb-table-thead-tr-sticky": left != undefined || right != undefined,
                                    "edb-table-alignLeft": headerAlign == "left",
                                    "edb-table-alignRight": headerAlign == "right",
                                    "edb-table-alignCenter": headerAlign == "center",
                                })}
                                key={`edb-table-thead-tr-th-${colIndex}`}
                            >
                                <div
                                    className={classnames("edb-table-thead-tr-th-content", {
                                        "edb-table-thead-tr-th-sortCol": canSort,
                                    })}
                                    draggable={colDraggable}
                                    onDragStart={canDrag ? () => onDragStart(dataIndex) : clearDrag}
                                    onDragEnd={canDrag ? onDragEnd : clearDrag}
                                    onDragEnter={canDrag ? () => onDragEnter(dataIndex) : clearDrag}
                                    onClick={canSort ? (e) => onSortClick(e, dataIndex, sortDirection, sorter) : null}
                                    style={{ width, height, lineHeight: height + "px" }}
                                >
                                    {sortIconRender}
                                    {item["title"]}
                                </div>
                                {colResizable ? (
                                    <div className={classnames("edb-table-thead-tr-th-colResize", {
                                        "edb-table-thead-tr-th-colResize-selected": isResizeSelect
                                    })}
                                        style={{
                                            height: isResizeSelect ? tableProps.tableHeight : height,
                                            right: isResizeSelect ? selectResizeColRight : 0,
                                        }}
                                        onMouseDown={(e) => onMouseDown(e, dataIndex)}
                                    >
                                    </div>
                                ) : ""
                                }
                            </th>
                        )
                    })
                }
            </tr>
        </thead >

    )
}

export default THead;