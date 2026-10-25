# API_CONTRACTS.md — API Design and Compatibility Standard

Version: 2.0

## 1. Principles
APIs are long-lived contracts. They should be predictable, validated, observable, and compatible by default.

## 2. Naming
Prefer resource-oriented nouns:
- `GET /products`
- `GET /products/:id`
- `POST /orders`
- `PATCH /users/:id`

Use explicit action endpoints only for true commands, e.g. `POST /orders/:id/cancel`.

## 3. Methods
- GET: read
- POST: create/command
- PUT: replace
- PATCH: partial update
- DELETE: delete

## 4. Response envelope
Recommended success:
```json
{ "data": {}, "meta": {} }
```

Recommended error:
```json
{
  "error": {
    "code": "RESOURCE_NOT_FOUND",
    "message": "The requested resource could not be found.",
    "details": {}
  }
}
```

## 5. Status semantics
Use standard HTTP semantics consistently: 200, 201, 204, 400, 401, 403, 404, 409, 422, 429, 500, 503.

## 6. Validation
Validate path, query, headers, and body. Reject unknown/unsafe fields where appropriate.

## 7. Authentication and authorization
Document per endpoint:
- auth requirement
- role/permission
- resource ownership rule
- tenant scope

## 8. Pagination
Prefer cursor pagination for large/changing data sets. Define stable sorting and cursor semantics.

## 9. Filtering/sorting
Document allowed filters and sort fields. Never expose arbitrary database column/order execution.

## 10. Idempotency
Require idempotency keys for operations where duplicate execution is harmful: payments, refunds, order creation, provisioning, expensive external jobs.

## 11. Versioning
Version public/long-lived APIs when compatibility matters. Avoid versioning internal APIs unnecessarily if coordinated deployment is guaranteed.

## 12. Breaking changes
Breaking changes include field removal, type changes, semantic changes, auth changes, endpoint removal, and changed nullability expectations.

## 13. Webhooks
Webhook handlers must verify signature, validate schema, detect replay/duplicates, process idempotently, log safely, and respond within provider timeout constraints.

## 14. Endpoint documentation template
### `[METHOD] /resource`
Purpose:  
Authentication:  
Authorization:  
Rate limit:  
Idempotency:  
Request schema:  
Response schema:  
Errors:  
Side effects:  
Observability:  
Compatibility notes:
