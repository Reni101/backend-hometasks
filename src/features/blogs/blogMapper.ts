import {WithId} from "mongodb";
import {BlogDbType} from "../../db/types";

export const blogMapper = ({_id,...rest}:WithId<BlogDbType>) => {
    return {id: _id, ...rest}
}