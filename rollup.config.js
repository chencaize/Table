import babel from "@rollup/plugin-babel";
import commonjs from "@rollup/plugin-commonjs";
import resolve from "@rollup/plugin-node-resolve";
import filesize from "rollup-plugin-filesize";
import replace from "@rollup/plugin-replace";
import serve from "rollup-plugin-serve";
import livereload from "rollup-plugin-livereload";
import postcss from "rollup-plugin-postcss";
import { uglify } from "rollup-plugin-uglify";
import { name, version, author } from "./package.json";

//每个文件表头加上统一信息
const banner = `/*${name}.js v${version}\n *(c)2020-${new Date().getFullYear()} ${author}\n *Released under the MIT License.\n*/`;

//是否为开发环境
const IS_DEV = process.env.NODE_ENV === "development";

//基础配置
const BASE_CONFIG = {
    plugins: [
        babel({
            presets: ["@babel/preset-env", "@babel/preset-react"],
            babelHelpers: "bundled",
            exclude: "node_modules/**"
        }),
        resolve(),
        commonjs(),
        postcss()
    ],
}

//组件项目打包配置
const DEV_CONFIG = {
    input: "src/index.js",
    output: [
        {
            file: `dist/${name}.js`,
            format: "umd",
            name,
            banner,
        },
        {
            file: `dist/${name}.min.js`,
            format: "umd",
            name,
            banner,
            sourcemap: true,
            plugins: [
                uglify(),
            ]
        },
        {
            file: `lib/${name}.cjs.js`,
            format: "cjs",
            banner,
        },
        {
            file: `es/${name}.esm.js`,
            format: "esm",
            banner,
        },
    ],
    plugins: [
        ...BASE_CONFIG.plugins,
        (!IS_DEV && filesize()),//生产环境下进行文件大小分析
    ],
    external: ["react", "react-dom"]
}

//测试项目打包配置
const TEST_CONFIG = {
    input: "test/index.js",
    output: [
        {
            file: `test/dist/bundle.js`,
            name,
            format: "umd",
            sourcemap: true,
        }
    ],
    plugins: [
        ...BASE_CONFIG.plugins,
        serve({
            open:true,
            verbose:false,
            contentBase: "test",
            port: "3000",
        }),
        livereload({
            watch:['es','test/lib'],
            verbose:false,
        }),
        replace({
            "process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV || 'development'),
            exclude: "node_modules/**"
        })
    ]
}

let config = IS_DEV ? [DEV_CONFIG,TEST_CONFIG] : DEV_CONFIG;

export default config;