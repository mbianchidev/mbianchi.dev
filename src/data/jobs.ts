export interface CareerRole {
  id: string
  slug: string
  title: string
  description: string
  skills: string[]
  level: string
  scope: string
  mandate: string[]
  responsibilities: string[]
  requirements: string[]
  success: string[]
  evidence: string[]
}

export const careerRoles: CareerRole[] = [
  {
    id: 'platform',
    slug: 'platform-engineer',
    title: 'Senior/Staff Platform Engineer',
    description:
      'Developer platforms, Kubernetes, infrastructure as code, reliability, and self-service people do not need a ticket to use.',
    skills: ['Platform engineering', 'Kubernetes', 'IaC', 'SRE'],
    level: 'Senior / Staff',
    scope: 'Platform product',
    mandate: [
      'Build and evolve an internal developer platform that turns cloud, Kubernetes, delivery, security, and observability capabilities into paved roads teams actively choose.',
      'This is a staff-shaped individual-contributor role: own ambiguous cross-team problems, set technical direction, stay hands-on in APIs and tooling, and treat developers as users rather than ticket submitters.',
    ],
    responsibilities: [
      'Own the platform architecture and roadmap with a product mindset, balancing developer experience, reliability, security, and cost.',
      'Build self-service APIs, CLIs, templates, and golden paths for provisioning environments, shipping software, and operating services.',
      'Standardize infrastructure as code, GitOps, CI/CD, secrets, policy, observability, and Kubernetes lifecycle practices without hiding useful escape hatches.',
      'Interview platform users, measure adoption and lead time, and remove friction based on evidence rather than platform-team intuition.',
      'Mentor engineers and influence application, security, SRE, and product teams without relying on hierarchy.',
    ],
    requirements: [
      'Deep production experience with Kubernetes and at least one major public cloud; multi-cloud experience is useful when it comes with restraint.',
      'Strong software engineering in Go, Python, TypeScript, or Java, including API and distributed-system design.',
      'Hands-on experience with Terraform or OpenTofu, GitOps, CI/CD, observability, and secure software supply chains.',
      'A record of building platforms for other engineers and improving adoption, not only operating infrastructure.',
      'Clear technical writing, architecture communication, and the ability to lead decisions across teams.',
    ],
    success: [
      'New services and environments can be created safely without queueing for a platform ticket.',
      'Developer onboarding and deployment lead time drop while platform adoption and user satisfaction rise.',
      'Reliability, security, and cost improve without turning the platform into a mandatory abstraction tax.',
      'Teams understand the paved road, the escape hatches, and the trade-offs behind both.',
    ],
    evidence: [
      'Built platform APIs and zero-touch onboarding for 70+ engineers across six product teams.',
      'Helped operate infrastructure and APIs used by more than 10 million people every day.',
      'Co-founded KubeLab and moved a multi-cloud Kubernetes platform from idea to MVP.',
      'Delivered Platform Engineering and Kubernetes training to 500+ alumni with 95% surveyed CSAT.',
    ],
  },
  {
    id: 'sre',
    slug: 'site-reliability-engineer',
    title: 'Site Reliability Engineer',
    description:
      'Production reliability, observability, incident response, performance, and automation for systems people depend on.',
    skills: ['SRE', 'Observability', 'Incident response', 'Performance'],
    level: 'Senior / Staff',
    scope: 'Reliability systems',
    mandate: [
      'Make reliability an engineering discipline: define service objectives, automate operational work, improve system resilience, and create incident practices that make the organisation safer rather than quieter.',
      'The role stays close to code and architecture. It should reduce toil and failure modes, not become a permanent escalation queue.',
    ],
    responsibilities: [
      'Define and evolve SLOs, error budgets, service health indicators, and reliability reporting with product and engineering teams.',
      'Design observability across metrics, logs, traces, alerting, and user journeys so pages are actionable and failures are diagnosable.',
      'Lead incident command, blameless reviews, and follow-through on systemic corrective work.',
      'Build automation for deployment, recovery, capacity, performance, and repetitive operational workflows.',
      'Partner with software and platform teams on resilience, disaster recovery, cost, scalability, and safe change management.',
    ],
    requirements: [
      'Strong Linux, cloud, Kubernetes, networking, and distributed-systems fundamentals.',
      'Production coding ability in Go, Python, Java, or another systems language; shell scripts alone are not the reliability strategy.',
      'Experience with Prometheus, Grafana, OpenTelemetry, Datadog, Dynatrace, Splunk, or comparable observability systems.',
      'Calm incident leadership and the ability to communicate clearly with engineers, leaders, customers, and support teams.',
      'A track record of reducing toil and recurrence through software, architecture, and operating-model changes.',
    ],
    success: [
      'Customer-impacting incidents become less frequent, shorter, and easier to understand.',
      'Alerts map to user impact and an actionable response instead of creating background anxiety.',
      'Operational toil decreases while safe deployment velocity increases.',
      'Teams use SLOs and post-incident learning to make real prioritisation decisions.',
    ],
    evidence: [
      'Led reliability for products serving 10M+ daily users across Europe, North America, and Latin America.',
      'Prevented an estimated €10M+ in SLA breach costs while operating as an incident commander.',
      'Reduced cloud costs by 30–40% while improving application performance by 15–20%.',
      'Reduced bugs and incident impact by about 30% through delivery, observability, alerting, and supply-chain improvements.',
    ],
  },
  {
    id: 'software',
    slug: 'software-engineer',
    title: 'Senior/Staff Software Engineer',
    description:
      'APIs, services, CLIs, interfaces, automation, and system design in Go, Python, TypeScript, Rust, and React.',
    skills: ['Go', 'Python', 'TypeScript', 'Rust'],
    level: 'Senior / Staff',
    scope: 'Software systems',
    mandate: [
      'Own consequential software problems from architecture through operation: APIs, services, CLIs, interfaces, and automation that connect technical quality to a measurable product or business outcome.',
      'The role should combine staff-level technical direction with hands-on delivery, improving the surrounding system rather than optimising one isolated repository.',
    ],
    responsibilities: [
      'Design and build reliable APIs, services, event-driven workflows, CLIs, and product interfaces.',
      'Lead architecture decisions across performance, security, data, operability, and long-term maintainability.',
      'Raise engineering quality through tests, reviews, observability, documentation, and deliberate simplification.',
      'Work directly with users, product, and customer-facing teams to turn ambiguous needs into shipped software.',
      'Mentor engineers, unblock complex delivery, and improve standards across multiple teams or domains.',
    ],
    requirements: [
      'Strong software fundamentals and substantial production experience in more than one programming ecosystem.',
      'Experience designing APIs and distributed systems that are observable, secure, and operable under real load.',
      'Comfort moving between backend, infrastructure, automation, and enough frontend work to finish the product.',
      'Good judgement about build versus buy, abstraction boundaries, migrations, and technical debt.',
      'The communication skills to explain trade-offs to both engineers and non-engineering stakeholders.',
    ],
    success: [
      'Complex product work ships in understandable increments without creating a maintenance trap.',
      'System performance, reliability, and developer velocity improve together.',
      'Architecture decisions remain legible after the original author leaves the room.',
      'Teams spend less time compensating for unclear ownership, brittle interfaces, and repeated manual work.',
    ],
    evidence: [
      'Built platform APIs, services, and automation used by 70+ engineers and millions of end users.',
      'Worked across Java, PHP and Laravel, TypeScript and React, Node.js, Go, Python, and Linux since 2015.',
      'Built cloud and application systems across healthcare, SaaS, government, media, fashion, and developer tooling.',
      'Created an internal assistant that removed 20–25% of recurring Solutions Engineering work.',
    ],
  },
  {
    id: 'ai-automation',
    slug: 'ai-engineer',
    title: 'AI Engineer, Developer Automation',
    description:
      'Agents, assistants, MCP integrations, and automation for jobs people already do. No chatbot looking for a reason to exist.',
    skills: ['AI agents', 'MCP', 'Automation', 'Evaluation'],
    level: 'Senior / Staff',
    scope: 'Agentic systems',
    mandate: [
      'Build agentic systems around real workflows, tools, and data, with measurable value, explicit human ownership, and enough evaluation to know when the system is useful or wrong.',
      'This is software engineering with probabilistic components, not a prompt-writing role. Security, observability, failure handling, and product adoption remain first-class concerns.',
    ],
    responsibilities: [
      'Map repeated work before automating it, then choose where deterministic software, LLMs, or human judgement should own each step.',
      'Build agents and assistants that use APIs, MCP servers, internal tools, and governed data sources safely.',
      'Create evaluation datasets, quality gates, tracing, feedback loops, and production observability for model behaviour.',
      'Design permission boundaries, auditability, data protection, and human approval for consequential actions.',
      'Work with users and domain experts to ship, measure, and continuously improve the complete workflow.',
    ],
    requirements: [
      'Strong Python or TypeScript software engineering and experience integrating production APIs and data systems.',
      'Hands-on work with LLM APIs, agent SDKs, tool calling, retrieval, MCP, and structured outputs.',
      'Experience evaluating model quality, latency, reliability, cost, and failure modes beyond demo prompts.',
      'A practical understanding of identity, permissions, sensitive data, and human-in-the-loop control.',
      'Product judgement: the ability to reject AI when a script, form, search index, or workflow change is better.',
    ],
    success: [
      'The system removes measurable work without hiding ownership or creating a new review bottleneck.',
      'Tool use is scoped, auditable, and recoverable when models or dependencies fail.',
      'Evaluation and telemetry catch regressions before users have to explain that the assistant became worse.',
      'Users adopt the workflow because it fits their job, not because the interface says AI.',
    ],
    evidence: [
      'Created an internal OpenClaw-style assistant that automated 20–25% of recurring Solutions Engineering work.',
      'Connected agentic workflows to real internal tools and operational data rather than isolated chat experiences.',
      'Applied platform, reliability, and software engineering practices to automation with human ownership.',
      'Supported machine-learning workloads for computational pathology across bare-metal Kubernetes and Azure AKS.',
    ],
  },
  {
    id: 'open-source',
    slug: 'open-source-community-lead',
    title: 'Open Source & Community Lead',
    description:
      'Upstream contributions, open-source strategy, technical education, speaking, mentorship, and community work.',
    skills: ['Open source', 'Speaking', 'Training', 'Community'],
    level: 'Lead / Staff',
    scope: 'Open source strategy',
    mandate: [
      'Connect credible engineering work, contributor experience, product strategy, and public education into an open-source programme people can trust and participate in.',
      'The role should create healthy upstream relationships and useful feedback loops, not treat community as a distribution channel with a Discord server attached.',
    ],
    responsibilities: [
      'Develop open-source and OSPO strategy with clear goals for upstream contribution, governance, adoption, and product alignment.',
      'Contribute technically, improve release and contributor processes, and help maintainers remove friction for new and existing contributors.',
      'Create technical documentation, talks, workshops, demos, and examples grounded in real engineering work.',
      'Build contributor recognition, mentoring, event, and community programmes that scale without burning out volunteers.',
      'Bring community and customer evidence back to product and engineering teams in a form they can act on.',
    ],
    requirements: [
      'A visible, credible history of upstream contributions or project leadership in a significant open-source ecosystem.',
      'Enough technical depth to review code, release software, debug contributor problems, and represent engineering accurately.',
      'Strong public speaking, writing, teaching, facilitation, and community conflict-resolution skills.',
      'Experience working across engineering, product, marketing, legal, OSPO, field, and executive stakeholders.',
      'Comfort measuring community health without reducing people to vanity metrics.',
    ],
    success: [
      'Contributors can understand the project, make useful changes, and receive timely feedback.',
      'Upstream work and product strategy reinforce each other without compromising project trust.',
      'Technical content and events help people solve real problems and create qualified product feedback.',
      'Maintainers, advocates, and community members have sustainable processes and visible recognition.',
    ],
    evidence: [
      'Worked on Kubernetes releases v1.31 through v1.34 and now maintains Release Engineering.',
      'Served as Branch Manager for v1.32, v1.33, and v1.34 and Communications Release Lead for v1.32.',
      'Delivered public talks and workshops to more than 3,000 people and taught 500+ course alumni.',
      'Advised startups through public companies on open-source strategy and delivered fractional DevRel and OSPO work.',
    ],
  },
  {
    id: 'solutions',
    slug: 'solutions-customer-success-architect',
    title: 'Solutions Engineer / Customer Success Architect',
    description:
      'Customer discovery, architecture, demos, proof of value, implementation help, and product feedback with enough detail to be useful.',
    skills: ['Discovery', 'Architecture', 'Demos', 'GTM'],
    level: 'Senior / Principal',
    scope: 'Customer outcomes',
    mandate: [
      'Own the technical path from an ambiguous customer problem to architecture, proof, implementation, adoption, and a measurable business outcome.',
      'This role should stay hands-on after the call: build the tailored demo, inspect the integration, unblock delivery, and make sure product feedback survives contact with the roadmap.',
    ],
    responsibilities: [
      'Lead technical discovery across business goals, developer workflows, architecture, security, operations, and buying constraints.',
      'Design and build tailored demos, proofs of value, reference architectures, and implementation plans.',
      'Support onboarding, adoption, expansion, and complex escalations for strategic customer environments.',
      'Partner with Sales, Customer Success, Product, Engineering, Field Marketing, and open-source teams.',
      'Turn repeated field work into reusable tooling, enablement, documentation, and product improvements.',
    ],
    requirements: [
      'A strong software, platform, cloud, or developer-tooling background with the ability to build and debug the proposed solution.',
      'Experience with enterprise discovery, technical qualification, architecture, demos, and proof-of-value delivery.',
      'Clear communication with executives, architects, developers, security teams, procurement, and open-source stakeholders.',
      'Commercial awareness without losing technical honesty or promising product behaviour that does not exist.',
      'Ownership across pre-sales and post-sales boundaries, including adoption and customer outcomes.',
    ],
    success: [
      'Customers reach a technically credible decision faster and understand the implementation path.',
      'Proofs become production adoption rather than isolated demo environments.',
      'Field feedback changes documentation, enablement, product priorities, or the product itself.',
      'Revenue, retention, and expansion improve alongside customer trust and technical outcomes.',
    ],
    evidence: [
      'Reached 185% quota at GitHub and won President’s Club for fiscal year 2026.',
      'Reached 121% quota in the first eight months while supporting customers averaging 500 developers.',
      'Worked closely with Sales, Field Marketing, Product, and OSPO and delivered talks at industry and open-source conferences.',
      'Automated 20–25% of recurring Solutions Engineering work through an internal assistant.',
    ],
  },
]

export function getCareerRoleBySlug(slug: string) {
  return careerRoles.find((role) => role.slug === slug)
}
