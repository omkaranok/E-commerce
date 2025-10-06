const RateLimiter = require('../ratelimiter/rateLimiter.ts');

const apiRater = new RateLimiter({
    tokenPerInterval: 5,
    interval: "second",
    fireImmediately: false, // wait if tokens are not enough true for throwing error else false for waiting the request to get procedded
})

async function rateLimiterMiddleware(req, res, next) {
    try {
        const tokensRemaining = await apiRater.removeToken(1); // 1 token per request
        console.log("tokensRemaining", tokensRemaining);
        if (tokensRemaining === -1) {
            return res.status(429).json({ message: "Too many requests. Please try again later." });
        }
        next(); // allow the request and pass it to next middleware
    } catch (err) {
        return res.status(500).json({ message: "Rate limiter error", error: err.message });
    }
}

module.exports = rateLimiterMiddleware;