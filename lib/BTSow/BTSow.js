const BTSowTool = require('./BTSowTool')();

var officalUrl = 'https://www.btsow.com';
var InnerUrl = "https://www.btsow.rest";

// (async () => {
//     BTSowTool.setHomePage(InnerUrl);
//     const videos = await BTSowTool.search("长津湖");
//     console.log(videos);
// })();

class BTSow { }

BTSow.Listen = (ws, MsgData) => {
    BTSowTool.setHomePage(InnerUrl);

    let keyword = "";
    if (/搜索种子.*/gim.test(MsgData["message"])) {
        keyword = MsgData["message"].substring(
            MsgData["message"].indexOf("搜索种子") + 4,
            MsgData["message"].length
        )
        keyword = keyword.trim();
        if (keyword != "") {
            MsgData["MaxItemNumber"] = 5;
            BTSow.Search(ws, MsgData, keyword);
        }
    }

}

BTSow.Search = (ws, MsgData, keywords) => {
    console.log("Search: " + keywords);
    (async () => {
        let torrentList = await BTSowTool.search(keywords);
        // console.log(videoList);

        if (torrentList.length != 0) {
            let string = "给你找到了这些结果喵：\n";
            let count = 0;
            let ListLength = 0;
            if (MsgData["MaxItemNumber"] && MsgData["MaxItemNumber"] <= torrentList.length) {
                ListLength = MsgData["MaxItemNumber"]
            } else {
                ListLength = torrentList.length;
            }
            for (let i = 0; i < ListLength; i++) {
                string = string + torrentList[i]["title"] + "\n";
                string = string + "大小:" + torrentList[i]["size"] + " 日期:" + torrentList[i]["date"] + "\n";
                string = string + torrentList[i]["magnet"] + "\n\n"
                // 计数器,每5个结果分一段
                count++;
                if (count == 5) {
                    BTSow.postTextMsg(ws, MsgData, string);
                    count = 0;
                    string = "";
                }
            }
            BTSow.postTextMsg(ws, MsgData, string);
        } else {
            BTSow.postTextMsg(ws, MsgData, "你搜的啥稀罕玩意儿，我怎么找不到喵~");
        }
    })();
}

BTSow.GetInfo = (ws, MsgData, keywords) => {
    console.log("GetInfo: " + keywords);
    (async () => {
        let show = await BTSowTool.show(keywords);
        // console.log(show);

        if (show["gid"] != undefined) {
            let string = "这是你想要的信息喵，下次我可要收小鱼干作为情报费啦~：\n";
            string = string + show["title"] + "\n";
            string = string + "[CQ:image,file=" + show["cover"].replace(officalUrl, InnerUrl) + "]\n";
            string = string + "出版日期:" + show["release_date"] + "\n";

            const files = await BTSowTool.magnet(show.gid);
            // console.log(files);

            if (files.length != 0) {
                string = string + "\n下面是磁力链接喵！\n";
                let count = (files.length > 5) ? 5 : files.length;
                for (let i = 0; i < count; i++) {
                    string = string + files[i]["name"] + " " + files[i]["size"] + "\n";
                    string = string + files[i]["link"].substring(0, files[i]["link"].indexOf("&dn=")) + "\n\n";
                }
            }

            BTSow.postTextMsg(ws, MsgData, string);
        } else {
            BTSow.postTextMsg(ws, MsgData, "哼哼~别想骗我，你给的这个号码根本不存在喵！");
        }
    })();
}

BTSow.postTextMsg = (ws, MsgData, msgText) => {
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


module.exports = BTSow;