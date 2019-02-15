class StoryTool {
	private static TOKEN:string = "token";

	public constructor() {
	}

	public static getToken():string{
		return egret.localStorage.getItem(StoryTool.TOKEN);
	}
	public static setToken(token:string){
		egret.localStorage.setItem(StoryTool.TOKEN,token);
	}

	public static getItem(item,defStr){
		let s = egret.localStorage.getItem(item);
		if(!s){
			return defStr;
		}else{
			return s;
		}
	}

	public static setItem(key,value){
		egret.localStorage.setItem(key,value);
	}
}