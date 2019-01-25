/**
 * 虚拟摇杆，
 * 1，摇杆事件回调
 * 2，摇杆可以选择定位或不定位
 */
class VirtualJoystick extends eui.Component implements eui.UIComponent {

	public bgGroup: eui.Group;
	public rect: eui.Rect;
	public centerPoint: eui.Rect;

	private statues: Number = 0;
	private moveListener: Array<Listener> = new Array();
	private fixed: boolean = true;
	private originPoint:egret.Point = new egret.Point();

	public constructor() {
		super();
	}

	protected partAdded(partName: string, instance: any): void {
		super.partAdded(partName, instance);
	}

	protected childrenCreated(): void {
		super.childrenCreated();
		this.bgGroup.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onTouchStart, this);
		this.bgGroup.addEventListener(egret.TouchEvent.TOUCH_MOVE, this.onTouchMove, this);
		this.bgGroup.addEventListener(egret.TouchEvent.TOUCH_END, this.onTouchEnd, this);
		this.bgGroup.addEventListener(egret.TouchEvent.TOUCH_RELEASE_OUTSIDE, this.onTouchEnd, this);
	}

	public onTouchStart(event: egret.TouchEvent) {
		this.statues = 1;
		if(!this.fixed){
			this.originPoint = new egret.Point(this.x,this.y);
			this.x = event.stageX - this.width/2;
			this.y= event.stageY - this.height/2;
		}
	}

	public onTouchMove(event: egret.TouchEvent) {
		if (this.statues != 1) {
			return;
		}
		this.centerPoint.x = event.stageX - this.x;
		this.centerPoint.y = event.stageY - this.y;
		let jsEvent: JoystickEvent = this.getJoystickEvent();
		this.dispatchjsEvent(jsEvent);
	}

	public onTouchEnd(event: egret.TouchEvent) {
		this.statues = 0;
		this.centerPoint.x = this.width / 2;
		this.centerPoint.y = this.height / 2;
		this.dispatchjsEvent(new JoystickEvent());
		if(!this.fixed){
			this.x = this.originPoint.x;
			this.y = this.originPoint.y;
		}
	}

	/**
	 * 添加摇杆事件监听
	 */
	public addMoveListener(fun: Function, target: any) {
		let listener: Listener = new Listener();
		listener.fun = fun;
		listener.target = target;
		this.moveListener.push(listener);
	}

	/**
	 * 设置摇杆是否固定
	 */
	public setFixed(fixed: boolean,obj?:eui.UIComponent) {
		if(fixed == this.fixed) return;
		if (!fixed) {
			if(obj == undefined) return
			this.bgGroup.removeEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onTouchStart, this);
			this.bgGroup.removeEventListener(egret.TouchEvent.TOUCH_MOVE, this.onTouchMove, this);
			this.bgGroup.removeEventListener(egret.TouchEvent.TOUCH_END, this.onTouchEnd, this);
			this.bgGroup.removeEventListener(egret.TouchEvent.TOUCH_RELEASE_OUTSIDE, this.onTouchEnd, this);

			obj.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onTouchStart, this);
			obj.addEventListener(egret.TouchEvent.TOUCH_MOVE, this.onTouchMove, this);
			obj.addEventListener(egret.TouchEvent.TOUCH_END, this.onTouchEnd, this);
			obj.addEventListener(egret.TouchEvent.TOUCH_RELEASE_OUTSIDE, this.onTouchEnd, this);
		} else {
			this.bgGroup.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onTouchStart, this);
			this.bgGroup.addEventListener(egret.TouchEvent.TOUCH_MOVE, this.onTouchMove, this);
			this.bgGroup.addEventListener(egret.TouchEvent.TOUCH_END, this.onTouchEnd, this);
			this.bgGroup.addEventListener(egret.TouchEvent.TOUCH_RELEASE_OUTSIDE, this.onTouchEnd, this);
		}
		this.fixed = fixed;
	}


	/**
	 * 构建摇杆事件
	 */
	private getJoystickEvent(): JoystickEvent {
		let jsEvent: JoystickEvent = new JoystickEvent();
		let y = this.centerPoint.localToGlobal().y - this.localToGlobal().y - this.height /2;
		let x = this.centerPoint.localToGlobal().x - this.localToGlobal().x - this.width /2;
		jsEvent.dirAngle = Math.atan2(y, x);
		jsEvent.strength = Math.sqrt(y * y + x * x);
		return jsEvent;
	}

	/**
	 * 派发摇杆事件
	 */
	private dispatchjsEvent(jsEvent: JoystickEvent) {
		for (let i = this.moveListener.length - 1; i >= 0; i--) {
			let listener: Listener = this.moveListener[i];
			if (!listener.target) {
				this.moveListener.splice(i, 1);
				continue;
			}
			listener.fun.call(listener.target, jsEvent);
		}
	}
}
class Listener {
	public fun: Function;
	public target: any
	public constructor() {
	}
}