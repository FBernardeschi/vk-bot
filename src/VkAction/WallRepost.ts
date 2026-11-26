import { API, ContextDefaultState, getRandomId, WallPostContext } from "vk-io";

export default class WallRepost
{
    private ctx: WallPostContext;
    private api: API;
    private chatId: number;
    
    constructor(ctx: WallPostContext, api: API, chatId: number) {
        this.ctx = ctx;
        this.api = api;
        this.chatId = chatId;
    }

    async sender(): Promise<void> {
        const smalls = ['&#9889;', '&#127873;', '&#127872;', '&#127917;', '&#9730;', '&#128011;', '&#128049;', '&#128029;', '&#11088;'];
        const small = smalls[Math.floor((Math.random() * smalls.length))];
        await this.api.messages.send({
            peer_id: this.chatId,
            random_id: getRandomId(),
            message: small + ' В сообществе новая запись! ' + small,
            attachment: this.ctx.wall
        });
    }
}