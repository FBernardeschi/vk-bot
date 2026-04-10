"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv = __importStar(require("dotenv"));
const vk_io_1 = require("vk-io");
const SendReaction_1 = __importDefault(require("./VkAction/SendReaction"));
const WallRepost_1 = __importDefault(require("./VkAction/WallRepost"));
const SendComment_1 = __importDefault(require("./VkAction/SendComment"));
const messages_1 = require("./messages");
const random_utils_1 = require("./utils/random.utils");
const result = dotenv.config({ path: "./.env" });
if (result.error) {
    throw result.error;
}
const TOKEN = process.env.TOKEN || '';
const OWNER_CHAT = Number(process.env.CHAT) || 0;
// const ADMIN = Number(process.env.ADMIN) || 0;
const SHIT = (process.env.SHIT || '').split(',');
const ADMINS = (process.env.ADMIN || '').split(',');
const api = new vk_io_1.API({ token: TOKEN });
const vk = new vk_io_1.VK({ token: TOKEN });
vk.updates.on('message', (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(ctx);
    if (ctx.replyMessage && (ctx.text === '!ban' || ctx.text === '!бан') && ctx.peerType === 'chat') {
        if (ADMINS.includes(ctx.senderId.toString())) {
            api.messages.removeChatUser({
                chat_id: ctx.peerId % 2000000000,
                user_id: ctx.replyMessage.senderId
            });
        }
        else {
            ctx.reply('&#10060; Недостаточно полномочий! &#10060;');
        }
        yield api.messages.delete({
            delete_for_all: 1,
            peer_id: ctx.peerId,
            cmids: ctx.replyMessage.conversationMessageId
        });
    }
    if (ctx.peerType === 'chat' && random_utils_1.RandomUtils.rollChance(10)) {
        new SendReaction_1.default(ctx, api).sender();
    }
    if (SHIT.includes(ctx.senderId.toString())) {
        new SendReaction_1.default(ctx, api).sender(5);
    }
}));
vk.updates.on('wall_post_new', (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    if (!ctx.isRepost && !((_a = ctx.wall.donut) === null || _a === void 0 ? void 0 : _a.is_donut)) {
        new WallRepost_1.default(ctx, api, OWNER_CHAT).sender();
        const commentSender = new SendComment_1.default(ctx, api);
        commentSender.sender(messages_1.MESSAGES.CHAT_LINK);
        commentSender.sender(messages_1.MESSAGES.TG_LINK);
    }
}));
vk.updates.start();
