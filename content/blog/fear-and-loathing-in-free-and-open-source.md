---
title: "Fear and Loathing in Free and Open-Source"
date: "2023-09-29"
author: "Matteo Bianchi"
category: "Open Source"
image: "/images/blog/fear-and-loathing-in-free-and-open-source.webp"
imageAlt: "A man in aviator glasses riding in a convertible"
excerpt: "Why are all these companies moving to restrictive licenses or changing pricing models?"
readTime: "4 min read"
---

Free and (sometimes) open-source software. \
The engine of innovation, a brilliant model of development, where **engineers build for the benefit of everyone**, without profit driving their choices.\
Think about the amount of indie games built with Unity in the last 10 years, all your git repos, your favorite OS (ofc it is Arch Linux), Kubernetes and so on…

The very foundation of software lies in open-source.

![What a wonderful evergreen.](https://miro.medium.com/v2/resize:fit:1400/0*NsNFTKROicAKdw1z.png)

*What a wonderful evergreen.*

> And they lived happily ever after.

> The end.

Hah. You wish.

### Unity Pricing Change

Recent news has [**Unity changing their software licensing**](<https://unity.com/pricing-updates>) into a literal trap for free games developers.\
Charging 0.20$ per install on their free games in case they reached 100k downloads.\
Making money out of 0$ devs? Excuse me Unity?

I bet more and more devs will turn around and see [**Godot**](<https://godotengine.org/>) giggling over there. \
I personally have used it to build [**Blockster**](<https://github.com/mbianchidev/blockster-2d>), a block-smashing 2d game during a hackathon back in 2019 and it is so amazing. Way better than Unity in its DevEx if you ask me and I am not even kidding.\
Try it and let me know!

### Terraform License Change

Not long ago, HashiCorp changed the Terraform license from MLP to BSL (free and open to basically closed source), I have talked about it in [**this blog post**](</blog/terraform-wtf/>) over a month ago now.

Fortunately enough the community came together to build an awesome open alternative, now officially adopted by the Linux Foundation.\
A round of applause and a warm welcome to [**OpenTofu**](<https://github.com/opentofu/opentofu>)!

![The logo doesn’t click with me but I’ll learn to love it](https://miro.medium.com/v2/resize:fit:1400/1*vrdKFM860D_jAwRF-aTbCA.jpeg)

*The logo doesn’t click with me but I’ll learn to love it*

*I proposed a cool name too, Plasma, but it was not accepted — and I’m lowkey sad about it :(*

### Not Twitter and Reddit only

Remember [**Twitter APIs pricing change**](<https://www.theverge.com/2023/3/30/23662832/twitter-api-tiers-free-bot-novelty-accounts-basic-enterprice-monthly-price>)? Goodbye small app devs! \
But hey, Elon is changing the url to [x.com](<http://x.com>) and we even have a wonderful X icon instead of the iconic bird. Amazing, right?

What about [**Reddit’s API pricing change**](<https://www.techtarget.com/whatis/feature/Reddit-pricing-API-charge-explained>)? \
That killed a ton of 3d party apps that were so useful for redditors aaaand now they’re gone.\
Not even the widespread reddit strike protest could stop the evil [/u/spez](<https://www.reddit.com/u/spez/>), from changing that pricing model.\
So sad, press F to pay respects or send some F’s to spez.

In the last 5 years or so, we experienced a long wave of licensing and pricing changes. \
[**Redis**](<https://redis.com/blog/redis-labs-modules-license-changes/>) (2018), [**MongoDB**](<https://www.mongodb.com/licensing/server-side-public-license/faq>) (2018), [**Elastic**](<https://www.elastic.co/pricing/faq/licensing>) (2021), [**Grafana**](<https://grafana.com/licensing>) (2021, actually switching to a good license), [**Google Maps API**](<https://techcrunch.com/2018/05/02/google-revamps-its-google-maps-developer-platform/>) (2018), [**Meta WhatsApp API**](<https://web.archive.org/web/20230923115152/https://developers.facebook.com/docs/whatsapp/pricing/pricing-changes-launch-timeline/>) (2023)…

The typical pattern begins with a low (or no) price to capture market share. As adoption grows, increase prices and/or change license. \
Users tend to stick around unless a compelling alternative emerges and in case, companies often choose between acquiring the competition or leveraging their dominant market position.\
This goes for both enterprise comapanies; see Netflix, Spotify or PayPal (at least when it had a looser KYC policy, other cash apps are eating its market share now) and for open-source software too.

Let’s face it. \
**Companies building and maintaining open software cannot sustain themselves without profits indefinitely**. Revenues are necessary for sustainability, but striking the right balance is also crucial.

**Donation and crowdfunding** is not long term viable, not much to add here.\
**Freemium** can help getting some initial traction but is not ideal either.\
**Dual licensing** is the most popular choice. \
Competitors will be tailing and taking advantage out of your open code and you will gradually start neglecting it, focusing more on the enterprise version or leaning towards a closed model.\
That is unless everything is **governed and steered by a foundation** or at least a group of maintainers from different companies, in that case we are pretty much safe from any sort of *enterprise* *blackmailing* and we can achieve long term viability too. A win win!

- **Allows companies to grow sustainably** enabling them to keep them pushing money to **R&D**;
- **Keeps contributors happy** (and fed);
- **Fosters competition** and avoids having a company as single point of failure;

![Fear and Loathing in Free and Open-Source](https://miro.medium.com/v2/resize:fit:1400/0*bMRl5H3yMeYHYpcM.jpg)

I recommend that every open-source adopter **avoid relying on a single vendor**, if possible. Instead, **have multiple options ready** or, at the very least, be aware of alternatives in case of licensing or pricing changes.

Last but not least: definitely **try contributing to that piece of open software you take value from**, unless there is some pull request gatekeeping going on, in that case **just fork and do it yourself**.

Comment, share and tag me to discuss!\
Find all my links 👉 [**here**](<https://mb-consulting.dev/all-links>).

That’s all for now, ciao :)

---

*Originally published on [blog.mb-consulting.dev](https://blog.mb-consulting.dev/fear-and-loathing-in-free-and-open-source-8439a1dbf5da).*
