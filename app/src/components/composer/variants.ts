// Copilot desktop Input Box: the local component set 10064:383334 in lqKjNjyifEXCeywg69Knr2. The plan's 5563:230560 is an
// instance of its Type=Bottom small, Tools & Sources=Yes variant (main 10064:383340). The library source file's ids
// (7372:140062 and 7372:140063-140106) do not resolve in this file, so every id here is the local copy's: the set's 44
// children, 10064:383335-383378, read in the bridge in this order. Properties: Type, State, Tools & Sources, Text,
// Attachment (+ the boolean "Inline Skills"). The composer stamps the variant it is showing on its root
// (data-figma-variant, and data-node-id unless the screen passes its instance id), so a dev can go from any rendered
// state to its Figma component.
export const COMPOSER_SET_ID = '10064:383334'

export type VariantProps = {
  Type: 'Landing Page' | 'Bottom small' | 'Bottom large'
  State: 'Default' | 'Generating' | 'Limit exceed'
  'Tools & Sources': 'Yes' | 'No'
  Text: 'Placeholder' | 'One line' | 'Two line' | 'Max line'
  Attachment: 'Yes' | 'No'
}

// "Type|State|Tools|Text|Attachment" -> variant id, from the set's 44 children.
const IDS: Record<string, string> = {
  'Landing Page|Default|No|Placeholder|No': '10064:383335',
  'Bottom small|Generating|No|Placeholder|No': '10064:383336',
  'Bottom small|Default|No|Placeholder|No': '10064:383337',
  'Bottom small|Default|No|One line|No': '10064:383338',
  'Bottom small|Generating|Yes|Placeholder|No': '10064:383339',
  'Bottom small|Default|Yes|Placeholder|No': '10064:383340',
  'Bottom small|Default|Yes|One line|No': '10064:383341',
  'Landing Page|Default|No|Placeholder|Yes': '10064:383342',
  'Landing Page|Default|Yes|Placeholder|No': '10064:383343',
  'Landing Page|Default|Yes|Placeholder|Yes': '10064:383344',
  'Landing Page|Default|No|One line|No': '10064:383345',
  'Bottom large|Default|No|Placeholder|Yes': '10064:383346',
  'Bottom large|Default|Yes|Placeholder|Yes': '10064:383347',
  'Bottom large|Default|No|One line|Yes': '10064:383348',
  'Bottom large|Default|No|Max line|Yes': '10064:383349',
  'Bottom large|Limit exceed|No|Max line|Yes': '10064:383350',
  'Bottom large|Default|No|One line|No': '10064:383351',
  'Bottom large|Default|No|Two line|No': '10064:383352',
  'Bottom large|Default|No|Two line|Yes': '10064:383353',
  'Bottom large|Default|No|Max line|No': '10064:383354',
  'Bottom large|Limit exceed|No|Max line|No': '10064:383355',
  'Bottom large|Default|Yes|One line|Yes': '10064:383356',
  'Bottom large|Default|Yes|Max line|Yes': '10064:383357',
  'Bottom large|Limit exceed|Yes|Max line|Yes': '10064:383358',
  'Bottom large|Default|Yes|One line|No': '10064:383359',
  'Bottom large|Default|Yes|Two line|No': '10064:383360',
  'Bottom large|Default|Yes|Two line|Yes': '10064:383361',
  'Bottom large|Default|Yes|Max line|No': '10064:383362',
  'Bottom large|Limit exceed|Yes|Max line|No': '10064:383363',
  'Landing Page|Default|No|One line|Yes': '10064:383364',
  'Landing Page|Default|Yes|One line|No': '10064:383365',
  'Landing Page|Default|Yes|One line|Yes': '10064:383366',
  'Landing Page|Default|Yes|Two line|No': '10064:383367',
  'Landing Page|Default|Yes|Two line|Yes': '10064:383368',
  'Landing Page|Default|Yes|Max line|No': '10064:383369',
  'Landing Page|Default|Yes|Max line|Yes': '10064:383370',
  'Landing Page|Limit exceed|Yes|Max line|No': '10064:383371',
  'Landing Page|Limit exceed|Yes|Max line|Yes': '10064:383372',
  'Landing Page|Default|No|Two line|No': '10064:383373',
  'Landing Page|Default|No|Two line|Yes': '10064:383374',
  'Landing Page|Default|No|Max line|No': '10064:383375',
  'Landing Page|Default|No|Max line|Yes': '10064:383376',
  'Landing Page|Limit exceed|No|Max line|No': '10064:383377',
  'Landing Page|Limit exceed|No|Max line|Yes': '10064:383378',
}

const key = (v: VariantProps) => [v.Type, v.State, v['Tools & Sources'], v.Text, v.Attachment].join('|')

/** "Type=Bottom small, State=Generating, …" as Figma names the variant. */
export const variantName = (v: VariantProps) =>
  `Type=${v.Type}, State=${v.State}, Tools & Sources=${v['Tools & Sources']}, Text=${v.Text}, Attachment=${v.Attachment}`

/**
 * The variant's node id, or the nearest drawn one: the set has no Generating variant with text, for example, so that
 * falls back to the same type and text in State=Default, then to Placeholder text, then to the set itself.
 */
export function variantId(v: VariantProps): string {
  const tries: VariantProps[] = [v, { ...v, State: 'Default' }, { ...v, Text: 'Placeholder' }, { ...v, State: 'Default', Text: 'Placeholder' }]
  for (const t of tries) {
    const id = IDS[key(t)]
    if (id) return id
  }
  return COMPOSER_SET_ID
}
