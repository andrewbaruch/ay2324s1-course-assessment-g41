// import NodeCache from "node-cache";

// const complexityMatchingPairCache = new NodeCache();

// export default complexityMatchingPairCache;

import Redis from "ioredis";
import JSONCache from "redis-json";

const redis = new Redis(
  "rediss://default:9ed22128c2b945b78ff7fd840679a80a@sought-meerkat-43858.upstash.io:43858"
);

const complexityMatchingPairCache = new JSONCache(redis);

export default complexityMatchingPairCache;

