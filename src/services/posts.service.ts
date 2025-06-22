import {ObjectId} from "mongodb";
import {InputPostBody} from "../common/types/input/posts.type";
import {Post} from "../entity/post.entity";
import {InputPostByBlogBody} from "../common/types/input/blogs.types";
import {inject, injectable} from "inversify";
import {BlogsQueryRepository} from "../repositories/blogs/blogs.query.repository";
import {BlogsRepository} from "../repositories/blogs/blogs.repository";
import {PostsRepository} from "../repositories/posts/posts.repository";
import {PostsQueryRepository} from "../repositories/posts/posts.query.repository";
import {likeStatus} from "../db/reactionCommentSchema";
import {Result} from "../common/result/result.types";
import {ResultStatus} from "../common/result/resultCode";
import {ReactionPostRepository} from "../repositories/reactions/reactionsPostRepository";
import {reactionPostModel} from "../db/reactionPostSchema";
import {UsersRepository} from "../repositories/users/users.repository";
import {recountLikesHelper} from "../helpers/recountLikesHelper";

@injectable()
export class PostService {
    constructor(@inject(BlogsQueryRepository) private blogsQueryRepository: BlogsQueryRepository,
                @inject(BlogsRepository) private blogsRepository: BlogsRepository,
                @inject(PostsQueryRepository) private postsQueryRepository: PostsQueryRepository,
                @inject(PostsRepository) private postsRepository: PostsRepository,
                @inject(ReactionPostRepository) private reactionPostRepository: ReactionPostRepository,
                @inject(UsersRepository) private usersRepository: UsersRepository
    ) {
    }


    async createPost(dto: InputPostBody) {

        const blog = await this.blogsRepository.findBlog(dto.blogId)
        if (!blog) return null
        const newPost = new Post(dto.title, dto.shortDescription, dto.content, new ObjectId(dto.blogId), blog.name)
        const result = await this.postsRepository.createPost(newPost)

        return this.postsQueryRepository.findPost(result.insertedId.toString())

    }

    async updatePost(dto: InputPostBody, postId: string) {
        const blog = await this.blogsQueryRepository.findBlog(dto.blogId)
        const post = await this.postsQueryRepository.findPost(postId)
        if (blog && post) {
            const result = await this.postsRepository.updatePost(dto, postId)
            return result.modifiedCount === 1
        }
        return false
    }

    async deletePost(id: string) {
        const result = await this.postsRepository.deletePost(id)
        return result.deletedCount === 1
    }

    async createPostByBlogId(dto: InputPostByBlogBody & { blogId: string }) {
        const blog = await this.blogsRepository.findBlog(dto.blogId)
        if (!blog) return null
        const newPost = new Post(dto.title, dto.shortDescription, dto.content, new ObjectId(dto.blogId), blog.name)
        const result = await this.postsRepository.createPost(newPost)
        return await this.postsQueryRepository.findPost(result.insertedId.toString())
    }

    async reactionToggle(dto: { postId: string, userId: string, likeStatus: likeStatus }): Promise<Result> {
        const post = await this.postsRepository.findById(dto.postId)
        if (!post) {
            return {
                status: ResultStatus.NotFound,
                data: null,
                errorMessage: '404',
                extensions: [],
            }
        }

        const reaction = await this.reactionPostRepository.findByUserIdAndPostId({
            postId: dto.postId,
            userId: dto.userId
        })

        if (!reaction && dto.likeStatus === 'None') {
            // нет реакции и приходит статус 'None'=> ошибка 400 поле likeStatus +
            return {
                status: ResultStatus.BadRequest,
                data: null,
                errorMessage: '400',
                extensions: [{field: 'likeStatus', message: 'no changes'}],
            }
        }

        if (!reaction) {
            //нет реакции приходит статус like/dislike => создаём новую реакцию => обновляем счётчики в посте
            const user = await this.usersRepository.findById(dto.userId)

            const reaction = new reactionPostModel({
                postId: dto.postId,
                userId: dto.userId,
                status: dto.likeStatus,
                createdAt: new Date(),
                login: user?.login,
            })

            await this.reactionPostRepository.createReaction(reaction)


            const likesInfo =
                reaction.status === 'Like' ?
                    recountLikesHelper(post.extendedLikesInfo, 'addLike') :
                    recountLikesHelper(post.extendedLikesInfo, 'addDislike')

            await this.postsRepository.updateLikesInfo(likesInfo, post._id)

            return {
                status: ResultStatus.Success,
                data: null,
                errorMessage: '204',
                extensions: [],
            }


        } else {

            if (dto.likeStatus === 'None') {
                // есть реакция и приходит "None" => удаляем реакцию, и в зависимости какой был статус в реакции обновляем счётчики

                const likesInfo = reaction.status === 'Like' ?
                    recountLikesHelper(post.extendedLikesInfo, 'removeLike') :
                    recountLikesHelper(post.extendedLikesInfo, 'removeDislike')


                await this.postsRepository.updateLikesInfo(likesInfo, post._id)
                await this.reactionPostRepository.deleteReaction(reaction?._id)
                return {
                    status: ResultStatus.Success,
                    data: null,
                    errorMessage: '204',
                    extensions: [],
                }
            }

            if (dto?.likeStatus !== reaction?.status) {
                await this.reactionPostRepository.updateReaction({status: dto.likeStatus, reactionId: reaction._id})

                const likesInfo = dto.likeStatus === 'Like' ?
                    recountLikesHelper(post.extendedLikesInfo, 'toggleLike') :
                    recountLikesHelper(post.extendedLikesInfo, 'toggleDislike')

                await this.postsRepository.updateLikesInfo(likesInfo, post._id)
                return {
                    status: ResultStatus.Success,
                    data: null,
                    errorMessage: '204',
                    extensions: [],
                }
            } else {
                // есть реакция и приходит like/dislike не отличающийся от того что в бд => ошибка 400 поле likeStatus
                return {
                    status: ResultStatus.Success,
                    data: null,
                    errorMessage: '204',
                    extensions: [],
                }
            }
        }

    }

    async reactionStatusToPost(dto: { postId: string, userId: string }): Promise<likeStatus> {
        const reaction = await this.reactionPostRepository.findByUserIdAndPostId(dto)
        if (reaction?.status === 'Like') return 'Like'
        if (reaction?.status === 'Dislike') return 'Dislike'
        return 'None'

    }
}
