import { useEffect, useRef, useState, type KeyboardEvent } from 'react'
import {
  AttachmentStrip, AttachmentThumb, COMPOSER_HINTS, CompanyChip, Composer, EnhanceButton, LimitPill, QueueButton,
  ResearchChip, RotatingPlaceholder, SendButton, StopButton,
  type ComposerAttachment, type ComposerHandle, type ComposerTrigger,
} from '../../components/composer'
import { COMPOSE_MAX_LINE, COMPOSE_THREE_LINE, COMPOSE_TWO_LINE } from '../../fixtures/compose'
import { useUiParam } from '../../router/uiParams'
import chart from '../../assets/composer/sample-chart.svg'
import photo from '../../assets/composer/sample-photo.svg'
import { GallerySection, Specimen, Specimens } from '../GalleryPage'
import type { GalleryMeta } from '../registry'
import './composer.css'

export const meta: GalleryMeta = {
  title: 'Composer',
  figmaNodeIds: ['10064:383334', '5563:230560', '5546:212948', '7372:140000', '7372:140049', '9806:507020', '144:37183', '144:37169', '7159:535660'],
  group: 'Composer',
  description:
    'Copilot desktop Input Box (set 10064:383334) and its parts: Type=Landing Page / Bottom small / Bottom large, the ' +
    'Company and Research chips, Send / Stop / Queue, the skill and mention tokens with the caret-anchored trigger, ' +
    'attachment thumbnails, the rotating placeholder, the Enhance slot and the default / generating / loading states. ' +
    'Reference frames: figma-ref/chat-artifacts/input-large (24 frames).',
  sheets: [
    { id: 'types', label: 'Types' },
    { id: 'states', label: 'States' },
    { id: 'buttons', label: 'Buttons & chips' },
    { id: 'tokens', label: 'Tokens & triggers' },
    { id: 'attachments', label: 'Attachments' },
    { id: 'placeholder', label: 'Placeholder' },
    { id: 'playground', label: 'Playground' },
  ],
}

const SKILLS = ['Tech design requirements', 'Meeting summary & Action items', 'Personalised Outreach Email', 'Account Web Intelligence', 'Onboarding Plan', 'Email Drafting']
const PEOPLE = ['Assistant', 'Matt Rivera', 'John Whitaker', 'Grace Coleman']

// The copy of the input-large frames (one source: src/fixtures/compose.ts).
const SKILL = '/Tech design requirements'
const ONE = `${SKILL} AI-generated insights based on the inputs provided.`
const TWO = `${SKILL} ${COMPOSE_TWO_LINE}`
const THREE = `${SKILL} ${COMPOSE_THREE_LINE}`
const MAX = `${SKILL} ${COMPOSE_MAX_LINE}`

const ATTACHMENTS: ComposerAttachment[] = [
  { id: 'a1', kind: 'image', name: 'Pipeline chart.png', src: chart, status: 'ready' },
  { id: 'a2', kind: 'image', name: 'Team offsite.jpg', src: photo, status: 'ready' },
  { id: 'a3', kind: 'file', name: 'Attachment', meta: 'File', fileType: 'file', status: 'ready' },
  { id: 'a4', kind: 'file', name: 'Attachment.pdf', meta: 'PDF · 200 KB', fileType: 'pdf', status: 'ready' },
  { id: 'a5', kind: 'image', name: 'Reference.png', src: chart, status: 'ready' },
]

/** A composer that keeps its own attachment list, so the remove buttons work in the gallery. */
function WithFiles({ initial, ...props }: { initial: ComposerAttachment[] } & Parameters<typeof Composer>[0]) {
  const [files, setFiles] = useState(initial)
  return <Composer {...props} attachments={files} onRemoveAttachment={id => setFiles(f => f.filter(a => a.id !== id))} />
}

