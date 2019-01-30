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
	/**
	 * 点击签摇杆的位置
	 */
	private originPoint: egret.Point = new egret.Point();
	/**
	 * 当前点击的id
	 */
	private touchId: number;
	/**
	 * 最大力度，默认为宽度的一半
	 */
	public maxStrength: number;

	public constructor() {
		super();
	}

	protected partAdded(partName: string, instance: any): void {
		super.partAdded(partName, instance);
	}

	protected childrenCreated(): void {
		super.childrenCreated();
		this.centerPoint.x = this.width / 2;
		this.centerPoint.y = this.height / 2;
		this.maxStrength = this.width/2;
		this.bgGroup.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onTouchStart, this);
		this.bgGroup.addEventListener(egret.TouchEvent.TOUCH_MOVE, this.onTouchMove, this);
		this.bgGroup.addEventListener(egret.TouchEvent.TOUCH_END, this.onTouchEnd, this);
		this.bgGroup.addEventListener(egret.TouchEvent.TOUCH_RELEASE_OUTSIDE, this.onTouchEnd, this);
		window['vsj'] = this;
	}

	public onTouchStart(event: egret.TouchEvent) {
		if (this.statues == 1) {
			return;
		}
		this.statues = 1;
		this.touchId = event.touchPointID
		if (!this.fixed) {
			this.originPoint = new egret.Point(this.x, this.y);
			let p = this.parent.globalToLocal(event.stageX - this.width / 2, event.stageY - this.height / 2);
			this.x = p.x;
			this.y = p.y;
		}
	}

	public onTouchMove(event: egret.TouchEvent) {
		if (this.statues != 1 || this.touchId != event.touchPointID) {
			return;
		}
		let p = this.globalToLocal(event.stageX, event.stageY);
		this.centerPoint.x = p.x;
		this.centerPoint.y = p.y;
		let jsEvent: JoystickEvent = this.getJoystickEvent();
		if (jsEvent.strength > this.maxStrength) {
			this.centerPoint.x = this.width / 2 + this.maxStrength * Math.cos(jsEvent.dirAngle)
			this.centerPoint.y = this.height / 2 - this.maxStrength * Math.sin(-jsEvent.dirAngle)
			jsEvent.strength = this.maxStrength;
		}
		this.dispatchjsEvent(jsEvent);
	}

	public onTouchEnd(event: egret.TouchEvent) {
		if (this.touchId != event.touchPointID) {
			return;
		}
		this.statues = 0;
		this.touchId = undefined;
		this.centerPoint.x = this.width / 2;
		this.centerPoint.y = this.height / 2;
		this.dispatchjsEvent(new JoystickEvent());
		// if (!this.fixed) {
		// 	this.x = this.originPoint.x;
		// 	this.y = this.originPoint.y;
		// }
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
	public setFixed(fixed: boolean, obj?: eui.UIComponent) {
		if (fixed == this.fixed) return;
		if (!fixed) {
			if (obj == undefined) return
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
		let y = this.centerPoint.localToGlobal().y - this.localToGlobal().y - this.height / 2 + this.centerPoint.height / 2;
		let x = this.centerPoint.localToGlobal().x - this.localToGlobal().x - this.width / 2 + this.centerPoint.width / 2;
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