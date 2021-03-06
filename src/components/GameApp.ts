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
	private tixianPanel: RechangePanel;
	private congzhiPanel: WithdrawPanel;
	public caidan: eui.Image;
	public btnFankui: eui.Image;
	public btnMore:eui.Group;


	public constructor() {
		super();
	}

	protected partAdded(partName: string, instance: any): void {
		super.partAdded(partName, instance);
	}


	protected childrenCreated(): void {
		super.childrenCreated();
		this.btn_congzhi.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onCongzhi, this);
		this.btn_tixian.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTixian, this);
		this.btn_start.addEventListener(egret.TouchEvent.TOUCH_TAP, this.startGame, this);
		this.btnFankui.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onFeedback, this);
		this.btnMore.addEventListener(egret.TouchEvent.TOUCH_TAP,this.more,this);
		this.startAnimation();
	}

	private onCongzhi(event: egret.TouchEvent) {
		if (this.tixianPanel == null) {
			this.tixianPanel = new RechangePanel();
			this.tixianPanel.x = 10;
			this.tixianPanel.y = (this.height - 584) / 2
		}
		this.addChild(this.tixianPanel);
	}
	private onTixian() {
		if (this.congzhiPanel == null) {
			this.congzhiPanel = new WithdrawPanel();
			this.congzhiPanel.x = 10;
			this.congzhiPanel.y = (this.height - 584) / 2
		}
		this.addChild(this.congzhiPanel);
	}

	private startGame() {
		let game: GamePanel = new GamePanel();
		game.x = 0;
		game.y = 0;
		this.addChild(game);
	}

	private onFeedback() {
		this.addChild(new Feedback());
	}

	private startAnimation() {
		egret.Tween.get(this.caidan, { loop: true }).to({ rotation: 360 }, 4000, egret.Ease.backInOut)
	}
	private more(){
		console.log("click")
		window["showGzh"]();
	}
}