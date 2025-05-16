import { API, ContextDefaultState, getRandomId } from "vk-io";

export default class WallRepost
{
    private ctx: ContextDefaultState;
    private api: API;
    private chatId: number;
    
    constructor(ctx: ContextDefaultState, api: API, chatId: number) {
        this.ctx = ctx;
        this.api = api;
        this.chatId = chatId;
    }

    async sender() {
        const smalls = ['&#9889;', '&#127873;', '&#127872;', '&#127917;', '&#9730;', '&#128011;'];
        const small = smalls[Math.floor((Math.random() * smalls.length))];
        const result = await this.api.messages.send({
            peer_id: this.chatId,
            random_id: getRandomId(),
            message: small + ' В сообществе новая запись! ' + small,
            attachment: this.ctx.wall
        });

        return result;
    }
}