/**
 * 目标1：设置频道下拉菜单
 *  1.1 获取频道列表数据
 *  1.2 展示到下拉菜单中
 */

// 网页运行后，默认调用一次
setChannleList()


/**
 * 目标2：文章封面设置
 *  2.1 准备标签结构和样式
 *  2.2 选择文件并保存在 FormData
 *  2.3 单独上传图片并得到图片 URL 网址
 *  2.4 回显并切换 img 标签展示（隐藏 + 号上传标签）
 */

document.querySelector('.img-file').addEventListener('change', async (result) => {

    // 2.2 选择文件并保存在 FormData
    // console.log(result.target.files[0]);
    const fd = new FormData()
    fd.append('image', result.target.files[0])

    // 2.3 单独上传图片并得到图片 URL 网址
    const rel = await axios({
        url: '/v1_0/upload',
        method: 'post',
        data: fd
    })
    // console.log(rel);

    // 2.4 回显并切换 img 标签展示（隐藏 + 号上传标签）
    document.querySelector('.rounded').src = rel.data.url
    document.querySelector('.rounded').classList.add('show')
    document.querySelector('.place').classList.add('hide')

    // 优化：点击 img 可以重新切换封面
    // 思路：img 点击 => 用 JS 方式触发文件选择元素 click 事件方法
    document.querySelector('.rounded').addEventListener('click', () => {
        document.querySelector('.img-file').click()
    })
})


/**
 * 目标3：发布文章保存
 *  3.1 基于 form-serialize 插件收集表单数据对象
 *  3.2 基于 axios 提交到服务器保存
 *  3.3 调用 Alert 警告框反馈结果给用户
 *  3.4 重置表单并跳转到列表页
 */

document.querySelector('.send').addEventListener('click', (a) => {
    if (a.target.innerHTML !== '发布') { return }
    // *  3.1 基于 form-serialize 插件收集表单数据对象
    const from = document.querySelector('.art-form')
    const data = serialize(from, { hash: true, mepty: false })
    // console.log(data);
    data.cover = {
        type: 1,
        images: [document.querySelector('.rounded').src]
    }

    console.log(data);

    // * 3.2 基于 axios 提交到服务器保存
    axios({
        url: '/v1_0/mp/articles',
        method: 'post',
        data: data
    }).then(rel => {
        console.log(rel);
        //  *  3.3 调用 Alert 警告框反馈结果给用户
        myAlert(true, '发布成功')

        // *  3.4 重置表单并跳转到列表页
        document.querySelector('.rounded').src = ''
        document.querySelector('.rounded').classList.add('show')
        document.querySelector('.place').classList.remove('hide')
        document.querySelector('.form-control').value = ''
        document.querySelector('.form-select').innerHTML = '<option value="" selected="">请选择文章频道</option>'
        editor.html = '<p><br></p>'
        setTimeout(() => {
            location.href = '../content/index.html'
        }, 1500)

    }).catch(error => {
        // console.dir(error);
        myAlert(false, error.response.data.message)
    })

})

    /**
     * 目标4：编辑-回显文章
     *  4.1 页面跳转传参（URL 查询参数方式）
     *  4.2 发布文章页面接收参数判断（共用同一套表单）
     *  4.3 修改标题和按钮文字
     *  4.4 获取文章详情数据并回显表单
     */

    // *  4.2 发布文章页面接收参数判断（共用同一套表单）
    ; (function () {
        // location.search  网址后面的参数
        // URLSearchParams 详情： https://blog.csdn.net/weixin_57780816/article/details/128136416
        const idParameter = location.search
        // console.log(idParameter);
        const ParamsObj = new URLSearchParams(idParameter)
        // console.log(ParamsObj);
        ParamsObj.forEach(async (rel, key) => {
            // console.log(rel, key);
            // 当前有要编辑的文章 id 被传入过来
            if (key === 'id') {
                // 4.3 修改标题和按钮文字
                document.querySelector('.title').innerHTML = '<span>编辑文章</span>'
                document.querySelector('.send').innerHTML = '修改'
                // 4.4 获取文章详情数据并回显表单
                const res = await axios({
                    url: `/v1_0/mp/articles/${rel}`
                })
                // console.log(res);
                // 组织我仅仅需要的数据对象，为后续遍历回显到页面上做铺垫
                const editObj = {
                    title: res.data.title,
                    channel_id: res.data.channel_id,
                    content: res.data.content,
                    rounded: res.data.cover.images[0],      // 封面图片地址
                    id: res.data.id
                }
                // console.log(editObj);
                // 遍历数据对象属性，映射到页面元素上，快速赋值
                // console.log(document.querySelector(`[name=title`).value = editObj.title);

                Object.keys(editObj).map(item => {
                    // 封面设置
                    if (item === 'rounded') {
                        // 有封面
                        if (editObj[item]) {
                            document.querySelector('.rounded').src = editObj[item]
                            document.querySelector('.place').classList.add('hide')
                            document.querySelector('.rounded').classList.add('show')
                        }
                    } else if (item === 'content') {
                        // 富文本内容
                        editor.setHtml(editObj[item])
                    } else {
                        // 用数据对象属性名，作为标签 name 属性选择器值来找到匹配的标签
                        // console.log(item);
                        document.querySelector(`[name=${item}]`).value = editObj[item]
                    }
                })
            }
        })
    })();




/**
 * 目标5：编辑-保存文章
 *  5.1 判断按钮文字，区分业务（因为共用一套表单）
 *  5.2 调用编辑文章接口，保存信息到服务器
 *  5.3 基于 Alert 反馈结果消息给用户
 */

document.querySelector('.send').addEventListener('click', async a => {
    // *  5.1 判断按钮文字，区分业务（因为共用一套表单）
    if (a.target.innerHTML !== '修改') { return }
    const form = document.querySelector('.art-form')
    const fd = serialize(form, { hash: true, empty: true })
    // console.log(fd);
    // console.log(document.querySelector('.rounded').src);
    try {
        const res = await axios({
            url: `/v1_0/mp/articles/${fd.id}`,
            method: 'put',
            data: {
                ...fd,
                cover: {
                    type: document.querySelector('.rounded').src ? 1 : 0,
                    images: [document.querySelector('.rounded').src]
                }
            }
        })
        console.log(res);
        myAlert(true, '修改成功')
        // document.querySelector('.rounded').src = ''
        // document.querySelector('.place').classList.remove('hide')
        // document.querySelector('.rounded').classList.add('hide')
        // document.querySelector('.form-control').value = ''
        // document.querySelector('.form-select').innerHTML = '<option value="" selected="">请选择文章频道</option>'
        // editor.html = '<p><br></p>'
        setTimeout(() => {
            location.href = '../content/index.html'
        }, 1500)
    } catch (error) {
        // console.dir(error.response.data.message);
        myAlert(false, error.response.data.message)
    }
})