import {userCollection} from "../../db/mongo-db";
import {ObjectId} from "mongodb";
import {User} from "../../entity/user.entity";
import {injectable} from "inversify";

@injectable()
export class UsersRepository {
    async createUser(newUser: User) {
        return userCollection.insertOne(newUser);
    }

    async findUniqueUser(dto: { login: string, email: string }) {
        return userCollection.findOne({$or: [{login: dto.login}, {email: dto.email}]});
    }

    async findById(id: string) {
        return userCollection.findOne({_id: new ObjectId(id)}
        )
    }

    async findByLoginOrEmail(loginOrEmail: string,) {
        return userCollection.findOne({
            $or: [{email: loginOrEmail}, {login: loginOrEmail}],
        });
    }

    async findUserByConfirmationCode(code: string,) {
        return userCollection.findOne({'emailConfirmation.confirmationCode': code});
    }

    async findUserByEmail(email: string,) {
        return userCollection.findOne({email});
    }

    async confirmEmail(userId: string) {
        return userCollection.updateOne({_id: new ObjectId(userId)}, {$set: {'emailConfirmation.isConfirmed': true}});
    }

    async updateEmailConfirmation(userId: string, newConfirmationCode: string, newDate: string) {


        return userCollection.updateOne({_id: new ObjectId(userId)},
            {
                $set: {
                    'emailConfirmation.expirationDate': newDate,
                    'emailConfirmation.confirmationCode': newConfirmationCode,
                }
            });
    }

    async deleteUser(id: string) {
        return userCollection.deleteOne({_id: new ObjectId(id)})
    }

    async updateRecoveryCode(userId: ObjectId, recoveryCode: string,) {
        return userCollection.updateOne({_id: userId},
            {$set: {recoveryCode: recoveryCode,}});
    }

    async findByRecoveryCode(recoveryCode: string,) {
        return userCollection.findOne({recoveryCode});
    }

    async updatePassword(userId: ObjectId, passwordHash: string) {
        return userCollection.updateOne({_id: userId}, {
            $set: {
                passwordHash: passwordHash, recoveryCode: ''
            }
        });
    }
}