
/**
 * 中间战绩面板
 */
class HomeTabPanel extends eui.Component implements eui.UIComponent {

	public vStack: eui.ViewStack;
	public realTimeScroller: eui.Scroller;
	public realTimeList: eui.List;
	public myHistoryScroller: eui.Scroller;
	public myHistoryList: eui.List;
	public btnRealTime: eui.Button;
	public btnMyHistory: eui.Button;
	public realTimeCollection:eui.ArrayCollection = new eui.ArrayCollection();
	public historyCollection:eui.ArrayCollection = new eui.ArrayCollection();


	public constructor() {
		super();
	}

	protected partAdded(partName: string, instance: any): void {
		super.partAdded(partName, instance);
	}


	protected childrenCreated(): void {
		super.childrenCreated();
		this.btnRealTime.addEventListener(egret.TouchEvent.TOUCH_TAP, this.changeTab, this);
		this.btnMyHistory.addEventListener(egret.TouchEvent.TOUCH_TAP, this.changeTab, this);

		//填充数据
		this.realTimeCollection = new eui.ArrayCollection([1,2,3,4,5,6,7,8,9,10,11,12,14,15]);
		this.realTimeList.dataProvider = this.realTimeCollection;
		this.realTimeList.itemRendererSkinName = "HomeTabItemSkin";
		// this.realTimeList.itemRenderer = HomeTabItem
		this.realTimeScroller.viewport = this.realTimeList

		this.historyCollection = new eui.ArrayCollection([1,2,3,4]);
		this.myHistoryList.dataProvider = this.historyCollection;
		this.myHistoryList.itemRendererSkinName = "HomeTabItemSkin"
		// this.myHistoryList.itemRenderer = HomeTabItem;
		this.myHistoryScroller.viewport = this.myHistoryList
		
	}

	/**
	 * 修改中间战绩面板
	 */
	private changeTab(event: egret.TouchEvent) {
		if (event.target == this.btnRealTime) {
			this.vStack.selectedIndex = 0;
		} else if (event.target == this.btnMyHistory) {
			this.vStack.selectedIndex = 1;
		}
	}

}