import {Router} from "express";
import {postBodyValidation, postQueryValidation} from "../middleware/validations/posts.input.validation-middleware";
import {errorsMiddleware} from "../middleware/errorsMiddleware";
import {authBasicMiddleware} from "../middleware/auth.basic.middleware";
import {blogsController} from "../composition-root";
import {
    blogBodyValidation,
    blogIdParam,
    blogQueryValidation
} from "../middleware/validations/blogs.input.validation-middleware";

export const blogsRouter = Router()


blogsRouter.get('/', blogQueryValidation, errorsMiddleware, blogsController.getAllBlogs.bind(blogsController))
blogsRouter.get('/:id', blogsController.getBlogById.bind(blogsController))
blogsRouter.post('/', authBasicMiddleware, blogBodyValidation, errorsMiddleware, blogsController.createBlog.bind(blogsController))
blogsRouter.put('/:id', authBasicMiddleware, blogBodyValidation, errorsMiddleware, blogsController.updateBlog.bind(blogsController))
blogsRouter.delete('/:id', authBasicMiddleware, blogsController.deleteBlog.bind(blogsController))
blogsRouter.get('/:blogId/posts', blogIdParam, postQueryValidation, errorsMiddleware, blogsController.getPostsByBlogId.bind(blogsController))
blogsRouter.post('/:blogId/posts', blogIdParam, authBasicMiddleware, postBodyValidation, errorsMiddleware, blogsController.createPostByBlogId.bind(blogsController))

