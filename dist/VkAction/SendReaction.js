"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class SendReaction {
    ctx;
    api;
    constructor(ctx, api) {
        this.ctx = ctx;
        this.api = api;
    }
    async sender(reactionId = Math.ceil(Math.random() * 15)) {
        if (reactionId == 14 || reactionId == 31 || reactionId == 37 || reactionId == 28) {
            reactionId = 1;
        }
        const result = await this.api.messages.sendReaction({
            peer_id: this.ctx.peerId,
            cmid: this.ctx.conversationMessageId || 0,
            reaction_id: reactionId
        });
        // return result;
    }
}
exports.default = SendReaction;
var Reaction;
(function (Reaction) {
    Reaction[Reaction["LOVE"] = 1] = "LOVE";
    Reaction[Reaction["FIRE"] = 2] = "FIRE";
    Reaction[Reaction["SHIT"] = 5] = "SHIT";
    Reaction[Reaction["AMIN"] = 13] = "AMIN";
})(Reaction || (Reaction = {}));
//# sourceMappingURL=SendReaction.js.map