import { getmillisecond, wait } from "./clock";
import { Interval, TokenBucket, INTERVAL_MAP } from "./tokenBucket";

// const { getmillisecond, wait } = require('./clock.ts');
// const { Interval, TokenBucket, INTERVAL_MAP } = require('./tokenBucket.ts');

export type RateLimiterOpt = {
    tokenPerInterval: number,
    interval: Interval,
    fireImmediately?: Boolean
}

export class RateLimiter {
    tokenBucket: TokenBucket;
    tokenThisInterval: number;
    curIntervalStart: number;
    fireImmmediately?: Boolean;

    constructor({ tokenPerInterval, interval, fireImmediately, }: RateLimiterOpt) {
        const tokenBucket = new TokenBucket({
            bucketSize: tokenPerInterval,
            tokenPerInterval,
            interval: interval
        })

        this.tokenBucket = tokenBucket;
        this.curIntervalStart = getmillisecond();
        this.tokenBucket.content = tokenPerInterval;
        this.tokenThisInterval = 0;
        this.fireImmmediately = fireImmediately ?? false;
    }

    async removeToken(count: number) {
        if (count > this.tokenBucket.bucketSize) {
            throw new Error(`Request number of token is more than the Bucketsize it can't be Proceeded`);
        }

        const now = getmillisecond();
        const tokenBucketIntervalTime = typeof this.tokenBucket.interval === "number"
            ? this.tokenBucket.interval
            : INTERVAL_MAP[this.tokenBucket.interval as string]

        if (!tokenBucketIntervalTime) {
            throw new Error("Invalid Interval")
        }

        if (
            now < this.curIntervalStart ||
            (now - this.curIntervalStart) >= (
                tokenBucketIntervalTime
            )
        ) {
            // your logic here
            this.curIntervalStart = now;
            this.tokenThisInterval = 0;
        }

        ///let's say if we have implemeted or requested the number of tokens greatre than the present count 
        ///then we have to wait for few second so that we can have sufficient tokens

        if (count > this.tokenBucket.tokenPerInterval - this.tokenThisInterval) {
            if (this.fireImmmediately) {
                return -1;
            } else {
                //we have to wait till the next refill of tokens in bucket
                const waitMs = Math.max(0, Math.ceil(this.curIntervalStart + tokenBucketIntervalTime - now));
                await wait(waitMs);
                const remainingTokens = await this.tokenBucket.removeToken(count);
                this.tokenThisInterval += count;
                return remainingTokens;
            }
        }

        const remainingTokens = await this.tokenBucket.removeToken(count);
        this.tokenThisInterval += count;
        return remainingTokens;
    }

    async tryRemoveTokens(count: number) {
        if (count > this.tokenBucket.bucketSize) return false;

        const now = getmillisecond();

        const tokenBucketIntervalTime = typeof this.tokenBucket.interval === "number"
            ? this.tokenBucket.interval
            : INTERVAL_MAP[this.tokenBucket.interval as string]

        if (!tokenBucketIntervalTime) {
            throw new Error('Invalid Interval');
        }

        if (now < this.curIntervalStart || now - this.curIntervalStart >= tokenBucketIntervalTime) {
            this.curIntervalStart = now;
            this.tokenThisInterval = 0;
        }

        if (count > this.tokenBucket.tokenPerInterval - this.tokenThisInterval) return false;

        const removed = await this.tokenBucket.tryRemoveToken(count);
        if (removed) {
            this.tokenThisInterval += count;
        }

        return removed;
    }

    getTokensRemaining(): number {
        this.tokenBucket.drip();
        return this.tokenBucket.content;
    }
}

module.exports = RateLimiter;