function Types() {
  return (
    <>
      <GallerySection title="Type=Landing Page" description="640 wide on the landing page (760 on the Projects dashboard, which is the plain box with no shadow). The field is two lines tall and grows to 12 lines (Max line), then scrolls.">
        <Specimens min="lg">
          <Specimen wide label="Tools & Sources=No, Text=Placeholder (the Projects dashboard box)" nodeId="10064:383335">
            <div className="cg-landing"><Composer /></div>
          </Specimen>
          <Specimen wide label="Tools & Sources=Yes, Text=Placeholder, elevated (input-large 03)" nodeId="10064:383343">
            <div className="cg-landing"><Composer tools elevated skills={SKILLS} /></div>
          </Specimen>
          <Specimen wide label="Text=One line, skill token (input-large 04)" nodeId="10064:383365">
            <div className="cg-landing"><Composer tools elevated skills={SKILLS} defaultValue={ONE} /></div>
          </Specimen>
          <Specimen wide label="Text=Two line (input-large 05)" nodeId="10064:383367">
            <div className="cg-landing"><Composer tools elevated skills={SKILLS} defaultValue={TWO} /></div>
          </Specimen>
          <Specimen wide label="Text=Max line (input-large 06)" nodeId="10064:383369">
            <div className="cg-landing"><Composer tools elevated skills={SKILLS} defaultValue={MAX} /></div>
          </Specimen>
          <Specimen wide label="State=Limit exceed, pill hovered (input-large 07)" nodeId="10064:383371">
            <div className="cg-landing"><Composer tools elevated skills={SKILLS} defaultValue={MAX} maxLength={400} hover="limit" /></div>
          </Specimen>
          <Specimen wide label="Attachment=Yes" nodeId="10064:383344">
            <div className="cg-landing"><WithFiles tools elevated initial={ATTACHMENTS} /></div>
          </Specimen>
        </Specimens>
      </GallerySection>

      <GallerySection title="Type=Bottom small" description="The 48px pill docked under a chat: icon-only chips, the field inline, Voice until there is text.">
        <Specimens min="lg">
          <Specimen wide label="Tools & Sources=No, Text=Placeholder" nodeId="10064:383337">
            <div className="cg-bottom"><Composer type="bottom-small" /></div>
          </Specimen>
          <Specimen wide label="Tools & Sources=Yes, Text=Placeholder" nodeId="10064:383340">
            <div className="cg-bottom"><Composer type="bottom-small" tools /></div>
          </Specimen>
          <Specimen wide label="Text=One line, skill token (input-large 09)" nodeId="10064:383341">
            <div className="cg-bottom"><Composer type="bottom-small" tools skills={SKILLS} defaultValue="/Tech design requirements AI-generated insights based on " /></div>
          </Specimen>
          <Specimen wide label="State=Generating (input-large 08, 14-24)" nodeId="10064:383339">
            <div className="cg-bottom"><Composer type="bottom-small" tools state="generating" /></div>
          </Specimen>
        </Specimens>
      </GallerySection>

      <GallerySection title="Type=Bottom large" description="Once the text no longer fits the pill (or files are attached) the box gets a full-width message row. It grows upward from the dock, to 12 lines. type=&quot;bottom&quot; picks small or large by itself.">
        <Specimens min="lg">
          <Specimen wide label="Text=One line (input-large 10)" nodeId="10064:383359">
            <div className="cg-bottom"><Composer type="bottom-large" tools skills={SKILLS} defaultValue="/Tech design requirements AI-generated insights based on the inputs provided by you. " /></div>
          </Specimen>
          <Specimen wide label="Text=Two line (input-large 11)" nodeId="10064:383360">
            <div className="cg-bottom"><Composer type="bottom-large" tools skills={SKILLS} defaultValue={THREE} /></div>
          </Specimen>
          <Specimen wide label="Text=Max line (input-large 12)" nodeId="10064:383362">
            <div className="cg-bottom"><Composer type="bottom-large" tools skills={SKILLS} defaultValue={MAX} /></div>
          </Specimen>
          <Specimen wide label="State=Limit exceed (input-large 13)" nodeId="10064:383363">
            <div className="cg-bottom"><Composer type="bottom-large" tools skills={SKILLS} defaultValue={MAX} maxLength={400} /></div>
          </Specimen>
          <Specimen wide label="Attachment=Yes, Text=One line (queue-1 04)" nodeId="10064:383356">
            <div className="cg-bottom">
              <WithFiles type="bottom" tools skills={SKILLS} defaultValue="/Tech design requirements AI-generated insights based on the inputs provided." initial={ATTACHMENTS} />
            </div>
          </Specimen>
        </Specimens>
      </GallerySection>
    </>
  )
}

