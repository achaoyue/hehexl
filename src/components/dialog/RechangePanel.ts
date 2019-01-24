class RechangePanel extends eui.Component implements eui.UIComponent {

	public radio: eui.RadioButton;
	public butCommit: eui.Button;
	public butConcel: eui.Button;
	public qrGroup: eui.Group;
	public qrImage: eui.Image;


	private radioGroup: eui.RadioButtonGroup;


	public constructor() {
		super();
	}

	protected partAdded(partName: string, instance: any): void {
		super.partAdded(partName, instance);
	}


	protected childrenCreated(): void {
		super.childrenCreated();
		this.radioGroup = this.radio.group;
		this.radioGroup.addEventListener(egret.Event.CHANGE, this.OnRadioChange, this)

		this.butConcel.addEventListener(egret.TouchEvent.TOUCH_TAP, function () { this.parent.removeChild(this); }, this);
		this.butCommit.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onCommitCash, this);
	}

	/**
	 * 单选改变
	 */
	private OnRadioChange(event: egret.Event) {
		console.log("selected:" + this.radioGroup.selectedValue)
	}

	/**
	 * 点击提交按钮
	 */
	private onCommitCash() {
		console.log("commit click")
		this.qrGroup.visible = true;
	}
}