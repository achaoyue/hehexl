class GameConfig {
	public static instance:GameConfig;
	public evn: string = "local"
	public host: string;
	public loginUrl: string;
	public gameSocket: string;


	public constructor() {
		let config = GameConfig[this.evn];
		for(let item in config){
			this[item] = config[item];
		}
		GameConfig.instance = this;
	}
	private static online = {
		host: "http://lelefans.top:8080/",
		loginUrl: "lele/game/user/login",
		gameSocket: "ws://lelefans.top:8000?token="
	}
	private static local = {
		host: "http://192.168.99.103:8080/",
		loginUrl: "lele/game/user/login",
		gameSocket: "ws://192.168.99.103:8000?token="
	}
}
new GameConfig();