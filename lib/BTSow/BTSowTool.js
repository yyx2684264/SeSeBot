// 网址
var www = 'https://www.btsow.com';

var addQueue = require('./Crawler')
const cheerio = require('cheerio');

/**
 * BTSowTool
 * @param {*} param0 
 */
const BTSowTool = ({ homepage = www } = {}) => {
    return {
        async search(keyword, n = 1) {
            let data = null;
            addQueue(encodeURI(homepage + `/search/${keyword}/${n}`), ($) => {
                // console.log(encodeURI(homepage + `/search/${keyword}/${n}`));
                data = this.getSearchList($);
            })

            while (data == null) {
                await this.wait(200);
            }

            return data;

        },
        // 异步等待
        wait(ms) {
            return new Promise(resolve => setTimeout(() => resolve(), ms));
        },
        getSearchDetail($) {
            let data = {}

            console.log($)

            // get magnet link
            data.magnet_link = $('#magnetLink').text()

            // get more file list
            let dataList = cheerio($('.data-list')[1]).children()
            data.file_list = []
            for (let i = 1; i < dataList.length; i++) {
                let item = cheerio(dataList[i])
                let obj = {}
                obj.file_name = cheerio(item.find('.file')).text()
                obj.file_size = cheerio(item.find('.size')).text()
                data.file_list.push(obj)
            }
            console.log('TCL: getSearchDetail -> data', data)
            return data
        },
        /**
         * getSearchList
         * @param {Object} $
         */
        getSearchList($) {
            let jq = cheerio.load($.html());

            let dataList = jq('.data-list > div > a')

            let data = [];

            dataList.each(function (i, item) {
                let itemTitle = jq(item).attr("title");
                let itemUrl = jq(item).attr("href");
                let magnet = "magnet:?xt=urn:btih:" + itemUrl.substring(itemUrl.indexOf("hash/") + 5, itemUrl.length);

                let sizeDate = jq(".size-date", item).text();
                let size = sizeDate.substring(sizeDate.indexOf("Size:") + 5, sizeDate.indexOf(" / "));
                let date = sizeDate.substring(sizeDate.indexOf("Convert Date:") + 13, sizeDate.length);

                data.push({
                    title: itemTitle,
                    magnet: magnet,
                    size: size,
                    date: date
                })
            })

            return data
        },
        setHomePage(url) {
            homepage = url;
        }
    };
};

module.exports = BTSowTool;