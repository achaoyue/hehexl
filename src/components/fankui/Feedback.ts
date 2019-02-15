class Feedback extends eui.Component implements eui.UIComponent {
	public phoneInput: eui.TextInput;
	public contentInput: eui.EditableText;
	public btnSubmit: eui.Button;
	public btnClose: eui.Button;
	public subLabel: eui.Label;
	public resultGP:eui.Group;
	public btnCancel:eui.Button;

	public constructor() {
		super();
	}

	protected partAdded(partName: string, instance: any): void {
		super.partAdded(partName, instance);
	}

	protected childrenCreated(): void {
		super.childrenCreated();
		this.btnSubmit.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onSubmit, this);
		this.btnClose.addEventListener(egret.TouchEvent.TOUCH_TAP,this.close,this);
		this.btnCancel.addEventListener(egret.TouchEvent.TOUCH_TAP,this.close,this);
	}

	private onSubmit() {
		let phone = this.phoneInput.text;
		let content = this.contentInput.text;
		let url = GameConfig.instance.host + GameConfig.instance.feedback + "?phone=" + phone + "&content=" + content+"&userId="+userInfo.id;
		this.resultGP.visible = true;
		NetTool.get(url).then(function (data) {
			this.subLabel.text = "提交完成。\n谢谢你的反馈，我们会尽快联系你."
		}.bind(this), function () {
			this.subLabel.text = "提交失败，麻烦稍后再试";
		}.bind(this));
	}

	private close() {
		this.parent.removeChild(this);
	}
}