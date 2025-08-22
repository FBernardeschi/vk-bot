import * as dotenv from "dotenv";
import { API, Updates, VK, Upload, WallPostContext } from 'vk-io';
import SendReaction from "./VkAction/SendReaction";
import WallRepost from "./VkAction/WallRepost";
import UserVk from "./VkAction/UserType";
import SendComment from "./VkAction/SendComment";
import { MESSAGES } from "./messages";

const result = dotenv.config({ path: "./.env" });
if (result.error) {
    throw result.error
}

const TOKEN = process.env.TOKEN || '';
const OWNER_CHAT = Number(process.env.CHAT) || 0;
const ADMIN = Number(process.env.ADMIN) || 0;

const api = new API({ token: TOKEN });
const vk = new VK({ token: TOKEN });

vk.updates.on('message', async (ctx) => {    
    console.log(ctx);
    
    if(ctx.replyMessage && (ctx.text === '!ban' || ctx.text === '!бан') && ctx.peerType === 'chat') {

        if(ctx.senderId === ADMIN) {
            api.messages.removeChatUser({
                chat_id: ctx.peerId % 2000000000,
                user_id: ctx.replyMessage.senderId
            });
        } else {
            ctx.reply('&#10060; Недостаточно полномочий! &#10060;');
        }
        
        await api.messages.delete({
            delete_for_all: 1,
            peer_id: ctx.peerId,
            cmids: ctx.replyMessage.conversationMessageId
        });
    }

    if(ctx.peerType === 'chat' && Math.ceil(Math.random() * 10) == 3) {
        console.log('Click reaction!');
        new SendReaction(ctx, api).sender();
    }
});

vk.updates.on('wall_post_new', async (ctx: WallPostContext) => {
    console.log(ctx);
    if(!ctx.isRepost) {
        new WallRepost(ctx, api, OWNER_CHAT).sender();
        const commentSender = new SendComment(ctx, api);
        commentSender.sender(MESSAGES.CHAT_LINK);  
        commentSender.sender(MESSAGES.TG_LINK);  
    }
});


vk.updates.start();