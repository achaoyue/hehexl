class GamePanel extends eui.Component implements eui.UIComponent {

	public bgGroup: eui.Group;
	public rect: eui.Rect;
	public vJoystick: VirtualJoystick;
	public selfSprit: eui.Image;
	public btnTest: eui.Button;
	public btn_close: eui.Button;

//------------以下为自定义变量-------------
	/**
	 * 玩家
	 */
	private sprites:Array<GamerSprite>;
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
		this.addEventListener(egret.Event.ENTER_FRAME, this.moveSprite, this);
		//发射子弹
		this.btnTest.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onFire, this);
		//初始化socket
		this.initWebsocket();
		let gamer1 = new GamerSprite(RES.getRes("asserts_json.s1"))
		gamer1.x = 100;
		gamer1.y=100;
		this.addChild(gamer1);

		let gamer2 = new GamerSprite(RES.getRes("asserts_json.s1"))
		gamer2.x = 200;
		gamer2.y = 200;
		this.addChild(gamer2);

		this.sprites = [gamer1,gamer2];
	}

	private onFire(event: egret.TouchEvent) {
		console.log("click");
		event.stopPropagation();
		event.preventDefault();
	}
	private changeMove(event: JoystickEvent) {
		console.log(event.dirAngle * 180 / 3.14);
		// this.jsEvent = event;
		let moveEvent:MoveChangeEvent = new MoveChangeEvent();
		moveEvent.dirAngel = Math.floor(event.dirAngle * 100) / 100;
		moveEvent.speed = Math.floor(event.strength/(this.vJoystick.width/2)*5*100)/100;
		let msg:WebsocketRequest = new WebsocketRequest();
		msg.messageType = RequestMessageTypeEnum.Move;
		msg.data = moveEvent;
		this.socket.writeUTF(JSON.stringify(msg));
	}

	private moveSprite() {
		if (this.jsEvent === undefined || this.jsEvent.strength === undefined) {
			return;
		} else {
			this.selfSprit.y += Math.sin(this.jsEvent.dirAngle) * this.jsEvent.strength / this.vJoystick.maxStrength * 10;
			this.selfSprit.x += Math.cos(this.jsEvent.dirAngle) * this.jsEvent.strength / this.vJoystick.maxStrength * 10;
		}
		
	}

	/**
	 * onClose 调用完毕后一定要记得delete这个class，不然的话事件派发可能有问题
	 */
	private onClose() {
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
		this.socket.connectByUrl("ws://192.168.99.103:8000?token=X0YzBRIfARFsDIPU3cTukxFsDFRZUxVzAAAFXVBcUhE")
	}

	private onReceiveMessage(event:egret.Event){
		let msg = this.socket.readUTF();
		console.log("msg",msg)
		let msgObj:SocketResponse = JSON.parse(msg);
		if(msgObj.messageType == ResponseMessageTypeEnum.Room_Status){
			this.updateSpriteStatus(msgObj.data);
		}
	}
	private onSocketOpen(){
		console.log("connect")
		this.socket.writeUTF('{"messageType":5}');
		this.socket.flush();
	}
	private onSocketClose(){

	}
	private onSocketError(){

	}

	private updateSpriteStatus(event:GameStartEvent){
		if(event.bombs instanceof Array){

		}
		if(event.gamers instanceof Array){
			for(let i = 0;i<event.gamers.length;i++){
				this.sprites[i].x = event.gamers[i].x;
				this.sprites[i].y = event.gamers[i].y;
			}
		}
	}
}