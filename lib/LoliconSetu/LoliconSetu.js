var request = require("request")

class LoliconSetu { }

LoliconSetu.replaceUrl = "pixiv.re";

LoliconSetu.preMessage = (MsgData) => {
    let Template = [
        "来了来了！色图抽卡时间！我抽！",
        "你要色图啊？稍微等一下喵，我去窝里找一找喵~",
        "我可不是随便的猫啊喵！这次就算了，下次我可要收费了！一次两条小鱼干！",
        "我说过！我可要收费的！一次三条小鱼干！涨！价！啦！",
        "真是的，一天天的总是欲求不满，真是没办法，我去给你找找喵···",
        "啊？" + MsgData["sender"]["nickname"] + "又是你在要色图啊，哎···我去给你找一张喵···",
        "" + MsgData["sender"]["nickname"] + "，你可真是个LSP···",
        "色图？什么色图？我可没有喵！才怪~"
    ]

    let RandomNumber = Math.round(Math.random() * (Template.length - 1));

    return Template[RandomNumber];
}

LoliconSetu.sufMessage = (MsgData) => {
    let Template = [
        "", "", "", "", "",
        "不好意思让你久等了喵~",
        "做好事不留名，今天我也是活雷锋喵~",
        "来，你要的色图喵~",
        "给你，如果有需要的话下次再来找我就行了喵~",
        "下次记得给我带点小鱼干喵~",
    ]

    // 群内适用的模板
    if (MsgData["group_id"]) {
        groupTemplate = [
            "[CQ:at,qq=" + MsgData["user_id"] + "] 给,你要的色图喵！",
            "来，给你，这么大人了都不会自己找色图，真让人担心喵···" + "[CQ:at,qq=" + MsgData["user_id"] + "]",
        ];

        Template.push.apply(Template, groupTemplate);
    }

    let RandomNumber = Math.round(Math.random() * (Template.length - 1));

    return Template[RandomNumber];
}


LoliconSetu.Listen = (ws, MsgData) => {
    if (/.*来点色图喵.*/g.test(MsgData["message"])) {
        LoliconSetu.postTextMsg(ws, MsgData, LoliconSetu.preMessage(MsgData));
        LoliconSetu.getSetu(ws, MsgData, "萝莉|少女|御姐")
    } else if (/.*来点.*的色图喵.*/g.test(MsgData["message"])) {
        LoliconSetu.postTextMsg(ws, MsgData, LoliconSetu.preMessage(MsgData));
        let keyword = MsgData["message"].substring(
            MsgData["message"].indexOf("来点") + 2,
            MsgData["message"].indexOf("的色图喵")
        )
        LoliconSetu.getSetu(ws, MsgData, keyword)
    } else if (/.*来.*张色图喵.*/g.test(MsgData["message"])) {
        let keyword = MsgData["message"].substring(
            MsgData["message"].indexOf("来") + 1,
            MsgData["message"].indexOf("张色图喵")
        )
        MsgData["multi"] = true;

        let number = LoliconSetu.checkNumber(keyword);

        if (number > 5) {
            number = 5;
            LoliconSetu.postTextMsg(ws, MsgData, "太贪心了可不好喵，最多给你五张喵！");
        } else if (number == 0) {
            LoliconSetu.postTextMsg(ws, MsgData, "虽然我知道你想要色图喵，但是你至少得说我听得懂的话喵！");
        }

        if (number > 0) {
            LoliconSetu.postTextMsg(ws, MsgData, LoliconSetu.preMessage(MsgData));
            for (let i = 0; i < number; i++) {
                LoliconSetu.getSetu(ws, MsgData, "萝莉|少女|御姐");
            }
        }
    }
}


