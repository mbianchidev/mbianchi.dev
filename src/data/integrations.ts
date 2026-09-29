import amazonLogo from '@/assets/logos/amazon.svg'
import microsoftLogo from '@/assets/logos/microsoft.svg'
import type { StaticImageData } from 'next/image'
import {
  siAnsible,
  siArgo,
  siCilium,
  siDatadog,
  siDynatrace,
  siFlux,
  siGithub,
  siGnubash,
  siGo,
  siGooglecloud,
  siGrafana,
  siIstio,
  siJenkins,
  siKubernetes,
  siLaravel,
  siLinux,
  siNextdotjs,
  siNodedotjs,
  siOpentelemetry,
  siOpenjdk,
  siOpentofu,
  siPagerduty,
  siPhp,
  siPrometheus,
  siPuppet,
  siPython,
  siQuarkus,
  siReact,
  siSplunk,
  siSpring,
  siTerraform,
  siTypescript,
  type SimpleIcon,
} from 'simple-icons'

export type IntegrationLogo =
  | {
      kind: 'simple'
      icon: SimpleIcon
      color: string
    }
  | {
      kind: 'asset'
      src: StaticImageData
      color: string
      wide?: boolean
    }

export interface IntegrationItem {
  name: string
  logo: IntegrationLogo
}

export interface IntegrationGroup {
  id: string
  title: string
  items: IntegrationItem[]
}

const simpleLogo = (icon: SimpleIcon, color = `#${icon.hex}`): IntegrationLogo => ({
  kind: 'simple',
  icon,
  color,
})

const assetLogo = (
  src: StaticImageData,
  color: string,
  wide = false
): IntegrationLogo => ({
  kind: 'asset',
  src,
  color,
  wide,
})

const javaLogo = () => simpleLogo(siOpenjdk, '#F89820')

export const integrationGroups: IntegrationGroup[] = [
  {
    id: 'cloud-network',
    title: 'Cloud, orchestration & networking',
    items: [
      { name: 'Google Cloud', logo: simpleLogo(siGooglecloud) },
      { name: 'AWS', logo: assetLogo(amazonLogo, '#FF9900', true) },
      { name: 'Azure', logo: assetLogo(microsoftLogo, '#00A4EF') },
      { name: 'Azure AKS', logo: assetLogo(microsoftLogo, '#326CE5') },
      { name: 'Kubernetes', logo: simpleLogo(siKubernetes) },
      { name: 'Argo CD', logo: simpleLogo(siArgo) },
      { name: 'Flux CD', logo: simpleLogo(siFlux) },
      { name: 'Cilium', logo: simpleLogo(siCilium) },
      { name: 'Istio', logo: simpleLogo(siIstio) },
    ],
  },
  {
    id: 'observability',
    title: 'Observability & incident response',
    items: [
      { name: 'Grafana', logo: simpleLogo(siGrafana) },
      { name: 'Prometheus', logo: simpleLogo(siPrometheus) },
      { name: 'OpenTelemetry', logo: simpleLogo(siOpentelemetry) },
      { name: 'Dynatrace', logo: simpleLogo(siDynatrace) },
      { name: 'Datadog', logo: simpleLogo(siDatadog) },
      { name: 'PagerDuty', logo: simpleLogo(siPagerduty) },
      { name: 'Splunk', logo: simpleLogo(siSplunk) },
    ],
  },
  {
    id: 'delivery',
    title: 'Infrastructure & delivery',
    items: [
      { name: 'Terraform', logo: simpleLogo(siTerraform) },
      { name: 'OpenTofu', logo: simpleLogo(siOpentofu) },
      { name: 'Ansible', logo: simpleLogo(siAnsible) },
      { name: 'Puppet', logo: simpleLogo(siPuppet) },
      { name: 'Jenkins', logo: simpleLogo(siJenkins) },
      { name: 'GitHub', logo: simpleLogo(siGithub, '#FFFFFF') },
      { name: 'Linux', logo: simpleLogo(siLinux) },
    ],
  },
  {
    id: 'code',
    title: 'Languages & frameworks',
    items: [
      { name: 'Python', logo: simpleLogo(siPython) },
      { name: 'TypeScript', logo: simpleLogo(siTypescript) },
      { name: 'React', logo: simpleLogo(siReact) },
      { name: 'Next.js', logo: simpleLogo(siNextdotjs, '#FFFFFF') },
      { name: 'Node.js', logo: simpleLogo(siNodedotjs) },
      { name: 'Go', logo: simpleLogo(siGo) },
      { name: 'Bash', logo: simpleLogo(siGnubash) },
      { name: 'Java', logo: javaLogo() },
      { name: 'Spring', logo: simpleLogo(siSpring) },
      { name: 'Quarkus', logo: simpleLogo(siQuarkus) },
      { name: 'PHP', logo: simpleLogo(siPhp) },
      { name: 'Laravel', logo: simpleLogo(siLaravel) },
      { name: 'EJB', logo: javaLogo() },
      { name: 'JSP', logo: javaLogo() },
    ],
  },
]

export const integrationCount = integrationGroups.reduce(
  (count, group) => count + group.items.length,
  0
)
