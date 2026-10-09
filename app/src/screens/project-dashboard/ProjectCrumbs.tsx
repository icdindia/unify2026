import { Breadcrumb } from '../../components'
import { useProjectFix } from '../../fixes/projects'
import { navigate } from '../../router/router'
import type { Project } from '../../data/projects'

/**
 * "Projects / <project> ⌄" in the shell's top strip. "Projects" goes back to the landing. As designed the current crumb
 * is the frame's placeholder "New Project Name"; the "crumb-shows-project-name" fix shows the project's name.
 */
export function ProjectCrumbs({ project }: { project: Project }) {
  const fixed = useProjectFix('crumb-shows-project-name')
  const label = fixed ? project.name : project.crumbAsDesigned ?? project.name
  return (
    <Breadcrumb
      className={fixed ? 'pd-crumbs' : 'pd-crumbs pd-crumbs--drawn'}
      items={[
        { label: 'Projects', onClick: () => navigate('/projects') },
        { label, current: true, menu: true },
      ]}
    />
  )
}
