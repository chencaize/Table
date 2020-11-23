//通用方法
import React from "react";
import moment from "moment";
/**
 * 判断对象是否为空
 * @author czchen.clarence
 * @param {*} data any
 */
export function isEmpty(data) {
    if (data instanceof Object && Object.getOwnPropertyNames(data).length === 0) {
        return true;
    }
    if (data instanceof Array && data.length === 0) {
        return true;
    }
    if (data === "" || data === null || data === undefined) {
        return true;
    }
    return false;
}

/**
 * 将数组按切割点及长度进行切割
 * @param {*} array  要切割的数组 any[]
 * @param {*} index 切割点 number
 * @param {*} length  切割长度 number
 */
export function spliceArray(array, index = 0, length = array.length) {
    if (!array || !(array instanceof Array)) {
        return [];
    }
    return array.slice(index, index + length);
}

/**
 * 深拷贝
 * @param {*} obj 要拷贝的对象 any{}
 */
export function clone(obj) {
    let copy;
    if (null == obj || "object" != typeof obj) return obj;

    //如果是reactElement对象
    if (React.isValidElement(obj)) {
        copy = React.cloneElement(obj);
        return copy;
    }

    //如果是日期对象
    if (obj instanceof moment) {
        copy = moment(obj.format(obj["_f"]), obj["_f"]);
        return copy;
    }

    if (obj instanceof Date) {
        copy = new Date();
        copy.setTime(obj.getTime);
        return copy;
    }
    if (obj instanceof Array) {
        copy = [];
        for (let i = 0, len = obj.length; i < len; i++) {
            copy[i] = clone(obj[i]);
        }
        return copy;
    }
    if (obj instanceof Object) {
        copy = {};
        for (let attr in obj) {
            if (obj.hasOwnProperty(attr)) copy[attr] = clone(obj[attr]);
        }
        return copy;
    }
}

/**
 * 复制内容到剪切板
 * @param {*} data 要复制的数据 string
 */
export function copyToClipboard(data){
    const el = document.createElement("textarea");
    el.value = data;
    el.setAttribute("readonly","");
    el.style.position = "absolute";
    el.style.left = "-9999px";
    document.body.appendChild(el);
    el.select();
    document.execCommand("copy");
    document.body.removeChild(el);
}

/**
 * 获取时间戳
 */
export function getTimeRandom(){
    return new Date().getTime() + Math.floor(Math.random() * 1000);
}