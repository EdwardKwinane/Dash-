# AI_AGENT.md — Service Profile

Version: 1.0
Applies when: an LLM can plan, call tools, change state, or perform multi-step work.

## Principle
The agent proposes; deterministic application controls decide whether an action is valid and authorized.

## Agent boundary
Define objective, allowed tools, disallowed actions, state/memory policy, maximum steps, wall-clock limit, token/cost budget, and completion criteria.

## Tools
Every tool has a narrow schema, server-side authorization, explicit side effects, timeouts, rate/cost limits, audit logging, and idempotency where required. Do not expose generic shell/SQL/browser capabilities when a narrow domain tool can satisfy the use case.

## High-impact actions
Require explicit human approval or a product-approved deterministic policy before irreversible deletion, financial transfer/refund above limits, privilege changes, mass outbound communication, or disclosure of sensitive data.

## Memory
Separate durable application state from model conversation history. Do not treat model-generated memory as authoritative without validation. Define retention and tenant/user scoping.

## Evaluation
Maintain scenarios covering correct tool choice, no-tool cases, authorization failures, prompt injection, loops, provider failure, malformed output, and recovery. Track successful-task cost and latency, not only per-call metrics.

## Kill switch
Production agents must have a practical way to disable tool execution or the entire agent path without a full code rewrite.
