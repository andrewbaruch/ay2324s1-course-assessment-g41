// import NodeCache from "node-cache";

// const complexityMatchingRequestCache = new NodeCache();

// export default complexityMatchingRequestCache;

import Redis from "ioredis"

const complexityMatchingRequestCache = new Redis("rediss://default:e840999abd7046a39bf40c6aaf69faf9@quality-llama-43887.upstash.io:43887");

export default complexityMatchingRequestCache;

