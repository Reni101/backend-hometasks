import {UserQueriesType} from "../../../helpers/types";
import {userCollection} from "../../../db/mongo-db";
import {ObjectId, WithId} from "mongodb";
import {UserDbType} from "../../../db/types";

export const usersQueryRepository = {
    async getUsers(query: UserQueriesType) {

        const filter: any = {}
        const conditions = []

        if (query.searchLoginTerm) {
            conditions.push({login: {$regex: query.searchLoginTerm, $options: 'i'}});  // Поиск по логину
        }
        if (query.searchEmailTerm) {
            conditions.push({email: {$regex: query.searchEmailTerm, $options: 'i'}});  // Поиск по email
        }

        if (conditions.length > 0) {
            filter.$or = conditions
        }

        const users = await userCollection.find(filter)
            .sort(query.sortBy, query.sortDirection)
            .skip((query.pageNumber - 1) * query.pageSize)
            .limit(query.pageSize)
            .toArray();

        const totalCount = await userCollection.countDocuments(filter)

        return {
            items: users.map(this._userMap),
            page: query.pageNumber,
            pageSize: query.pageSize,
            totalCount,
            pagesCount: Math.ceil(totalCount / query.pageSize)
        };
    },

    async findUser(id
                   :
                   string
    ) {
        const user = await userCollection.findOne({_id: new ObjectId(id)})
        return user ? this._userMap(user) : undefined

    }
    ,

    _userMap(user
             :
             WithId<UserDbType>
    ) {
        return {
            id: user._id,
            login: user.login,
            email: user.email,
            createdAt: user.createdAt,

        }

    }
}