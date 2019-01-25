class GamePanel extends eui.Component implements eui.UIComponent {

	public bgGroup: eui.Group;
	public rect: eui.Rect;
	public vJoystick: VirtualJoystick;
	public selfSprit: eui.Image;
	public btnTest: eui.Button;

	private vJoystickPoint: egret.Point = new egret.Point();

	public constructor() {
		super();
	}

	protected partAdded(partName: string, instance: any): void {
		super.partAdded(partName, instance);
	}


	protected childrenCreated(): void {
		super.childrenCreated();
		this.vJoystick.setFixed(false,this.bgGroup);
		this.vJoystick.addMoveListener(this.moveSprit,this);

		this.btnTest.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onClick, this);
	}

	private onTouchBegin(event: egret.TouchEvent) {
		this.vJoystickPoint.x = this.vJoystick.x;
		this.vJoystickPoint.y = this.vJoystick.y;
		this.vJoystick.x = event.stageX - this.vJoystick.width / 2;
		this.vJoystick.y = event.stageY - this.vJoystick.height / 2;
	}

	private onTouchEnd(event: egret.TouchEvent) {
		this.vJoystick.x = this.vJoystickPoint.x;
		this.vJoystick.y = this.vJoystickPoint.y;
	}

	private onClick(event: egret.TouchEvent) {
		console.log("click");
		event.stopPropagation();
		event.preventDefault();
	}
	private moveSprit(event:JoystickEvent){
		console.log(event.dirAngle*180/3.14);
	}

	/**
	 * onClose 调用完毕后一定要记得delete这个class，不然的话事件派发可能有问题
	 */
	private onClose() {
		this.parent.removeChild(this);
	}

}