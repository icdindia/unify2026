// The Assistant's own pieces: the landing mark, the avatar, the "Thinking..." row and the chain of thought
// (BUILD-PLAN inventory rows 18 (mark), 27 and 28). Gallery: #/gallery/assistant-mark, agent-avatar, thinking-indicator,
// chain-of-thought.
export { AssistantMark, ASSISTANT_MARK_COMPONENT, type AssistantMarkProps } from './AssistantMark'
export { AgentAvatar, AGENT_AVATAR_SET, type AgentAvatarProps, type AgentAvatarTone } from './AgentAvatar'
export { ThinkingIndicator, THINKING_STATE_SET, type ThinkingIndicatorProps } from './ThinkingIndicator'
export {
  ChainOfThought, AGENT_COT_SET,
  type ChainOfThoughtProps, type ChainOfThoughtSpec, type ChainThought, type CotPresentation, type CotThoughtIcon, type CotSourceKind,
} from './ChainOfThought'
export { AGENT_FIXES, useAgentFix } from './fixes'
