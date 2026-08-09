---
title: "Kubernetes Community Days Experience"
date: "2023-03-03"
author: "Matteo Bianchi"
category: "Cloud Native"
image: "/images/blog/kubernetes-community-days-experience.webp"
imageAlt: "An arcade controller and terminal during Kubernetes Community Days"
excerpt: "KCD 2023 was last week and it has been an awesome experience. I’ll try to summarize it a few chapters, enjoy!"
readTime: "11 min read"
---

KCD 2023 was last week and it has been an awesome experience. I’ll try to summarize it a few chapters but it is definitely going to be a challenge.

A big shoutout goes to [the organizers](<https://www.meetup.com/dutch-kubernetes-meetup/>) (mostly italian fellas!), the speakers, the attendees and the sponsors who made everything possible.\
Both days were so full of interesting talks that I don’t know where to begin. I’ve been able to attend quite a good number of those, while also connecting with a new and vibrant Cloud Native community.\
I have also teamed up with my CEO, [Peter](<https://www.linkedin.com/in/peter-comstock-3225695/>) to “divide et impera” multiple talks at the same time.

![Le me, testing out a fun game @ the event](https://miro.medium.com/v2/resize:fit:1400/1*jNCsPw7sYwu-Dum1l2WrFg.jpeg)

*Le me, testing out a fun game @ the event*

Since I’m italian don’t mind me if I talk about food too.\
Breakfast was served everyday from 8 to 9 a bit too early if I may say, but at least no cappuccino was served after 11 (italian rule, sorry). Cookies: super good, carrot cake/banana bread? Same.

Disclaimer: looooong article.

**Day One**

![Yep, all the photos will be phone format, next time I will flip it I swear!](https://miro.medium.com/v2/resize:fit:1400/1*Sx6ICB9TR7A-6-C9DTgzzw.jpeg)

*Yep, all the photos will be phone format, next time I will flip it I swear!*

The conference started with a very intriguing Keynote by [Sarah Polan](<https://www.linkedin.com/in/sarah-polan/>) — Field CTO @ HashiCorp, the Terraform / Vault peeps.\
Explaining the complexity of the IT industry by using OODA loops (Observe, Orient, Decide, Act) — not dissimilar by DevOps processes, has proven to be fundamental to understand what’s behind often neglected and underestimated metrics such as time to market, security/governance and efficiency.

She then digged a bit into the history of the four Industrial Revolutions and this was so beneficial to understand how building developer centric platforms is fundamental in order to really scale companies and leave a mark in the world. \
Creating a platform for developers will be the next step of my CTOing in KubeLab, sort of a v2.0 that will be coming soon…

![Kubernetes Community Days Experience](https://miro.medium.com/v2/resize:fit:1400/1*LVTYyHbgCWboziQk9eUDCA.jpeg)

I learnt about the difficulties in the implementation of a gRPC Proxyless Service Mesh architecture thanks to [Gijs Molenaar](<https://www.linkedin.com/in/gijsmolenaar/>), Senior System Engineer @ Spotify. \
Handling, maintaining and evolving internal tools like Hermes protocol and Nameless DNS service became way too complex even for Spotify too handle.\
They decided to switch back to market-ready solutions instead of building everything from scratch, to reduce the scaling complexity and having more community support. \
Sometimes delegating can be the best choice to continue improving faster on your product development and focus less on everything collateral.\
Sounds familiar? KubeLab is there to help with that, feel free to book a quick call with me to talk about your challenges, don’t be shy!

It was then time for a break! \
Vegan smoothies were super good, but sadly I never saw them again throughout the conference.

![Kubernetes Community Days Experience](https://miro.medium.com/v2/resize:fit:1400/1*TVWZ1AcWguZwTJvS1nFwQA.jpeg)

[Marcel Claassen](<https://www.linkedin.com/in/marcelclaassen/>), Sales Engineer @ Sysdig shared an awesome product with which I was already aquainted and fan of, as you can see from [my website](<https://www.mb-consulting.dev/>). *p.s. did you know I’m open for mentorship, CV reviews and advisory?* 👀\
Feel free to [hit me up](<https://www.mb-consulting.dev/contacts?serviceName=other-services>).

Anyway, back in topic.\
Marcel presented [Falco](<https://sysdig.com/opensource/falco/>), the K8s threat detection OSS solution. \
A tool able to detect threats at a syscall level via eBPF, in the cloud? Awesome! We were shown a very effective demo showing part of the rule engine in action as well as their plugins and also sidekick UI to enable well-detailed Slack notifications and a cool dashboard.

Another small break to meet some friends from [Mia-Platform](<https://mia-platform.eu/>).\
[Nicolò](<https://www.linkedin.com/in/nicol%C3%B2-cambiaso-319511bb/>) is THE marketing man, we exchanged a few marketing insights and he helped me a lot; while I also had a nice convo with [Davide](<https://www.linkedin.com/in/davide-bianchi-929a74b9/>), creator of [Kube-Green](<https://kube-green.dev/>) or one of my favorite k8s projects, awesome guy!\
*Yep, they are italian and the company is too. Something tech Italy can be proud of.*

I’ve also met the Kairos team. They build sponsored OpenSource software, Kairos is [the Immutable Linux OS for Kubernetes](<https://kairos.io/>).

This break doesn’t really look as a break. Doesn’t it?

Back in action with “Operating high traffic websites on Kubernetes” with a super cool demo session by [Salman Iqbal](<https://www.linkedin.com/in/salman-iqbal-a6a5b026/>), MLOps Engineer @ Appvia.\
Seeing live NGINX Ingress Controller scaling so seemlessly on a minikube cluster to handle [Locust-generated flooding traffic](<https://locust.io/>), also thanks to [Kubernetes Event-Driven Autoscaling](<https://keda.sh/>) was truly amazing! \
This showed the true power of a well configured cluster on bot scaling up and scaling down to save a lot of the costs for any kind of application. \
Not only! Seeing [podinfo](<https://github.com/stefanprodan/podinfo>) and [Prometheus](<https://prometheus.io/>) in action and allowed the attendees to see a clear picture of the current status of the cluster without k9s or any console at all, even if I love consoles I still think that a nice UI can help sometimes. \
This is something to really implement for your company too and I have to remind you that KubeLab can surely do that for you!

Boom, vegan lunch! \
A bit chaotic but I understand that is not easy to handle that amount of people trying to get food at the same time, next time we should implement smarter queues, maybe with Kafka. Pun intended.

After lunch I took a break to see some of the sponsors booths, I also luckily won a LEGO Technic thanks to [Xebia](<https://www.linkedin.com/company/xebia/>)! It will look like a charm on my desk, as soon as I have time to build it.

![Kubernetes Community Days Experience](https://miro.medium.com/v2/resize:fit:1400/1*V8Sq_MnJjMl6PsqdQC8Xng.jpeg)

[Robbin Siepman](<https://www.linkedin.com/in/robbin-siepman-0b183511b/>), Lead Engineer @ IGN Bank, explained how the ING team handled a banking landscape complexity by containerizing and creating self-service platforms for their developers, with security as a priority, as it should (always) be.\
I was also able to probe more in depth their Quota Autoscaler strategy on production and test environments by interacting with him during the talk. \
In conclusion I gathered that developers can’t be let free of scaling as much as they want, you must give them some boundaries and spaces to operate within, so they can learn how autoscaling truly works without spending a lot of money in cloud costs.\
Developer should be focusing on creating scalable software instead of throwing more resources hoping that it will work as it is.\
The amount of resources saved by simple yet powerful tricks and tools is overwhelming and poses a question on every company that is missing these strategies. Wanna lower your costs? Go cloud and do it well.

![Kubernetes Community Days Experience](https://miro.medium.com/v2/resize:fit:1400/1*PZoUUT03vnZiZxJTJK7nsA.jpeg)

Continuing our journey with [Ara Pulido](<https://www.linkedin.com/in/arapulido/>), Staff Developer Advocate @ Datadog, she explained wonderfully why Ingresses are becoming more and more inefficient and why we should consider [Gateway API](<https://gateway-api.sigs.k8s.io/guides/>) to overcome Ingress API limitations. \
North/South traffic can be handled easily with Gateway API but instead of having this tool inside our Kubernetes version it’s built as a CRD (CustomResourceDefinition) to enable more flexibility, with just a small overhead. Advocating for this new method of integrating new tools for Kubernetes was really brave and I appreciated that, a lot.

![Kubernetes Community Days Experience](https://miro.medium.com/v2/resize:fit:1400/1*ydyVBfm2N_rrTP6hoGI0pw.jpeg)

Next for a wonderful talk by [Kristina Devochko](<https://www.linkedin.com/in/krisde/>) where we gathered knowledge about some of some of the risks in the adoption of Kubernetes managed solutions like AKS, EKS, GKE (and more). \
It is important to know what you are supposed to be responsible of when using a managed service and how can you get the most out of it, never blindly trusting the default configs and designing carefully every component of your cloud infra to avoid security flaws, unexpectedly high costs and a lot of cloud management issues.\
Another brave comment that made me think a lot: Kubernetes is not always the one-cure-all answer.\
I agree and maybe there are more suitable cloud services for your use-case, but how do you know without guidance from experts? You can’t, but fortunately we are there to provide our expertise to your business.

CERN is using OpenShift?! [Jack Henschel](<https://www.linkedin.com/in/jack-henschel/>), Fellow Computing Engineer / DevOps @ CERN gave us this wonderful news. I was completely unaware that CERN used Kubernetes so extensively and had that number of Cloud-Native workloads running OpenShift and OpenStack, everything in a secure and hybrid environment not always cloud-native. They use OpenPolicyAgent and ArgoCD as CNCF projects but they also have internal products to handle storage, authentication and DNS assignment for their scientific research projects. \
Science leveraging the cloud. How wonderful is that? We feel that the trust in Cloud Native is growing and I am grateful to contribuiting to build that trust by providing services for clients and, in the near future, thanks to KubeLab, a platform for all developers.

**Day Two**

Day two started with a banger

![Kubernetes Community Days Experience](https://miro.medium.com/v2/resize:fit:1400/1*KysKSn-BHBWVUgSjXirPZQ.png)

[Gijs van der Voort](<https://www.linkedin.com/in/gijsvandervoort/>), Lead SRE & Python ambassador @ Picnic explained how the company migrated its workload from the cloud to on-premise because they had low-latency requirements for their groceries packing warehouses systems but then they decided to go back to the cloud as soon as the conditions were favorable enough for them, once more the cloud proved to be the best choice even in the most though situations. Good job to Picnic and thanks for sharing the importance of a clear roadmap in a cloud journey.

![Kubernetes Community Days Experience](https://miro.medium.com/v2/resize:fit:1400/1*Hb1OAP116iSxqs6E_gh4dQ.jpeg)

We were involved in a fascinating eBPF talk, another big topic of this KCD, by Krisztian Fekete Field Engineer @ Solo.io.\
He explained the complex eBPF landscape in a simple way by exploring the tools, in a live demo which involved Prometheus metrics being exposed for the sake of better observability of Kubernetes clusters. We were truly fascinated by the power of eBPF, it’s a revolutionary technology that can run sealed programs inside a Linux kernel but without touching code or modules in the kernel itself. How amazing is that?

GitOps. Finally! A talk that really got me say “AHA” more than once.\
[Roberto Carratalá](<https://www.linkedin.com/in/rcarrata/>), Senior Cloud Services @ Red Hat and [Germán M Yébenes](<https://www.linkedin.com/in/gmontalvoy/>), Technical Marketing Manager @ SUSE gave us a comprehensive overview of the power of GitOps on Kubernetes clusters.\
Using Kustomize and ArgoCD they demonstrated how GitOps works but not only, we were also presented different promotions strategies between clusters and environment (dev, test, prod).\
They demonstrated how to deploy in multiple clusters at the same time by using ApplicationSets. Interesting.\
I don’t think it has a use environment-wise in the strict sense but imagine to rollout a new deployment in multiple regions at the same time. You could update your globally scalable app for all your client (or not, and you can just stick to a classic mono-regional canary deploy).

Either way you should take care of your DevOps and cloud, long enough to turn yourself into a GitOps-ready company, where everything works as in a well-oiled production chain.

Service Mesh without the mess by [Raymond de Jong](<https://www.linkedin.com/in/dejongraymond/>), Field-CTO EMEA @ Isovalent has been a really interesting talk.\
Service meshes are becoming the best way to build observable/secure entrance nodes for accessing distributed Kubernetes systems. They are not really easy to use but Raymond explained their function in the most essential way by also showing us an hands-on demo using Cilium Service Mesh (eBPF based) to monitor service-to-service connectivity while collecting and presenting data with Prometheus, Grafana and OpenTelemetry.\
This eBPF based service mesh eliminates sidecars to improve performance, reduce latency, lower the operational complexity, and resource usage. Basically low cost and low complexity.\
Wouldn’t we all love this?

It was time for another vegan lunch and the afternoon was still full of talks, at this point I started to be a bit tired, I admit it!

WASM was also a big part of this conference, also thanks to Fermyon and their [Spin](<https://developer.fermyon.com/spin/quickstart>).\
Could it bring the next revolution in the cloud? Fast, secure and interoperable, seems good enough to make a real difference!\
WASM containers have important features for cloud-native applications, they are small, platform-independent, and more secure than classical containers. \
KWasm operator comes to the rescue as [Sven Pfennig](<https://www.linkedin.com/in/sven-pfennig/>), Senior Software Developer @ Liquid Reply told us. Adding support for WebAssembly to Kubernetes distributions was a truly brilliant idea, hoping that soon it will be natively added by the major cloud providers.

[Lukonde Mwila](<https://www.linkedin.com/in/lukonde-mwila-25103345/>), Senior Developer Advocate @ AWS helped us understand more in depth how high availability comes at a cost, tipically a high one, since cross-zone, cross-regional traffic and egress traffic become very expensive when dealing with Cloud workloads. You need to separate and govern those PODs, and if PodAffinity doesn’t work PodAntiAffinity does and very well but the Istio-Karpenter reduces scaling latency and infrastructure costs by handling the schedule of new nodes to always have the perfect resource, just in time.

Who told you that the government is not Cloud Native?\
[Dinant Paardenkooper](<https://www.linkedin.com/in/dinantpaardenkooper/>) is a Cloud Native Architect and Kubernetes Consultant for the City of Amsterdam with [Jurgen Allewijn](<https://www.linkedin.com/in/jallewijn/>) in the same role. \
They shared their experience in transforming such an institution in a bleeding edge cloud native adopter with a lot of challenges like multi-tenancy and application segregation they build an AKS infrastructure that integrates with pre-existing services, holds newly migrated ones and allows team to manage workloads securely and in compliance with the current government regulations. I’ve had the opportunity to speak with them and Timo Halbesma after the talk to ask some questions about how to transition similar organization to the cloud without disrupting their rules too much. It has been an interesting exchange of ideas.

Rabobank’s Cherwin Nooitmeer described how a large scale bank with clients all over the world adopted Kubernetes and migrated extensive workloads from on-premise systems to GitOps processes with Argo Workflows, FluxCD and AWS as provider.\
Their EKS infrastructure is really impressive, number at hands, demonstrating that no workload is too complex to be migrated or scaled, with the right expertise by your side.

Last but not least, we had the priviledge of having as the closing keynote speaker [Priyanka Sharma](<https://www.linkedin.com/in/pritianka/>), Executive Director @ CNCF. \
She was inspiring and open to questions and critics from the audience, we really appreciated her words and we all truly embraced her call for building a better, more open and secure Cloud Native community, not only in the Netherlands but all over the world.

**The end**

Vegan BBQ, techno music, good vibes and home to sleep at 4 AM. What happens during the afterparty stays at the afterparty, it’s the rule!\
Come by next year and you’ll see ;)

Originally published in KubeLab’s blog, slightly revised here.

Follow me here, hit that green button!\
Feel free to comment, share and tag me to discuss.\
You can follow my other social media and get some other interesting links [here](<https://mb-consulting.dev/all-links>).

See you next time!

---

*Originally published on [blog.mb-consulting.dev](https://blog.mb-consulting.dev/kubernetes-community-days-experience-67de887ec1d8).*
