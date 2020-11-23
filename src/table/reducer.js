import { createContext } from "react";
import { spliceArray, isEmpty, clone, copyToClipboard } from "../utils/CommHelper";
import moment from "moment";
import {
    DEFAULT_COL_WIDTH,
    SEQUENCE_NAME,
    SORTER_ORDER,
    DEFAULT_SCROLL_WIDTH,
    DEFAULT_SCROLL_MIN_HEIGHT,
    DEFAULT_SORT_DIRECTION,
    DEFAULT_SORT_ASCEND,
    DEFAULT_SORT_DESCEND,
    DEFAULT_SELECT_SINGLE,
    DEFAULT_SELECT_COL,
    DEFAULT_SELECT_ROW,
} from "../utils/GlobalVir";

const CONTEXT = createContext(null);

const STORE = {
    columns: [],
    dataSource: [],
    rowHeight: 0,//行高
    rowCount: 0,//展示行个数
    rowIndex: 0,//行索引
    displayDataSource: [],//展示内容
    colDraggable: false,//是否可拖拽
    colResizable: false,//是否可调整列宽
    selectable: false,//是否可选择
    copyable: false,//是否可复制
    deleteable: false,//是否可删除
    editable: false,//是否可编辑
    resolveable: false,//是否可旋转
    tableProps: {
        tableWidth: 0,//table宽度
        clientWidth: 0,//容器总宽
        tableHeight: 0,//容器总高
    },
    scrollProps: {
        scrollWidth: 0,//滚动条宽度
        scrollHeight: 0,//滚动条高度
        perMoveHeight: 0,//每次移动距离
        maxIndex: 0,//最大索引值
    },//滚动条对象
    sortProps: {
        sortDataIndex: "",//排序列
        sortDirectionIndex: 0,
        sortDirection: [],//可选排序
        sorter: null,//排序方法
    },//排序对象
    selectProps: {
        selectCol: 0,//选中列
        selectType: "",//选择类型
        selectRow: "",//选中行
        isEditStatus: false,//是否处于编辑状态
    },//选择对象
    contextMenuProps: {
        hasContextMenu: false,
        contextMenuDisplay: false,
        contextMenuPosition: {
            x: 0,
            y: 0,
        }
    },//菜单对象
    resolveProps: {
        isResolve: false,
        colDraggable: false,
        colResizable: false,
        selectable: false,
        copyable: false,
        deleteable: false,
        editable: false,
        columns: [],
        rowCount: 0,
        scrollProps: {},
    },//旋转对象
}

