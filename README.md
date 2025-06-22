# Official @wthek Extension – Zod Express Interceptor for `http-error-kit`

**Seamlessly intercept and transform Zod validation errors in Express using `http-error-kit` — no clutter, just clean error handling**

_Built for Express projects using [`http-error-kit`][http-error-kit], this interceptor captures Zod validation errors and converts them into structured HttpError.BadRequest responses._

> 💡 What the HEK?! Still manually catching Zod errors in every route? Let `@wthek/zod-express-interceptor` intercept them globally and standardize your error flow.

![GitHub Workflow Status](https://img.shields.io/github/actions/workflow/status/skillnter/wthek-zod-express-interceptor/main.yml)
[![npm version](https://img.shields.io/npm/v/%40wthek%2Fzod-express-interceptor?color=brightgreen)](https://www.npmjs.com/package/@wthek/zod-express-interceptor)
[![GitHub license](https://img.shields.io/github/license/skillnter/wthek-zod-express-interceptor?color=brightgreen)](LICENSE)
[![GitHub Issues](https://img.shields.io/github/issues/Skillnter/wthek-zod-express-interceptor)](https://github.com/Skillnter/wthek-zod-express-interceptor/issues)
[![Codacy Badge](https://app.codacy.com/project/badge/Coverage/81ed9450fcc0416aa32973457a220193)](https://app.codacy.com/gh/Skillnter/wthek-zod-express-interceptor/dashboard?utm_source=gh&utm_medium=referral&utm_content=&utm_campaign=Badge_coverage)
[![Codacy Badge](https://app.codacy.com/project/badge/Grade/81ed9450fcc0416aa32973457a220193)](https://app.codacy.com/gh/Skillnter/wthek-zod-express-interceptor/dashboard?utm_source=gh&utm_medium=referral&utm_content=&utm_campaign=Badge_grade)
![npms.io (final)](https://img.shields.io/npms-io/maintenance-score/%40wthek/zod-express-interceptor?color=brightgreen)
![npm](https://img.shields.io/npm/dy/%40wthek%2Fzod-express-interceptor)
![npm bundle size (version)](https://img.shields.io/bundlephobia/minzip/%40wthek%2Fzod-express-interceptor/1.0.0-beta.1)
![NPM Type Definitions](https://img.shields.io/npm/types/%40wthek%2Fzod-express-interceptor)
[![Socket Badge](https://socket.dev/api/badge/npm/package/@wthek/zod-express-interceptor/1.0.0-beta.1)](https://socket.dev/npm/package/@wthek/zod-express-interceptor/overview/1.0.0-beta.1)
[![GitHub Pages](https://img.shields.io/badge/GitHub%20Pages-121013?logo=github&logoColor=white)](https://skillnter.github.io/wthek-zod-express-interceptor/)
[![Github Sponsors](https://img.shields.io/badge/GitHub%20Sponsors-30363D?&logo=GitHub-Sponsors&logoColor=EA4AAA)](https://github.com/sponsors/Skillnter)
[![Open Collective](https://img.shields.io/badge/Open%20Collective-3385FF?logo=open-collective&logoColor=white)](https://opencollective.com/skillnter)
[![Buy Me A Coffee](https://img.shields.io/badge/Buy%20Me%20a%20Coffee-ffdd00?&logo=buy-me-a-coffee&logoColor=black)](https://www.buymeacoffee.com/skillnter)
[![Patreon](https://img.shields.io/badge/Patreon-F96854?logo=patreon&logoColor=white)](https://www.patreon.com/skillnter)
[![PayPal](https://img.shields.io/badge/PayPal-003087?logo=paypal&logoColor=fff)](https://www.paypal.me/skillnte)

## Features

-   **Express-native** – Built specifically for Express request/response lifecycle
-   **Automatic ZodError Handling** – Captures **Zod** errors and transforms them into `HttpError.BadRequest`
-   **Built on WTHek stack** – Fully compatible with `@wthek/express-middleware`
-   **Keeps raw Zod issues** – Sends all validation issue data in structured `details`
-   **Plug-and-play logic** – Minimal setup, no need to wrap schema validation manually
-   **Composable** – Can be used alongside `@wthek/*-middleware` extension

## Table of Content

-   [Installation](#installation)
-   [Usage](#usage)
-   [Explore More WTHek Extensions](#explore-more-wthek-extensions)
-   [People](#people)
-   [Donations](#donations)
-   [License](#license)

## Installation

```console
npm install @wthek/zod-express-interceptor
```

## Usage

**Add Middleware Just Before defining Routes**

Use `KitZodExpressInterceptor` **after your route definitions**, but **before** the final error-handling middleware like [`@wthek/express-middleware`][@wthek/express-middleware].

This ensures Zod validation errors are transformed into `http-error-kit` errors early, allowing WTHek or any other middlewares to handle them cleanly.

> _If the interceptor is placed before your routes, it won't catch the Zod errors since those are thrown inside route execution — **after middleware execution phase**._

```Typescript
import express from 'express';
import { z } from 'zod';
import { KitZodExpressInterceptor } from '@wthek/zod-express-interceptor';
import { KitExpressMiddleware } from '@wthek/express-middleware';

const app = express();

app.use(express.json());



app.post('/user', (req, res) => {
    const schema = z.object({
        name: z.string(),
        age: z.number().min(18),
    });

    const parsed = schema.parse(req.body); // Will throw if invalid
    res.send({ status: 'ok', parsed });
});

// ✅ Place interceptor BEFORE your routes
app.use(KitZodExpressInterceptor());

// ✅ Global error handler (after routes)
app.use(KitExpressMiddleware());

app.listen(3000);
```

### Optional: Custom Formatting with `KitHttpErrorConfig`

To define how your error responses look in production:

```Typescript
import { KitHttpErrorConfig } from "http-error-kit";

KitHttpErrorConfig.configureFormatter(
    (statusCode, message, details, ...args) => ({
        code: statusCode,
        msg: message,
        extra: details,
        traceId: args[0] || "0fcb44cb-4f09-4900-8c4f-73ddd37ffe0a",
    })
);


// Response
{
    "code": 400,
    "msg": "Zod validation failed",
    "extra": {
        "issues": [
            {
                "code": "too_small",
                "minimum": 18,
                "type": "number",
                "inclusive": true,
                "exact": false,
                "message": "Number must be greater than or equal to 18",
                "path": ["age"]
            }
        ]
    },
    "traceId": "0fcb44cb-4f09-4900-8c4f-73ddd37ffe0a"
}

```

## Explore More WTHek Extensions

The WTHek ecosystem continues to grow with new extensions to simplify error handling across various frameworks and libraries. Stay updated with the latest tools that integrate seamlessly with `http-error-kit`.

**Check out the official list of extensions**: [Official Extensions List](https://github.com/Skillnter/http-error-kit/wiki/Official-Extensions-List)

## People

The original author of the project is [Himanshu Bansal][skillnter]

## Donations

**This is all voluntary work**, so if you want to support my efforts you can

-   [Buy Me A Coffee](https://www.buymeacoffee.com/skillnter)
-   [Paypal](https://www.paypal.me/skillnte)
-   [GitHub Sponsor](https://github.com/sponsors/Skillnter)
-   [Patreon](https://www.patreon.com/skillnter)
-   [Open Collective](https://opencollective.com/skillnter)

You can also use the following:

![BNB: 0x1D59a291391a3CE17C63D5dC50F258Dc0Ab62889](https://img.shields.io/badge/BNB-0x1D59a291391a3CE17C63D5dC50F258Dc0Ab62889-brightgreen)

![BTC: bc1p22h4nsad5d8ketyhuvf0vyva6unttxwzzqvkty5r839as0mlclgs72d3mf](https://img.shields.io/badge/BTC-bc1p22h4nsad5d8ketyhuvf0vyva6unttxwzzqvkty5r839as0mlclgs72d3mf-brightgreen)

![ETH: 0x1D59a291391a3CE17C63D5dC50F258Dc0Ab62889](https://img.shields.io/badge/ETH-0x1D59a291391a3CE17C63D5dC50F258Dc0Ab62889-brightgreen)

## License

`@wthek/zod-express-interceptor` project is open-sourced software licensed under the [MIT license](LICENSE) by [Himanshu Bansal][skillnter].

[skillnter]: https://github.com/Skillnter/
[http-error-kit]: https://www.npmjs.com/package/http-error-kit
[@wthek/express-middleware]: https://www.npmjs.com/package/@wthek/express-middleware
