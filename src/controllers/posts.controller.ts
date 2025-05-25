import {inject, injectable} from "inversify";
import {Response} from "express";
import {InputPostBody} from "../common/types/input/posts.type";
import {InputPostsQueryType} from "../common/types/query.types";
import {postQueries} from "../helpers/postQueries";
import {postsQueryRepository} from "../repositories/posts/posts.query.repository";
import {ReqWithBody, ReqWithParams, ReqWithParAndBody, ReqWithQuery} from "../common/types/requests";
import {commentQueries} from "../helpers/commentQueries";
import {commentsQueryRepository} from "../repositories/comments/comments.query.repository";
import {commentsService} from "../services/comments.service";
import {HttpStatuses} from "../common/types/httpStatuses";
import {PostService} from "../services/posts.service";


@injectable()
export class PostsController {
    constructor(@inject(PostService) private postsService: PostService,
    ) {
    }

    async getAllPosts(req: ReqWithQuery<InputPostsQueryType>, res: Response) {
        const query = postQueries(req)
        const posts = await postsQueryRepository.getPosts(query);
        res.status(200).json(posts).end()
        return
    }

    async getPostById(req: ReqWithParams<{ id: string }>, res: Response) {
        const blog = await postsQueryRepository.findPost(req.params.id)
        blog ? res.status(200).json(blog).end() : res.status(404).end()
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
        const post = await postsQueryRepository.findPost(req.params.postId)
        if (!post) {
            res.status(404).end()
            return
        }
        const result = await commentsQueryRepository.getComments(query, req.params.postId)
        result ? res.status(200).json(result).end() : res.status(404).end()
        return
    }

    async createCommentByPostId(req: ReqWithParAndBody<{ postId: string }, { content: string }>, res: Response) {
        const dto = {postId: req.params.postId, content: req.body.content, userId: req.userId!}
        const newComment = await commentsService.createComment(dto)
        newComment ? res.status(HttpStatuses.Created).json(newComment).end() : res.status(HttpStatuses.NotFound).end()
        return

    }
}
