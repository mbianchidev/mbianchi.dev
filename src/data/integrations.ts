import aksLogo from '@/assets/integrations/aks.svg'
import awsLambdaLogo from '@/assets/integrations/aws-lambda.svg'
import awsLogo from '@/assets/integrations/aws.svg'
import azureDevOpsLogo from '@/assets/integrations/azure-devops.svg'
import azureLogo from '@/assets/integrations/azure.svg'
import cloudNativePgLogo from '@/assets/integrations/cloudnativepg.svg'
import cniLogo from '@/assets/integrations/cni.svg'
import crossplaneLogo from '@/assets/integrations/crossplane.svg'
import csharpLogo from '@/assets/integrations/csharp.svg'
import foremanLogo from '@/assets/integrations/foreman.svg'
import karpenterLogo from '@/assets/integrations/karpenter.png'
import kedaLogo from '@/assets/integrations/keda.svg'
import kubeVirtLogo from '@/assets/integrations/kubevirt.svg'
import openAiLogo from '@/assets/integrations/openai.svg'
import oracleLogo from '@/assets/integrations/oracle.svg'
import portLogo from '@/assets/integrations/port.svg'
import salesforceLogo from '@/assets/integrations/salesforce.svg'
import vsphereLogo from '@/assets/integrations/vmware-vsphere.svg'
import type { StaticImageData } from 'next/image'
import {
  siAngular,
  siAnsible,
  siAnthropic,
  siApachekafka,
  siArgo,
  siBackstage,
  siCilium,
  siContainerd,
  siCplusplus,
  siDatadog,
  siDocker,
  siDotnet,
  siDynatrace,
  siEtcd,
  siFlux,
  siGithub,
  siGithubactions,
  siGithubcopilot,
  siGitlab,
  siGnubash,
  siGo,
  siGooglecloud,
  siGrafana,
  siHelm,
  siIstio,
  siJavascript,
  siJenkins,
  siKubernetes,
  siLaravel,
  siLinux,
  siModelcontextprotocol,
  siNewrelic,
  siNextdotjs,
  siNodedotjs,
  siOpencode,
  siOpenjdk,
  siOpentelemetry,
  siOpentofu,
  siOpsgenie,
  siPagerduty,
  siPhp,
  siPrometheus,
  siPuppet,
  siPython,
  siQuarkus,
  siRabbitmq,
  siReact,
  siRedhatopenshift,
  siRust,
  siSap,
  siSpinnaker,
  siSplunk,
  siSpring,
  siTerraform,
  siTypescript,
  siVitess,
  type SimpleIcon,
} from 'simple-icons'

export type IntegrationMarkSize = 'square' | 'wide' | 'wordmark'

export type IntegrationLogo =
  | {
      kind: 'simple'
      icon: SimpleIcon
      color: string
      size: IntegrationMarkSize
      viewBox: string
    }
  | {
      kind: 'asset'
      src: StaticImageData
      color: string
      size: IntegrationMarkSize
    }
  | {
      kind: 'image'
      src: StaticImageData
      color: string
    }

export interface IntegrationItem {
  id: string
  name: string
  logo: IntegrationLogo
}

export interface IntegrationSubcategory {
  id: string
  title: string
  items: IntegrationItem[]
}

export interface IntegrationGroup {
  id: string
  title: string
  landscape: boolean
  subcategories: IntegrationSubcategory[]
}

const panelBackground = '#0A0A0B'
const fallbackColor = '#FFFFFF'
const minimumContrast = 3

function relativeLuminance(hex: string) {
  const channels = hex
    .replace('#', '')
    .match(/.{2}/g)!
    .map((channel) => {
      const value = parseInt(channel, 16) / 255
      return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4
    })

  return 0.2126 * channels[0] + 0.7152 * channels[1] + 0.0722 * channels[2]
}

// Brand colours that disappear on the dark panel fall back to Signal White on hover.
function readableColor(hex: string) {
  const lighter = Math.max(relativeLuminance(hex), relativeLuminance(panelBackground))
  const darker = Math.min(relativeLuminance(hex), relativeLuminance(panelBackground))
  return (lighter + 0.05) / (darker + 0.05) >= minimumContrast ? hex : fallbackColor
}

interface SimpleLogoOptions {
  color?: string
  size?: IntegrationMarkSize
  // Crops wordmark icons to their artwork so they do not render as a thin strip.
  viewBox?: string
}

