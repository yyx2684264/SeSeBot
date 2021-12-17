const JavBusTool = require('./JavbusTool')();

var officalUrl = 'https://www.javbus.com';
var InnerUrl = "https://www.busdmm.fun";

class JavBus { }

JavBus.Listen = (ws, MsgData) => {
    JavBusTool.setHomePage(InnerUrl);

    let keyword = "";
    if (/搜索艾薇.*/gim.test(MsgData["message"])) {
        keyword = MsgData["message"].substring(
            MsgData["message"].indexOf("搜索艾薇") + 4,
            MsgData["message"].length
        )
        keyword = keyword.trim();
        if (keyword != "") {
            MsgData["MaxItemNumber"] = 5;
            JavBus.Search(ws, MsgData, keyword);
        }
    } else if (/查看艾薇.*/gim.test(MsgData["message"])) {
        keyword = MsgData["message"].substring(
            MsgData["message"].indexOf("查看艾薇") + 4,
            MsgData["message"].length
        )
        keyword = keyword.trim();
        if (keyword != "") {
            JavBus.GetInfo(ws, MsgData, keyword);
        }
    } else if (/搜索全部艾薇.*/gim.test(MsgData["message"])) {
        keyword = MsgData["message"].substring(
            MsgData["message"].indexOf("搜索全部艾薇") + 6,
            MsgData["message"].length
        )
        keyword = keyword.trim();
        if (keyword != "") {
            JavBus.Search(ws, MsgData, keyword);
        }
    } else if (/^最新艾薇.*/gim.test(MsgData["message"])) {
        keyword = MsgData["message"].substring(
            MsgData["message"].indexOf("最新艾薇") + 4,
            MsgData["message"].length
        )
        keyword = keyword.trim();
        if (keyword == "" || parseInt(keyword).toString() != "NaN") {
            if (keyword == "") {
                keyword = 1;
            } else {
                keyword = parseInt(keyword);
            }
            MsgData["MaxItemNumber"] = 5;
            console.log(keyword);
            JavBus.News(ws, MsgData, keyword);
        }
    } else if (/^(国王排名|女优排名).*/gim.test(MsgData["message"])) {
        keyword = MsgData["message"].substring(
            MsgData["message"].indexOf("排名") + 2,
            MsgData["message"].length
        )
        keyword = keyword.trim();
        if (keyword == "" || parseInt(keyword).toString() != "NaN") {
            if (keyword == "") {
                keyword = 1;
            } else {
                keyword = parseInt(keyword);
            }
            MsgData["MaxItemNumber"] = 20;
            JavBus.Actresses(ws, MsgData, keyword);
        }
    }


}

JavBus.Search = (ws, MsgData, keywords) => {
    console.log("Search: " + keywords);
    (async () => {
        let videoList = await JavBusTool.search(keywords);
        // console.log(videoList);

        if (videoList.length != 0) {
            let string = "给你找到了这些结果喵：\n";
            let count = 0;
            let videoListLength = 0;
            if (MsgData["MaxItemNumber"] && MsgData["MaxItemNumber"] <= videoList.length) {
                videoListLength = MsgData["MaxItemNumber"]
            } else {
                videoListLength = videoList.length;
            }
            for (let i = 0; i < videoListLength; i++) {
                string = string + videoList[i]["id"] + " " + videoList[i]["name"];
                string = string + "[CQ:image,file=" + InnerUrl + videoList[i]["img"] + "]" + "\n\n"
                // 计数器,每5个结果分一段
                count++;
                if (count == 5) {
                    JavBus.postTextMsg(ws, MsgData, string);
                    count = 0;
                    string = "";
                }
            }
            JavBus.postTextMsg(ws, MsgData, string);
        } else {
            JavBus.postTextMsg(ws, MsgData, "残念！没有找到你想看的艾薇喵~");
        }
    })();
}