LoliconSetu.postTextMsg = (ws, MsgData, msgText) => {
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

LoliconSetu.getSetu = (ws, MsgData, keywords) => {
    let url = "https://api.lolicon.app/setu/v2?"
    let size = "original";

    // 批量获取时降低质量以提高速度
    if (MsgData["multi"]) {
        url = url + "size=regular&";
        size = "regular";
    } else {
        url = url + "size=original&";
        size = "original";
    }

    let keywordsString = "";
    let keywordsTmp = keywords.replaceAll(/((并且是?|或者是?)?r18)+/gim, "");
    let keywordsList = keywordsTmp.split("并且是");

    for (let i = 0; i < keywordsList.length; i++) {
        if (keywordsList[i] != "") {
            keywordsString = keywordsString + "tag=" + keywordsList[i].replaceAll(/或者是?/gim, "|") + "&";
        }
    }

    url = url + keywordsString;

    // 关键词含有R18
    if (/^.*r18.*/gi.test(keywords.toString())) {
        url = url + "r18=1";
    } else {
        url = url + "r18=0";
    }

    url = encodeURI(url);

    request.get({
        url: url,
        method: "GET",
    }, function (error, response, data) {
        if (!error && response.statusCode == 200) {
            console.log("LoliconSetu Response");
            console.log(data);
            let dataObj = JSON.parse(data);
            if (dataObj["error"] == "") {
                if (dataObj["data"].length != 0) {
                    console.log(JSON.stringify(dataObj["data"][0]["urls"][size]));
                    LoliconSetu.postImgMsg(ws, MsgData, dataObj["data"][0]["urls"][size].replaceAll("pixiv.cat", LoliconSetu.replaceUrl))
                } else {
                    LoliconSetu.postTextMsg(ws, MsgData, "抱歉喵，没找到你说的这种色图喵~换点其他的试试喵？");
                }
            }
        }
    })
}

LoliconSetu.postImgMsg = (ws, MsgData, imageUrl) => {
    let sufText = LoliconSetu.sufMessage(MsgData);

    // 多图时不发送随机后缀语句
    if (MsgData["multi"]) {
        sufText = "";
    } else if (sufText == "") {
        LoliconSetu.postTextMsg(ws, MsgData, LoliconSetu.sufMessage(MsgData));
    }

    LoliconSetu.postTextMsg(ws, MsgData, sufText + "[CQ:image,file=" + imageUrl + "]");
}

// 中文转换成数字
LoliconSetu.ChineseNumber = {
    "零": 0, "一": 1, "二": 2, "三": 3, "四": 4, "五": 5, "六": 6, "七": 7, "八": 8, "九": 9,
    "零": 0, "壹": 1, "贰": 2, "叁": 3, "肆": 4, "伍": 5, "陆": 6, "柒": 7, "捌": 8, "玖": 9,
    "两": 2, "俩": 2, "仨": 3
};

LoliconSetu.ChineseNumberValue = {
    "十": { value: 10, secUnit: false },
    "百": { value: 100, secUnit: false },
    "千": { value: 1000, secUnit: false },
    "万": { value: 10000, secUnit: true },
    "亿": { value: 100000000, secUnit: true },
    "拾": { value: 10, secUnit: false },
    "佰": { value: 100, secUnit: false },
    "仟": { value: 1000, secUnit: false }
};

LoliconSetu.ChineseToNumber = (chnStr) => {
    var rtn = 0;
    var section = 0;
    var number = 0;
    var secUnit = false;
    var str = chnStr.split('');

    for (var i = 0; i < str.length; i++) {
        var num = LoliconSetu.ChineseNumber[str[i]];
        if (typeof num !== 'undefined') {
            number = num;
            if (i === str.length - 1) {
                section += number;
            }
        } else {
            var unit = LoliconSetu.ChineseNumberValue[str[i]].value;
            secUnit = LoliconSetu.ChineseNumberValue[str[i]].secUnit;
            if (secUnit) {
                section = (section + number) * unit;
                rtn += section;
                section = 0;
            } else {
                section += (number * unit);
            }
            number = 0;
        }
    }
    return rtn + section;
}

LoliconSetu.checkNumber = (string) => {
    if (parseFloat(string).toString() != "NaN") {
        return parseInt(string);
    } else if (parseFloat(LoliconSetu.ChineseToNumber(string)).toString() != "NaN") {
        return parseInt(LoliconSetu.ChineseToNumber(string));
    } else {
        return 0;
    }
}


module.exports = LoliconSetu;