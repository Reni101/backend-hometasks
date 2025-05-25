import 'reflect-metadata';
import {Container} from 'inversify';
import {BlogsRepository} from "./repositories/blogs/blogs.repository";
import {BlogService} from "./services/blogs.service";
import {BlogsQueryRepository} from "./repositories/blogs/blogs.query.repository";
import {BLogsController} from "./controllers/blogs.controller";
import {PostsQueryRepository} from "./repositories/posts/posts.query.repository";
import {PostsRepository} from "./repositories/posts/posts.repository";
import {PostService} from "./services/posts.service";
import {PostsController} from "./controllers/posts.controller";
import {CommentQueryRepository} from "./repositories/comments/comments.query.repository";
import {CommentRepository} from "./repositories/comments/comments.repository";
import {CommentsService} from "./services/comments.service";
import {CommentsController} from "./controllers/comments.controller";


export const container = new Container()

container.bind(BLogsController).to(BLogsController);
container.bind(BlogService).to(BlogService);
container.bind(BlogsRepository).to(BlogsRepository);
container.bind(BlogsQueryRepository).to(BlogsQueryRepository);

container.bind(PostsController).to(PostsController);
container.bind(PostService).to(PostService);
container.bind(PostsRepository).to(PostsRepository);
container.bind(PostsQueryRepository).to(PostsQueryRepository);


container.bind(CommentsController).to(CommentsController);
container.bind(CommentsService).to(CommentsService);
container.bind(CommentQueryRepository).to(CommentQueryRepository);
container.bind(CommentRepository).to(CommentRepository);



export const postsController = container.get(PostsController);
export const blogsController = container.get(BLogsController)
export const commentsController = container.get(CommentsController)