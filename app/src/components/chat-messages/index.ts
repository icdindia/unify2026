// Chat thread messages (BUILD-PLAN inventory rows 22-26 and 29): user messages (own / participant, grouped), the system
// line, the typing row, the Assistant response with its feedback row, suggested prompts and inline citation pills.
// Gallery: #/gallery/chat-messages and #/gallery/assistant-response.
export {
  MessageGroup, UserMessage, OWN_MESSAGE_SET, PARTICIPANT_MESSAGE_SET, USER_ACTIONS, PARTICIPANT_GROUP_FRAME,
  type MessageGroupProps, type UserMessageProps, type MessageSpacing,
} from './UserMessage'
export { SystemLine, SYSTEM_LINE_FRAME, type SystemLineProps } from './SystemLine'
export { TypingIndicator, TYPING_ROW_FRAME, THREE_DOTS_SET, type TypingIndicatorProps } from './TypingIndicator'
export { AssistantResponse, RESPONSE_SET, RESPONSE_ASSISTANT, type AssistantResponseProps } from './AssistantResponse'
export { FeedbackRow, FEEDBACK_ARRAY, type FeedbackRowProps, type FeedbackAction, type FeedbackVote } from './FeedbackRow'
export { SuggestedPrompts, SUGGESTED_PROMPTS, type SuggestedPromptsProps } from './SuggestedPrompts'
export { CitationPill, CITATION_PILL_SET, CITATION_CARD, type CitationPillProps, type CitationDetail } from './CitationPill'
export { RichRuns, MentionPill, type RichRunsProps, type MentionStyle } from './RichText'
export {
  plainText, answerText, copyToClipboard, isBold, isMention, isCite,
  type MessageRun, type MessageAuthor, type UserMessageData, type ResolvedAnswer, type ResolvedBlock, type ResolvedCitation,
} from './types'
export { groupThread, useAuthorOf, type ThreadSegment } from './thread'
export { CHAT_MESSAGE_FIXES, useChatMessageFix, type ChatMessageFixId } from './fixes'
export { AssistantGlyph } from './icons'
