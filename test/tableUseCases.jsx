import React, { useState } from "react";
import { Table } from '../es/Table.esm';
import { cases, api } from "./data";
import omit from "object.omit";
import classnames from "classnames";
import "./style/index";

function TableUseCases() {

    const [select, setSelect] = useState();

    const onClick = (name) => {
        setSelect(name);
    }

    return (
        <div className="Test-EDB-Table">
            <div className="navigation">
                <ul>
                    <li title="EDB Table">EDB Table</li>
                    {cases && cases.map((item, index) => {
                        const { name, description } = item;
                        return <li title={description} key={`nav-cases-${index}`}><a className={classnames({ "select": select === name })} onClick={() => onClick(name)} href={`#${name}`}>{name}</a></li>
                    })}
                    <li title="API">API</li>
                    {
                        api && api.map((item, index) => {
                            const { name, description } = item;
                            return <li title={description} key={`nav-api-${index}`}><a className={classnames({ "select": select === name })} onClick={() => onClick(name)} href={`#${name}`}>{name}</a></li>
                        })
                    }
                </ul>
            </div>
            <div className="header">
                <h1><a name="edb-table">EDB Table</a></h1>
            </div>
            <div className="container-table">
                {cases && cases.map((item, index) => {
                    let { display, name, description, columns, dataSourceFunc, dataSource } = item;
                    if (dataSourceFunc && typeof dataSourceFunc === "function") {
                        dataSource = dataSourceFunc();
                    }
                    return display ? (
                        <div className="card" key={`card-${index}`}>
                            <h4>表格类型:<a name={name}>{name}</a></h4>
                            <h4>描述:{description}</h4>
                            <div className="session">
                                <Table key={`card-table-${index}`} columns={columns} dataSource={dataSource} {...omit(item, ["name", "description", "dataSourceFunc", "dataSource", "columns", "display"])}></Table>
                            </div>
                        </div>
                    ) : ""
                })}
            </div>
            <div className="container-api">
                <h1><a name="api">API</a></h1>
                {api && api.map((item, index) => {
                    let { name, columns, dataSource, display } = item;
                    return display ? (
                        <div key={`container-api-div-${index}`}>
                            <h4><a name={name}>{name}</a></h4>
                            <div>
                                <Table rowCount={50} key={`container-api-table-${index}`} columns={columns} dataSource={dataSource} {...omit(item, ["name", "description", "dataSourceFunc", "dataSource", "columns", "display"])}></Table>
                            </div>
                        </div>
                    ) : ""
                })}
            </div>
            <div className="footer">
                <div>Author:Clarence</div>
                <div>©CopyRight 2020 All Rights Reserved. 陈才泽 版权所有</div>
            </div>
        </div>
    )
}

export default TableUseCases;