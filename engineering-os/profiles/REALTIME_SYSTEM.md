# REALTIME_SYSTEM.md — Service Profile

Version: 1.0
Applies when: building chat, collaboration, live tracking/location, presence, streaming updates, or realtime dashboards.

## State model
Define authoritative state, ephemeral state, event ordering requirements, conflict policy, and what happens when clients reconnect after missing events.

## Transport
Choose WebSocket, SSE, managed realtime, or polling based on directionality, frequency, scale, client support, and operational cost. Do not add realtime infrastructure to data that can tolerate normal refresh.

## Events
Events need stable names/schemas, ownership, authorization, versioning expectations, and idempotency/deduplication where replay is possible.

## Presence/location
Treat presence and live location as time-bounded signals. Define update rate, staleness threshold, retention, privacy permissions, and battery/network tradeoffs.

## Reliability
Handle disconnects, reconnect/backoff, duplicate/out-of-order events, server restarts, and degraded provider availability. Define maximum tolerated staleness.

## Security
Authorize subscriptions/channels and every server-side mutation. Never rely on obscure channel names for privacy. Rate-limit abusive publish/subscribe behavior.

## Observability
Track connection count, disconnect/reconnect rate, event lag, fan-out failures, dropped events, stale clients, and provider limits.