function reducer(state, action) {
    let obj = {};
    let newColumns = [];
    let newDataSource = [];
    let newDisplayDataSource = [];
    let newSortProps = {};
    let newScrollProps = {};
    let newContextMenuProps = {};
    let newSelectProps = {};
    let newTableProps = {};
    let newRowIndex = 0;
    let newRowCount = 0;
    let totalLength = 0;
    switch (action.type) {
        case "initialize"://初始化
            obj = initialize(clone(action.columns), clone(action.dataSource), action.sequence, action.rowHeight);//初始化数据
            totalLength = obj.tempDataSource.length;
            newDisplayDataSource = spliceArray(obj.tempDataSource, 0, action.rowCount);//获取显示数据
            newTableProps = calculateTableProps({ columns: obj.tempColumns, clientWidth: action.tableProps.clientWidth }, { rowCount: action.rowCount, rowHeight: action.rowHeight, length: totalLength });
            newScrollProps = calculateScroll(totalLength, action.rowCount, newTableProps.tableHeight);//初始化滚动条参数
            return {
                ...state,
                columns: obj.tempColumns,
                dataSource: obj.tempDataSource,
                rowIndex: 0,
                rowHeight: action.rowHeight,
                rowCount: action.rowCount,
                displayDataSource: newDisplayDataSource,
                scrollProps: newScrollProps,
                sortProps: {
                    sortDataIndex: "",
                    sortDirectionIndex: 0,
                    sortDirection: [],
                    sorter: null,
                },
                selectProps: {
                    selectType: "",
                    selectCol: 0,
                    selectRow: "",
                    isEditStatus: false
                },
                colDraggable: action.colDraggable,
                colResizable: action.colResizable,
                selectable: action.selectable,
                copyable: action.copyable,
                deleteable: action.deleteable,
                resolveable: action.resolveable,
                editable: action.editable,
                contextMenuProps: {
                    hasContextMenu: action.selectable || action.copyable || action.deleteable || action.resolveable,
                    contextMenuDisplay: false,
                    contextMenuPosition: {
                        x: 0,
                        y: 0,
                    }
                },
                sequence: action.sequence,
                tableProps: newTableProps
            };
        case "updateRowIndex"://更新数组索引
            newDisplayDataSource = spliceArray(state.dataSource, action.rowIndex, state.rowCount);
            return {
                ...state,
                rowIndex: action.rowIndex,
                displayDataSource: newDisplayDataSource
            };
        case "updateColPosition"://更新列位置
            newColumns = updateColPosition(state.columns, action.dataIndexs);
            return {
                ...state,
                columns: newColumns
            };
        case "updateColWidth"://更新列宽
            newColumns = updateColWidth(state.columns, action.resizeObj);
            totalLength = state.dataSource.length;
            newTableProps = calculateTableProps({ columns: newColumns, clientWidth: state.tableProps.clientWidth }, { rowCount: state.rowCount, rowHeight: state.rowHeight, length: totalLength });
            return {
                ...state,
                columns: newColumns,
                tableProps: newTableProps,
            };
        case "updateContextMenu"://更新菜单
            newContextMenuProps = { ...state.contextMenuProps, ...action.contextMenuProps };
            return {
                ...state,
                contextMenuProps: newContextMenuProps,
            }
        case "dataSorter"://排序 PS:排序后需要更新索引
            newSortProps = updateSortProps(state.sortProps, action.sortProps);
            if (isEmpty(newSortProps)) {
                return {
                    ...state
                };
            } else {
                newDataSource = dataSorter(newSortProps, state.dataSource);
                newDisplayDataSource = spliceArray(newDataSource, state.rowIndex, state.rowCount);
                return {
                    ...state,
                    dataSource: newDataSource,
                    displayDataSource: newDisplayDataSource,
                    sortProps: newSortProps,
                };
            }
        case "dataSelect"://选择数据
            newSelectProps = { ...state.selectProps, ...action.selectProps };
            return {
                ...state,
                selectProps: newSelectProps,
            };
        case "dataCopy"://复制选中
            dataCopy(state.dataSource, state.columns, state.selectProps);
            return {
                ...state,
            }
        case "dataDelete"://删除选中
            //删除数据
            obj = dataDelete(state.dataSource, state.columns, state.selectProps);
            newRowIndex = state.rowIndex;
            totalLength = obj.tempDataSource.length;
            //删除行的情况
            if (state.selectProps.selectType === DEFAULT_SELECT_ROW) {
                //重算滚动条参数
                newScrollProps = calculateScroll(totalLength, state.rowCount, state.tableProps.tableHeight);
                //如果删除的是后面的rowCount内的数据,需要将rowindex往前移动
                if (newRowIndex + state.rowCount > totalLength) {
                    newRowIndex = totalLength - state.rowCount;
                }
                //如果删除后选择行超过数组长度,更新选择对象
                if (state.selectProps.selectRow >= totalLength) {
                    newSelectProps = {
                        selectType: ""
                    }
                }
            }
            //删除列的情况
            if (state.selectProps.selectType === DEFAULT_SELECT_COL) {
                //更新选择对象
                newSelectProps = {
                    selectType: ""
                }
            }
            //更新可视区域数据
            newDisplayDataSource = spliceArray(obj.tempDataSource, newRowIndex, state.rowCount);
            //更新table属性
            newTableProps = calculateTableProps({ columns: obj.tempColumns, clientWidth: state.tableProps.clientWidth }, { rowCount: state.rowCount, rowHeight: state.rowHeight, length: totalLength });
            return {
                ...state,
                columns: obj.tempColumns,
                dataSource: obj.tempDataSource,
                displayDataSource: newDisplayDataSource,
                scrollProps: {
                    ...state.scrollProps,
                    ...newScrollProps
                },
                selectProps: {
                    ...state.selectProps,
                    ...newSelectProps
                },
                tableProps: newTableProps,
            }
        case "dataEdit"://编辑选中单元格
            return {
                ...state,
                selectProps: {
                    ...state.selectProps,
                    ...action.selectProps
                }
            }
        case "dataEditSave"://保存单元格编辑
            newDataSource = dataEdit(state.dataSource, action.value, state.selectProps);
            newDisplayDataSource = spliceArray(newDataSource, state.rowIndex, state.rowCount);
            return {
                ...state,
                dataSource: newDataSource,
                displayDataSource: newDisplayDataSource,
                selectProps: {
                    ...state.selectProps,
                    ...action.selectProps
                }
            }
        case "tableResolve":
            //旋转功能:
            //1.更新样式 
            //2.处理columns,所有宽度统一为120,计算rowCount,更新displayDatasource,并将所有功能关闭
            //再次旋转,所有新设定状态更新回之前的状态
            if (!state.resolveProps.isResolve) {
                newColumns = resolveUpdateColumns(clone(state.columns));
                newRowCount = Math.floor(Math.min(state.tableProps.tableWidth, state.tableProps.clientWidth) / DEFAULT_COL_WIDTH) - 1;
                //更新可视区域数据
                newRowIndex = 0;
                newDisplayDataSource = spliceArray(state.dataSource, newRowIndex, newRowCount);
                newScrollProps = calculateResolveScroll(state.dataSource.length, newRowCount, state.columns.length * getRealHeightOrWidth(state.rowHeight));
                return {
                    ...state,
                    rowIndex: newRowIndex,
                    colDraggable: false,
                    colResizable: false,
                    selectable: false,
                    copyable: false,
                    deleteable: false,
                    editable: false,
                    columns: newColumns,
                    rowCount: newRowCount,
                    displayDataSource: newDisplayDataSource,
                    scrollProps: newScrollProps,
                    selectProps: {
                        selectCol: 0,
                        selectType: "",
                        selectRow: "",
                        isEditStatus: false,
                    },
                    resolveProps: {
                        ...state.resolveProps,
                        isResolve: true,
                        colDraggable: state.colDraggable,
                        colResizable: state.colResizable,
                        selectable: state.selectable,
                        copyable: state.copyable,
                        deleteable: state.deleteable,
                        editable: state.editable,
                        columns: state.columns,
                        rowCount: state.rowCount,
                        scrollProps: state.scrollProps,
                        selectProps: state.selectProps,
                    }
                }
            } else {
                newRowCount = state.resolveProps.rowCount;
                //更新可视区域数据
                newRowIndex = 0;
                newDisplayDataSource = spliceArray(state.dataSource, newRowIndex, newRowCount);
                return {
                    ...state,
                    rowIndex: newRowIndex,
                    colDraggable: state.resolveProps.colDraggable,
                    colResizable: state.resolveProps.colResizable,
                    selectable: state.resolveProps.selectable,
                    copyable: state.resolveProps.copyable,
                    deleteable: state.resolveProps.deleteable,
                    editable: state.resolveProps.editable,
                    columns: state.resolveProps.columns,
                    rowCount: newRowCount,
                    displayDataSource: newDisplayDataSource,
                    scrollProps: state.resolveProps.scrollProps,
                    selectProps: state.resolveProps.selectProps,
                    resolveProps: {
                        ...state.resolveProps,
                        isResolve: false,
                        colDraggable: false,
                        colResizable: false,
                        selectable: false,
                        copyable: false,
                        deleteable: false,
                        editable: false,
                        columns: [],
                        rowCount: 0,
                        scrollProps: {},
                    }
                }
            }
        default: throw new Error();
    }
}


