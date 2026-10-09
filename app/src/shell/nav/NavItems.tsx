import { DARK, LIGHT, RAIL_DARK } from './icons'
import { AgentRow, ChatRow, LightChatRow, NavRow, NavSection, type Destinations } from './rows'

// The scrolling item list of the expanded nav, one component per mode. Each mode keeps its own items
// exactly as drawn: dark has the pinned project tree and a "Chats" group; light has "History" instead.
// Chat titles, agents and statuses are the file's placeholder content.

type ItemsProps = {
  nav: Destinations
  /** pin the two hover states drawn in the dashboard frame (dark only), for 1:1 diffs */
  pinFigmaHovers?: boolean
}

/** Dark (226:81200). */
export function DarkNavItems({ nav, pinFigmaHovers }: ItemsProps) {
  return (
    <>
      <div className="ngrp ngrp--primary">
        {/* selected, the plus is full white (chat-artifact 08); the nav asset is the 60% rest state */}
        <NavRow tone="dark" to="new" nav={nav} icon={nav.selected === 'new' ? RAIL_DARK.newSession : DARK.newSession} label="New Session" />
        {/* the solid folder is the selected state (Projects frames); unselected it is the outline (chat-artifact 08) */}
        <NavRow tone="dark" to="projects" nav={nav} icon={nav.selected === 'projects' ? DARK.projects : DARK.pinnedProjects} label="Projects" />
        <NavRow tone="dark" to="routines" nav={nav} icon={DARK.routines} label="Routines" />
        <NavRow tone="dark" to="meetings" nav={nav} icon={DARK.meetings} label="Meetings" />
        <div className="nrow-wrap">
          <NavRow tone="dark" to="artifacts" nav={nav} icon={DARK.artifacts} label="Artifacts" labelClassName="nt--m" />
          <span className="nline" />
        </div>
      </div>

      <NavSection tone="dark" title="Agents" className="ngrp ngrp--sec ngrp--clip" headerClassName="nsub" divider>
        <AgentRow tone="dark" avatar={DARK.agentFinancial} name="Financial Analysis Agent" />
        <AgentRow tone="dark" avatar={DARK.agentSheet} name="Sheet Sage Agent" labelClassName="nt--m" />
        <AgentRow tone="dark" avatar={DARK.agentFalcon} name="Formula Falcon Agent" labelClassName="nt--m" />
      </NavSection>

      <NavSection tone="dark" title="Pinned" className="ngrp ngrp--sec" headerClassName="nsub" divider>
        <NavRow tone="dark" icon={DARK.pinnedArtifacts} label="Artifacts" className="nrow--pr4" labelClassName="nt--m" hover={pinFigmaHovers} />
        <NavRow tone="dark" icon={DARK.pinnedProjects} label="Projects" className="nrow--pr4" innerClassName="nrow__in--fill" />
        <div className="ntree">
          <img alt="" src={DARK.treeLine} className="ntree__line" />
          <div className="ntree__col">
            <ChatRow title="Excel Formula Help From Main Document" status="progress" />
            <ChatRow title="Chat 2 inside this Project" status="waiting" className="nchat--pl4" />
          </div>
        </div>
        <ChatRow title="Plan launch timeline" status="progress" />
        <ChatRow title="Review customer feedback" status="failed" />
      </NavSection>

      <div className="ngrp ngrp--hist">
        <NavSection tone="dark" title="Routines" className="nhgrp" headerClassName="nsub nsub--h" divider>
          <ChatRow title="Get all granola notes summarized and del " status="waiting" />
          <ChatRow title="Excel Formula Help From Main Document" status="progress" hover={pinFigmaHovers} />
          <ChatRow title="Design Stand up follow-up  meeting" status="progress" preserveSpaces />
        </NavSection>
        <NavSection tone="dark" title="Chats" className="nhgrp" headerClassName="nsub nsub--h">
          <ChatRow title="Sheet Formula Consultant" status="unread" />
          <ChatRow title="Workbook Support Hub" className="nchat--pr4" />
          <ChatRow title="Morning Digest" time="2h" className="nchat--pr4" />
          <ChatRow title="Spreadsheet Formula Advisor" className="nchat--pr4" />
        </NavSection>
      </div>
    </>
  )
}

/** Light (9721:594967). Only the first two History rows spin; the last two keep the file's static ring. */
export function LightNavItems({ nav }: ItemsProps) {
  return (
    <>
      <div className="lgrp lgrp--primary">
        <NavRow tone="light" to="new" nav={nav} icon={LIGHT.newSession} label="New Session" />
        <NavRow tone="light" to="projects" nav={nav} icon={LIGHT.projects} label="Projects" />
        <NavRow tone="light" to="routines" nav={nav} icon={LIGHT.routines} label="Routines" />
        <NavRow tone="light" to="meetings" nav={nav} icon={LIGHT.meetings} label="Meetings" />
        <div className="nrow-wrap lrow-wrap">
          <NavRow tone="light" to="artifacts" nav={nav} icon={LIGHT.artifacts} label="Artifacts" className="lrow--pr2" />
          <span className="lline" />
        </div>
      </div>

      <NavSection tone="light" title="Agents" className="lgrp" headerClassName="lsub" divider>
        <AgentRow tone="light" avatar={LIGHT.agentFinancial} name="Financial Analysis Agent" />
        <AgentRow tone="light" avatar={LIGHT.agentSheet} name="Sheet Sage Agent" />
        <AgentRow tone="light" avatar={LIGHT.agentFalcon} name="Formula Falcon Agent" />
      </NavSection>

      <NavSection tone="light" title="Pinned" className="lgrp" headerClassName="lsub" divider>
        <NavRow tone="light" icon={LIGHT.artifacts} label="Artifacts" className="lrow--pr2" />
        <NavRow tone="light" icon={LIGHT.projects} label="Projects" />
        <LightChatRow title="Plan launch timeline" dot="progress" />
        <LightChatRow title="Review customer feedback" dot="failed" />
      </NavSection>

      <div className="lgrp lgrp--hist">
        <NavSection tone="light" title="Routines" className="nhgrp" headerClassName="lsub" divider>
          <LightChatRow title="Get all granola notes summarized and del " dot="waiting" />
          <LightChatRow title="Excel Formula Help From Main Document" dot="progress" />
          <LightChatRow title="Design Stand up follow-up  meeting" dot="progress" />
        </NavSection>
        <NavSection tone="light" title="History" className="nhgrp" headerClassName="lsub">
          <LightChatRow title="Sheet Formula Consultant" dot="progress" more className="lchat--pr4" />
          <LightChatRow title="Workbook Support Hub" dot="progress" more className="lchat--pr4" />
          <LightChatRow title="Excel Formula Help From Main Document" dot="ring" more />
          <LightChatRow title="Excel Formula Help From Main Document" dot="ring" time="2h" />
        </NavSection>
      </div>
    </>
  )
}
