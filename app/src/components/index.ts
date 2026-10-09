// The shared primitives, one folder per component with its CSS. Import from a folder ('components/avatar') or from here.
// Page chrome (breadcrumb, page header, buttons, dropdown menu, composer) is ported from prototypes/project-dashboard
// (the verified 1:1 HTML rebuild of "Dashboard" 14045:584747 and inside page option 2, 15054:105151); the rest is wave 1
// of the Chat + Artifacts plan (app/figma-ref/chat-artifacts/BUILD-PLAN.md, inventory rows 5-16).
// Each primitive has a gallery page: #/gallery/<name> (src/gallery/pages).
export * from './breadcrumb'
export * from './page-header'
export * from './composer'
export * from './dropdown-menu'
export * from './buttons'
export * from './avatar'
export * from './pill'
export * from './form'
export * from './option-menu'
export * from './empty-state'
export * from './overlays'
// Chat + Artifacts (chat-artifact journey): the chat chrome, messages, agent, artifact surfaces and the split view.
export * from './chat-header'
export * from './chat-title-menu'
export * from './share-modal'
export * from './chat-messages'
export * from './mention-picker'
export * from './agent'
export * from './inline-artifact-card'
export * from './files-panel'
export * from './access-popover'
export * from './artifact-header'
export * from './artifact-canvas'
export * from './split-view'
