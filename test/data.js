import moment from "moment";
const display = true;
const bigDataProps = {
    columnsLength: 20,
    dataSourceLength: 100000
}
function genFixedColumns() {
    let columns = [
        {
            title: "Full Name",
            dataIndex: "fullName",
            fixed: "left",
        },
        {
            title: "Age",
            dataIndex: "age",
            fixed: "left",
        },
        {
            title: "指标1",
            dataIndex: "index1",
        },
        {
            title: "指标2",
            dataIndex: "index2",
        },
        {
            title: "指标3",
            dataIndex: "index3",
        },
        {
            title: "指标4",
            dataIndex: "index4",
            fixed: "right"
        },
        {
            title: "指标5",
            dataIndex: "index5",
            fixed: "right"
        },
        {
            title: "Action",
            dataIndex: "action",
            fixed: "right"
        }
    ];
    return columns;
}

function genFixedDataSource() {
    let dataSource = [];
    for (let i = 0; i < 30; i++) {
        let obj = {
            fullName: "Edrward" + i,
            age: 33,
            action: "action",
            index1: "data" + i,
            index2: "data" + i,
            index3: "data" + i,
            index4: "data" + i,
            index5: "data" + i,
        };
        dataSource.push(obj);
    }
    return dataSource;
}

function genNormalColumns() {
    let columns = [
        {
            title: "姓名",
            dataIndex: "name",
        },
        {
            title: "出生日期",
            dataIndex: "date"
        },
        {
            title: "年龄",
            dataIndex: "age"
        },
        {
            title: "住址",
            dataIndex: "address"
        },
    ];
    return columns;
}

function genNormalDataSource() {
    let dataSource = [
        { name: "胡彦斌", date: "1988-03-11", age: 32, address: "西湖区湖底公园1号" },
        { name: "吴彦祖", date: "1978-04-06", age: 42, address: "浙江省杭州市西湖区湖底公园2号" },
    ];
    return dataSource;
}

function genRenderColumns() {
    let columns = [
        {
            title: "姓名",
            dataIndex: "name",
        },
        {
            title: "出生日期",
            dataIndex: "date",
            render:(text,record,index) =>{
                return moment(text).format("YYYY年MM月DD日");
            }
        },
        {
            title: "年龄",
            dataIndex: "age",
            render:(text,record,index) =>{
                return parseInt(text).toFixed(4);
            }
        },
        {
            title: "住址",
            dataIndex: "address"
        },
    ];
    return columns;
}

function genRenderDataSource() {
    let dataSource = [
        { name: "胡彦斌", date: "1988-03-11", age: 32, address: "西湖区湖底公园1号" },
        { name: "吴彦祖", date: "1978-04-06", age: 42, address: "浙江省杭州市西湖区湖底公园2号" },
    ];
    return dataSource;
}

function genBigData(columnsLength, dataSourceLength) {
    let columns = [], dataSource = [];
    for (let i = 0; i < columnsLength; i++) {
        let obj = {
            title: "指标" + i,
            dataIndex: "index" + i
        }
        columns.push(obj);
    }
    for (let j = 0; j < dataSourceLength; j++) {
        let obj = {};
        for (let k = 0; k < columns.length; k++) {
            const { dataIndex } = columns[k];
            obj[dataIndex] = `data-${j}-${k}`;
        }
        dataSource.push(obj);
    }
    return { columns, dataSource };
}

let bigDataObj = genBigData(bigDataProps.columnsLength, bigDataProps.dataSourceLength);

