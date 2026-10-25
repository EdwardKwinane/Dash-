# RAG.md — Service Profile

Version: 1.0
Applies when: retrieving documents/data to ground model responses.

## Ingestion
Define supported sources, parsing, normalization, chunking, metadata, language handling, deduplication, update/delete propagation, and failed-ingestion behavior.

## Access control
Authorization must be enforced before or during retrieval so unauthorized chunks never enter the model context. Metadata filters are part of the security boundary and require tests.

## Retrieval
Version embedding model, chunking strategy, indexes, filters, retrieval count, reranker, and query transformation. Tune against a representative evaluation set rather than intuition alone.

## Grounding
For factual knowledge workflows, expose citations/provenance where useful and define behavior when evidence is insufficient or conflicting. The model must be allowed to say it lacks support.

## Freshness
Define source-of-truth ownership, re-index triggers, delete/tombstone behavior, and acceptable staleness.

## Evaluation
Measure retrieval recall/relevance separately from answer quality. Include unauthorized-document tests, stale-document tests, adversarial/malicious-document prompt injection, and citation correctness.

## Privacy
Do not send entire documents or unnecessary sensitive fields to embedding/model providers. Document provider retention/privacy settings.
