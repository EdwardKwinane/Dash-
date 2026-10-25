# ECOMMERCE.md — Service Profile

Version: 1.0
Applies when: selling physical/digital products, managing catalog/inventory, checkout, orders, refunds, or POS synchronization.

## Sources of truth
Explicitly define the source of truth for catalog, price, inventory, customer, order, payment, fulfillment, and POS data. Never let two systems silently own the same field.

## Money
Represent money in integer minor units or an equivalent precise decimal strategy; never use binary floating point for authoritative totals. Server-side calculations own price, tax, discount, shipping, and order totals.

## Checkout/payment
Use tokenized/hosted payment flows where possible. Verify webhooks, make financial mutations idempotent, and reconcile provider state with internal state. Never mark an order paid solely from a browser redirect.

## Inventory
Define reservation, oversell policy, cancellation/restock, returns, and concurrency behavior. Inventory updates from POS/ecommerce integrations require conflict and reconciliation rules.

## Order lifecycle
Use an explicit state machine for order/payment/fulfillment/return states. Invalid transitions must be rejected rather than patched after the fact.

## Security/fraud
Protect coupon/discount rules, admin price changes, refund actions, export endpoints, and account/order lookup. Audit high-value and privileged operations.

## Operations
Provide reconciliation/runbook procedures for failed webhooks, duplicate events, partial fulfillment, payment disputes, provider outages, and POS sync drift.
