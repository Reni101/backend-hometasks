import {InputPostBody} from "../../common/types/input/posts.type";
import {postCollection} from "../../db/mongo-db";
import {ObjectId} from "mongodb";
import {Post} from "../../entity/post.entity";
import {injectable} from "inversify";

@injectable()
export class PostsRepository {
    async createPost(newPost: Post) {
        return postCollection.insertOne(newPost);
    }

    async updatePost(dto: InputPostBody, postId: string) {
        return postCollection.updateOne({_id: new ObjectId(postId)}, {
            $set: {
                title: dto.title,
                shortDescription: dto.shortDescription,
                content: dto.content,
                blogId: new ObjectId(dto.blogId)
            },
        })
    }

    async deletePost(id: string) {
        return postCollection.deleteOne({_id: new ObjectId(id)})
    }

    async findById(id: string) {
        return postCollection.findOne({_id: new ObjectId(id)})
    }

    async updateLikesInfo(dto: { likesCount: number, dislikesCount: number, }, postId: ObjectId) {
        return postCollection.updateOne({_id: postId}, {
            $set: {
                'extendedLikesInfo.likesCount': dto.likesCount,
                'extendedLikesInfo.dislikesCount': dto.dislikesCount
            },
        })
    }
}
