class GamePanel extends eui.Component implements eui.UIComponent {
	public bgGroup: eui.Group;
	public rect: eui.Rect;
	public vJoystick: VirtualJoystick;
	public btn_close: eui.Button;
	public btnFire: eui.Button;
	public waitGroup: eui.Group;
	public loginText: eui.Label;
	public btnStopWait: eui.Button;



	//------------以下为自定义变量-------------
	/**
	 * 玩家
	 */
	private sprites: Array<GamerSprite> = [];
	/**
	 * 子弹
	 */
	private bombs: Array<BombSprite> = [];
	/**
	 * 当前移动状态
	 */
	private jsEvent: JoystickEvent;
	/**
	 * 上一次发送消息时间，方便控制发送速率
	 */
	private lastMsgTime: number;
	/**
	 * websocket
	 */
	private socket: egret.WebSocket;
	private timer: egret.Timer;

	private me: GamerSprite;


	public constructor() {
		super();
	}

	protected partAdded(partName: string, instance: any): void {
		super.partAdded(partName, instance);
	}

	protected childrenCreated(): void {
		super.childrenCreated();
		this.vJoystick.setFixed(false, this.bgGroup);
		this.vJoystick.addMoveListener(this.changeMove, this);
		//移动精灵
		// this.addEventListener(egret.Event.ENTER_FRAME, this.moveSprite, this);
		// this.timer = new egret.Timer(50, 0);
		// this.timer.addEventListener(egret.TimerEvent.TIMER, this.moveSprite, this);
		// this.timer.start();
		//发射子弹
		this.btnFire.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onFire, this);
		//初始化socket
		this.initWebsocket();
		this.btnStopWait.addEventListener(egret.TouchEvent.TOUCH_TAP, this.stopWait, this);
		this.btn_close.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onClose, this);

		// let xxx = new BombSprite(RES.getRes("stone_png"), 90);
		// this.addChild(xxx)
		// window['xxx'] = xxx;

		// this.addEventListener(egret.Event.ENTER_FRAME, function(){window["xxx"].x++;window["xxx"].y+=2;}, this);
		// setInterval(function(){window["xxx"].x++;window["xxx"].y+=2;},50)
	}

	private onFire(event: egret.TouchEvent) {
		let msg: WebsocketRequest = new WebsocketRequest();
		msg.messageType = RequestMessageTypeEnum.Fire;
		msg.data = new FireEvent()
		this.sendMsg(msg);
	}
	private changeMove(event: JoystickEvent) {
		// console.log(event.dirAngle * 180 / 3.14);
		this.jsEvent = event;
		let moveEvent: MoveChangeEvent = new MoveChangeEvent();
		moveEvent.dirAngel = Math.floor(event.dirAngle * 100) / 100;
		moveEvent.speed = Math.floor(event.strength / (this.vJoystick.width / 2) * 5 * 100) / 100;

		let msg: WebsocketRequest = new WebsocketRequest();
		msg.messageType = RequestMessageTypeEnum.Move;
		msg.data = moveEvent;
		this.sendMsg(msg)
		if (event.strength != 0) {
			this.me.dir(event.dirAngle * 180 / Math.PI)
		}
	}

	private moveSprite() {
		if (this.jsEvent === undefined || this.jsEvent.strength === undefined) {
			return;
		} else {
			this.sprites[0].y += Math.sin(this.jsEvent.dirAngle) * this.jsEvent.strength / this.vJoystick.maxStrength * 8;
			this.sprites[0].x += Math.cos(this.jsEvent.dirAngle) * this.jsEvent.strength / this.vJoystick.maxStrength * 8;
		}

	}

	/**
	 * onClose 调用完毕后一定要记得delete这个class，不然的话事件派发可能有问题
	 */
	private onClose() {
		this.socket.close();
		this.parent.removeChild(this);
	}

	private initWebsocket() {
		this.socket = new egret.WebSocket();
		this.socket.type = egret.WebSocket.TYPE_STRING;
		//添加收到数据侦听，收到数据会调用此方法
		this.socket.addEventListener(egret.ProgressEvent.SOCKET_DATA, this.onReceiveMessage, this);
		//添加链接打开侦听，连接成功会调用此方法
		this.socket.addEventListener(egret.Event.CONNECT, this.onSocketOpen, this);
		//添加链接关闭侦听，手动关闭或者服务器关闭连接会调用此方法
		this.socket.addEventListener(egret.Event.CLOSE, this.onSocketClose, this);
		//添加异常侦听，出现异常会调用此方法
		this.socket.addEventListener(egret.IOErrorEvent.IO_ERROR, this.onSocketError, this);
		//连接服务器
		this.socket.connectByUrl(GameConfig.instance.gameSocket + StoryTool.getToken())
	}

	private onReceiveMessage(event: egret.Event) {
		let msg = this.socket.readUTF();
		if(window["on"]){
			console.log("msg", msg)
		}
		let msgObj: SocketResponse = JSON.parse(msg);
		if (msgObj.messageType == ResponseMessageTypeEnum.Room_Status) {
			this.updateSpriteStatus(msgObj.data);
		} else if (msgObj.messageType == ResponseMessageTypeEnum.LOGIN) {
			this.onLoginMsg(msgObj.data);
		} else if (msgObj.messageType == ResponseMessageTypeEnum.START_GAME) {
			this.onStartGame(msgObj.data)
		}
	}
	private onSocketOpen() {
		console.log("connect")
		setTimeout(function(){this.socket.writeUTF('{"messageType":5}');}.bind(this),1000)
		this.socket.flush();
	}
	private onSocketClose() {

	}
	private onSocketError() {

	}

	private updateSpriteStatus(event: GameStartEvent) {
		let i = 0;
		console.log("收到消息，开始更新界面",this.numChildren,this.bombs.length,event.bombs == undefined?0:event.bombs.length,)
		for (i; event.bombs != undefined && i < this.bombs.length && i < event.bombs.length; i++) {
			this.bombs[i].x = event.bombs[i].x;
			this.bombs[i].y = event.bombs[i].y;
			console.log("修改子弹位置",this.bombs[i].id,this.bombs[i].x,this.bombs[i].y)
		}
		//添加新增的
		for (; event.bombs != undefined && i < event.bombs.length; i++) {
			let bomb: BombSprite = new BombSprite(RES.getRes("stone_png"), this.sprites[0].dirAngle)
			let point  = this.globalToLocal()
			bomb.x = event.bombs[i].x;
			bomb.y = event.bombs[i].y;
			bomb.rotation = Math.atan2(event.bombs[i].y - bomb.y, event.bombs[i].x - bomb.x) * 180 / Math.PI + 90;
			this.bombs.push(bomb);
			this.addChild(bomb);
			console.log("add gamer over", this.contains(bomb), bomb.width, bomb.height,bomb.x,bomb.y)
		}
		//删除出边界的
		for (let i=0; i<this.bombs.length;i++) {
			let item = this.bombs[i]
			if (this.contains(item)
				&& (item.x <= 0 || item.y <= 0 || item.x >= this.width || item.y >= this.height)) {
				this.removeChild(item);
				this.bombs.splice(i,1);
				console.log("删除元素",item.id)
			}
		}
		//更新玩家
		for (let i = 0; event.gamers != undefined && i < event.gamers.length; i++) {
			if (this.sprites[i].id != userInfo.id && this.sprites[i].x != event.gamers[i].x && this.sprites[i].y != event.gamers[i].y) { // 对方玩家在移动过程中修改方向，停止后不改变方向
				this.sprites[i].rotation = Math.atan2(event.gamers[i].y - this.sprites[i].y, event.gamers[i].x - this.sprites[i].x) * 180 / Math.PI + 90;
			}
			this.sprites[i].x = event.gamers[i].x;
			this.sprites[i].y = event.gamers[i].y;
		}
	}
	public log(){

	}
	private onLoginMsg(data: boolean) {
		if (data === true) {

		} else {
			this.loginText.text = "登录失败！"
		}
	}
	private onStartGame(data: Array<number>) {
		for (let gameId of data) {
			let gamer = new GamerSprite(RES.getRes("wandou_png"))
			gamer.x = 100;
			gamer.y = 100;
			gamer.id = gameId;
			if (gamer.id == userInfo.id) {
				this.me = gamer;
			}
			this.addChild(gamer);
			this.sprites.push(gamer);
		}
		this.waitGroup.visible = false;
	}
	private stopWait() {
		this.socket.close();
		this.parent.removeChild(this);
	}
	private sendMsg(msg: WebsocketRequest) {
		this.socket.writeUTF(JSON.stringify(msg));
	}
}