"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
class SendReaction {
    constructor(ctx, api) {
        this.ctx = ctx;
        this.api = api;
    }
    sender() {
        return __awaiter(this, arguments, void 0, function* (reactionId = Math.ceil(Math.random() * 15)) {
            const result = yield this.api.messages.sendReaction({
                peer_id: this.ctx.peerId,
                cmid: this.ctx.conversationMessageId || 0,
                reaction_id: reactionId
            });
            return result;
        });
    }
}
exports.default = SendReaction;
var Reaction;
(function (Reaction) {
    Reaction[Reaction["LOVE"] = 1] = "LOVE";
    Reaction[Reaction["FIRE"] = 2] = "FIRE";
    Reaction[Reaction["AMIN"] = 13] = "AMIN";
})(Reaction || (Reaction = {}));
