import {WithId} from "mongodb";
import {PostDbType} from "../../db/types";

export const postMap = ({_id,...rest}:WithId<PostDbType>) => {
    return {id: _id, ...rest}
}