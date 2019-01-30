// TypeScript file
/**
 * 游戏房间状态消息，包括玩家、子弹位置信息，玩家得分等。
 */
class GameStartEvent{
    /**
     * 游戏玩家
     */
    public gamers:Array<Gamer>;
    /**
     * 子弹
     */
    public bombs:Array<Bomb>;
}