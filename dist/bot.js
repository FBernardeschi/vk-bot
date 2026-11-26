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
const SHIT = (process.env.SHIT || '').split(',');
const ADMINS = (process.env.ADMIN || '').split(',');
const ENABLE_COMMENT_SENDER = process.env.ENABLE_COMMENT_SENDER === '1';
if (!TOKEN) {
    throw new Error('VK_TOKEN не указан в .env');
}
const api = new vk_io_1.API({ token: TOKEN });
const vk = new vk_io_1.VK({ token: TOKEN });
async function getCommunityId(api) {
    const groups = await api.groups.getById([]);
    // Проверяем, что groups существует и не пуст
    if (!groups || !groups.groups || groups.groups.length === 0) {
        throw new Error('Не удалось получить ID сообщества');
    }
    // После проверки TypeScript понимает, что groups.groups точно есть
    const group = groups.groups[0];
    if (group) {
        return group.id.toString();
    }
    return '';
}
async function deleteMessageForAll(api, peerId, cmids) {
    if (cmids === undefined)
        return;
    await api.messages.delete({
        delete_for_all: 1,
        peer_id: peerId,
        cmids
    });
}
async function bootstrap() {
    const idCommunity = await getCommunityId(api);
    const GROUP_ID = Number(idCommunity);
    console.log(`Community ID: ${idCommunity}`);
    vk.updates.on('message', async (ctx) => {
        console.log(ctx);
        // if (
        //     ctx.replyMessage &&
        //     (ctx.text === '!ban' || ctx.text === '!бан') &&
        //     ctx.peerType === 'chat'
        // ) {
        //     const senderId = ctx.senderId.toString();
        //     if (ADMINS.includes(senderId) || idCommunity === senderId) {
        //         await api.messages.removeChatUser({
        //             chat_id: ctx.peerId % 2000000000,
        //             user_id: ctx.replyMessage.senderId
        //         });
        //     } else {
        //         await ctx.reply('&#10060; Недостаточно полномочий! &#10060;');
        //     }
        //     await api.messages.delete({
        //         delete_for_all: 1,
        //         peer_id: ctx.peerId,
        //         cmids: ctx.replyMessage.conversationMessageId
        //     });
        // }
        if (ctx.replyMessage &&
            ['!ban', '!бан', '!bl', '!чс'].includes((ctx.text || '').toLowerCase()) &&
            ctx.peerType === 'chat') {
            const senderId = ctx.senderId.toString();
            const targetId = ctx.replyMessage.senderId; // ID того, кого баним
            const command = (ctx.text || '').toLowerCase();
            // Проверка прав
            if (ADMINS.includes(senderId) || idCommunity === senderId) {
                try {
                    // 1. Всегда выгоняем из беседы
                    await api.messages.removeChatUser({
                        chat_id: ctx.peerId % 2000000000,
                        user_id: targetId
                    });
                    // 2. Если это ЧС/Блеклист - баним в сообществе (заносим в ЧС группы)
                    if (['!bl', '!чс'].includes(command)) {
                        await api.groups.ban({
                            group_id: GROUP_ID, // ID сообщества (число)
                            owner_id: targetId, // ВАЖНО: именно owner_id! (ID пользователя)
                            reason: 1 // 1 = Спам
                        });
                    }
                }
                catch (error) {
                    console.error(`Ошибка при выполнении команды ${command}:`, error);
                    await ctx.reply('⚠️ Произошла ошибка. Возможно, пользователь уже забанен или вышел из беседы.');
                }
            }
            else {
                await ctx.reply('❌ Недостаточно полномочий! ❌');
            }
            // 3. Удаляем сообщение с командой
            try {
                await deleteMessageForAll(api, ctx.peerId, ctx.replyMessage?.conversationMessageId);
            }
            catch (error) {
                console.error('Не удалось удалить сообщение с командой:', error);
            }
        }
        if (ctx.peerType === 'chat' &&
            random_utils_1.RandomUtils.rollChance(5)) {
            new SendReaction_1.default(ctx, api).sender();
        }
        if (SHIT.includes(ctx.senderId.toString())) {
            new SendReaction_1.default(ctx, api).sender(5);
        }
        if (ctx.attachments &&
            Array.isArray(ctx.attachments) &&
            ctx.attachments.length > 0 &&
            ctx.attachments[0] instanceof vk_io_1.VideoAttachment &&
            ctx.attachments[0].title?.includes('Клип')) {
            // 3. Удаляем сообщение с клипом
            try {
                await deleteMessageForAll(api, ctx.peerId, ctx.replyMessage?.conversationMessageId);
            }
            catch (error) {
                console.error('Не удалось удалить сообщение с командой:', error);
            }
            console.log('Клип удалён!');
        }
    });
    // vk.updates.on('wall_post_new', async (ctx: WallPostContext) => {
    //     if (!ctx.isRepost && !ctx.wall.donut?.is_donut) {
    //         new WallRepost(ctx, api, OWNER_CHAT).sender();
    //         const commentSender = new SendComment(ctx, api);
    //         // commentSender.sender(MESSAGES.CHAT_LINK);
    //         // commentSender.sender(MESSAGES.TG_LINK);
    //         if (ENABLE_COMMENT_SENDER) {
    //             const commentSender = new SendComment(ctx, api);
    //             commentSender.sender(MESSAGES.CHAT_LINK);
    //             commentSender.sender(MESSAGES.TG_LINK);
    //         }
    //     }
    // });
    vk.updates.on('wall_post_new', async (ctx) => {
        // Проверяем, что это не репост и не донат
        if (!ctx.isRepost && !ctx.wall.donut?.is_donut) {
            // Получаем ID автора записи (от чьего имени опубликовано)
            const authorId = ctx.wall.authorId;
            // ID сообщества у нас уже есть в GROUP_ID (положительное число)
            console.log(authorId);
            // Сравниваем. Если автор записи — наше сообщество, обрабатываем.
            if (Math.abs(authorId) === GROUP_ID) {
                // Твой код: WallRepost, SendComment и т.д.
                new WallRepost_1.default(ctx, api, OWNER_CHAT).sender();
                if (ENABLE_COMMENT_SENDER) {
                    const commentSender = new SendComment_1.default(ctx, api);
                    commentSender.sender(messages_1.MESSAGES.CHAT_LINK);
                    commentSender.sender(messages_1.MESSAGES.TG_LINK);
                }
            }
        }
    });
    // Запускаем получение событий только после инициализации
    await vk.updates.start();
    console.log('VK Bot started!');
}
bootstrap().catch((error) => {
    console.error('VK Bot startup error:', error);
    process.exitCode = 1;
});
//# sourceMappingURL=bot.js.map