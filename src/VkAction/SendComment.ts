import { API, WallPostContext } from 'vk-io';
import { WallCreateCommentResponse } from 'vk-io/lib/api/schemas/responses';


export default class SendComment 
{
    private api: API;
    private context: WallPostContext;

    constructor(context: WallPostContext, api: API)
    {
        this.context = context;
        this.api = api;
    }

    async sender(text: string): Promise<WallCreateCommentResponse>
    {
        return this.api.wall.createComment({
            owner_id: this.context.wall.ownerId,
            post_id: this.context.wall.id,
            message: text
        });
    }

}