import type {
    Request,
    Response,
    NextFunction,
    ErrorRequestHandler,
} from "express";
import {
    fromZodError,
    IKitZodTransformerOptions,
} from "@wthek/zod-transformer";

export type { IKitZodTransformerOptions };

/**
 * Express.js middleware that intercepts all errors and transforms any
 * Zod validation errors into structured `http-error-kit` errors.
 * If the error is not a ZodError, it is passed down the middleware chain unchanged.
 *
 * @param {IKitZodTransformerOptions} [options] Optional configuration for the transformed error.
 * @returns {ErrorRequestHandler} An Express error-handling middleware function.
 *
 * @example
 * ```typescript
 * import express from "express";
 * import { KitZodExpressInterceptor } from "@wthek/zod-express-interceptor";
 * import { KitExpressMiddleware } from "@wthek/express-middleware";
 *
 * const app = express();
 *
 * // Intercept Zod errors first, converting them to KitHttpErrors
 * app.use(KitZodExpressInterceptor());
 *
 * // Then format and send all KitHttpErrors
 * app.use(KitExpressMiddleware());
 * ```
 */
export function KitZodExpressInterceptor(
    options?: IKitZodTransformerOptions
): ErrorRequestHandler {
    return (
        error: unknown,
        _req: Request,
        _res: Response,
        next: NextFunction
    ) => {
        try {
            const transformed = fromZodError(error, options);
            next(transformed ?? error);
        } catch (err) {
            next(err);
        }
    };
}
