
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

if (!TOKEN) {
    throw new Error('VK_TOKEN не указан в .env');
}

const api = new API({ token: TOKEN });
const vk = new VK({ token: TOKEN, pollingGroupId: 210739052 });

async function getCommunityId(api: API): Promise<string> {
    const groups = await api.groups.getById([]);

    if (!groups.groups.length) {
        throw new Error('Не удалось получить ID сообщества');
    }

    return groups.groups[0].id.toString();
}

async function bootstrap() {
    // Получаем ID сообщества до запуска обработчиков
    const idCommunity = await getCommunityId(api);

    console.log(`Community ID: ${idCommunity}`);

    vk.updates.on('message', async (ctx) => {
        console.log(ctx);

        if (
            ctx.replyMessage &&
            (ctx.text === '!ban' || ctx.text === '!бан') &&
            ctx.peerType === 'chat'
        ) {
            const senderId = ctx.senderId.toString();

            if (ADMINS.includes(senderId) || idCommunity === senderId) {
                await api.messages.removeChatUser({
                    chat_id: ctx.peerId % 2000000000,
                    user_id: ctx.replyMessage.senderId
                });
            } else {
                await ctx.reply('&#10060; Недостаточно полномочий! &#10060;');
            }

            await api.messages.delete({
                delete_for_all: 1,
                peer_id: ctx.peerId,
                cmids: ctx.replyMessage.conversationMessageId
            });
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

    vk.updates.on('wall_post_new', async (ctx: WallPostContext) => {
        if (!ctx.isRepost && !ctx.wall.donut?.is_donut) {
            new WallRepost(ctx, api, OWNER_CHAT).sender();

            const commentSender = new SendComment(ctx, api);

            commentSender.sender(MESSAGES.CHAT_LINK);
            commentSender.sender(MESSAGES.TG_LINK);
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
