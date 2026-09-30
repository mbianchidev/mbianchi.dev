import cloudNativePgLogo from '@/assets/integrations/cloudnativepg.svg'
import cniLogo from '@/assets/integrations/cni.svg'
import kedaLogo from '@/assets/integrations/keda.svg'
import karpenterLogo from '@/assets/integrations/karpenter.png'
import kubeVirtLogo from '@/assets/integrations/kubevirt.svg'
import awsLogo from '@/assets/integrations/aws.svg'
import microsoftLogo from '@/assets/logos/microsoft.svg'
import type { StaticImageData } from 'next/image'
import {
  siAnsible,
  siArgo,
  siCilium,
  siContainerd,
  siDatadog,
  siDynatrace,
  siEtcd,
  siFlux,
  siGithub,
  siGnubash,
  siGo,
  siGooglecloud,
  siGrafana,
  siHelm,
  siIstio,
  siJenkins,
  siKubernetes,
  siLinux,
  siNextdotjs,
  siNodedotjs,
  siOpentelemetry,
  siOpenjdk,
  siOpentofu,
  siPagerduty,
  siPrometheus,
  siPuppet,
  siPython,
  siQuarkus,
  siReact,
  siSplunk,
  siSpring,
  siTerraform,
  siTypescript,
  siVitess,
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
  | {
      kind: 'image'
      src: StaticImageData
      color: string
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

const imageLogo = (src: StaticImageData, color: string): IntegrationLogo => ({
  kind: 'image',
  src,
  color,
})

const javaLogo = () => simpleLogo(siOpenjdk, '#F89820')

export const integrationGroups: IntegrationGroup[] = [
  {
    id: 'cloud-native',
    title: 'Cloud Native',
    items: [
      { name: 'Google Cloud', logo: simpleLogo(siGooglecloud) },
      { name: 'AWS', logo: assetLogo(awsLogo, '#FF9900', true) },
      { name: 'Azure', logo: assetLogo(microsoftLogo, '#00A4EF') },
      { name: 'Kubernetes', logo: simpleLogo(siKubernetes) },
      { name: 'Cilium', logo: simpleLogo(siCilium) },
      { name: 'Istio', logo: simpleLogo(siIstio) },
      { name: 'Vitess', logo: simpleLogo(siVitess) },
      { name: 'CloudNativePG', logo: assetLogo(cloudNativePgLogo, '#692ACA') },
      { name: 'Helm', logo: simpleLogo(siHelm) },
      { name: 'KubeVirt', logo: assetLogo(kubeVirtLogo, '#00AAB2') },
      { name: 'KEDA', logo: assetLogo(kedaLogo, '#326DE6') },
      { name: 'Karpenter', logo: imageLogo(karpenterLogo, '#326DE6') },
      { name: 'etcd', logo: simpleLogo(siEtcd) },
      { name: 'containerd', logo: simpleLogo(siContainerd) },
      { name: 'CNI', logo: assetLogo(cniLogo, '#00B0AD') },
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
      { name: 'Argo CD', logo: simpleLogo(siArgo) },
      { name: 'Flux CD', logo: simpleLogo(siFlux) },
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
    ],
  },
]

export const integrationCount = integrationGroups.reduce(
  (count, group) => count + group.items.length,
  0
)
