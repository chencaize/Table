import React, { useContext, useEffect, useState } from "react";
import { CONTEXT } from "../../reducer";
import Icon from "../../../icon/index";
import { DEFAULT_SELECT_COL, DEFAULT_SELECT_ROW, DEFAULT_SELECT_SINGLE } from "../../../utils/GlobalVir";
import { isEmpty } from "../../../utils/CommHelper";
import "./index.less";
import classnames from "classnames";

function ContextMenu() {

    const { state, dispatch } = useContext(CONTEXT);

    const { contextMenuProps, selectable, copyable, deleteable, selectProps, resolveable,editable } = state;

    const { contextMenuDisplay, contextMenuPosition, hasContextMenu } = contextMenuProps;

    const [showMenuItems, setShowMenuItems] = useState([]);

    /**
     * 清除菜单状态
     */
    const clear = () => {
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

    useEffect(() => {
        let tempMenuItems = [
            {
                name: "旋转",
                icon: "sync",
                show: resolveable,
                disable: false,
                hasSep: false,
                onClick: function (e, disable) {
                    if (!disable) {
                        dispatch({
                            type: "tableResolve"
                        })
                        clear();
                    }
                    e.stopPropagation();
                    e.preventDefault();
                },
            },
            {
                name: "编辑单元格",
                icon: "edit",
                show: editable,
                disable: !selectable || selectProps.selectType !== DEFAULT_SELECT_SINGLE,
                hasSep: false,
                onClick: function (e, disable) {
                    if (!disable) {
                        dispatch({
                            type:"dataEdit",
                            selectProps:{
                                isEditStatus:true,
                            }
                        })
                        clear();
                    }
                    e.stopPropagation();
                    e.preventDefault();
                },
            },
            {
                name: "选中当前行",
                icon: "select",
                show: selectable,
                disable: isEmpty(selectProps.selectType),
                hasSep: false,
                onClick: function (e, disable) {
                    if (!disable) {
                        dispatch({
                            type: "dataSelect",
                            selectProps: {
                                selectType: DEFAULT_SELECT_ROW,
                            }
                        })
                        clear();
                    }
                    e.stopPropagation();
                    e.preventDefault();
                },
            },
            {
                name: "选中当前列",
                icon: "select",
                show: selectable,
                disable: isEmpty(selectProps.selectType),
                hasSep: false,
                onClick: function (e, disable) {
                    if (!disable) {
                        dispatch({
                            type: "dataSelect",
                            selectProps: {
                                selectType: DEFAULT_SELECT_COL,
                            }
                        })
                        clear();
                    }
                    e.stopPropagation();
                    e.preventDefault();
                },
            },
            {
                name: "复制选中",
                icon: "copy",
                show: copyable,
                disable: !selectable || isEmpty(selectProps.selectType),
                hasSep: false,
                onClick: function (e, disable) {
                    if (!disable) {
                        dispatch({
                            type: "dataCopy",
                        })
                        clear();
                    }
                    e.stopPropagation();
                    e.preventDefault();
                },
            },
            {
                name: "删除选中",
                icon: "delete",
                show: deleteable,
                disable: !selectable || isEmpty(selectProps.selectType),
                hasSep: false,
                onClick: function (e, disable) {
                    if (!disable) {
                        dispatch({
                            type: "dataDelete",
                        });
                        clear();
                    }
                    e.stopPropagation();
                    e.preventDefault();
                },
            },
        ];
        let tempShowMenuItems = [];
        tempMenuItems.forEach((item, index) => {
            const { name, icon, show, hasSep, onClick, disable } = item;
            let child = "";
            if (show) {
                child = (
                    <div
                        key={`edb-table-contextMenu-item-${index}`}
                        onMouseDown={e => onClick(e, disable)}
                    >
                        <div className={classnames("edb-table-contextMenu-item", {
                            "edb-table-contextMenu-item-disable": disable
                        })}>
                            <Icon type={icon}></Icon>
                            <span>{name}</span>
                        </div>
                        {hasSep ? <hr></hr> : ""}
                    </div>
                )
                tempShowMenuItems.push(child);
            }
        });
        setShowMenuItems(tempShowMenuItems);
    }, [selectable, selectProps, copyable, deleteable, resolveable])

    return (
        <div className="edb-table-contextMenu" style={{ display: hasContextMenu && contextMenuDisplay ? "block" : "none", left: contextMenuPosition.x, top: contextMenuPosition.y }}>
            {showMenuItems.map((item) => {
                return item;
            })}
        </div>
    )
}

export default ContextMenu