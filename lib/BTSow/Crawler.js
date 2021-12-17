var Crawler = require('crawler')
console.log('初始化...')
const c = new Crawler({
    maxConnections: 10,
    timeout: 3000,
    retryTimeout: 3000,
    retries: 2,
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/69.0.3497.92 Safari/537.36',
    headers: {
        'Accept-Language': 'zh-CN,zh;q=0.9',
        'Accept': '*/*',
        'Connection': 'keep-alive'
    }
})

// Queue just one URL, callback
function addQueue(url, callback, handleError) {
    console.log('请求中...')
    c.queue({
        url: url,
        callback: function (error, res, done) {
            if (error) {
                handleError && handleError(error)
            } else {
                // console.log(res.$.html());
                callback && callback(res.$, res)
            }
            done()
        }
    })
}

module.exports = addQueue;