JavBus.GetInfo = (ws, MsgData, keywords) => {
    console.log("GetInfo: " + keywords);
    (async () => {
        let show = await JavBusTool.show(keywords);
        // console.log(show);

        if (show["gid"] != undefined) {
            let string = "这是你想要的信息喵，下次我可要收小鱼干作为情报费啦~：\n";
            string = string + show["title"] + "\n";
            string = string + "[CQ:image,file=" + show["cover"].replace(officalUrl, InnerUrl) + "]\n";
            string = string + "出版日期:" + show["release_date"] + "\n";

            const files = await JavBusTool.magnet(show.gid);
            // console.log(files);

            if (files.length != 0) {
                string = string + "\n下面是磁力链接喵！\n";
                let count = (files.length > 5) ? 5 : files.length;
                for (let i = 0; i < count; i++) {
                    string = string + files[i]["name"] + " " + files[i]["size"] + "\n";
                    string = string + files[i]["link"].substring(0, files[i]["link"].indexOf("&dn=")) + "\n\n";
                }
            }

            JavBus.postTextMsg(ws, MsgData, string);
        } else {
            JavBus.postTextMsg(ws, MsgData, "哼哼~别想骗我，你给的这个号码根本不存在喵！");
        }
    })();
}

JavBus.News = (ws, MsgData, keywords = 1) => {
    console.log("GetNews");
    (async () => {
        let videoList = await JavBusTool.page(keywords);
        // console.log(videoList);

        if (videoList.length != 0) {
            let string = "给你~这是最新的好康的~\n";
            let count = 0;
            let videoListLength = 0;
            if (MsgData["MaxItemNumber"] && MsgData["MaxItemNumber"] <= videoList.length) {
                videoListLength = MsgData["MaxItemNumber"]
            } else {
                videoListLength = videoList.length;
            }
            for (let i = 0; i < videoListLength; i++) {
                string = string + videoList[i]["id"] + " 【" + videoList[i]["date"] + "】\n" + videoList[i]["name"];
                string = string + "[CQ:image,file=" + InnerUrl + videoList[i]["img"] + "]" + "\n\n"
                // 计数器,每5个结果分一段
                count++;
                if (count == 5) {
                    JavBus.postTextMsg(ws, MsgData, string);
                    count = 0;
                    string = "";
                }
            }
            JavBus.postTextMsg(ws, MsgData, string);
        } else {
            JavBus.postTextMsg(ws, MsgData, "估摸着是网络出问题了喵~过一段时间再试试喵~");
        }
    })();
}

JavBus.Actresses = (ws, MsgData, keywords = 1) => {
    console.log("GetActresses");
    (async () => {
        let actressList = await JavBusTool.actresses(keywords);
        // console.log(actressList);

        if (actressList.length != 0) {
            let string = "竞争非常激烈！这是最新的排名喵！\n";
            let actressListLength = 0;
            if (MsgData["MaxItemNumber"] && MsgData["MaxItemNumber"] <= actressList.length) {
                actressListLength = MsgData["MaxItemNumber"]
            } else {
                actressListLength = actressList.length;
            }
            for (let i = 0; i < actressListLength; i++) {
                string = string + (i + 1) + " " + actressList[i]["name"];

                if (keywords == 1) {
                    switch (i) {
                        case 0:
                            string = string + "\t🥇\n";
                            break;
                        case 1:
                            string = string + "\t🥈\n";
                            break;
                        case 2:
                            string = string + "\t🥉\n";
                            break;
                        default:
                            string = string + "\n";
                            break;
                    }
                } else {
                    string = string + "\n";
                }

                // 暂时不加图片
                // string = string + "[CQ:image,file=" + InnerUrl + actressList[i]["img"] + "]" + "\n\n"
            }
            JavBus.postTextMsg(ws, MsgData, string);
        } else {
            JavBus.postTextMsg(ws, MsgData, "虽然网络出了问题，但是排名竞争依然非常激烈喵~请大家给自己喜欢的人选投上一票喵");
        }
    })();
}

JavBus.postTextMsg = (ws, MsgData, msgText) => {
    if (msgText != "") {
        let obj = {
            "action": "send_msg",
            "params": {
                "message": msgText,
                "auto_escape": false,
            }
        };

        if (MsgData["group_id"]) {
            obj["params"]["group_id"] = MsgData["group_id"];
        } else {
            obj["params"]["user_id"] = MsgData["user_id"];
        }
        ws.send(JSON.stringify(obj));
    }
}


module.exports = JavBus;