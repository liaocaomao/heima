/**
 * 目标1：验证码登录
 * 1.1 在 utils/request.js 配置 axios 请求基地址
 * 1.2 收集手机号和验证码数据
 * 1.3 基于 axios 调用验证码登录接口
 * 1.4 使用 Bootstrap 的 Alert 警告框反馈结果给用户
 */

document.querySelector('.btn').addEventListener('click', () => {

    // 1.2 收集手机号和验证码数据
    const MyForm = document.querySelector('.login-form')
    const MyData = serialize(MyForm, { hash: true, empty: true })
    // console.log(MyData);

    // 1.3 基于 axios 调用验证码登录接口
    axios({
        url: '/v1_0/authorizations',
        method: 'POST',
        data: MyData
    }).then(result => {
        // 1.4 使用 Bootstrap 的 Alert 警告框反馈结果给用户
        myAlert(true, '登录成功')

        // 登录成功后，保存 token 令牌字符串到本地，并跳转到内容列表页面
        // console.log(result.data.data.token);
        // console.log(result);
        localStorage.setItem('token', result.data.token)
        // 延迟跳转，让 alert 警告框停留一会儿
        setTimeout(() => {
            location.href = '../content/index.html'
        }, 1500)

    }).catch(error => {
        // console.dir(error.response.data.message);
        myAlert(false, error.response.data.message)
    })

})
