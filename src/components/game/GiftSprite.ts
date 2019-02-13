class GiftSprite extends eui.Component implements eui.UIComponent {
	public img: eui.Image;
	public light1: eui.Image;
	public light2: eui.Image;

	//-----自定义--
	public time: number = 1000;

	public constructor() {
		super();
	}

	protected partAdded(partName: string, instance: any): void {
		super.partAdded(partName, instance);
	}

	protected childrenCreated(): void {
		super.childrenCreated();
		this.anchorOffsetX = this.width / 2;
		this.anchorOffsetY = this.height / 2;
		let tw = egret.Tween.get(this, { loop: true });
		for (let i = 0; i < 10; i++) {
			tw.to({ rotation: 15 }, 100, egret.Ease.backInOut).wait(300);
			tw.to({ rotation: 0 }, 100, egret.Ease.backInOut).wait(300);
			tw.to({ rotation: -15 }, 100, egret.Ease.backInOut).wait(300);
			tw.to({ rotation: 0 }, 100, egret.Ease.backInOut).wait(300);
		}
		tw.wait(4000);
		this.light1.width = this.width;
		this.light1.height = this.height;
		this.light2.width = this.width;
		this.light2.height = this.height;
		setTimeout(this.startAnimation.bind(this), this.time)
	}

	private startAnimation() {
		this.light1.visible = true;
		this.light2.visible = true;
		egret.Tween.get(this.light1, { loop: true }).to({ rotation: 180, scaleX: 2, scaleY: 2 }, 2000).to({ rotation: 180, scaleX: 0.5, scaleY: 0.5 }, 2000)
		egret.Tween.get(this.light2, { loop: true }).to({ rotation: 180, scaleX: 2, scaleY: 2 }, 2000).to({ rotation: 180, scaleX: 0.5, scaleY: 0.5 }, 2000)
	}
}