//---------------------------------------------初始化功能 START ---------------------------//
/**
 * 初始化数据
 * 1.给每个columns增加宽度(没有设置的情况下)
 * 2.整理数据,按照fixed进行整理
 * @param {*} columns 表头
 * @param {*} dataSource 数据
 */
function initialize(columns, dataSource, sequence, rowHeight) {
    let tempColumns = [], tempDataSource = [];

    let leftColumns = [], centerColumns = [], rightColumns = [];


    //判断是否已有序号列
    let hasSquenceColumn = false;
    columns && columns.forEach(item => {
        if (item.dataIndex == SEQUENCE_NAME) {
            hasSquenceColumn = true;
        }
    })
    //需要序号列
    if (sequence && !hasSquenceColumn) {
        let sequenceColumn = {
            title: "序号",
            dataIndex: SEQUENCE_NAME,
            width: Math.ceil(DEFAULT_COL_WIDTH / 2),
            fixed: "left",
            align: "center"
        }
        columns.push(sequenceColumn);
    }

    columns && columns.forEach(column => {
        column.width = column.width ? column.width : DEFAULT_COL_WIDTH;
        column.height = rowHeight;
        switch (column.fixed) {
            case "left":
                column.left = leftColumns.length ? leftColumns.length * getRealHeightOrWidth(column.width) : 0;
                pushColumn(leftColumns, column);
                break;
            case "right":
                //朝右的偏移需要考虑到最右边的边框,所以每列的right需要+1
                column.right = rightColumns.length ? rightColumns.length * getRealHeightOrWidth(column.width) + 1 : 0;
                pushColumn(rightColumns, column);
                break;
            default:
                pushColumn(centerColumns, column);
                break;
        }
    })

    //右边column需要进行翻转,先写fixed的在最右边
    rightColumns = rightColumns.reverse();

    //生成数据
    dataSource && dataSource.forEach((data, index) => {
        let tempObj = {};
        tempObj = pushData(tempObj, { leftColumns, centerColumns, rightColumns }, data);
        tempObj[SEQUENCE_NAME] = index + 1;//所有数据增加索引列,方便查找数据
        tempObj[SORTER_ORDER] = index;//初始数据索引
        tempDataSource.push(tempObj);
    })

    //合成表头
    tempColumns = tempColumns.concat(leftColumns, centerColumns, rightColumns);

    return { tempColumns, tempDataSource };
}

