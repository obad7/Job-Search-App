import rateLimit from "express-rate-limit";

const limiter = rateLimit({
    windowMs: 5 * 60 * 1000,
    max: 10,

    handler: (req, res, next, options) => {
        return next(new Error(options.message, { cause: options.statusCode }));
    },
});

export default limiter;