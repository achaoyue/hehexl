class GamePanel extends eui.Component implements eui.UIComponent {
	public bgGroup: eui.Group;
	public rect: eui.Rect;
	public vJoystick: VirtualJoystick;
	public meScore: eui.Label;
	public oScore: eui.Label;
	public btnFire: eui.Button;
	public btn_close: eui.Button;
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
	private gift: GiftSprite;
	private status: ResponseMessageTypeEnum;
	private bgSound: egret.Sound;
	private bgSoundChannel: egret.SoundChannel;


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
		//发射子弹
		this.btnFire.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onFire, this);
		//初始化socket
		this.initWebsocket();
		this.btnStopWait.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onClose, this);
		this.btn_close.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onClose, this);
		this.bgSound = RES.getRes("bg_mp3");
		this.bgSoundChannel = this.bgSound.play()
		// this.buildGift(100, 100, 2000)
	}

	private onFire(event: egret.TouchEvent) {
		let msg: WebsocketRequest = new WebsocketRequest();
		msg.messageType = RequestMessageTypeEnum.Fire;
		msg.data = new FireEvent()
		this.sendMsg(msg);
	}
	private changeMove(event: JoystickEvent) {
		this.jsEvent = event;
		let moveEvent: MoveChangeEvent = new MoveChangeEvent();
		moveEvent.dirAngel = Math.floor(event.dirAngle * 100) / 100;
		moveEvent.speed = Math.floor(event.strength / (this.vJoystick.width / 2) * 5 * 100) / 100;

		let msg: WebsocketRequest = new WebsocketRequest();
		msg.messageType = RequestMessageTypeEnum.Move;
		msg.data = moveEvent;
		this.sendMsg(msg)
		if (event.strength != 0) {
			this.me.rotation = (event.dirAngle * 180 / Math.PI) + 90
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
		this.bgSoundChannel.stop();
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
		let msgObj: SocketResponse = JSON.parse(msg);
		if (msgObj.messageType == ResponseMessageTypeEnum.Room_Status) {
			this.updateSpriteStatus(msgObj.data);
		} else if (msgObj.messageType == ResponseMessageTypeEnum.LOGIN) {
			this.onLoginMsg(msgObj.data);
		} else if (msgObj.messageType == ResponseMessageTypeEnum.START_GAME) {
			this.onStartGame(msgObj.data)
		} else if (msgObj.messageType == ResponseMessageTypeEnum.GAME_OVER) {
			if (this.status == ResponseMessageTypeEnum.GAME_OVER) {
				return;
			}
			this.onGameOver(msgObj.data);
			this.status = ResponseMessageTypeEnum.GAME_OVER;
		}
	}
	private onSocketOpen() {
		console.log("connect")
		setTimeout(function () { this.socket.writeUTF('{"messageType":5}'); }.bind(this), 1000)
		this.socket.flush();
	}
	private onSocketClose() {
		this.onGameOver("close");
	}
	private onSocketError() {
		this.onGameOver("close");
	}

	private updateSpriteStatus(event: GameStartEvent) {
		let i = 0;
		for (i; event.bombs != undefined && i < this.bombs.length && i < event.bombs.length; i++) {
			this.bombs[i].rotation = Math.atan2(event.bombs[i].y - this.bombs[i].y, event.bombs[i].x - this.bombs[i].x) * 180 / Math.PI;
			this.bombs[i].x = event.bombs[i].x;
			this.bombs[i].y = event.bombs[i].y;
			this.bombs[i].toRemove = event.bombs[i].remove;
		}
		//console.log(this.numChildren,this.bombs.length)
		//添加新增的
		for (; event.bombs != undefined && i < event.bombs.length; i++) {
			let bomb: BombSprite = new BombSprite(RES.getRes("stone_png"), 0)
			let point = this.globalToLocal()
			bomb.x = event.bombs[i].x;
			bomb.y = event.bombs[i].y;
			//bomb.rotation = Math.atan2(event.bombs[i].y - bomb.y, event.bombs[i].x - bomb.x) * 180 / Math.PI + 90;
			this.bombs.push(bomb);
			this.addChild(bomb);
			var sound: egret.Sound = RES.getRes("fire_mp3");
			sound.play(0, 1);
		}
		//删除出边界的
		for (let i = 0; i < this.bombs.length; i++) {
			let item = this.bombs[i]
			if (this.contains(item)
				&& (item.x <= 0 || item.y <= 0 || item.x >= this.width || item.y >= this.height || this.bombs[i].toRemove === true)) {
				this.removeChild(item);
				this.bombs.splice(i, 1);
			}
		}
		//添加或移除礼物
		if (event.gift != undefined) {
			console.log(event.gift, new Date().getTime() - event.gift.time);
			if (event.gift.remove == true && this.gift != null) {
				this.removeChild(this.gift);
				this.gift = null;
			} else if (event.gift.remove == false && this.gift == null) {
				this.buildGift(event.gift.x, event.gift.y, event.gift.time);
			}
		}
		//更新玩家
		for (let i = 0; event.gamers != undefined && i < event.gamers.length; i++) {
			if (this.sprites[i].id != userInfo.id && this.sprites[i].x != event.gamers[i].x && this.sprites[i].y != event.gamers[i].y) { // 对方玩家在移动过程中修改方向，停止后不改变方向
				this.sprites[i].rotation = Math.atan2(event.gamers[i].y - this.sprites[i].y, event.gamers[i].x - this.sprites[i].x) * 180 / Math.PI + 90;
			}
			if (this.sprites[i].id == userInfo.id) {
				this.meScore.text = (event.gamers[i].score + "分");
			}
			else {
				this.oScore.text = event.gamers[i].score + "分";
			}
			this.sprites[i].x = event.gamers[i].x;
			this.sprites[i].y = event.gamers[i].y;
		}
	}
	public log() {

	}
	private onLoginMsg(data: boolean) {
		if (data === true) {

		} else {
			this.loginText.text = "登录失败！"
		}
	}
	private onStartGame(data: Array<number>) {
		for (let gameId of data) {
			let gamer = new GamerSprite(RES.getRes("guaiwu_png"))
			gamer.x = 100;
			gamer.y = 100;
			gamer.id = gameId;
			if (gamer.id == userInfo.id) {
				this.me = gamer;
			}
			this.addChild(gamer);
			this.setChildIndex(gamer, 1)
			this.sprites.push(gamer);
		}
		this.waitGroup.visible = false;
	}
	private onGameOver(data) {
		if (data == "close") {
			this.loginText.text = "链接断开了"
		} else if (data == this.me.id) {
			this.loginText.text = "你还需努力"
		} else if (data != this.me.id) {
			this.loginText.text = "胜利"
		}
		this.btnStopWait.label = "关闭";
		this.waitGroup.visible = true;
	}
	private buildGift(x: number, y: number, time: number) {
		this.gift = new GiftSprite();
		this.gift.width = 40;
		this.gift.height = 50;
		this.gift.x = x;
		this.gift.y = y;
		this.gift.time = time - new Date().getTime();
		this.addChild(this.gift)
	}
	private stopWait() {
		this.socket.close();
		this.parent.removeChild(this);
	}
	private sendMsg(msg: WebsocketRequest) {
		this.socket.writeUTF(JSON.stringify(msg));
	}
}