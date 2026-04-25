# Ollama Cloud Integration TODO

## Plan
Apply Ollama Cloud Models documentation across the QMS application.

## Files to Modify

1. [ ] `sdk/providers/ollama.ts` — Add `ollamaCloudProvider` and cloud model definitions (gpt-oss:120b-cloud, etc.)
2. [ ] `sdk/providers/index.ts` — Export Ollama cloud provider and models
3. [ ] `sdk/utils.ts` — Update `getAPIKeyEnvVar` to handle Ollama cloud host configuration
4. [ ] `lib/ollama.ts` — Add cloud API client: `chatWithOllamaCloud`, `streamChatWithOllamaCloud`, `listOllamaCloudModels`, `generateWithOllamaCloud`
5. [ ] `lib/sdk/config.ts` — Add `OLLAMA_API_KEY` and `OLLAMA_HOST` to env schema; add Ollama cloud config
6. [ ] `lib/sdk/ai.ts` — Add Ollama cloud models to `availableModels`; add `isOllamaModel` helper
7. [ ] `lib/services/ai-service.ts` — Detect Ollama models and route to cloud client; add `pullOllamaCloudModel`
8. [ ] `hooks/use-ai.ts` — Update to support Ollama cloud model selection and streaming
9. [ ] `app/flow-process/components/AIPanel.tsx` — Add Ollama cloud models to `defaultModels`
10. [ ] `components/ai-elements/model-selector.tsx` — Add `ollama` to `ModelSelectorLogo` provider union
11. [ ] `README.md` — Add Ollama Cloud setup section

## Follow-up
- Run `npm run type-check` to verify TypeScript compiles
- No new dependencies needed (uses built-in `fetch` for cloud API)

