
import * as dotenv from "dotenv";
import {
    API,
    VK,
    WallPostContext,
    VideoAttachment
} from 'vk-io';

import SendReaction from "./VkAction/SendReaction";
import WallRepost from "./VkAction/WallRepost";
import SendComment from "./VkAction/SendComment";
import { MESSAGES } from "./messages";
import { RandomUtils } from "./utils/random.utils";

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

const api = new API({ token: TOKEN });
const vk = new VK({ token: TOKEN });

async function getCommunityId(api: API): Promise<string> {
    const groups = await api.groups.getById([]);

    if (!groups.groups.length) {
        throw new Error('Не удалось получить ID сообщества');
    }

    return groups.groups[0].id.toString();
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

        if (
            ctx.replyMessage &&
            ['!ban', '!бан', '!bl', '!чс'].includes((ctx.text || '').toLowerCase()) &&
            ctx.peerType === 'chat'
        ) {
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
                            group_id: GROUP_ID,   // ID сообщества (число)
                            owner_id: targetId,   // ВАЖНО: именно owner_id! (ID пользователя)
                            reason: 1             // 1 = Спам
                        });
                    }
                } catch (error) {
                    console.error(`Ошибка при выполнении команды ${command}:`, error);
                    await ctx.reply('⚠️ Произошла ошибка. Возможно, пользователь уже забанен или вышел из беседы.');
                }
            } else {
                await ctx.reply('❌ Недостаточно полномочий! ❌');
            }

            // 3. Удаляем сообщение с командой (вынес из try, чтобы удалялось всегда, даже если бан не прошел)
            try {
                await api.messages.delete({
                    delete_for_all: 1,
                    peer_id: ctx.peerId,
                    cmids: ctx.replyMessage.conversationMessageId
                });
            } catch (error) {
                console.error('Не удалось удалить сообщение с командой:', error);
            }
        }

        if (
            ctx.peerType === 'chat' &&
            RandomUtils.rollChance(5)
        ) {
            new SendReaction(ctx, api).sender();
        }

        if (SHIT.includes(ctx.senderId.toString())) {
            new SendReaction(ctx, api).sender(5);
        }

        if (
            ctx.attachments &&
            Array.isArray(ctx.attachments) &&
            ctx.attachments.length > 0 &&
            ctx.attachments[0] instanceof VideoAttachment &&
            ctx.attachments[0].title?.includes('Клип')
        ) {
            await api.messages.delete({
                delete_for_all: 1,
                peer_id: ctx.peerId,
                cmids: ctx.conversationMessageId
            });

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

    vk.updates.on('wall_post_new', async (ctx: WallPostContext) => {
        // Проверяем, что это не репост и не донат
        if (!ctx.isRepost && !ctx.wall.donut?.is_donut) {
            // Получаем ID автора записи (от чьего имени опубликовано)
            const authorId = ctx.wall.authorId;
            // ID сообщества у нас уже есть в GROUP_ID (положительное число)

            console.log(authorId);
            
            
            // Сравниваем. Если автор записи — наше сообщество, обрабатываем.
            if (Math.abs(authorId as number) === GROUP_ID) {
                // Твой код: WallRepost, SendComment и т.д.
                new WallRepost(ctx, api, OWNER_CHAT).sender();
                
                if (ENABLE_COMMENT_SENDER) {
                    const commentSender = new SendComment(ctx, api);
                    commentSender.sender(MESSAGES.CHAT_LINK);
                    commentSender.sender(MESSAGES.TG_LINK);
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
