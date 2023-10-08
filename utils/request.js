// axios 公共配置
// 基地址
axios.defaults.baseURL = 'http://geek.itheima.net'


// 添加请求拦截器
axios.interceptors.request.use(function (config) {
    // 在发送请求之前做些什么
    // 统一携带 token 令牌字符串在请求头上
    const token = localStorage.getItem('token')
    token && (config.headers.Authorization = `Bearer ${token}`)
    return config;
}, function (error) {
    // 对请求错误做些什么
    return Promise.reject(error);
});


// 添加响应拦截器
axios.interceptors.response.use(function (response) {
    // 2xx 范围内的状态码都会触发该函数。
    // 对响应数据做点什么
    // console.log(response.data);
    const result = response.data
    // console.log(result);
    return result;
}, function (error) {
    // 超出 2xx 范围的状态码都会触发该函数。
    // 对响应错误做点什么
    console.dir(error);
    console.dir(error.response.data.message);
    // 统一对 401 身份验证失败情况做出处理
    if (error?.response?.status) {
        // alert('登录信息出错，请新登录')
        // localStorage.removeItem('token')        // 清除指定键名的数据
        // localStorage.clear()                       // 清除 localStorage 储存的所有数据
        // location.href = '../login/index.html'
    }
    return Promise.reject(error);
});
