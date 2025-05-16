import { API, ContextDefaultState } from "vk-io";

export default class SendReaction
{
    private ctx: ContextDefaultState;
    private api: API;

    constructor(ctx: ContextDefaultState, api: API) {
        this.ctx = ctx;
        this.api = api;
    }

    async sender() {
        const result = await this.api.messages.sendReaction({
            peer_id: this.ctx.peerId,
            cmid: this.ctx.conversationMessageId || 0,
            reaction_id: Math.floor(Math.random()) == 1 ? Reaction.LOVE : Reaction.AMIN
        });

        return result;
    }
}

enum Reaction {
    LOVE = 1,
    FIRE = 2,
    AMIN = 13,
}