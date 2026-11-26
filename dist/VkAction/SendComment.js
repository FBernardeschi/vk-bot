"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// import { WallCreateCommentResponse } from 'vk-io';
class SendComment {
    api;
    context;
    constructor(context, api) {
        this.context = context;
        this.api = api;
    }
    async sender(text) {
        return this.api.wall.createComment({
            owner_id: this.context.wall.ownerId,
            post_id: this.context.wall.id,
            message: text
        });
    }
}
exports.default = SendComment;
//# sourceMappingURL=SendComment.js.map