function States() {
  return (
    <GallerySection title="state" description="default · generating (the Assistant answers: Stop, and Queue once there is text) · loading (Enhance with AI rewrites the prompt: skeleton, Send disabled, the Enhance slot shows Stop).">
      <Specimens min="lg">
        <Specimen wide label="generating, empty: Stop hovered, tooltip pinned (queue-1 01)" nodeId="10064:383339">
          <div className="cg-bottom"><Composer type="bottom" tools state="generating" onQueue={() => {}} hover="stop" /></div>
        </Specimen>
        <Specimen wide label="generating, with text: Queue + Stop, Queue hovered (queue-1 02)">
          <div className="cg-bottom"><Composer type="bottom" tools state="generating" onQueue={() => {}} defaultValue="AI-generated insights based on " hover="queue" /></div>
        </Specimen>
        <Specimen wide label="generating, uploading: Queue disabled (queue-1 04)">
          <div className="cg-bottom">
            <Composer type="bottom" tools state="generating" onQueue={() => {}} defaultValue="Use the attached image as a reference for data graphs."
                      attachments={[{ id: 'u1', kind: 'image', name: 'Reference.png', status: 'loading' }]} />
          </div>
        </Specimen>
        <Specimen wide label="default with the Enhance slot, disabled (enhance-prompt 01)">
          <div className="cg-landing"><Composer tools elevated enhance={<EnhanceButton state="disabled" />} /></div>
        </Specimen>
        <Specimen wide label="default with the Enhance slot, enabled (enhance-prompt 02)">
          <div className="cg-landing"><Composer tools elevated defaultValue="AI-generated insights based on the inputs provided." enhance={<EnhanceButton />} /></div>
        </Specimen>
        <Specimen wide label="loading: skeleton, Send disabled, Enhance is Stop (enhance-prompt 04)">
          <div className="cg-landing">
            <Composer tools elevated state="loading" defaultValue="AI-generated insights based on the inputs provided." enhance={<EnhanceButton state="loading" />} />
          </div>
        </Specimen>
        <Specimen wide label="loading in the pill">
          <div className="cg-bottom"><Composer type="bottom-small" tools state="loading" defaultValue="AI-generated insights" enhance={<EnhanceButton state="loading" />} /></div>
        </Specimen>
      </Specimens>
    </GallerySection>
  )
}

