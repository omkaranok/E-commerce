"use strict";
// const { performance } = require('perf_hooks');
Object.defineProperty(exports, "__esModule", { value: true });
exports.getmillisecond = getmillisecond;
exports.wait = wait;
function hrstime(previousTimeStamp) {
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
function getmillisecond() {
    const [second, nanoSecond] = hrstime();
    console.log("second", second, "nanSecond", nanoSecond);
    return second * 1e3 + (nanoSecond / 1e6);
}
// Wait for a specified number of milliseconds before fulfilling the returned promise.
function wait(ms) {
    return new Promise((resolve) => (setTimeout(resolve, ms)));
}