/**
 * 插入columns,可以对column进行处理后再push
 * @param {*} columns 
 * @param {*} column 
 */
function pushColumn(columns, column) {
    columns.push(column);
}

/**
 * 插入数据
 * @param {*} obj 
 * @param {*} columns 
 * @param {*} data 
 */
function pushData(obj, columns, data) {
    const { leftColumns, centerColumns, rightColumns } = columns;
    leftColumns && leftColumns.forEach(column => {
        const { dataIndex } = column;
        obj[dataIndex] = data[dataIndex];
    })
    centerColumns && centerColumns.forEach(column => {
        const { dataIndex } = column;
        obj[dataIndex] = data[dataIndex];
    })
    rightColumns && rightColumns.forEach(column => {
        const { dataIndex } = column;
        obj[dataIndex] = data[dataIndex];
    })
    return obj;
}

/**
 * 计算table属性
 * @param {*} widthProps 
 * @param {*} heightProps 
 */
function calculateTableProps(widthProps, heightProps) {
    const { columns, clientWidth } = widthProps;
    const { rowHeight, rowCount, length } = heightProps;
    let columnsWidth = 0;
    columns.forEach(item => {
        const { width } = item;
        columnsWidth += getRealHeightOrWidth(width);
    })
    return {
        tableWidth: columnsWidth + 1,//总体宽度考虑到最右边边框,需要+1
        tableHeight: (Math.min(rowCount, length) + 1) * getRealHeightOrWidth(rowHeight) + 1,//总高度需要考虑底部边框,需要+1
        clientWidth: clientWidth
    }
}

/**
 * 计算滚动条相关参数
 * @param {*} totalLength 总数据长度
 * @param {*} rowCount 展示数据长度
 * @param {*} tableHeight table高度
 */
function calculateScroll(totalLength, rowCount, tableHeight) {
    let scrollProps = {};
    if (totalLength <= rowCount) {
        scrollProps.scrollWidth = 0;
        return scrollProps;
    } else {
        scrollProps.scrollWidth = DEFAULT_SCROLL_WIDTH;
    }
    scrollProps.scrollHeight = Math.max(rowCount / totalLength, DEFAULT_SCROLL_MIN_HEIGHT);//滚动条最少显示10%
    let remainRows = totalLength - rowCount;//剩余行
    let remainHeight = tableHeight * (1 - scrollProps.scrollHeight);//剩余高度
    scrollProps.perMoveHeight = remainHeight / remainRows;//计算出每次滚动滚动条移动距离
    scrollProps.maxIndex = totalLength - rowCount;
    return scrollProps;
}

/**
 * 计算旋转后的滚动条参数
 * @param {*} totalLength 
 * @param {*} colCount 
 * @param {*} tableHeight 
 */
function calculateResolveScroll(totalLength, colCount, tableHeight) {
    let scrollProps = {};
    if (totalLength <= colCount) {
        scrollProps.scrollWidth = 0;
        return scrollProps;
    } else {
        scrollProps.scrollWidth = DEFAULT_SCROLL_WIDTH;
    }
    scrollProps.scrollHeight = Math.max(colCount / totalLength, DEFAULT_SCROLL_MIN_HEIGHT);//滚动条最少显示10%
    let remainRows = totalLength - colCount;//剩余行
    let remainHeight = tableHeight * (1 - scrollProps.scrollHeight);//剩余高度
    scrollProps.perMoveHeight = remainHeight / remainRows;//计算出每次滚动滚动条移动距离
    scrollProps.maxIndex = totalLength - colCount;
    return scrollProps;
}

