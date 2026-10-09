import { useArtifactFix } from './fixes'

export type VersionBannerProps = {
  /** The version on the canvas. */
  version: number
  /** Its "when" ("Yesterday • 14:14"). */
  when: string
  /** Go back to the newest version. */
  onLatest: () => void
}

/**
 * "Viewing v2 · Yesterday • 14:14 — Back to latest": shown between the header and the canvas while an older version is
 * on screen (Q52 default). Not drawn in Figma, so it renders only with fix version-viewing-banner and has no Figma node.
 */
export const VersionBanner = ({ version, when, onLatest }: VersionBannerProps) => {
  const on = useArtifactFix('version-viewing-banner')
  if (!on) return null
  return (
    <div className="vbanner" role="status">
      <span className="vbanner__t">Viewing <b>v{version}</b> · {when}</span>
      <button type="button" className="vbanner__btn" onClick={onLatest}>Back to latest</button>
    </div>
  )
}
