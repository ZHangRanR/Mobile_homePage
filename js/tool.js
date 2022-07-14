// 工具库
function $(selector){
    // querySelector 只选择匹配上的一个
    return document.querySelector(selector);
}

function $$(selector){
    // querySelector 只选择匹配上的一个
    return document.querySelectorAll(selector);
}


// 辅助函数：该函数的功能就是将对象转为字符串
// {username:'xiejie',userage:18}  ====>  name=xiejie&age=18
function toData(obj) {
    if (obj === null) {
        return obj
    }
    let arr = [];
    for (let i in obj) {
        arr.push(`${i}=${obj[i]}`); 
    }
    return arr.join('&');
}

// 封装的 ajax 函数 用于发送 ajax 请求
function ajax(obj) {
    // 确定提交的请求的方式
    obj.type = obj.type || 'get'
    // 确定提交的方式是同步还是异步
    obj.async = obj.async || true;
    // 设置提交数据的默认值
    obj.data = obj.data || null;
    let xhr = null; // 跑腿的人 
    // 1. 创建 xhr 对象
    if (window.XMLHttpRequest) {
        // 非 IE 浏览器
        xhr = new XMLHttpRequest();
    } else {
        // 是 IE 浏览器
        xhr = new ActiveXObject('Microsoft.XMLHTTP');
    }
    // 2. 请求对应的服务器地址（open） 如果有数据 向服务器发送数据（send）
    if (obj.type === 'get' || 'GET') {
        // 说明是以 get 形式来发送请求
        let url = obj.url + '?' + toData(obj.data) // 重构 url 将数据附加在 url 后面   test.php?name=xiejie&pwd=123456
        xhr.open('get', url, obj.async);
        xhr.send(null);
    } else {
        // 说明是以 post 形式来发送请求
        xhr.open('post', obj.url, obj.async);
        xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded;charset=UTF-8");
        xhr.send(toData(obj.data));
    }
    // 3. 进行状态的监听 将从服务器取回来的数据返回
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            // 说明 xhr 已经从服务器带着数据回来了
            obj.success(xhr.responseText);
        }
    }
}