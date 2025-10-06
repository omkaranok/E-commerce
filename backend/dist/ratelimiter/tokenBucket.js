"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TokenBucket = exports.INTERVAL_MAP = void 0;
const { getmillisecond, wait } = require('./clock.ts');
exports.INTERVAL_MAP = {
    "sec": 1000,
    "second": 1000,
    "minute": 60 * 1000,
    "hour": 60 * 60 * 1000,
    "min": 60 * 1000,
    "hr": 60 * 60 * 1000,
    "day": 24 * 60 * 60 * 1000,
};
class TokenBucket {
    ///here we are making intervaql into millisecond //////
    constructor({ bucketSize, tokenPerInterval, interval, parentBucket }) {
        if (typeof interval === "string") {
            switch (interval) {
                case "second":
                case "sec":
                    this.interval = 1000;
                    break;
                case "minute":
                case "min":
                    this.interval = 60 * 1000;
                    break;
                case "hour":
                case "hr":
                    this.interval = 60 * 60 * 1000;
                    break;
                case "day":
                    this.interval = 24 * 60 * 60 * 1000;
                    break;
                default:
                    throw new Error(`Invalid interval `);
            }
        }
        else {
            this.interval = interval;
        }
        this.lastDrip = getmillisecond();
        this.content = 0;
        this.tokenPerInterval = tokenPerInterval;
        this.bucketSize = bucketSize;
        this.parentBucket = parentBucket;
    }
    async removeToken(count) {
        if (!this.bucketSize) {
            return Number.POSITIVE_INFINITY;
        }
        if (count > this.bucketSize) {
            throw new Error('Count is greater than bucket size for rate limiting algorithm');
        }
        ////drip new Token here if not enough token then it we will wait and call recursively to fill our bucket;;;;
        this.drip();
        const intervalValue = typeof this.interval === "number"
            ? this.interval
            : exports.INTERVAL_MAP[this.interval];
        if (intervalValue === undefined) {
            throw new Error(`Invalid interval: ${this.interval}`);
        }
        const comeBackLater = async () => {
            const ms = Math.ceil(count - this.content) * ((intervalValue) / this.tokenPerInterval);
            await wait(ms);
            return this.removeToken(count);
        };
        if (count > this.content)
            return comeBackLater();
        if (this.parentBucket != undefined) {
            const remainingTokens = await this.parentBucket.removeToken(count);
            // Check that we still have enough tokens in this bucket
            if (count > this.content)
                return comeBackLater();
            // Tokens were removed from the parent bucket, now remove them from
            // this bucket. Note that we look at the current bucket and parent
            // bucket's remaining tokens and return the smaller of the two values
            this.content -= count;
            return Math.min(remainingTokens, this.content);
        }
        else {
            this.content -= count;
            return this.content;
        }
    }
    async tryRemoveToken(count) {
        if (!this.bucketSize) {
            return true; ////here bucketsize is zero which means that we can proceed with infinte tokens
        }
        if (count > this.bucketSize)
            return false; //if the requested number of token is greater than required 
        ///Drip new Token here
        this.drip();
        if (count > this.content)
            return false;
        if (this.parentBucket && !this.parentBucket.tryRemoveToken(count))
            return false;
        // Remove the requested tokens from this bucket and return
        this.content -= count;
        return true;
    }
    drip() {
        if (this.tokenPerInterval === 0) {
            const prevContent = this.content;
            this.content = this.bucketSize;
            return this.content > prevContent;
        }
        const intervalValue = typeof this.interval === "number"
            ? this.interval
            : exports.INTERVAL_MAP[this.interval];
        if (intervalValue === undefined) {
            throw new Error(`Invalid interval: ${this.interval}`);
        }
        const now = getmillisecond();
        const deltaMS = Math.max(now - this.lastDrip, 0);
        this.lastDrip = now;
        const dripAmount = deltaMS * (this.tokenPerInterval / intervalValue);
        const prevContent = this.content;
        this.content = Math.min(this.content + dripAmount, this.bucketSize);
        return Math.floor(this.content) > Math.floor(prevContent);
    }
}
exports.TokenBucket = TokenBucket;
