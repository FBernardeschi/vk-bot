import WallPostNewContext from 'vk-io';

declare module 'vk-io' {
    interface WallPostNewContext {
        "donut": {
            "is_donut": boolean
        }
    }
}