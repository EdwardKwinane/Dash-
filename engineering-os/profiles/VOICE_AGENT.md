# VOICE_AGENT.md — Service Profile

Version: 1.0
Applies when: building AI phone, call-center, or realtime voice experiences.

## Pipeline
Define telephony/transport, VAD, STT, turn-taking, LLM, tool layer, TTS, interruption/barge-in, and handoff. Track end-to-end latency, not only model latency.

## Identity and disclosure
Define when the system identifies itself as automated, how user identity is verified before account-specific actions, and what actions require stronger verification.

## Conversation safety
Do not infer authorization from caller ID alone. High-impact account, financial, or privacy actions require deterministic verification and approval rules.

## Failure handling
Support silence, noise, STT uncertainty, dropped calls, provider outages, tool failures, and transfer-to-human paths. Avoid trapping a user in an agent loop.

## Accessibility
Provide an equivalent text/digital path where practical and follow `ACCESSIBILITY.md` for voice-related requirements.

## Privacy and recording
Define recording/transcription consent, storage, retention, redaction, and jurisdiction/client obligations before enabling recording. Do not log raw sensitive utterances unnecessarily.

## Evaluation
Measure task completion, transfer rate, interruption quality, STT failures, latency, tool accuracy, cost/minute or cost/task, and safety/authorization failures.
