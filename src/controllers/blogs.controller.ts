import {Request, Response} from "express";
import {InputBlogBody, InputPostByBlogBody} from "../common/types/input/blogs.types";
import {BlogService} from "../services/blogs.service";
import {blogQueries} from "../helpers/blogQueries";
import {InputBlogsQueryType, InputPostsQueryType} from "../common/types/query.types";
import {postQueries} from "../helpers/postQueries";
import {BlogsQueryRepository} from "../repositories/blogs/blogs.query.repository";
import {ReqWithBody, ReqWithParams, ReqWithParAndBody, ReqWithQuery} from "../common/types/requests";
import {HttpStatuses} from "../common/types/httpStatuses";
import {inject, injectable} from "inversify";
import {PostService} from "../services/posts.service";
import {PostsQueryRepository} from "../repositories/posts/posts.query.repository";
import {ReactionsPostQueryRepository} from "../repositories/reactions/reactionsPostQueryRepository";


@injectable()
export class BLogsController {
    constructor(@inject(BlogsQueryRepository) private blogsQueryRepository: BlogsQueryRepository,
                @inject(BlogService) private blogsService: BlogService,
                @inject(PostService) private postsService: PostService,
                @inject(PostsQueryRepository) private postsQueryRepository: PostsQueryRepository,
                @inject(ReactionsPostQueryRepository) private reactionsPostQueryRepository: ReactionsPostQueryRepository,
    ) {
    }

    async getAllBlogs(req: ReqWithQuery<InputBlogsQueryType>, res: Response,) {
        const query = blogQueries(req)
        const response = await this.blogsQueryRepository.getBlogs(query)
        res.status(200).json(response).end()
        return
    }

    async getBlogById(req: ReqWithParams<{ id: string }>, res: Response,) {
        const blog = await this.blogsQueryRepository.findBlog(req.params.id)
        blog ? res.status(200).json(blog).end() : res.status(404).end()
        return
    }

    async createBlog(req: ReqWithBody<InputBlogBody>, res: Response,) {
        const result = await this.blogsService.createBlog(req.body)
        const newBlog = await this.blogsQueryRepository.findBlog(result.insertedId.toString())
        res.status(201).json(newBlog).end()
        return
    }

    async updateBlog(req: ReqWithParAndBody<{ id: string }, InputBlogBody>, res: Response,) {
        const isUpdated = await this.blogsService.updateBlog(req.body, req.params.id)
        isUpdated ? res.status(204).end() : res.status(404).end();
        return
    }


    async deleteBlog(req: Request<{ id: string }>, res: Response,) {
        const isDeleted = await this.blogsService.deleteBlog(req.params.id)
        isDeleted ? res.status(HttpStatuses.NoContent).end() : res.status(404).end()
        return
    }

    async getPostsByBlogId(req: ReqWithParAndBody<{ blogId: string }, InputPostsQueryType>, res: Response,) {
        const query = postQueries(req)
        const blog = await this.blogsQueryRepository.findBlog(req.params.blogId)
        if (!blog) {
            res.status(HttpStatuses.NotFound).end()
            return
        }

        const posts = await this.postsQueryRepository.getPosts(query, req.params.blogId)
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

    async createPostByBlogId(req: ReqWithParAndBody<{ blogId: string }, InputPostByBlogBody>, res: Response,) {
        const dto = {...req.body, blogId: req.params.blogId}
        const newPost = await this.postsService.createPostByBlogId(dto)
        newPost ? res.status(HttpStatuses.Created).json(newPost).end() : res.status(HttpStatuses.NoContent).end()
        return
    }
}


