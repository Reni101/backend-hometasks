import {WithId} from "mongodb";
import {BlogDbType} from "../../db/types";

export const blogMap = ({_id,...rest}:WithId<BlogDbType>) => {
    return {id: _id, ...rest}
}