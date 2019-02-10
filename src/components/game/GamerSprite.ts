class GamerSprite extends egret.Sprite {
	public id: number
	private img: egret.Bitmap;
	private saomiao: egret.Bitmap;
	public dirAngle:number;

	public constructor(txtr: egret.Texture) {
		super();
		this.width = 80;
		this.height = 80;
		this.anchorOffsetX = 40;
		this.anchorOffsetY = 40;

		this.saomiao = new egret.Bitmap();
		this.saomiao.texture = RES.getRes("saomiao_png");
		this.saomiao.width = 100;
		this.saomiao.height = 150
		this.saomiao.anchorOffsetX = 50;
		this.saomiao.anchorOffsetY = 150;
		this.saomiao.x = this.width / 2;
		this.saomiao.y = this.height /2;
		this.addChild(this.saomiao)

		this.img = new egret.Bitmap();
		this.img.texture = txtr;
		this.img.width = 80;
		this.img.height = 110;
		this.addChild(this.img);

		this.once(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
	}

	public onAddToStage(event: egret.Event) {

	}

	public dir(dir: number) {
		this.saomiao.rotation = dir + 90;
		this.dirAngle = dir;
	}

}