const cases = [
    {
        name: "normal Table",
        description: "基本用法",
        columns: genNormalColumns(),
        dataSource: genNormalDataSource(),
        dataSourceFunc: null,
        display: display,
    },
    {
        name: "fixed Table",
        description: "固定列",
        columns: genFixedColumns(),
        dataSource: genFixedDataSource(),
        dataSourceFunc: null,
        display: display,
    },
    {
        name: "align Table",
        description: "列居左,中,右",
        columns: [
            {
                title: "姓名",
                dataIndex: "name",
                align: "center",
                headerAlign: "left"
            },
            {
                title: "出生日期",
                dataIndex: "date"
            },
            {
                title: "年龄",
                dataIndex: "age",
                align: "right"
            },
            {
                title: "住址",
                dataIndex: "address"
            }
        ],
        dataSource: genNormalDataSource(),
        dataSourceFunc: null,
        display: display,
    },
    {
        name: "sequence Table",
        description: "自带序号列",
        columns: genNormalColumns(),
        dataSource: genNormalDataSource(),
        dataSourceFunc: null,
        display: display,
        sequence: true,
    },
    {
        name: "colDraggable Table",
        description: "列顺序可调整(拖拽)",
        columns: genNormalColumns(),
        dataSource: genNormalDataSource(),
        dataSourceFunc: null,
        display: display,
        colDraggable: true,
    },
    {
        name: "colResizable Table",
        description: "列宽可调整",
        columns: genNormalColumns(),
        dataSource: genNormalDataSource(),
        dataSourceFunc: null,
        display: display,
        colResizable: true,
    },
    {
        name: "sort Table",
        description: "支持列排序(前端)",
        columns: [
            {
                title: "姓名",
                dataIndex: "name",
                sorter: (a, b) => a.name.length - b.name.length,
            },
            {
                title: "出生日期",
                dataIndex: "date",
                sorter: (a, b) => a.date.length - b.date.length,
            },
            {
                title: "年龄",
                dataIndex: "age",
                sorter: (a, b) => a.age - b.age,
            },
            {
                title: "住址",
                dataIndex: "address",
                sorter: (a, b) => a.address.length - b.address.length,
                sortDirection: ["ascend", "descend"]
            }
        ],
        dataSource: genNormalDataSource(),
        dataSourceFunc: null,
        display: display,
    },
    {
        name: "select Table",
        description: "单元格,行,列可选中,左键选中单元格,右键菜单进行行列选中",
        columns: genNormalColumns(),
        dataSource: genNormalDataSource(),
        dataSourceFunc: null,
        display: display,
        selectable: true,
    },
    {
        name: "copy Table",
        description: "复制选中,必须选中目标才可以进行操作",
        columns: genNormalColumns(),
        dataSource: genNormalDataSource(),
        dataSourceFunc: null,
        display: display,
        selectable: true,
        copyable: true,
    },
    {
        name: "delete Table",
        description: "删除选中,必须选中目标才可以进行操作",//用例描述
        columns: genNormalColumns(),
        dataSource: genNormalDataSource(),
        dataSourceFunc: null,
        display: display,
        selectable: true,
        deleteable: true,
    },
    {
        name: "resolve Table",
        description: "旋转",//用例描述
        columns: genNormalColumns(),
        dataSource: genNormalDataSource(),
        dataSourceFunc: null,
        display: display,
        resolveable: true,
    },
    {
        name: "editable Table",
        description: "单元格可编辑,必须选中单元格才可以进行操作",//用例描述
        columns: genNormalColumns(),
        dataSource: genNormalDataSource(),
        dataSourceFunc: null,
        display: display,
        selectable: true,
        editable: true,
    },
    {
        name: "render Table",
        description: "可渲染生成复杂数据,比如数字千分位,小数位数展示,日期格式等",//用例描述
        columns: genRenderColumns(),
        dataSource: genRenderDataSource(),
        dataSourceFunc: null,
        display: display,
    },
    {
        name: "virtual Table",
        description: `虚拟滚动(${bigDataProps.dataSourceLength}行*${bigDataProps.columnsLength}列),包含菜单所有功能`,//用例描述
        columns: bigDataObj.columns,
        dataSource: bigDataObj.dataSource,
        dataSourceFunc: null,
        display: display,
        selectable: true,
        editable: true,
        resolveable: true,
        deleteable: true,
        copyable: true,
        colResizable: true,
        colDraggable: true,
    },
];

const api = [
    {
        name: "Table",
        description:"Table API",
        columns: [
            {
                title: "参数",
                dataIndex: "param"
            },
            {
                title: "说明",
                dataIndex: "description",
                width: 400,
            },
            {
                title: "类型",
                dataIndex: "type",
                width: 180,
            },
            {
                title: "默认值",
                dataIndex: "default"
            },
        ],
        dataSource: [
            { param: "dataSource", description: "数据数组", type: "any[]", default: "" },
            { param: "columns", description: "表格列的配置描述，具体项见下表", type: "ColumnProps[]", default: "" },
            { param: "sequence", description: "序号列，可设置为true,false", type: "boolean", default: "false" },
            { param: "rowHeight", description: "每行高度", type: "number", default: "30px" },
            { param: "rowCount", description: "展示多少行", type: "number", default: "10" },
            { param: "colDraggable", description: "列顺序可调整(拖拽),可设置为true,false", type: "boolean", default: "false" },
            { param: "colResizable", description: "列宽度可调整,可设置为true,false", type: "boolean", default: "false" },
            { param: "selectable", description: "是否可选中,可设置为true,false", type: "boolean", default: "false" },
            { param: "copyable", description: "是否可复制,可设置为true,false", type: "boolean", default: "false" },
            { param: "deleteable", description: "是否可删除,可设置为true,false", type: "boolean", default: "false" },
            { param: "revolveable", description: "是否可旋转,可设置为true,false", type: "boolean", default: "false" },
            { param: "editable", description: "是否可编辑,可设置为true,false", type: "boolean", default: "false" },
        ],
        display: display
    },
    {
        name: "Column",
        description:"Column API",
        columns: [
            {
                title: "参数",
                dataIndex: "param"
            },
            {
                title: "说明",
                dataIndex: "description",
                width: 400,
            },
            {
                title: "类型",
                dataIndex: "type",
                width: 180,
            },
            {
                title: "默认值",
                dataIndex: "default"
            },
        ],
        dataSource: [
            { param: "title", description: "列头显示文字", type: "string", default: "" },
            { param: "dataIndex", description: "列数据在数据项中对应的key", type: "string", default: "" },
            { param: "className", description: "列的className", type: "string", default: "" },
            { param: "render", description: "生成复杂数据的渲染函数，参数分别为当前行的值，当前行数据，行索引", type: "Function(text, record, index) {}", default: "" },
            { param: "width", description: "列宽度", type: "number", default: "120px" },
            { param: "fixed", description: "列的固定方式,可设置为'left','right'", type: "string", default: "" },
            { param: "align", description: "列的对齐方式，可设置为'left','center','right'", type: "string", default: "" },
            { param: "headerAlign", description: "表头的对其方式,可设置为,'left','center','right'", type: "string", default: "" },
            { param: "sorter", description: "排序函数，本地排序使用一个函数(参考 Array.sort 的 compareFunction)", type: "Function", default: "" },
            { param: "sortDirection", description: "支持的排序方式,取值为'ascend','descend',false", type: "any[]", default: "" },
        ],
        display: display
    }
]

export { cases, api };