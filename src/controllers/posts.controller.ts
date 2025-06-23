import {inject, injectable} from "inversify";
import {Response} from "express";
import {InputPostBody} from "../common/types/input/posts.type";
import {InputPostsQueryType} from "../common/types/query.types";
import {postQueries} from "../helpers/postQueries";
import {ReqWithBody, ReqWithParams, ReqWithParAndBody, ReqWithQuery} from "../common/types/requests";
import {commentQueries} from "../helpers/commentQueries";
import {HttpStatuses} from "../common/types/httpStatuses";
import {PostService} from "../services/posts.service";
import {PostsQueryRepository} from "../repositories/posts/posts.query.repository";
import {CommentQueryRepository} from "../repositories/comments/comments.query.repository";
import {CommentsService} from "../services/comments.service";
import {ResultStatus} from "../common/result/resultCode";
import {ReactionsPostQueryRepository} from "../repositories/reactions/reactionsPostQueryRepository";

@injectable()
export class PostsController {
    constructor(
        @inject(PostService) private postsService: PostService,
        @inject(PostsQueryRepository) private postsQueryRepository: PostsQueryRepository,
        @inject(CommentQueryRepository) private commentsQueryRepository: CommentQueryRepository,
        @inject(CommentsService) private commentsService: CommentsService,
        @inject(ReactionsPostQueryRepository) private reactionsPostQueryRepository: ReactionsPostQueryRepository,
    ) {
    }

    async getAllPosts(req: ReqWithQuery<InputPostsQueryType>, res: Response) {
        const query = postQueries(req)
        const posts = await this.postsQueryRepository.getPosts(query);
        const postsId = posts.items.map(item => item.id.toString())

        for (const post of posts.items) {
            post.extendedLikesInfo.newestLikes = await this.reactionsPostQueryRepository.findNewReactions(post.id)
        }

        if (!req.userId) {
            res.status(200).json(posts).end()
            return
        }

        const reactions = await this.postsService.reactionStatusToPosts({userId: req.userId, postsId})

        posts.items.forEach((post, index) => {
            posts.items[index].extendedLikesInfo.myStatus = reactions[post.id] ? reactions[post.id] : 'None'
        })

        res.status(200).json(posts).end()
        return
    }

    async getPostById(req: ReqWithParams<{ id: string }>, res: Response) {
        const post = await this.postsQueryRepository.findPost(req.params.id)

        if (!post) {
            res.status(404).end()
            return
        }

        post.extendedLikesInfo.newestLikes = await this.reactionsPostQueryRepository.findNewReactions(post.id)

        if (post && !req.userId) {
            res.status(200).json(post).end()
            return
        }
        post.extendedLikesInfo.myStatus = await this.postsService.reactionStatusToPost({
            postId: post.id.toString(),
            userId: req.userId!
        })


        res.status(200).json(post).end()

        return


    }

    async createPost(req: ReqWithBody<InputPostBody>, res: Response) {
        const newPost = await this.postsService.createPost(req.body)
        newPost ? res.status(HttpStatuses.Created).json(newPost).end() : res.status(HttpStatuses.NotFound).end()
        return
    }

    async updatePost(req: ReqWithParAndBody<{ id: string }, InputPostBody>, res: Response,) {
        const isUpdated = await this.postsService.updatePost(req.body, req.params.id)
        isUpdated ? res.status(204).end() : res.status(404).end();
        return
    }

    async deletePost(req: ReqWithParams<{ id: string }>, res: Response,) {
        const isDeleted = await this.postsService.deletePost(req.params.id)
        isDeleted ? res.status(204).end() : res.status(404).end()
        return
    }

    async getCommentsByPostId(req: ReqWithParams<{ postId: string }>, res: Response) {
        const query = commentQueries(req)
        const post = await this.postsQueryRepository.findPost(req.params.postId)
        if (!post) {
            res.status(404).end()
            return
        }
        const result = await this.commentsQueryRepository.getComments(query, req.params.postId)
        if (!req.userId) {
            result ? res.status(200).json(result).end() : res.status(404).end()
            return
        } else {
            const commentsId = result.items.map(item => item.id)
            const reactions = await this.commentsService.reactionStatusToComments({userId: req.userId, commentsId})

            result.items.forEach((comment, index) => {
                result.items[index].likesInfo.myStatus = reactions[comment.id] ? reactions[comment.id] : 'None'
            })
            result ? res.status(200).json(result).end() : res.status(404).end()
            return
        }


    }

    async createCommentByPostId(req: ReqWithParAndBody<{ postId: string }, { content: string }>, res: Response) {
        const dto = {postId: req.params.postId, content: req.body.content, userId: req.userId!}
        const newComment = await this.commentsService.createComment(dto)
        newComment ? res.status(HttpStatuses.Created).json(newComment).end() : res.status(HttpStatuses.NotFound).end()
        return

    }

    async reaction(req: ReqWithParams<{ postId: string }>, res: Response) {
        const dto = {postId: req.params.postId, userId: req?.userId!, likeStatus: req.body.likeStatus}
        const result = await this.postsService.reactionToggle(dto)

        if (result.status === ResultStatus.BadRequest) {
            res.status(HttpStatuses.BadRequest).json({errorsMessages: result}).end()
            return
        }
        if (result.status === ResultStatus.NotFound) {
            res.status(HttpStatuses.NotFound).end()
            return
        }

        res.status(HttpStatuses.NoContent).end();
        return
    }
}

