import {Response, Router} from "express";
import {InputPostBody} from "../common/types/input/posts.type";
import {authBasicMiddleware} from "../middleware/auth.basic.middleware";
import {errorsMiddleware} from "../middleware/errorsMiddleware";
import {
    commentsQueryValidation,
    postBodyValidation,
    postContent,
    postQueryValidation
} from "../middleware/validations/posts.input.validation-middleware";
import {InputPostsQueryType} from "../common/types/query.types";
import {postQueries} from "../helpers/postQueries";
import {postsService} from "../services/post.service";
import {postsQueryRepository} from "../repositories/posts/posts.query.repository";
import {blogsQueryRepository} from "../repositories/blogs/blogs.query.repository";
import {ReqWithBody, ReqWithParams, ReqWithParAndBody, ReqWithQuery} from "../common/types/requests";
import {commentQueries} from "../helpers/commentQueries";
import {commentsQueryRepository} from "../repositories/comments/comments.query.repository";
import {authBearerMiddleware} from "../middleware/auth.bearer.middleware";
import {commentsService} from "../services/comments.service";

export const postRouter = Router()


const postsController = {
    async getAllPosts(req: ReqWithQuery<InputPostsQueryType>, res: Response) {
        const query = postQueries(req)
        const posts = await postsQueryRepository.getPosts(query);
        res.status(200).json(posts).end()
        return
    },
    async getPostById(req: ReqWithParams<{ id: string }>, res: Response) {
        const blog = await postsQueryRepository.findPost(req.params.id)
        blog ? res.status(200).json(blog).end() : res.status(404).end()
        return
    },

    async createPost(req: ReqWithBody<InputPostBody>, res: Response) {
        const blog = await blogsQueryRepository.findBlog(req.body.blogId)
        if (blog) {
            const result = await postsService.createPost(req.body, blog)
            const newPost = await postsQueryRepository.findPost(result.insertedId.toString())
            newPost && res.status(201).json(newPost).end()
            return
        }

        res.status(404).end()
        return
    },
    async updatePost(req: ReqWithParAndBody<{ id: string }, InputPostBody>, res: Response,) {
        const isUpdated = await postsService.updatePost(req.body, req.params.id)
        isUpdated ? res.status(204).end() : res.status(404).end();
        return
    },
    async deletePost(req: ReqWithParams<{ id: string }>, res: Response,) {
        const isDeleted = await postsService.deletePost(req.params.id)
        isDeleted ? res.status(204).end() : res.status(404).end()
        return
    },

    async getCommentsByPostId(req: ReqWithParams<{ postId: string }>, res: Response) {
        const query = commentQueries(req)
        const post = postsQueryRepository.findPost(req.params.postId)
        if (!post) {
            res.status(404).end()
            return
        }
        const result = await commentsQueryRepository.getComments(query, req.params.postId)
        result ? res.status(200).json(result).end() : res.status(404).end()
        return
    },

    async createCommentByPostId(req: ReqWithParAndBody<{ postId: string }, { content: string }>, res: Response) {
        const post = await postsQueryRepository.findPost(req.params.postId)
        if (!post) {
            res.status(404).end()
            return
        }

        const payload = {postId: post.id.toString(), content: req.body.content, userId: req.userId!}
        const result = await commentsService.createComments(payload)
        if(result){
            const newComment = await commentsQueryRepository.findComment(result.insertedId.toString())
            newComment ? res.status(201).json(newComment).end() : res.status(404).end()
            return
        }
        res.status(404).end()
        return


    }
}


postRouter.get('/', postQueryValidation, errorsMiddleware, postsController.getAllPosts)
postRouter.get('/:id', postsController.getPostById)
postRouter.post('/', authBasicMiddleware, postBodyValidation, errorsMiddleware, postsController.createPost)
postRouter.put('/:id', authBasicMiddleware, postBodyValidation, errorsMiddleware, postsController.updatePost)
postRouter.delete('/:id', authBasicMiddleware, postsController.deletePost)
postRouter.get('/:postId/comments', commentsQueryValidation, errorsMiddleware, postsController.getCommentsByPostId)
postRouter.post('/:postId/comments', authBearerMiddleware, postContent, errorsMiddleware, postsController.createCommentByPostId)