/**
 * 获得真实高度或宽度,考虑到边框,需要+3
 * @param {*} data 
 */
function getRealHeightOrWidth(data) {
    return data + 3;
}
//---------------------------------------------初始化功能 END -----------------------------//


//-----------------------------------------更新列位置功能 START ---------------------------//
/**
 * 更新列位置
 * @param {*} columns 表头
 * @param {*} dataIndexs {startDataIndex,endDataIndex} 初始索引,目标索引
 */
function updateColPosition(columns, dataIndexs) {
    let newColumns = [];
    const { startDataIndex, endDataIndex } = dataIndexs;
    if (isEmpty(startDataIndex) || isEmpty(endDataIndex) || startDataIndex === endDataIndex) return columns;
    let startIndex = 0, endIndex = 0, startItem, endItem;
    for (let i = 0; i < columns.length; i++) {
        let item = columns[i];
        const { dataIndex } = item;
        if (dataIndex === startDataIndex) {
            startIndex = i;
            startItem = item;
        } else if (dataIndex === endDataIndex) {
            endIndex = i;
            endItem = item;
        }
    }
    for (let i = 0; i < columns.length; i++) {
        if (i === startIndex) {
            continue;
        } else if (i === endIndex) {
            if (startIndex < endIndex) {
                newColumns.push(endItem);
                newColumns.push(startItem);
            } else {
                newColumns.push(startItem);
                newColumns.push(endItem);
            }
        } else {
            newColumns.push(columns[i]);
        }
    }
    return newColumns;
}
//-----------------------------------------更新列位置功能 END -----------------------------//


//----------------------------------------------更新列宽 START ---------------------------//
/**
 * 更新列宽
 * @param {*} columns 表头
 * @param {*} resizeObj {dataIndex,deltawidth} 表头索引值,宽度增量
 */
function updateColWidth(columns, resizeObj) {
    const { dataIndex, deltaWidth } = resizeObj;
    for (let i = 0; i < columns.length; i++) {
        let item = columns[i];
        if (item.dataIndex === dataIndex) {
            if (item.width - deltaWidth > 0) {
                item.width = item.width - deltaWidth;
            }
        }
    }
    return columns;
}
//----------------------------------------------更新列宽 END ------------------------------//


//---------------------------------------------排序功能 START -----------------------------//
/**
 * 
 * @param {*} oldSortProps 
 * @param {*} newSortProps 
 */
function updateSortProps(oldSortProps, newSortProps) {
    //如果用户未填sortDirection,设为默认值
    if (isEmpty(newSortProps.sortDirection)) newSortProps.sortDirection = DEFAULT_SORT_DIRECTION;
    //两次排序点击不是同一字段,重置index
    if (newSortProps.sortDataIndex !== oldSortProps.sortDataIndex) {
        newSortProps.sortDirectionIndex = 0;
    } else {//两次点击为同一字段,index++,并进行边界值判断
        newSortProps.sortDirectionIndex = oldSortProps.sortDirectionIndex + 1;
        if (newSortProps.sortDirectionIndex >= newSortProps.sortDirection.length) {
            newSortProps.sortDirectionIndex = 0;
        }
    }
    newSortProps.sorter = newSortProps.sorter;
    if (isEmpty(newSortProps.sorter) || !(typeof newSortProps.sorter === "function")) newSortProps = {};
    return newSortProps;
}

/**
 * 
 * @param {*} a 排序对象a
 * @param {*} b 排序对象b
 * @param {*} sortDirection 可选排序
 * @param {*} sortDirectionIndex 可选排序索引
 * @param {*} sorter 排序方法
 */
function compareFunc(a, b, sortDirection, sortDirectionIndex, sorter) {
    let result = parseInt(sorter(a, b));
    //升序
    if (sortDirection[sortDirectionIndex] === DEFAULT_SORT_ASCEND) {
        return result;
    } else if (sortDirection[sortDirectionIndex] === DEFAULT_SORT_DESCEND) {//降序
        return -1 * result;
    } else {
        return 0;
    }
}

