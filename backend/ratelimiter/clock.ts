// const { performance } = require('perf_hooks');

function hrstime(previousTimeStamp?: [number, number]): [number, number] {
    const clocktime = performance.now() * 1e-3;
    let second = Math.floor(clocktime);
    let nanoSecond = Math.floor((clocktime % 1) * 1e9);

    if (previousTimeStamp) {
        second = second - previousTimeStamp[0];
        nanoSecond = nanoSecond - previousTimeStamp[1];

        if (nanoSecond < 0) {
            second--;
            nanoSecond += 1e9;
        }
    }

    return [second, nanoSecond];

}

// The current timestamp in whole milliseconds
export function getmillisecond(): number {
    const [second, nanoSecond] = hrstime();
    console.log("second", second, "nanSecond", nanoSecond);
    return second * 1e3 + (nanoSecond / 1e6);
}

// Wait for a specified number of milliseconds before fulfilling the returned promise.
export function wait(ms: number): Promise<void> {
    return new Promise((resolve) => (setTimeout(resolve, ms)));
}