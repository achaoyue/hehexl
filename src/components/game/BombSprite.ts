class BombSprite extends egret.Sprite {
	public img: egret.Bitmap;
	public id:number
	public toRemove:boolean

	public constructor(texture:egret.Texture,dir:number) {
		super()
		if(!texture){
			console.error("texture error")
		}
		this.img = new egret.Bitmap();
		this.img.texture = texture;
		this.img.width = 50;
		this.img.height = 20;
		this.width = 50;
		this.height = 20;
		this.addChild(this.img);
		this.img.rotation = dir + 180;
		
		this.id = Math.random()*1000
	}

	public dir(dir:number){
		this.img.rotation = dir + 90;
	}
}