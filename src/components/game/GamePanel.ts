class GamePanel extends eui.Component implements eui.UIComponent {

	public bgGroup: eui.Group;
	public rect: eui.Rect;
	public vJoystick: VirtualJoystick;
	public selfSprit: eui.Image;
	public btnTest: eui.Button;

	private jsEvent: JoystickEvent;

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

		this.btnTest.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onClick, this);
	}

	private onClick(event: egret.TouchEvent) {
		console.log("click");
		event.stopPropagation();
		event.preventDefault();
	}
	private changeMove(event: JoystickEvent) {
		console.log(event.dirAngle * 180 / 3.14);
		this.jsEvent = event;
	}

	private moveSprite() {
		if (this.jsEvent === undefined || this.jsEvent.strength == 0) {
			return;
		} else {
			this.selfSprit.y += Math.sin(this.jsEvent.dirAngle) * 3 * this.jsEvent.strength / 20;
			this.selfSprit.x += Math.cos(this.jsEvent.dirAngle) * 3 * this.jsEvent.strength / 20;
		}
	}

	/**
	 * onClose 调用完毕后一定要记得delete这个class，不然的话事件派发可能有问题
	 */
	private onClose() {
		this.parent.removeChild(this);
	}

}