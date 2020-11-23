基于React生态系统,开发的一套table组件

##目录
* [工程结构](#structure)
* [打包方法](#package)
* [使用方法](#usage)

##工程结构
```
.
├── dist                              # umd文件
├── docs                              # 系统文档
│   ├──Table组件概要设计说明书.docx     # 概要设计说明书
│   ├──Table组件详细设计说明书.docx     # 详细设计说明书
├── es                                # es规范文件
├── lib                               # cmd规范文件
├── src                               # 主程序目录
│   ├── empty                         # 空组件
│   ├── icon                          # 图标组件
│   ├── table                         # 表格组件
│   ├── utils                         # 工具类
│   │    ├──CommHelper.js             # 通用方法
│   │    ├──GlobarVir.js              # 全局变量
│   └── index.js                      # 程序入口文件
├── test                              # 主程序测试目录
```

##打包方法
``` javascript
//安装程序包
$ npm install
//启动(将组件项目和测试项目进行打包并监听js文件变化,实现热更新,然后启动serve服务,将测试项目进行启动)
$ npm run start
//打包(将组件项目进行打包并进行文件大小分析)
$ npm run build
```

##使用方法
``` javascript
import { Table } from "Table";
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
let dataSource = [
        { name: "胡彦斌", date: "1988-03-11", age: 32, address: "西湖区湖底公园1号" },
        { name: "吴彦祖", date: "1978-04-06", age: 42, address: "浙江省杭州市西湖区湖底公园2号" },
    ];
<Table columns={columns} dataSource={dataSource}></Table>
```