function Buttons() {
  return (
    <>
      <GallerySection title="Send / Stop / Queue" description="Buttons/Button Neutral / Size=md, Hierarchy=Primary, Icon=Only on radius-full. Disabled is aria-disabled, so the button keeps focus and its tooltip.">
        <Specimens min="sm">
          <Specimen label="Send / Default" nodeId="9806:507121" surface="primary"><SendButton /></Specimen>
          <Specimen label="Send / Hover" nodeId="9806:507133" surface="primary"><SendButton hover /></Specimen>
          <Specimen label="Send / Disabled" nodeId="9806:507125" surface="primary"><SendButton disabled /></Specimen>
          <Specimen label="Stop / Default" surface="primary"><StopButton /></Specimen>
          <Specimen label="Stop / Hover, tooltip (queue-1 01)" surface="primary"><StopButton hover /></Specimen>
          <Specimen label="Queue / Default" surface="primary"><QueueButton /></Specimen>
          <Specimen label="Queue / Hover, tooltip (queue-1 02)" surface="primary"><QueueButton hover /></Specimen>
          <Specimen label="Queue / Disabled (uploading)" surface="primary"><QueueButton disabled /></Specimen>
        </Specimens>
      </GallerySection>
      <GallerySection title="Enhance with AI and the limit pill" description="Tertiary icon button with the AI stars glyph (tooltip &quot;Enhance with AI&quot;), Stop while the rewrite runs. The limit pill shows the overflow and explains it in its tooltip.">
        <Specimens min="sm">
          <Specimen label="Enhance / Default" surface="primary"><EnhanceButton /></Specimen>
          <Specimen label="Enhance / Disabled" surface="primary"><EnhanceButton state="disabled" /></Specimen>
          <Specimen label="Enhance / Loading (Stop)" surface="primary"><EnhanceButton state="loading" /></Specimen>
          <Specimen label="Limit pill" surface="primary"><LimitPill over={2346} /></Specimen>
        </Specimens>
      </GallerySection>
      <GallerySection title="Company / Research chips" description="Source Pill 7372:140000 and Tools Pill 7372:140049, md (landing) and icon-only (bottom). Company toggles (aria-pressed); Research shows × on hover or focus and a click removes it.">
        <Specimens min="sm">
          <Specimen label="Source Pill / Sources=Yes" nodeId="7372:140001" surface="primary"><CompanyChip on /></Specimen>
          <Specimen label="Source Pill / State=Hover" surface="primary"><CompanyChip on hover /></Specimen>
          <Specimen label="Source Pill / Sources=No" surface="primary"><CompanyChip on={false} /></Specimen>
          <Specimen label="Tools Pill / Default" nodeId="7372:140050" surface="primary"><ResearchChip /></Specimen>
          <Specimen label="Tools Pill / State=Hover" surface="primary"><ResearchChip hover /></Specimen>
          <Specimen label="Icon only: Company / off / Research / hover" surface="primary">
            <span className="cg-row">
              <CompanyChip on size="icon" /><CompanyChip on={false} size="icon" /><ResearchChip size="icon" /><ResearchChip size="icon" hover />
            </span>
          </Specimen>
        </Specimens>
      </GallerySection>
    </>
  )
}

/** A bare-bones picker for the gallery: shows the trigger contract (caret box, query, insertToken) at work. */
function TriggerDemo() {
  const handle = useRef<ComposerHandle>(null)
  const [trigger, setTrigger] = useState<ComposerTrigger | null>(null)
  const [active, setActive] = useState(0)
  const options = trigger ? (trigger.kind === 'mention' ? PEOPLE : SKILLS).filter(n => n.toLowerCase().includes(trigger.query.toLowerCase())) : []
  useEffect(() => setActive(0), [trigger?.query, trigger?.kind])
  const pick = (name: string) => trigger && handle.current?.insertToken(trigger.kind, name)
  const onKey = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (!options.length) return false
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault()
      setActive(i => (i + (e.key === 'ArrowDown' ? 1 : options.length - 1)) % options.length)
      return true
    }
    if (e.key === 'Enter' || e.key === 'Tab') {
      e.preventDefault()
      pick(options[active])
      return true
    }
    return false
  }
  return (
    <div className="cg-trigger">
      <div className="cg-bottom">
        <Composer
          type="bottom" tools handleRef={handle} skills={SKILLS} mentions={PEOPLE} label="Message (type @ or /)"
          defaultValue="@Matt Rivera you own most of those six — which " onTrigger={setTrigger} onTriggerKeyDown={onKey}
        />
      </div>
      {trigger && options.length > 0 && (
        <ul className="cg-picker" role="listbox" aria-label={trigger.kind === 'mention' ? 'People' : 'Skills'}
            style={{ left: trigger.anchor.left, top: trigger.anchor.top }}>
          {options.map((o, i) => (
            <li key={o} role="option" aria-selected={i === active} className={i === active ? 'is-active' : undefined}
                onMouseDown={e => { e.preventDefault(); pick(o) }}>{o}</li>
          ))}
        </ul>
      )}
      <pre className="cg-out" aria-live="polite">{trigger
        ? `onTrigger: ${trigger.char}${trigger.query}  [${trigger.start}, ${trigger.end})  caret ${Math.round(trigger.caret.left)},${Math.round(trigger.caret.top)}`
        : 'onTrigger: null'}</pre>
    </div>
  )
}

