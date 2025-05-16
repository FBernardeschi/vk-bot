import * as dotenv from "dotenv";
import { API, Updates, Upload } from "vk-io";
import SendReaction from "./VkAction/SendReaction";
import WallRepost from "./VkAction/WallRepost";
import UserVk from "./VkAction/UserType";

const result = dotenv.config({ path: "./.env" });
if (result.error) {
    throw result.error
}

const TOKEN = process.env.TOKEN || '';
const OWNER_CHAT = Number(process.env.CHAT) || 0;

const api = new API({ token: TOKEN });
const upload = new Upload({ api: api });

const updates = new Updates({
    api: api,
    upload: upload
});

updates.on('message', async (ctx) => {
    console.log(ctx);
    
    if(ctx.replyMessage && ctx.text === '/ban' && ctx.peerType === 'chat') {
        console.log(ctx);

        const users = await api.messages.getConversationMembers({
            peer_id: ctx.peerId,
            count: 40
        });

        const user = users.items.find(el => el.member_id === ctx.senderId);
        if(user && 'is_admin' in user && user.is_admin === true) {
            api.messages.removeChatUser({
                chat_id: ctx.peerId,
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
        const resultReaction = new SendReaction(ctx, api).sender();
    }
});

updates.on('wall_post_new', async (ctx) => {
    console.log(ctx);
    if(!ctx.isRepost) {
        const resultWallRepost = new WallRepost(ctx, api, OWNER_CHAT).sender();        
    }
});


updates.start();