import { useState, type ReactNode } from 'react'
import { cx } from '../buttons/cx'
import srcSun from '../../assets/chat/source-sun.png'
import srcRing from '../../assets/chat/source-ring.png'
import srcStripes from '../../assets/chat/source-stripes.png'
import { useChatMessageFix } from './fixes'
import {
  BranchIcon, CopyIcon, DotsIcon, DownloadIcon, ForwardIcon, SoundOnIcon, ThumbsDownIcon, ThumbsUpIcon,
} from './icons'
import { copyToClipboard } from './types'
import './response.css'

/** "Feedback Array" set 10016:493614, Type=Full screen 10016:493615. */
export const FEEDBACK_ARRAY = '10016:493615'
const COST = '10016:493566' // _Cost / Type=Low, State=Default
const ALL_SOURCES = '5970:544362' // All Sources / State=Default
const AGENT_ACTIONS = '250:177368' // CopilotBase_Feeback Actions / Type=Desktop Agent

/** The buttons after the cost, in order. chat-artifact 08 draws share, like, copy, read aloud, branch; input-large 24 has download for like. */
export type FeedbackAction = 'share' | 'like' | 'download' | 'copy' | 'read-aloud' | 'branch'
export type FeedbackVote = 'up' | 'down' | null

export type FeedbackRowProps = {
  /** Per-message cost pill ("$0.19"). */
  cost: string
  /** "8 Sources". */
  sources: number
  /** Left group after the cost. Default: share, like, copy, read-aloud, branch (chat-artifact 08). */
  actions?: FeedbackAction[]
  /** What Copy puts on the clipboard (the answer as plain text). */
  copyText?: string
  /** Thumbs up / down on the right (controlled when given). */
  vote?: FeedbackVote
  onVote?: (vote: FeedbackVote) => void
  /** The left "like" (controlled when given). */
  liked?: boolean
  onLike?: (liked: boolean) => void
  onShare?: () => void
  onDownload?: () => void
  /** After Copy (ok = the clipboard accepted it): the screen shows its toast. */
  onCopy?: (ok: boolean) => void
  onReadAloud?: () => void
  onBranch?: () => void
  onSources?: () => void
  onMore?: () => void
  className?: string
}

const LABEL: Record<FeedbackAction, string> = {
  share: 'Share', like: 'Like', download: 'Download', copy: 'Copy', 'read-aloud': 'Read aloud', branch: 'Branch from here',
}
const ICON: Record<FeedbackAction, ReactNode> = {
  share: <ForwardIcon />, like: <ThumbsUpIcon />, download: <DownloadIcon />, copy: <CopyIcon />, 'read-aloud': <SoundOnIcon />, branch: <BranchIcon />,
}

/**
 * The row under a finished answer: the answer's cost, share / like / copy / read aloud / branch, the source favicons with
 * "8 Sources", and on the right thumbs up, thumbs down and more. 24 tall; every button is Buttons/Button Neutral xs
 * Tertiary icon-only (24, p 6, a 12px icon in button-neutral-tertiary-fg), round on the left, radius 6 on the right.
 */
export function FeedbackRow({
  cost, sources, actions = ['share', 'like', 'copy', 'read-aloud', 'branch'], copyText = '', vote: voteProp, onVote,
  liked: likedProp, onLike, onShare, onDownload, onCopy, onReadAloud, onBranch, onSources, onMore, className,
}: FeedbackRowProps) {
  const pressedLook = useChatMessageFix('feedback-pressed-state')
  const [ownVote, setOwnVote] = useState<FeedbackVote>(null)
  const [ownLiked, setOwnLiked] = useState(false)
  const vote = voteProp !== undefined ? voteProp : ownVote
  const liked = likedProp ?? ownLiked
  const setVote = (v: FeedbackVote) => { if (voteProp === undefined) setOwnVote(v); onVote?.(v) }
  const setLiked = (v: boolean) => { if (likedProp === undefined) setOwnLiked(v); onLike?.(v) }

  const run = (a: FeedbackAction) => {
    switch (a) {
      case 'share': return onShare?.()
      case 'like': return setLiked(!liked)
      case 'download': return onDownload?.()
      case 'copy': return void copyToClipboard(copyText).then(ok => onCopy?.(ok))
      case 'read-aloud': return onReadAloud?.()
      case 'branch': return onBranch?.()
    }
  }

  return (
    <div className={cx('cm-fb', pressedLook && 'cm-fb--pressed-look', className)} role="group" aria-label="Answer actions" data-node-id={FEEDBACK_ARRAY}>
      <div className="cm-fb__left">
        <span className="cm-fb__cost" data-node-id={COST}>
          <span className="cm-sr">Cost of this answer: </span>{cost}
        </span>
        {actions.map(a => (
          <button
            key={a} type="button" className="cm-fb__btn cm-fb__btn--round" aria-label={LABEL[a]}
            aria-pressed={a === 'like' ? liked : undefined} onClick={() => run(a)}
          >
            {ICON[a]}
          </button>
        ))}
        <button type="button" className="cm-fb__sources" data-node-id={ALL_SOURCES} onClick={onSources} aria-label={`${sources} Sources`}>
          <span className="cm-fb__favs" aria-hidden="true">
            <img alt="" src={srcSun} /><img alt="" src={srcRing} /><img alt="" src={srcStripes} />
          </span>
          <span className="cm-fb__count" aria-hidden="true">{sources} Sources</span>
        </button>
      </div>
      <div className="cm-fb__right" data-node-id={AGENT_ACTIONS}>
        <button type="button" className="cm-fb__btn" aria-label="Good response" aria-pressed={vote === 'up'} onClick={() => setVote(vote === 'up' ? null : 'up')}>
          <ThumbsUpIcon />
        </button>
        <button type="button" className="cm-fb__btn" aria-label="Bad response" aria-pressed={vote === 'down'} onClick={() => setVote(vote === 'down' ? null : 'down')}>
          <ThumbsDownIcon />
        </button>
        <button type="button" className="cm-fb__btn" aria-label="More actions" aria-haspopup={onMore ? 'menu' : undefined} onClick={onMore}>
          <DotsIcon />
        </button>
      </div>
    </div>
  )
}