function Tokens() {
  return (
    <>
      <GallerySection title="Skill and mention tokens" description="A token is a run of the text: &quot;/&quot; + a known skill, &quot;@&quot; + a known person, drawn in steel-blue-400 through a mirror layer under the textarea. Backspace or Delete removes a token in one go. As designed, the landing frames draw the skill &quot;/&quot; in blue-dark-600; With fixes it is steel-blue-400 too (composer-skill-slash-colour).">
        <Specimens min="lg">
          <Specimen wide label="Response_Desktop full / in line Skills, landing" nodeId="7159:535660">
            <div className="cg-landing"><Composer tools elevated skills={SKILLS} defaultValue={ONE} /></div>
          </Specimen>
          <Specimen wide label="Mention token in the pill (collab-chat 05)">
            <div className="cg-bottom"><Composer type="bottom" tools mentions={PEOPLE} defaultValue="@Matt Rivera you own most of those six — which " /></div>
          </Specimen>
        </Specimens>
      </GallerySection>
      <GallerySection title="Trigger and caret" description="Type @ or / at a word start: the composer reports the trigger (kind, query, range) with the caret and anchor boxes, so a picker can open at the caret. Arrow keys and Enter go to the picker through onTriggerKeyDown; Escape dismisses it.">
        <TriggerDemo />
      </GallerySection>
    </>
  )
}

function Attachments() {
  const image = (id: string, status: ComposerAttachment['status']): ComposerAttachment => ({ id, kind: 'image', name: 'Reference.png', src: chart, status })
  const file = (id: string, status: ComposerAttachment['status'], fileType: 'file' | 'pdf' = 'pdf'): ComposerAttachment =>
    ({ id, kind: 'file', name: 'Attachment.pdf', meta: 'PDF · 200 KB', fileType, status })
  return (
    <>
      <GallerySection title="Attachments / Placement=With Reply Box, Size=md" description="Image Thumbnail and File, State=Default / Hover / Loading / Error. Each has the round remove button overhanging its top-right corner.">
        <Specimens min="sm">
          <Specimen label="Image Thumbnail / Default" nodeId="144:37184" surface="primary"><div className="cg-thumb"><AttachmentThumb attachment={image('i1', 'ready')} /></div></Specimen>
          <Specimen label="Image Thumbnail / Hover" nodeId="146:38626" surface="primary"><div className="cg-thumb"><AttachmentThumb attachment={image('i2', 'ready')} hover /></div></Specimen>
          <Specimen label="Image Thumbnail / Loading" nodeId="146:38631" surface="primary"><div className="cg-thumb"><AttachmentThumb attachment={image('i3', 'loading')} /></div></Specimen>
          <Specimen label="Image Thumbnail / Error" surface="primary"><div className="cg-thumb"><AttachmentThumb attachment={image('i4', 'error')} /></div></Specimen>
        </Specimens>
        <Specimens min="md">
          <Specimen label="File / Default (PDF)" surface="primary"><div className="cg-thumb"><AttachmentThumb attachment={file('f1', 'ready')} /></div></Specimen>
          <Specimen label="File / Default (File)" surface="primary"><div className="cg-thumb"><AttachmentThumb attachment={{ ...file('f2', 'ready', 'file'), name: 'Attachment', meta: 'File' }} /></div></Specimen>
          <Specimen label="File / Loading" nodeId="146:38731" surface="primary"><div className="cg-thumb"><AttachmentThumb attachment={file('f3', 'loading')} /></div></Specimen>
          <Specimen label="File / Error" nodeId="146:38679" surface="primary"><div className="cg-thumb"><AttachmentThumb attachment={file('f4', 'error', 'file')} /></div></Specimen>
        </Specimens>
      </GallerySection>
      <GallerySection title="Attachments Desktop" description="The row above the message: scrolls sideways, with the shade at the right edge while more tiles wait past it.">
        <Specimens min="lg">
          <Specimen wide label="Property 1=More Attachments" nodeId="144:37170" surface="primary">
            <div className="cg-bottom"><AttachmentStrip attachments={ATTACHMENTS} /></div>
          </Specimen>
        </Specimens>
      </GallerySection>
    </>
  )
}

