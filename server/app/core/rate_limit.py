from fastapi import Depends, HTTPException, Request, status
from redis.asyncio import Redis
from redis.exceptions import RedisError

from app.core.config import RATE_LIMIT_FAIL_OPEN
from app.core.redis import get_redis


def rate_limit(name: str, max_requests: int, window_seconds: int):
    async def limiter(request: Request, redis: Redis = Depends(get_redis)):
        ip_address = request.client.host if request.client else "unknown"

        key = f"rate-limit:{name}:{ip_address}"

        try:
            request_count = await redis.incr(key)

            if request_count == 1:
                await redis.expire(key, window_seconds)
        except RedisError:
            if RATE_LIMIT_FAIL_OPEN:
                return

            raise HTTPException(
                status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                detail="Rate limiting service is unavailable",
            )

        if request_count > max_requests:
            raise HTTPException(
                status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                detail="Too many requests. Please try again later.",
            )

    return limiter
