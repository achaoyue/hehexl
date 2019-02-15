class NetTool {
	public constructor() {
	}

	public static post(url, data) {
		return new Promise(function (resolve, reject) {
			var request: egret.HttpRequest;
			request = new egret.HttpRequest();
			request.responseType = egret.HttpResponseType.TEXT;
			request.addEventListener(egret.Event.COMPLETE, function (event: egret.Event) { resolve(JSON.parse(event.currentTarget.response)) }, this);
			request.addEventListener(egret.IOErrorEvent.IO_ERROR, function (event: egret.Event) { reject(event) }, this);

			request.open(url, egret.HttpMethod.POST);
			request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
			request.send(data);
		});
	}

	public static get(url) {
		return new Promise(function (resolve, reject) {
			var request: egret.HttpRequest;
			request = new egret.HttpRequest();
			request.responseType = egret.HttpResponseType.TEXT;
			request.addEventListener(egret.Event.COMPLETE, function (event: egret.Event) { resolve(JSON.parse(event.currentTarget.response)) }, this);
			request.addEventListener(egret.IOErrorEvent.IO_ERROR, function (event: egret.Event) { reject(event) }, this);

			request.open(url, egret.HttpMethod.GET);
			request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
			request.send();
		});
	}
}