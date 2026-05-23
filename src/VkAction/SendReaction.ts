import { API, ContextDefaultState } from "vk-io";

export default class SendReaction
{
    private ctx: ContextDefaultState;
    private api: API;

    constructor(ctx: ContextDefaultState, api: API) {
        this.ctx = ctx;
        this.api = api;
    }

    async sender(reactionId = Math.ceil(Math.random() * 15)) {
        if (reactionId == 5) {
            reactionId = 16;
        }
        const result = await this.api.messages.sendReaction({
            peer_id: this.ctx.peerId,
            cmid: this.ctx.conversationMessageId || 0,
            reaction_id: reactionId
        });

        return result;
    }
}

enum Reaction {
    LOVE = 1,
    FIRE = 2,
    SHIT = 5,
    AMIN = 13,
}