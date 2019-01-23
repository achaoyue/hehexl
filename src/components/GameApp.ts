class GameApp extends eui.Component implements eui.UIComponent {

	public headImg: eui.Image;
	public beanImg: eui.Image;
	public beanScore: eui.Label;


	public constructor() {
		super();
		this.skinName = "GameAppSkin";
	}

	protected partAdded(partName: string, instance: any): void {
		super.partAdded(partName, instance);
	}


	protected childrenCreated(): void {
		super.childrenCreated();
	}

}