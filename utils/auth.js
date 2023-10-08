// 权限插件（引入到了除登录页面，以外的其他所有页面）
/**
 * 目标1：访问权限控制
 * 1.1 判断无 token 令牌字符串，则强制跳转到登录页
 * 1.2 登录成功后，保存 token 令牌字符串到本地，并跳转到内容列表页面
 */

const Mytoken = localStorage.getItem('token')
// * 1.1 判断无 token 令牌字符串，则强制跳转到登录页
if (!Mytoken) {
    location.href = '../login/index.html'
}


/**
 * 目标2：设置个人信息
 * 2.1 在 utils/request.js 设置请求拦截器，统一携带 token
 * 2.2 请求个人信息并设置到页面
 */
// 2.2 请求个人信息并设置到页面
axios({
    url: '/v1_0/user/profile',
    // 使用 axios 请求头函数添加请求头
    // headers:{
    //     Authorization: `Bearer ${localStorage.getItem('token')}`
    // }
}).then(result => {
    // console.log(result);
    const username = result.data.name
    document.querySelector('.nick-name').innerHTML = username
}).catch(error => {
    // console.dir(error);
})


// 获取文章频道

function setChannleList() {
    // * 1.1 获取频道列表数据
    axios({
        url: '/v1_0/channels'
    }).then(result => {
        // console.log(result);
        // console.log(result.data.channels);
        const channleStr = result.data.channels.map(item => {
            return `<option value="${item.id}">${item.name}</option>`
        }).join('')
        // console.log(channleStr);
        // 1.2 展示到下拉菜单中
        document.querySelector('.form-select').innerHTML = `<option value="" selected="">请选择文章频道</option>` + channleStr
    })
}

/**
 * 目标3：退出登录
 *  3.1 绑定点击事件
 *  3.2 清空本地缓存，跳转到登录页面
 */

document.querySelector('.quit').addEventListener('click', a => {
    // 确认用户是否退出
    if (confirm('你确定退出吗')) {
        // *  3.1 绑定点击事件
        location.href = '../login/index.html'
        // *  3.2 清空本地缓存，跳转到登录页面
        // localStorage.removeItem('token')
        localStorage.clear()
    }
})
