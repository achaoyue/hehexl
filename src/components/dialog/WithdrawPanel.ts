class WithdrawPanel extends eui.Component implements eui.UIComponent {

	public totalBeans: eui.Label;
	public beanNum: eui.TextInput;
	public btnChoseFile: eui.Button;
	public btnSubmit: eui.Button;
	public btnCancel: eui.Button;
	public qrImg: eui.Image;


	public constructor() {
		super();
	}

	protected partAdded(partName: string, instance: any): void {
		super.partAdded(partName, instance);
	}


	protected childrenCreated(): void {
		super.childrenCreated();
		this.btnSubmit.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onSubmit, this);
		this.btnCancel.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onCancel, this);
		this.btnChoseFile.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onChoseFile, this);
	}

	private onSubmit() {
		console.log("submig");
	}
	private onCancel() {
		this.parent.removeChild(this);
	}
	private onChoseFile() {

	}

}