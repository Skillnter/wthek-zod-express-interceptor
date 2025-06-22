import { KitHttpError } from "http-error-kit";
import { KitZodExpressInterceptor } from "../src";
import { ZodError } from "zod";
import type { Request, Response } from "express";

describe("KitZodExpressInterceptor", () => {
    let next = jest.fn();
    beforeEach(() => {
        next.mockReset();
    });
    it("should return Kit error when provided error is ZodError", async () => {
        const error = new ZodError([
            {
                code: "invalid_type",
                expected: "string",
                received: "number",
                path: ["b"],
                message: "Expected string, received number",
            },
        ]);
        await KitZodExpressInterceptor()(
            error,
            null as unknown as Request,
            null as unknown as Response,
            next
        );
        expect(next.mock.calls[0][0]).toBeInstanceOf(KitHttpError);
        expect(next.mock.calls[0][0]).not.toBeInstanceOf(ZodError);
    });

    it("should return same error when provided error is not ZodError", async () => {
        const error = new Error("Test error");
        await KitZodExpressInterceptor()(
            error,
            null as unknown as Request,
            null as unknown as Response,
            next
        );
        expect(next.mock.calls[0][0]).toBeInstanceOf(Error);
        expect(next.mock.calls[0][0]).not.toBeInstanceOf(ZodError);
        expect(next.mock.calls[0][0]).not.toBeInstanceOf(KitHttpError);
    });
});