const simpleLogo = (
  icon: SimpleIcon,
  { color = `#${icon.hex}`, size = 'square', viewBox = '0 0 24 24' }: SimpleLogoOptions = {}
): IntegrationLogo => ({
  kind: 'simple',
  icon,
  color: readableColor(color),
  size,
  viewBox,
})

const assetLogo = (
  src: StaticImageData,
  color: string,
  size: IntegrationMarkSize = 'square'
): IntegrationLogo => ({
  kind: 'asset',
  src,
  color: readableColor(color),
  size,
})

const imageLogo = (src: StaticImageData, color: string): IntegrationLogo => ({
  kind: 'image',
  src,
  color: readableColor(color),
})

// Cloud-native groups follow the CNCF landscape (landscape.cncf.io) categories; functional
// groups such as Dev Platform and SRE take precedence for the tools they list.
export const integrationGroups: IntegrationGroup[] = [
  {
    id: 'provisioning',
    title: 'Provisioning',
    landscape: true,
    subcategories: [
      {
        id: 'automation-configuration',
        title: 'Automation & Configuration',
        items: [
          { id: 'terraform', name: 'Terraform', logo: simpleLogo(siTerraform) },
          { id: 'opentofu', name: 'OpenTofu', logo: simpleLogo(siOpentofu) },
          { id: 'ansible', name: 'Ansible', logo: simpleLogo(siAnsible) },
          { id: 'puppet', name: 'Puppet', logo: simpleLogo(siPuppet) },
          { id: 'foreman', name: 'Foreman', logo: assetLogo(foremanLogo, '#DDBE0C') },
          { id: 'vmware-vsphere', name: 'VMware vSphere', logo: assetLogo(vsphereLogo, '#0091DA') },
        ],
      },
    ],
  },
  {
    id: 'runtime',
    title: 'Runtime',
    landscape: true,
    subcategories: [
      {
        id: 'container-runtime',
        title: 'Container Runtime',
        items: [
          { id: 'containerd', name: 'containerd', logo: simpleLogo(siContainerd) },
        ],
      },
      {
        id: 'cloud-native-network',
        title: 'Cloud Native Network',
        items: [
          { id: 'cilium', name: 'Cilium', logo: simpleLogo(siCilium) },
          { id: 'cni', name: 'CNI', logo: assetLogo(cniLogo, '#00B0AD') },
        ],
      },
    ],
  },
  {
    id: 'orchestration-management',
    title: 'Orchestration & Management',
    landscape: true,
    subcategories: [
      {
        id: 'scheduling-orchestration',
        title: 'Scheduling & Orchestration',
        items: [
          { id: 'kubernetes', name: 'Kubernetes', logo: simpleLogo(siKubernetes) },
        ],
      },
      {
        id: 'autoscaling',
        title: 'Autoscaling',
        items: [
          { id: 'keda', name: 'KEDA', logo: assetLogo(kedaLogo, '#326DE6') },
          { id: 'karpenter', name: 'Karpenter', logo: imageLogo(karpenterLogo, '#326DE6') },
        ],
      },
      {
        id: 'coordination-service-discovery',
        title: 'Coordination & Service Discovery',
        items: [
          { id: 'etcd', name: 'etcd', logo: simpleLogo(siEtcd) },
        ],
      },
      {
        id: 'service-mesh',
        title: 'Service Mesh',
        items: [
          { id: 'istio', name: 'Istio', logo: simpleLogo(siIstio) },
        ],
      },
    ],
  },
  {
    id: 'app-definition-development',
    title: 'App Definition & Development',
    landscape: true,
    subcategories: [
      {
        id: 'database',
        title: 'Database',
        items: [
          { id: 'vitess', name: 'Vitess', logo: simpleLogo(siVitess) },
          {
            id: 'cloudnativepg',
            name: 'CloudNativePG',
            logo: assetLogo(cloudNativePgLogo, '#692ACA'),
          },
        ],
      },
      {
        id: 'streaming-messaging',
        title: 'Streaming & Messaging',
        items: [
          { id: 'kafka', name: 'Apache Kafka', logo: simpleLogo(siApachekafka) },
          { id: 'rabbitmq', name: 'RabbitMQ', logo: simpleLogo(siRabbitmq) },
        ],
      },
      {
        id: 'application-definition-image-build',
        title: 'Application Definition & Image Build',
        items: [
          { id: 'helm', name: 'Helm', logo: simpleLogo(siHelm) },
          { id: 'kubevirt', name: 'KubeVirt', logo: assetLogo(kubeVirtLogo, '#00AAB2') },
          { id: 'docker-compose', name: 'Docker Compose', logo: simpleLogo(siDocker) },
        ],
      },
      {
        id: 'continuous-integration-delivery',
        title: 'Continuous Integration & Delivery',
        items: [
          { id: 'argo-cd', name: 'Argo CD', logo: simpleLogo(siArgo) },
          { id: 'flux', name: 'Flux CD', logo: simpleLogo(siFlux) },
          { id: 'github-actions', name: 'GitHub Actions', logo: simpleLogo(siGithubactions) },
          { id: 'gitlab', name: 'GitLab', logo: simpleLogo(siGitlab) },
          { id: 'azure-devops', name: 'Azure DevOps', logo: assetLogo(azureDevOpsLogo, '#0078D4') },
          { id: 'jenkins', name: 'Jenkins', logo: simpleLogo(siJenkins) },
          { id: 'spinnaker', name: 'Spinnaker', logo: simpleLogo(siSpinnaker) },
        ],
      },
    ],
  },
  {
    id: 'platform',
    title: 'Platform',
    landscape: true,
    subcategories: [
      {
        id: 'certified-kubernetes-distribution',
        title: 'Certified Kubernetes - Distribution',
        items: [
          { id: 'openshift', name: 'Red Hat OpenShift', logo: simpleLogo(siRedhatopenshift) },
        ],
      },
      {
        id: 'certified-kubernetes-hosted',
        title: 'Certified Kubernetes - Hosted',
        items: [
          { id: 'aks', name: 'Azure Kubernetes Service', logo: assetLogo(aksLogo, '#814B99') },
        ],
      },
    ],
  },
  {
    id: 'serverless',
    title: 'Serverless',
    landscape: true,
    subcategories: [
      {
        id: 'hosted-platform',
        title: 'Hosted Platform',
        items: [
          { id: 'aws-lambda', name: 'AWS Lambda', logo: assetLogo(awsLambdaLogo, '#FF9900') },
        ],
      },
    ],
  },
  {
    id: 'observability-analysis',
    title: 'Observability & Analysis',
    landscape: true,
    subcategories: [
      {
        id: 'observability',
        title: 'Observability',
        items: [
          { id: 'prometheus', name: 'Prometheus', logo: simpleLogo(siPrometheus) },
          {
            id: 'opentelemetry',
            name: 'OpenTelemetry',
            logo: simpleLogo(siOpentelemetry),
          },
          { id: 'grafana', name: 'Grafana', logo: simpleLogo(siGrafana) },
          { id: 'datadog', name: 'Datadog', logo: simpleLogo(siDatadog) },
          { id: 'dynatrace', name: 'Dynatrace', logo: simpleLogo(siDynatrace) },
          { id: 'new-relic', name: 'New Relic', logo: simpleLogo(siNewrelic) },
          { id: 'splunk', name: 'Splunk', logo: simpleLogo(siSplunk, { size: 'wordmark', viewBox: '0 8.44 24 7.12' }) },
        ],
      },
    ],
  },
  {
    id: 'dev-platform',
    title: 'Dev Platform',
    landscape: false,
    subcategories: [
      {
        id: 'developer-portals',
        title: 'Developer portals',
        items: [
          { id: 'port', name: 'Port', logo: assetLogo(portLogo, '#FFFFFF') },
          { id: 'backstage', name: 'Backstage', logo: simpleLogo(siBackstage) },
        ],
      },
      {
        id: 'platform-orchestration',
        title: 'Platform orchestration',
        items: [
          { id: 'crossplane', name: 'Crossplane', logo: assetLogo(crossplaneLogo, '#F3807B') },
        ],
      },
      {
        id: 'code-collaboration',
        title: 'Code & collaboration',
        items: [
          { id: 'github', name: 'GitHub', logo: simpleLogo(siGithub) },
        ],
      },
    ],
  },
  {
    id: 'sre',
    title: 'SRE',
    landscape: false,
    subcategories: [
      {
        id: 'incident-response-on-call',
        title: 'Incident response & on-call',
        items: [
          { id: 'pagerduty', name: 'PagerDuty', logo: simpleLogo(siPagerduty) },
          { id: 'opsgenie', name: 'Opsgenie', logo: simpleLogo(siOpsgenie) },
        ],
      },
    ],
  },
  {
    id: 'ai',
    title: 'AI',
    landscape: false,
    subcategories: [
      {
        id: 'coding-agents',
        title: 'Coding agents',
        items: [
          { id: 'github-copilot', name: 'GitHub Copilot', logo: simpleLogo(siGithubcopilot) },
          { id: 'opencode', name: 'OpenCode', logo: simpleLogo(siOpencode) },
        ],
      },
      {
        id: 'model-providers',
        title: 'Model providers',
        items: [
          { id: 'openai', name: 'OpenAI', logo: assetLogo(openAiLogo, '#FFFFFF') },
          { id: 'anthropic', name: 'Anthropic', logo: simpleLogo(siAnthropic) },
        ],
      },
      {
        id: 'agent-protocols',
        title: 'Agent protocols',
        items: [
          {
            id: 'model-context-protocol',
            name: 'Model Context Protocol',
            logo: simpleLogo(siModelcontextprotocol),
          },
        ],
      },
    ],
  },
  {
    id: 'beyond-the-landscape',
    title: 'Beyond the landscape',
    landscape: false,
    subcategories: [
      {
        id: 'clouds-hosts',
        title: 'Clouds & hosts',
        items: [
          { id: 'aws', name: 'AWS', logo: assetLogo(awsLogo, '#FF9900', 'wide') },
          { id: 'azure', name: 'Microsoft Azure', logo: assetLogo(azureLogo, '#0089D6') },
          { id: 'google-cloud', name: 'Google Cloud', logo: simpleLogo(siGooglecloud) },
          { id: 'linux', name: 'Linux', logo: simpleLogo(siLinux) },
        ],
      },
      {
        id: 'enterprise-systems',
        title: 'Enterprise systems',
        items: [
          { id: 'salesforce', name: 'Salesforce', logo: assetLogo(salesforceLogo, '#00A1E0') },
          { id: 'sap', name: 'SAP', logo: simpleLogo(siSap, { size: 'wide', viewBox: '0 6.06 24 11.87' }) },
          { id: 'oracle-database', name: 'Oracle Database', logo: assetLogo(oracleLogo, '#EA1B22', 'wordmark') },
        ],
      },
      {
        id: 'languages',
        title: 'Languages',
        items: [
          { id: 'go', name: 'Go', logo: simpleLogo(siGo, { size: 'wide', viewBox: '0 7.52 24 8.97' }) },
          { id: 'python', name: 'Python', logo: simpleLogo(siPython) },
          { id: 'typescript', name: 'TypeScript', logo: simpleLogo(siTypescript) },
          { id: 'javascript', name: 'JavaScript', logo: simpleLogo(siJavascript) },
          { id: 'java', name: 'Java', logo: simpleLogo(siOpenjdk, { color: '#F89820' }) },
          { id: 'rust', name: 'Rust', logo: simpleLogo(siRust) },
          { id: 'bash', name: 'Bash', logo: simpleLogo(siGnubash) },
          { id: 'php', name: 'PHP', logo: simpleLogo(siPhp) },
          { id: 'cplusplus', name: 'C++', logo: simpleLogo(siCplusplus) },
          { id: 'csharp', name: 'C#', logo: assetLogo(csharpLogo, '#9B4F96') },
        ],
      },
      {
        id: 'frameworks-runtimes',
        title: 'Frameworks & runtimes',
        items: [
          { id: 'nodejs', name: 'Node.js', logo: simpleLogo(siNodedotjs) },
          { id: 'react', name: 'React', logo: simpleLogo(siReact) },
          { id: 'nextjs', name: 'Next.js', logo: simpleLogo(siNextdotjs) },
          { id: 'angular', name: 'Angular', logo: simpleLogo(siAngular) },
          { id: 'spring', name: 'Spring', logo: simpleLogo(siSpring) },
          { id: 'quarkus', name: 'Quarkus', logo: simpleLogo(siQuarkus) },
          { id: 'dotnet', name: '.NET', logo: simpleLogo(siDotnet, { size: 'wide', viewBox: '0 7.53 24 8.94' }) },
          { id: 'laravel', name: 'Laravel', logo: simpleLogo(siLaravel) },
        ],
      },
    ],
  },
]

export const countGroupIntegrations = (group: IntegrationGroup) =>
  group.subcategories.reduce((count, subcategory) => count + subcategory.items.length, 0)

export const integrationCount = integrationGroups.reduce(
  (count, group) => count + countGroupIntegrations(group),
  0
)
