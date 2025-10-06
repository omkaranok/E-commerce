const { getmillisecond, wait } = require('./clock.ts');

export type Interval = number | "second" | "sec" | "hour" | "hr" | "minute" | "min" | "others" | "day"

export type TokenBucketOpts = {
    bucketSize: number,
    interval: Interval,
    tokenPerInterval: number,
    parentBucket?: TokenBucket
}

export const INTERVAL_MAP: Record<string, number> = {
    "sec": 1000,
    "second": 1000,
    "minute": 60 * 1000,
    "hour": 60 * 60 * 1000,
    "min": 60 * 1000,
    "hr": 60 * 60 * 1000,
    "day": 24 * 60 * 60 * 1000,
}

export class TokenBucket {
    bucketSize: number;
    interval: Interval;
    tokenPerInterval: number;
    parentBucket?: TokenBucket;
    content: number;
    lastDrip: number;
    ///here we are making intervaql into millisecond //////
    constructor({ bucketSize, tokenPerInterval, interval, parentBucket }: TokenBucketOpts) {
        if (typeof interval === "string") {
            switch (interval) {
                case "second":
                case "sec":
                    this.interval = 1000;
                    break;

                case "minute":
                case "min":
                    this.interval = 60 * 1000
                    break;

                case "hour":
                case "hr":
                    this.interval = 60 * 60 * 1000
                    break;

                case "day":
                    this.interval = 24 * 60 * 60 * 1000
                    break;
                default:
                    throw new Error(`Invalid interval `);
            }
        } else {
            this.interval = interval;
        }

        this.lastDrip = getmillisecond();
        this.content = 0;
        this.tokenPerInterval = tokenPerInterval;
        this.bucketSize = bucketSize;
        this.parentBucket = parentBucket;
    }

    async removeToken(count: number): Promise<number> {
        if (!this.bucketSize) {
            return Number.POSITIVE_INFINITY
        }

        if (count > this.bucketSize) {
            throw new Error('Count is greater than bucket size for rate limiting algorithm');
        }
        ////drip new Token here if not enough token then it we will wait and call recursively to fill our bucket;;;;
        this.drip();

        const intervalValue =
            typeof this.interval === "number"
                ? this.interval
                : INTERVAL_MAP[this.interval as string];

        if (intervalValue === undefined) {
            throw new Error(`Invalid interval: ${this.interval}`);
        }

        const comeBackLater = async () => {
            const ms = Math.max(0, Math.ceil(count - this.content) * ((intervalValue) / this.tokenPerInterval));
            await wait(ms);
            return this.removeToken(count);
        }

        if (count > this.content) return comeBackLater();

        if (this.parentBucket != undefined) {
            const remainingTokens = await this.parentBucket.removeToken(count);

            // Check that we still have enough tokens in this bucket
            if (count > this.content) return comeBackLater();

            // Tokens were removed from the parent bucket, now remove them from
            // this bucket. Note that we look at the current bucket and parent
            // bucket's remaining tokens and return the smaller of the two values
            this.content -= count;

            return Math.min(remainingTokens, this.content);

        } else {
            this.content -= count;
            return this.content;
        }


    }

    async tryRemoveToken(count: number) {
        if (!this.bucketSize) {
            return true;       ////here bucketsize is zero which means that we can proceed with infinte tokens
        }

        if (count > this.bucketSize) return false; //if the requested number of token is greater than required 

        ///Drip new Token here
        this.drip();

        if (count > this.content) return false;

        if (this.parentBucket && !this.parentBucket.tryRemoveToken(count)) return false;

        // Remove the requested tokens from this bucket and return
        this.content -= count;
        return true;

    }


    drip(): Boolean {
        if (this.tokenPerInterval === 0) {
            const prevContent = this.content;
            this.content = this.bucketSize;
            return this.content > prevContent;
        }

        const intervalValue =
            typeof this.interval === "number"
                ? this.interval
                : INTERVAL_MAP[this.interval as string];

        if (intervalValue === undefined) {
            throw new Error(`Invalid interval: ${this.interval}`);
        }

        // const now = getmillisecond();
        // const deltaMS = Math.max(now - this.lastDrip, 0);
        // if (deltaMS <= 0) return false;
        // this.lastDrip = now;
        // const dripAmount = deltaMS * (this.tokenPerInterval / intervalValue);
        // if (dripAmount <= 0) return false;

        // const prevContent = this.content;
        // this.content = Math.min(this.content + dripAmount, this.bucketSize);
        // return Math.floor(this.content) > Math.floor(prevContent);

        const now = getmillisecond();
        const deltaMS = now - this.lastDrip;
        if (deltaMS <= 0) return false; // No real time passed

        const dripAmount = deltaMS * (this.tokenPerInterval / intervalValue);
        if (dripAmount <= 0) return false;

        const prevContent = this.content;
        this.content = Math.min(this.content + dripAmount, this.bucketSize);

        // Only update lastDrip when we actually added something
        if (this.content > prevContent) {
            this.lastDrip = now;
        }

        this.content = Math.min(this.bucketSize, Math.max(0, this.content)); // Clamp
        return Math.floor(this.content) > Math.floor(prevContent);
    }
}