function Placeholder() {
  return (
    <GallerySection title="_Text animate Desktop (5546:212948)" description="The empty landing composer rotates through four hints: each holds 4.5s, the field is blank for 0.2s, every change is a 300ms ease-in-out fade with a 2px drop. With reduced motion the hints still change, without the fade.">
      <Specimens min="lg">
        <Specimen wide label="Live (input-large 01)" nodeId="5220:222334">
          <div className="cg-landing"><Composer elevated placeholder={COMPOSER_HINTS} /></div>
        </Specimen>
        {COMPOSER_HINTS.map((h, i) => (
          <Specimen key={h} label={`prop=0${i + 1}`} nodeId={['5546:212949', '5546:212951', '5546:212953', '5546:212955'][i]} surface="primary">
            <span className="cg-hint"><RotatingPlaceholder hints={COMPOSER_HINTS} index={i} /></span>
          </Specimen>
        ))}
      </Specimens>
    </GallerySection>
  )
}

function Playground() {
  const [generating, setGenerating] = useState(false)
  const [files, setFiles] = useState<ComposerAttachment[]>([])
  const [log, setLog] = useState<string[]>([])
  const timers = useRef<number[]>([])
  useEffect(() => () => timers.current.forEach(t => window.clearTimeout(t)), [])
  const say = (line: string) => setLog(l => [line, ...l].slice(0, 6))
  const attach = () => {
    const id = `p${Date.now()}`
    setFiles(f => [...f, { id, kind: 'image', name: 'Reference.png', src: photo, status: 'loading' }])
    timers.current.push(window.setTimeout(() => setFiles(f => f.map(a => (a.id === id ? { ...a, status: 'ready' } : a))), 1500))
  }
  return (
    <GallerySection title="Playground" description="type=&quot;bottom&quot;: type past the pill's width or press Shift+Enter to grow it; + attaches an image (it uploads for 1.5s); Enter sends, which starts a 6s answer during which Enter queues and Stop ends it.">
      <div className="cg-bottom">
        <Composer
          type="bottom" tools skills={SKILLS} mentions={PEOPLE} state={generating ? 'generating' : 'default'}
          attachments={files} onAdd={attach} onRemoveAttachment={id => setFiles(f => f.filter(a => a.id !== id))}
          onSubmit={(text, sent) => {
            say(`sent: "${text}"${sent.length ? ` + ${sent.length} file(s)` : ''}`)
            setFiles([])
            setGenerating(true)
            timers.current.push(window.setTimeout(() => setGenerating(false), 6000))
          }}
          onQueue={(text, queued) => {
            say(`queued: "${text}"${queued.length ? ` + ${queued.length} file(s)` : ''}`)
            setFiles([])
          }}
          onStop={() => { setGenerating(false); say('stopped') }}
        />
      </div>
      <pre className="cg-out" aria-live="polite">{log.join('\n') || 'Nothing sent yet.'}</pre>
    </GallerySection>
  )
}

export default function ComposerGallery() {
  const [sheet] = useUiParam('sheet')
  switch (sheet) {
    case 'states': return <States />
    case 'buttons': return <Buttons />
    case 'tokens': return <Tokens />
    case 'attachments': return <Attachments />
    case 'placeholder': return <Placeholder />
    case 'playground': return <Playground />
    default: return <Types />
  }
}
