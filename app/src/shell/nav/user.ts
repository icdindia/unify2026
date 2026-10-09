import { pick, useFixPredicate } from '../../fixtures/drift'
import { PEOPLE, selfOn } from '../../fixtures/people'

/**
 * The signed-in user in the nav footer and the rail avatar. As drawn, every frame's footer says Anurag Kashyap (the
 * file's placeholder); with fix persona-signed-in it is Roger Bennett, the user the landing page greets (Q1 default).
 */
export function useSignedInUser(): { name: string; initial: string } {
  const applies = useFixPredicate()
  const person = PEOPLE[pick(selfOn('nav'), applies)]
  return { name: person.name, initial: person.initial }
}