/**
 * 
 * @param {*} sortProps 
 * @param {*} dataSource 
 */
function dataSorter(sortProps, dataSource) {
    const { sortDirection, sortDirectionIndex, sorter } = sortProps;
    let tempDataSource = [];
    //如果sortDirection为false,按初始索引排序,否则按用户给定方法排
    if (!sortDirection[sortDirectionIndex]) {
        tempDataSource = dataSource.sort((a, b) => a[SORTER_ORDER] - b[SORTER_ORDER]);
    } else {
        tempDataSource = dataSource.sort((a, b) => compareFunc(a, b, sortDirection, sortDirectionIndex, sorter));
    }
    //排序后需要重新建立索引
    tempDataSource && tempDataSource.forEach((data, index) => {
        tempDataSource[index][SEQUENCE_NAME] = index + 1;
    })
    return tempDataSource;
}
//---------------------------------------------排序功能 END -----------------------------------//


//---------------------------------------------复制选中功能 START -----------------------------//
/**
 * 
 * @param {*} dataSource 
 * @param {*} columns 
 * @param {*} selectProps 
 */
function dataCopy(dataSource, columns, selectProps) {
    let copyDatas = [];
    const { selectType, selectCol, selectRow } = selectProps;
    //复制单元格
    if (selectType === DEFAULT_SELECT_SINGLE) {
        copyDatas.push(dataSource[selectRow][selectCol]);
    }
    //复制行
    if (selectType === DEFAULT_SELECT_ROW) {
        columns.forEach(column => {
            const { dataIndex } = column;
            copyDatas.push(dataSource[selectRow][dataIndex]);
        })
    }
    //复制列,10W条数据需要6-7秒,可以接受,50W条数据会无法复制,如何解决？
    if (selectType === DEFAULT_SELECT_COL) {
        for (let i = 0; i < dataSource.length; i++) {
            let item = dataSource[i];
            copyDatas.push(item[selectCol]);
        }
    }
    //将数据复制到剪贴板,以空格分开
    copyToClipboard(copyDatas.join(" "));
}

//---------------------------------------------复制选中功能 END ------------------------------//


//---------------------------------------------删除选中功能 START -----------------------------//
/**
 * 
 * @param {*} dataSource 
 * @param {*} columns 
 * @param {*} selectProps 
 */
function dataDelete(dataSource, columns, selectProps) {
    let tempColumns = columns, tempDataSource = dataSource;
    const { selectType, selectCol, selectRow } = selectProps;
    //删除单元格
    if (selectType === DEFAULT_SELECT_SINGLE) {
        tempDataSource[selectRow][selectCol] = "";
    }
    //删除行
    if (selectType === DEFAULT_SELECT_ROW) {
        tempDataSource.splice(selectRow, 1);
        //删除后需重新建立索引
        tempDataSource && tempDataSource.forEach((data, index) => {
            tempDataSource[index][SEQUENCE_NAME] = index + 1;
        })
    }
    //删除列,是否需要删除数据?个人认为不需要,用户删除的目的应该是为了看起来方便,而不是为了真正删除,那么只要能让用户感受到删除即可
    if (selectType === DEFAULT_SELECT_COL) {
        tempColumns = tempColumns.filter(item => item.dataIndex !== selectCol);
    }
    return { tempColumns, tempDataSource };
}
//---------------------------------------------删除选中功能 END ------------------------------//

//---------------------------------------------编辑选中功能 START -----------------------------//
/**
 * 编辑单元格
 * @param {*} dataSource 
 * @param {*} value 
 * @param {*} selectProps 
 */
function dataEdit(dataSource, value, selectProps) {
    let tempDataSource = dataSource;
    const { selectCol, selectRow } = selectProps;
    tempDataSource[selectRow][selectCol] = value;
    return tempDataSource;
}
//---------------------------------------------编辑选中功能 END ------------------------------//

//---------------------------------------------旋转功能 START --------------------------------//
/**
 * 旋转后将宽度统一设置为默认宽度,离左距离为0
 * @param {*} columns 
 */
function resolveUpdateColumns(columns) {
    let newColumns = [];
    columns.forEach((item, index) => {
        item.width = DEFAULT_COL_WIDTH;
        item.left = 0;
        newColumns.push(item);
    })
    return newColumns;
}
//---------------------------------------------旋转功能 END ----------------------------------//
export { STORE, reducer, CONTEXT };