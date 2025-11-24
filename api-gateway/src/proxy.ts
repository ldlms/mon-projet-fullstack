import {type Express} from "express";
import {createProxyMiddleware} from "http-proxy-middleware";
import {ROUTES} from "./routes.ts";

export function setupProxies(app: Express) {
    ROUTES.forEach((route) => {
        app.use(route.url, createProxyMiddleware(route.proxy));
    })
}