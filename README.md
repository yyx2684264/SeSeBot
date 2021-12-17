# SeSeBot 色色机器人
一个基于Nodejs的色色机器人，可用于go-cqhttp或者其他websocket通信的机器人  

Nodejs小白写着玩的东西，采用 websocket 通信  
需要配合 https://github.com/Mrs4s/go-cqhttp 或者其他机器人食用  

其实就俩爬虫工具和一个调用LoliconAPI获取色图的小程序  

AV信息来源 https://JavBus.com  
色图接口来源 https://Lolicon.app  
种子信息来源 https://BTSow.com 

BTSow 爬虫部分参考了 https://github.com/Robinsir/BTSOW 的 Crawler.js 文件  
JavBus 爬虫部分参考了 https://github.com/song940/javbus 的大部分代码，并增加了演员表获取

## 使用方法 
0.安装好 Nodejs 环境  
1.下载代码到任意目录并执行 npm install  
2.修改 index.js 中的 var ws = new WebSocket("ws://localhost:61001"); 地址为你自己的机器人监听地址  
3.启动 go-cqhttp 或者其他什么机器人，等待启动完毕  
4.双击 start.bat 启动全部色色模块 

## 机器人命令 
### LoliconSetu模块： 
<pre>
来点色图喵                          可以获得一张随机色图  
来点XXX的色图喵                     可以获得指定标签的随机内容  
来点XXX并且是OOO或者是MMM的色图喵    可以获得符合该内容的一张随机色图  
PS：如果XXX中包含R18，则注定获取到R18的色图，否则不包含R18的色图 
</pre>

### JavBus模块： 
<pre>
搜索艾薇XXX         可以搜索指定内容的AV，数量限定为前5条信息  
搜索全部艾薇XXX     可以搜索指定内容的AV，数量限定为30条信息  
获取艾薇XXX         根据番号获取指定AV的详情和磁力链接  
国王排名            获取前20名女优信息  
女优排名            同上 
</pre>

### BTSow模块： 
<pre>
搜索种子XXX        可以搜索指定内容的种子，数量限定为最前面的5条信息  
PS：限定数量这个很好改，稍微能看懂就能改的 
</pre>

因为一开始搞这个的时候想的是可以方便的删除任意模块，所以每个模块都是完整且独立的，模块与模块之间函数有重复的部分 

如果你只想启动某一个模块功能，可以使用类似如下命令启动：  
<pre><code>node index.js LoliconSetu </code></pre>
 

### 可用的模式有： 
"色图模式": "LoliconSetu",  
"AV搜索工具模式": "JavBus",  
"种子搜索工具模式": "BTSow", 

## 机器人维护 
目前这些模块和内部包含的地址可以让机器人不需要代理直接运行  
但是并没有做自动获取最新免屏蔽地址的功能，所以如果某天获取数据失败了请对如下地方进行修改： 

JavBus.js 中的 var InnerUrl = "https://www.busdmm.fun";  
BTSow.js 中的 var InnerUrl = "https://www.btsow.rest";  
LoliconSetu.js 中的 LoliconSetu.replaceUrl = "pixiv.re"; 

## 后期更新计划 
基本没得计划，其实我是想做个骰子机器人的，但是写着写着就发现跑偏了 

### 虽然不是什么拿得出手的东西  
### 但是如果你喜欢的话请给个Star 
