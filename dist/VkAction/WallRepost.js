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
const vk_io_1 = require("vk-io");
class WallRepost {
    constructor(ctx, api, chatId) {
        this.ctx = ctx;
        this.api = api;
        this.chatId = chatId;
    }
    sender() {
        return __awaiter(this, void 0, void 0, function* () {
            const smalls = ['&#9889;', '&#127873;', '&#127872;', '&#127917;', '&#9730;', '&#128011;'];
            const small = smalls[Math.floor((Math.random() * smalls.length))];
            const result = yield this.api.messages.send({
                peer_id: this.chatId,
                random_id: (0, vk_io_1.getRandomId)(),
                message: small + ' В сообществе новая запись! ' + small,
                attachment: this.ctx.wall
            });
            return result;
        });
    }
}
exports.default = WallRepost;
