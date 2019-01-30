class GamerSprite extends egret.Bitmap {
	public id:number

	public constructor(txtr:egret.Texture){
		super(txtr);
		this.width =  20;
		this.height = 20;
		this.once(egret.Event.ADDED_TO_STAGE,this.onAddToStage,this);
	}

	public onAddToStage(event:egret.Event){

	}

}