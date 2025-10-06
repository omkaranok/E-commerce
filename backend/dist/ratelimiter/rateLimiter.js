"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RateLimiter = void 0;
const clock_1 = require("./clock");
const tokenBucket_1 = require("./tokenBucket");
class RateLimiter {
    constructor({ tokenPerInterval, interval, fireImmediately, }) {
        const tokenBucket = new tokenBucket_1.TokenBucket({
            bucketSize: tokenPerInterval,
            tokenPerInterval,
            interval: interval
        });
        this.tokenBucket = tokenBucket;
        this.curIntervalStart = (0, clock_1.getmillisecond)();
        this.tokenBucket.content = tokenPerInterval;
        this.tokenThisInterval = 0;
        this.fireImmmediately = fireImmediately ?? false;
    }
    async removeToken(count) {
        if (count > this.tokenBucket.bucketSize) {
            throw new Error(`Request number of token is more than the Bucketsize it can't be Proceeded`);
        }
        const now = (0, clock_1.getmillisecond)();
        const tokenBucketIntervalTime = typeof this.tokenBucket.interval === "number"
            ? this.tokenBucket.interval
            : tokenBucket_1.INTERVAL_MAP[this.tokenBucket.interval];
        if (!tokenBucketIntervalTime) {
            throw new Error("Invalid Interval");
        }
        if (now < this.curIntervalStart ||
            (now - this.curIntervalStart) >= (tokenBucketIntervalTime)) {
            // your logic here
            this.curIntervalStart = now;
            this.tokenThisInterval = 0;
        }
        ///let's say if we have implemeted or requested the number of tokens greatre than the present count 
        ///then we have to wait for few second so that we can have sufficient tokens
        if (count > this.tokenBucket.tokenPerInterval - this.tokenThisInterval) {
            if (this.fireImmmediately) {
                return -1;
            }
            else {
                //we have to wait till the next refill of tokens in bucket
                const waitMs = Math.ceil(this.curIntervalStart + tokenBucketIntervalTime - now);
                await (0, clock_1.wait)(waitMs);
                const remainingTokens = await this.tokenBucket.removeToken(count);
                this.tokenThisInterval += count;
                return remainingTokens;
            }
        }
        const remainingTokens = await this.tokenBucket.removeToken(count);
        this.tokenThisInterval += count;
        return remainingTokens;
    }
    async tryRemoveTokens(count) {
        if (count > this.tokenBucket.bucketSize)
            return false;
        const now = (0, clock_1.getmillisecond)();
        const tokenBucketIntervalTime = typeof this.tokenBucket.interval === "number"
            ? this.tokenBucket.interval
            : tokenBucket_1.INTERVAL_MAP[this.tokenBucket.interval];
        if (!tokenBucketIntervalTime) {
            throw new Error('Invalid Interval');
        }
        if (now < this.curIntervalStart || now - this.curIntervalStart >= tokenBucketIntervalTime) {
            this.curIntervalStart = now;
            this.tokenThisInterval = 0;
        }
        if (count > this.tokenBucket.tokenPerInterval - this.tokenThisInterval)
            return false;
        const removed = await this.tokenBucket.tryRemoveToken(count);
        if (removed) {
            this.tokenThisInterval += count;
        }
        return removed;
    }
    getTokensRemaining() {
        this.tokenBucket.drip();
        return this.tokenBucket.content;
    }
}
exports.RateLimiter = RateLimiter;
module.exports = RateLimiter;
