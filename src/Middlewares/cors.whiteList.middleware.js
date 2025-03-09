export const corsWhiteList = (req, res, next) => {
    const whiteList = ["http://localhost:3000", "http://localhost:3001"];

    const requestOrigin = req.header("origin");

    if (requestOrigin && !whiteList.includes(requestOrigin)) {
        return next(new Error("Origin not allowed"));
    }

    res.header("Access-Control-Allow-Origin", requestOrigin || "*");
    res.header("Access-Control-Allow-Methods", "*");
    res.header("Access-Control-Allow-Headers", "*");

    return next();
};