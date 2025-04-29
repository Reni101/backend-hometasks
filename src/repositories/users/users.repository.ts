import {userCollection} from "../../db/mongo-db";
import {ObjectId} from "mongodb";
import {User} from "../../entity/user.entity";
import {add} from "date-fns";

export const usersRepository = {
    async createUser(newUser: User) {
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
    async findUserByConfirmationCode(code: string,) {
        return userCollection.findOne({'emailConfirmation.confirmationCode': code});
    },
    async findUserByEmail(email: string,) {
        return userCollection.findOne({email});
    },
    async confirmEmail(userId: string) {
        return userCollection.updateOne({_id: new ObjectId(userId)}, {'emailConfirmation.isConfirmed': true});
    },
    async updateEmailConfirmation(userId: string, newConfirmationCode: string) {
        return userCollection.updateOne({_id: new ObjectId(userId)},
            {
                'emailConfirmation.expirationDate': add(new Date(), {
                    hours: 1,
                    minutes: 30,
                }).toISOString(),
                'emailConfirmation.confirmationCode': newConfirmationCode,
            });
    },
    async deleteUser(id: string) {
        return userCollection.deleteOne({_id: new ObjectId(id)})
    },
}