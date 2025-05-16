export default interface UserVk {
    member_id: number;
    is_restricted_to_write?: boolean,
    invited_by?: number,
    is_admin?: boolean,
    is_owner?: boolean,
    join_date?: number
}