import {UserDbType} from "../../db/types";
import {userCollection} from "../../db/mongo-db";
import {ObjectId} from "mongodb";

export const usersRepository = {
    async createUser(newUser: UserDbType) {
        return userCollection.insertOne(newUser);
    },
    async findUniqueUser(dto: { login: string, email: string }) {
        return userCollection.findOne({$or: [{login: dto.login}, {email: dto.email}]});
    },
    async findByLoginOrEmail(loginOrEmail: string,) {
        return userCollection.findOne({
            $or: [{email: loginOrEmail}, {login: loginOrEmail}],
        });
    },
    async deleteUser(id: string) {
        return userCollection.deleteOne({_id: new ObjectId(id)})
    },
}