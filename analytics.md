# RSSLookup Analytics Schema

This document references the schema for the detailed analytics tracking implemented via Cloudflare Analytics Engine.

## Dataset
- **Name**: `rsslookup_analytics`
- **Bindings**: `ANALYTICS` (in `wrangler.toml`)

## Schema Definition (TypeScript)

The application writes generic `blobs` and `doubles` to the engine. Below is the mapping of these fields to the logical schema.

```typescript
// From src/lib/analytics.ts
env.ANALYTICS.writeDataPoint({
    blobs: [
        eventName,   // blob1
        status,      // blob2
        method,      // blob3
        errorType,   // blob4
        source,      // blob5
    ],
    doubles: [
        feedCount,          // double1
        durationMs,         // double2
        upstreamStatus,     // double3
        externalRequestCount// double4
    ],
    indexes: [
        eventName // index1
    ]
});
```

## SQL View Setup

To query this data easily in Grafana or the Cloudflare Dashboard, you should treat the raw backing table as having the following columns.

**Recommended SQL:**

```sql
SELECT
    timestamp,
    blob1 as event_name,
    blob2 as status,
    blob3 as method,
    blob4 as error_type,
    blob5 as source,
    double1 as feed_count,
    double2 as duration_ms,
    double3 as upstream_status,
    double4 as external_request_count
FROM rsslookup_analytics
WHERE timestamp > NOW() - INTERVAL '1' DAY
ORDER BY timestamp DESC
```

## Field Descriptions

| Field | Column | Type | Description |
| :--- | :--- | :--- | :--- |
| **Event Name** | `blob1` | string | The type of event: `lookup`, `rate_limit`, `redirect`. |
| **Status** | `blob2` | string | Outcome of the operation: `success`, `no_feeds`, `error`, `blocked`. |
| **Method** | `blob3` | string | How feeds were found: `rule` (hardcoded), `scrape` (HTML), `guess` (common paths). |
| **Error Type** | `blob4` | string | Specific error details, e.g., `ip_limit_exceeded`, `http_404`, `fetch_error`. |
| **Source** | `blob5` | string | Origin of the request: `web` (UI), `bookmarklet` (URL param), `shortcut` (/https://...). |
| **Feed Count** | `double1` | number | Number of feeds returned to the user. |
| **Duration** | `double2` | number | Latency of the upstream fetch in milliseconds. |
| **Upstream Status** | `double3` | number | HTTP status code returned by the target URL (e.g., 200, 404, 500). |
| **Ext. Request Count** | `double4` | number | Total number of external HTTP requests made during processing. |
