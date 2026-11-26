"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vk_io_1 = require("vk-io");
class WallRepost {
    ctx;
    api;
    chatId;
    constructor(ctx, api, chatId) {
        this.ctx = ctx;
        this.api = api;
        this.chatId = chatId;
    }
    async sender() {
        const smalls = ['&#9889;', '&#127873;', '&#127872;', '&#127917;', '&#9730;', '&#128011;', '&#128049;', '&#128029;', '&#11088;'];
        const small = smalls[Math.floor((Math.random() * smalls.length))];
        await this.api.messages.send({
            peer_id: this.chatId,
            random_id: (0, vk_io_1.getRandomId)(),
            message: small + ' В сообществе новая запись! ' + small,
            attachment: this.ctx.wall
        });
    }
}
exports.default = WallRepost;
//# sourceMappingURL=WallRepost.js.map