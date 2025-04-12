import {Request} from "express";

export type ReqWithParams<P> = Request<P>
export type ReqWithBody<B> = Request<{}, {}, B>
export type ReqWithQuery<Q> = Request<{}, {}, {}, Q>

export type ReqWithParAndBody<P, B> = Request<P, {}, B>