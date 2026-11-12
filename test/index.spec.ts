import { KitHttpError } from "http-error-kit";
import { KitZodExpressInterceptor } from "../src";
import { z, ZodError } from "zod";
import type { Request, Response } from "express";
import { UNPROCESSABLE_ENTITY } from "http-response-status-code";
import * as zodTransformerPkg from "@wthek/zod-transformer";

describe("KitZodExpressInterceptor", () => {
    let next: jest.Mock;
    const sampleZodError = z
        .object({ username: z.string() })
        .safeParse({ username: 123 }).error!;

    beforeEach(() => {
        next = jest.fn();
    });

    it("should transform ZodError into KitHttpError and pass to next", () => {
        const interceptor = KitZodExpressInterceptor();
        interceptor(
            sampleZodError,
            null as unknown as Request,
            null as unknown as Response,
            next
        );
        expect(next).toHaveBeenCalledTimes(1);
        const passedError = next.mock.calls[0][0];
        expect(passedError).toBeInstanceOf(KitHttpError);
        expect(passedError).not.toBeInstanceOf(ZodError);
        expect(passedError.message).toBe("Zod Validation Failed");
        expect(passedError.getInputs()?.statusCode).toBe(400);
    });

    it("should pass options to transformer when options are provided", () => {
        const interceptor = KitZodExpressInterceptor({
            message: "Custom validation failure",
            statusCode: UNPROCESSABLE_ENTITY,
        });
        interceptor(
            sampleZodError,
            null as unknown as Request,
            null as unknown as Response,
            next
        );
        expect(next).toHaveBeenCalledTimes(1);
        const passedError = next.mock.calls[0][0];
        expect(passedError).toBeInstanceOf(KitHttpError);
        expect(passedError.message).toBe("Custom validation failure");
        expect(passedError.getInputs()?.statusCode).toBe(422);
    });

    it("should pass non-ZodError unchanged to next", () => {
        const regularError = new Error("Standard database error");
        const interceptor = KitZodExpressInterceptor();
        interceptor(
            regularError,
            null as unknown as Request,
            null as unknown as Response,
            next
        );
        expect(next).toHaveBeenCalledTimes(1);
        expect(next.mock.calls[0][0]).toBe(regularError);
    });

    it("should handle unexpected exception in catch block gracefully", () => {
        const spy = jest
            .spyOn(zodTransformerPkg, "fromZodError")
            .mockImplementation(() => {
                throw new Error("Unexpected transformer crash");
            });

        const interceptor = KitZodExpressInterceptor();
        interceptor(
            sampleZodError,
            null as unknown as Request,
            null as unknown as Response,
            next
        );

        expect(next).toHaveBeenCalledTimes(1);
        expect(next.mock.calls[0][0].message).toBe("Unexpected transformer crash");
        spy.mockRestore();
    });
});
