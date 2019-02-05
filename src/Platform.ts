/** 
 * 平台数据接口。
 * 由于每款游戏通常需要发布到多个平台上，所以提取出一个统一的接口用于开发者获取平台数据信息
 * 推荐开发者通过这种方式封装平台逻辑，以保证整体结构的稳定
 * 由于不同平台的接口形式各有不同，白鹭推荐开发者将所有接口封装为基于 Promise 的异步形式
 */
declare interface Platform {

    getUserInfo(): Promise<any>;

    login(name,pwd): Promise<any>

}

class DebugPlatform implements Platform {
    async getUserInfo() {
        return { nickName: "username" }
    }
    async login(name,pwd) {

    }
}


if (!window.platform) {
    window.platform = new DebugPlatform();
}


class MyLoginPlatform implements Platform {
    async getUserInfo() {
        return {loginId:StoryTool.getItem("loginId","common_"),token:StoryTool.getToken(),id:StoryTool.getItem("ssid","common_")}
    }
    async login(name,pwd) {
        console.log(name,pwd);
        return new Promise(function (resolve, regect) {
            let request: egret.HttpRequest = new egret.HttpRequest();
            request.responseType = egret.HttpResponseType.TEXT;
            request.open(GameConfig.instance.host + GameConfig.instance.loginUrl + "?name="+name+"&pwd="+pwd, egret.HttpMethod.GET);
            request.setRequestHeader("Content-Type", "application/json");
            request.send();
            request.addEventListener(egret.Event.COMPLETE, function(event:egret.Event){resolve(JSON.parse(event.currentTarget.response))}, this);
            request.addEventListener(egret.IOErrorEvent.IO_ERROR, function(event:egret.Event){regect(event)}, this);
        })
    }
}

class UserInfo{
    public id;
    public loginId;
    public token;
}

declare let platform: Platform;
declare let userInfo: UserInfo;

declare interface Window {

    platform: Platform
}

window.platform = new MyLoginPlatform();




