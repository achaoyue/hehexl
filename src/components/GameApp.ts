class GameApp extends eui.Component implements eui.UIComponent {

	public bg: eui.Group;
	public headImg: eui.Image;
	public beanImg: eui.Image;
	public beanScore: eui.Label;
	public btn_tixian: eui.Button;
	public btn_congzhi: eui.Button;
	public middle_bannel: eui.Rect;
	public tabPanel: HomeTabPanel;
	public btn_start: eui.Button;



	public constructor() {
		super();
		this.skinName = "GameAppSkin";
	}

	protected partAdded(partName: string, instance: any): void {
		super.partAdded(partName, instance);
	}


	protected childrenCreated(): void {
		super.childrenCreated();
		this.tabPanel.vStack.selectedIndex = 1;
		this.btn_start.addEventListener(egret.TouchEvent.TOUCH_TAP, this.changeTab, this);
	}

	private changeTab() {
		this.tabPanel.vStack.selectedIndex = 1 == this.tabPanel.vStack.selectedIndex ? 0 : 1;
	}

}