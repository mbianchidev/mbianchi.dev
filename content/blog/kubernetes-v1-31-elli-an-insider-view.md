---
title: "Kubernetes v1.31, Elli: an insider view!"
date: "2024-08-21"
author: "Matteo Bianchi"
category: "Kubernetes"
image: "/images/blog/kubernetes-v1-31-elli-an-insider-view.webp"
imageAlt: "The Kubernetes v1.31 release mascot Elli beside the Kubernetes logo"
excerpt: "Kubernetes has had a community-driven release lifecycle since forever now and I took part of it as Comms Shadow for v1.31, here’s how it went and what I have learnt in the process.Elli, the release lead doggo, how cute!The Story So FarI knew about..."
---

Kubernetes has had a community-driven release lifecycle since forever now and I took part of it as Comms Shadow for v1.31, here’s how it went and what I have learnt in the process.

![Elli, the release lead doggo, how cute!](https://cdn-images-1.medium.com/max/1024/0*_rzDE8q_SjhOwXrc.png)

### The Story So Far

I knew about the Kubernetes release lifecycle. I followed it when I was an SRE since one of my responsibilities was to perform cluster upgrades, apply the release notes recommendations and so on.

It all started with a community, like any good story. 
A friend and colleague of mine, Alessandro Vozza, sent me the Google form link to apply as a release shadow and I filled it out. 
Stared at that form for a couple of minutes, unsure about submitting it but in the end I did it and then I rapidly closed that page.

Some days passed. I got an email stating that…
I have been selected?!

So my journey started by coincidence, in a way.
I’m very happy it started, though!

### To Shadow or not to Shadow

My shadow experience has been enriching in so many ways.
First of all I got to know a lot of new people, working in the same space and all with a passion for open source in common.
Secondly I got to measure myself against a new process that I have never seen before, although I do have quite some experience with software delivery, matured in my work experience, it has been a good challenge to onboard myself in such a large open source community project.
Lastly, but most importantly (kidding), I got to brag with my friends about having my name in the Kubernetes official blog — [**here**](https://kubernetes.io/blog/2024/07/19/kubernetes-1-31-upcoming-changes/) and [**here**](https://kubernetes.io/blog/2024/08/13/kubernetes-v1-31-release/) too.

*Should I shadow too?*
Yes, go for it!

### The Comms Role

*What did you actually sign up for?*

I was assigned to be a Comms shadow, which was my first choice due to my recent (almost a year ago now) [**career switch to a DevRel direction**](https://blog.mb-consulting.dev/wtf-is-devrel-18cc6c82abf9).

The Comms role is in charge of coordinating blogs and PR for the release, including the final webinar involving CNCF and the release leads. 
We keep track of the PRs, communicate with sig-docs and sig-docs-blogs to ensure that we communicate correctly to every Kubernetes user what value this release will bring in for them.

Comms is just one piece of a complex machine called Release Team, made of 35–40 volunteers, working for around 14 weeks alongside various development sub-teams to deliver the next Kubernetes version to life.

### The Release Team

I’ll try to explain it in a few words.

To get a general understanding let’s take a step back and take a look at (some of) the different parts that compose Kubernetes.
Imagine for now a very simplified version of the architecture:

- Cloud provider controller
- Nodes and computing
- Kube-api-server
- Kubectl
- Storage layer
- Kube-proxy and network layer
Oversimplifying: every major component of Kubernetes typically has a vertical SIG “attached” to it.

A Special Interest Group is a sub-community of developers particularly interested in that component and its evolution — *yes there are also SIGs that are horizontal and project based but I won’t be able to explain the full structure in this blog*.
These SIGs are responsible for both the development and the technical review of: code PRs, documentation and blogs.

The Release Team as a whole aids and supports SIGs by overseeing and executing the operations fundamental for the release success, including but not limited to:
- triaging and tracking KEPs ([**Kubernetes Enhancement Proposals**](https://github.com/kubernetes/enhancements/tree/master/keps)) issues on GitHub;
- keeping track of CI/CD and TestGrid results;
- ensuring docs are present and useful to users;
- support blog drafting
- creating release notes with upgrade recommendations;
- cutting the git branches and creating the release tags on GitHub;
- producing and publishing release artifacts;
- communicating the release content externally;

You can read more about the different roles by consulting their [**handbooks**](https://github.com/kubernetes/sig-release/tree/master/release-team/role-handbooks).

### v1.31, what was special about it?

This release the Kubernetes team continued working on a few elements from the previous releases, including v1.30 “Uwubernetes” — *yep, leads get very creative when they decide the release topic and name* — but also added quite a good number of new “alpha” changes — not necessarily production ready and behind feature gates. Stability is very important for such a huge project.

My favorite changes for this release are the following:

- A number of enhancements related to DRA and management of GPUs with Kubernetes — AI FTW!
- Move cgroups v1 support into maintenance mode (security updates included), in favor of cgroups v2 for any new features.
- Networking improvements: dynamic CIDR for pods and services, kube-proxy connectivity enhanced with cloud provider load balancing…
- A bunch of storage layer changes around persistent volumes, also adding more useful metrics around these!
### v1.32 and beyond, what will be special about it?

This release already gave us some hints about the future of Kubernetes.

In my opinion one of the main goals will be to turn Kubernetes into a truly agnostic tool, no cloud provider ties, no external components — with kubectl migrating to its own repo and more changes to ensure interoperability at the maximum level!
Unpopular opinion: removing Kustomize from kubectl — aside from breaking tons of legacy pipelines — it’s not a bad idea at all.
I’ve read [**this proposal**](https://github.com/kubernetes/enhancements/issues/4706) but it did not pass in v1.31 and probably not anytime soon, but still. 
Technical debt is a company risk, not an open source one and don’t get me wrong, I’m not saying we should roll it out right away, but… 2–3 releases from now? 
After announcing and deprecating it properly and all? Sure!

Anyway, back to what will be special about the next releases, I think Kubernetes is and will be tilting more and more towards AI, continuing to improve its support for Stateful workloads as well, which I think is a good direction to go to, given that we don’t turn away from any other use-case.

Many more people are running ML/AI and datastores on Kubernetes and it makes me very excited to see this change first hand.

### Fun? Facts!

![Me flexing the Falco Graduation shirt!](https://cdn-images-1.medium.com/max/800/0*cVjJespxH9iwy5S-)

- I was interviewed due to my participation in the release team by the lovely people at the Dutch Kubernetes Podcast — you can listen to the episode [**here**](https://www.k8spodcast.nl/afleveringen/aflevering-63-kubernetes-v1-31-elli). Thanks again to Ronald and Jan for having me.
- I was asked to take on the Comms Lead role for v1.32 and I will do my best to fulfill my duties, especially focusing on mentoring my future shadows and find the next Comms Lead.
Want to apply? This is the form for applying to be a Release Shadow in v1.32 — you can find it at [**this link**](https://docs.google.com/forms/d/e/1FAIpQLSdb60FW9aYIepSdXIWexQIKNJ8m3JSqHZ6kkH3Q_I7XP9OVYA/viewform).
- You will find me speaking at [**SREDay in London**](https://sreday.com/2024-london/) later in September and mingling around at Cloud Native Rejekts and KubeCon NA in Salt Lake City in November. Come and say hi if you see me!
- **I’m open to work.**  
If your company needs a (remote) Cloud Engineer, Platform Engineer, DevRel or Software Engineer — 60% infra and Kubernetes based, 40% software, with a pinch of leadership and 100% teamwork, it’s time you hit me up [**on LinkedIn**](https://www.linkedin.com/in/mbianchidev/) — open to both B2B contracts and full time roles.
### In conclusion

A few words before wrapping up.

I cannot say thank you enough to all the people I’ve worked with — you can find the full list [**here**](https://github.com/kubernetes/sig-release/blob/master/releases/release-1.31/release-team.md)
It was a pleasure working with the Release Team and bringing v1.31 to life, together. ❤️

See you in v1.32!

That’s all for now, from your new favorite Cloud Native Avocado🥑
Find all my links 👉 [**here**](https://mb-consulting.dev/all-links).

See you around, ciao!

---

*Originally published on [blog.mb-consulting.dev](https://medium.com/@mbianchidev/kubernetes-v1-31-elli-an-insider-view-4da16b12ec7a?source=rss-4271f7910db4------2)*
