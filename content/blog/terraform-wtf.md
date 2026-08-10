---
title: "Terraform? Wtf?"
date: "2023-08-12"
author: "Matteo Bianchi"
category: "Infrastructure"
image: "/images/blog/terraform-wtf.webp"
imageAlt: "The HashiCorp logo altered with the question Evil?"
excerpt: "On August 10, Hashicorp announced licensing changes to Terraform along with many of their open source products."
readTime: "2 min read"
---

On August 10, Hashicorp announced licensing changes to Terraform along with many of their open source products.

![My paint skills >>>> yours](https://miro.medium.com/v2/resize:fit:1400/1*YY1M0poG0ZmJsagTNxVwAA.png)

*My paint skills >>>> yours*

Why? To summarize, they accuse other vendors to use their OSS for their commercial goals, without contributing back but without mentioning specific cases. *Suspicious.*

HashiCorp believes that OSS licenses should evolve to keep providing freely available software so instead of keeping their code open they close it, but not completely as “many vendors” did (again without mentioning names os such vendors). *Meh.*

They do mention other vendors who adopted the BSL 1.1 license too: Couchbase, Cockroach Labs, Sentry, and MariaDB, Confluent, MongoDB, Elastic, Redis Labs…\
Ok I get it, other companies did it but it doesn’t necessarily means that is no **evil**.

This license allows non-commercial use but any commercial use of Terraform (code) could be eeeeeeeh, *questionable*.

Now, let’s say that [KubeLab](<https://medium.com/u/df900bf2574a>) is about to release an OSS tool called kubelab-cli which is currently based on Terraform + Python automation to help deployment and management of K8s clusters lifecycle in different cloud providers. \
Are we getting prosecuted? In this case I hope not **but**. Let’s say we will extend kubelab-cli to become the first building block of a Platform Engineering tool, which we would like to commercialize. Is that ground for a lawsuit? Should I call my lawyers already?

I’m not the only one worried since Weaveworks (FluxCD authors) released [an alarming article](<https://web.archive.org/web/20230815140723/https://www.weave.works/blog/statement-for-terraform-hashicorp-license-changes>) stating that

> “If your use is non-commercial, then *as far as we are aware* you are unaffected — but our assumption is not conclusive. Please note this is **not** legal advice. If you want to get actionable help on open source licensing for your situation, then please consult a lawyer.”

If they don’t know, we don’t know. Send help!

In the meantime (allowed) forks, like [open-terraform](<https://web.archive.org/web/20230811134211/https://github.com/diggerhq/open-terraform>), are already sprawling, so everybody can maintain their very own version of Terraform.\
I honestly think it is time we consider a switch to [Pulumi](<https://www.pulumi.com/b/>) instead. I’m checking out [their GitHub](<https://github.com/pulumi/pulumi>) right now!\
I already had Pulumi on the roadmap for a while anyway, so this should be “just” a bump.

Follow me, hit that green “follow” button! 🟩\
Comment, share and tag me to discuss.\
Find all my links 👉 [here](<https://mb-consulting.dev/all-links>).

See you next time!

---

*Originally published on [blog.mb-consulting.dev](https://blog.mb-consulting.dev/terraform-wtf-a2d4db6f9f81).*
