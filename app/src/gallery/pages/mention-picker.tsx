import { useRef, useState } from 'react'
import { Composer, type ComposerHandle } from '../../components/composer'
import { useMentionPicker } from '../../components/mention-picker'
import type { MentionTarget, PersonId } from '../../fixtures/people'
import { GallerySection, Specimen, Specimens } from '../GalleryPage'
import type { GalleryMeta } from '../registry'
import './chat-messages.css'

export const meta: GalleryMeta = {
  title: 'Mention picker',
  figmaNodeIds: ['11832:31555', '11831:300413', '5129:473345'],
  group: 'Chat',
  description:
    'Type "@" in the composer: the Assistant first, then the chat\'s participants, filtered by the letters after the "@" ' +
    '(word starts first, then anywhere). The list opens over the "@" (176 wide, 4px left of it, 4px above its line), ' +
    'the field keeps focus as a combobox: ArrowUp / ArrowDown move, Enter or Tab inserts the blue token, Escape or a ' +
    'click outside closes it. As designed the full list misspells "John Whitake" and the filtered one "Mace Coleman".',
}

const PEOPLE: PersonId[] = ['matt-rivera', 'john-whitaker', 'grace-coleman']

function Wired({ text, hover, label }: { text?: string; hover?: MentionTarget; label: string }) {
  const handle = useRef<ComposerHandle>(null)
  const [picked, setPicked] = useState<string | null>(null)
  const mention = useMentionPicker({ composer: handle, participants: PEOPLE, hoverId: hover, onPick: t => setPicked(t) })
  return (
    <div className="cmg-stack">
      <Composer
        type="bottom" tools handleRef={handle} defaultValue={text} label={label} mentions={mention.names}
        onTrigger={mention.onTrigger} onTriggerKeyDown={mention.onTriggerKeyDown}
      />
      {mention.picker}
      <p aria-live="polite">{picked ? `Inserted @${picked}` : 'Type @ to mention a participant.'}</p>
    </div>
  )
}

export default function MentionPickerGallery() {
  return (
    <>
      <GallerySection title="In the composer" description="A live composer wired with useMentionPicker. The list is portalled into the overlay layer and follows the caret.">
        <Specimens min="lg">
          <Specimen wide label="Live" surface="primary" overflow="visible">
            <div className="cmg-col cmg-col--pad"><Wired label="Message (type @)" /></div>
          </Specimen>
        </Specimens>
      </GallerySection>
      <GallerySection title="Review states" description="The composer presets of chat-artifact 10 (compose=at) and 11 (compose=at-m, hover=mention:matt): the list opens on load.">
        <Specimens min="lg">
          <Specimen wide label="Full list: Assistant, Matt Rivera, John Whitake(r), Grace Coleman (chat-artifact 10)" nodeId="11832:31555" surface="primary" overflow="visible">
            <div className="cmg-col cmg-col--pad"><Wired text="@" label="Message, full list" /></div>
          </Specimen>
          <Specimen wide label={'"@m": Matt Rivera (State=Hover), Mace / Grace Coleman (chat-artifact 11)'} nodeId="11831:300414" surface="primary" overflow="visible">
            <div className="cmg-col cmg-col--pad"><Wired text="@m" hover="matt-rivera" label="Message, filtered list" /></div>
          </Specimen>
        </Specimens>
      </GallerySection>
    </>
  )
}
