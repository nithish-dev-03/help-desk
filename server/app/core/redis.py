import redis.asyncio as redis
from redis.asyncio import Redis

from app.core.config import REDIS_URL

redis_client: Redis | None = None


async def initialize_redis():
    global redis_client

    redis_client = redis.from_url(REDIS_URL, encoding="utf-8", decode_responses=True)

    await redis_client.ping()


async def close_redis():
    global redis_client

    if redis_client is not None:
        await redis_client.aclose()
        redis_client = None


def get_redis() -> Redis:
    if redis_client is None:
        raise RuntimeError("Redis has not been initialized")

    return redis_client