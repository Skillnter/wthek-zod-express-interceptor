import type { Request, Response, NextFunction } from "express";
import { KitZodTransformer } from "@wthek/zod-transformer";

/**
 * Express.js middleware that intercepts all errors and attempts to transform any
 * Zod validation errors into structured `http-error-kit` errors using the
 * KitZodTransformer. If the error is not a ZodError, it is left unchanged.
 *
 * @returns {import("express").Handler}
 * @example
 *
 * import express from "express";
 * import { KitZodExpressInterceptor } from "@wthek/zod-transformer";
 *
 * const app = express();
 * app.use(KitZodExpressInterceptor());
 */
export function KitZodExpressInterceptor() {
    return (
        error: unknown,
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        try {
            next(KitZodTransformer(error));
        } catch (err) {
            next(err);
        }
    };
}
