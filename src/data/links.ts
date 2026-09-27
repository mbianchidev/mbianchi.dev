export type PublicLinkIcon = 'mentor' | 'youtube' | 'github'

export interface PublicLink {
  service: string
  title: string
  description: string
  href: string
  icon: PublicLinkIcon
}

interface LinksPageConfig {
  handle: string
  description: string
  links: PublicLink[]
}

export const linksPageConfig: LinksPageConfig = {
  handle: '@mbianchidev',
  description:
    'Senior engineer. Builds platforms and software, contributes to open source, and occasionally explains distributed systems to humans.',
  links: [
    {
      service: 'MentorCruise',
      title: 'You getting mentored (by me)',
      description: 'One-to-one mentorship for engineers stuck on the next hard thing.',
      href: 'https://mentorcruise.com/mentor/matteobianchi',
      icon: 'mentor',
    },
    {
      service: 'YouTube',
      title: 'Me yapping about stuff',
      description: 'Cloud native, open source, platforms, and too many opinions with diagrams.',
      href: 'https://youtube.com/mbianchidev',
      icon: 'youtube',
    },
    {
      service: 'GitHub',
      title: 'Spaghetti code, publicly auditable',
      description: 'Repositories, upstream pull requests, experiments, and evidence.',
      href: 'https://github.com/mbianchidev',
      icon: 'github',
    },
  ],
}
