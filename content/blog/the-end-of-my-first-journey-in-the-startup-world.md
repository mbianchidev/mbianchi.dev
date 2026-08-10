---
title: "The end of my first journey in the startup world"
date: "2023-09-18"
author: "Matteo Bianchi"
category: "Startups"
image: "/images/blog/the-end-of-my-first-journey-in-the-startup-world.webp"
imageAlt: "The End title card in a classic cartoon style"
excerpt: "Behind the scenes and lessons learned"
readTime: "11 min read"
---

> ***Disclaimer*** \
> **1.** This article is (quite) long and there is no TLDR at the end.\
> **2.** This is mainly meant to be an update to the people I have involved in my journey at some level. It can also serve as a memorandum to my future self and to whoever can find it useful.\
> **3.** I will talk about some personal stuff too, if you are solely interested in engineering management advice you can skip to the “lessons learned” chapter.\
> **4.** Opinions are my own.

![The end of my first journey in the startup world](https://miro.medium.com/v2/resize:fit:1400/1*4YZp0PIHASr3IXD7kLOnkQ.png)

[Yep, that’s me](<https://www.youtube.com/watch?v=B4LFYs3VpxY>). You probably wonder how did I end up in this situation.

![The end of my first journey in the startup world](https://miro.medium.com/v2/resize:fit:1400/1*x4AqVqM2v2ZsWIeKIgEA-g.png)

This is also me, just 2 months ago. Things looked quite bright but… were they?

### Ready, Set, Go!

My journey in the startup world started as consultant/advisor in 2021 when I was still a digital nomad and a freelancer and it naturally evolved to [**fractional-CTO**](<https://www.mb-consulting.dev/service/cto-as-a-service>) roles.

In January 2023, I was officially offered a CTO role. I needed to figure out the best way to boost a bootstrapped company, so I gradually **forwent my freelancing career** and, after packing the few things I have, I **moved to the Netherlands.**\
Here I tried to find a permanent accomodation but the whole housing thing is way more difficult than it should be, ugh. \
I couchsurfed to this day — thanks to a couple of wonderful friends.\
*Some bias towards Italians and expats in general is indeed included in the Dutch landlords/makelaars (real-estate agent) package, meh.*

I accepted a lower-end salary as a CTO living in the Netherlands with the **prospect of future growth**, opportunity of creating my own team, shaping a company culture from ground up and finally building something I could be very proud of, after years spent in consultancy firms and freelancing.\
*Consultancy is quite rewarding but can also be not-so-fun. If you know, you know!*\
 \
I was **excited and full of hope**, in a new country I could explore.

Quoting my past self:

> Do I feel ready?\
> If “ready” means hyped-up to take the big step, fail, learn from my mistakes and improve: HELL YEAH.\
> If instead you mean “ready” as in “know-it-all” kind of behavior, absolutely not.

Oh, little did I know.

### Roadblocks

I started working in a quite diverse engineering team, who formed months before I joined and has been trained, with a strong focus on the DevOps side, to provide cloud consultancy to clients.\
As in most of early-stage startups, **things were kinda messy and there was no clear direction** to take.\
 \
We had to deal with two major roadblocks:

- **lack of strong commercial traction** due to multiple factors that I will try to summarize: market saturation, pricing and skills mismatch, lack of company track record, no funnel or a well-defined marketing process;
- **internal leadership struggles** between me and another piece of the leadership, it was mostly based on personal animosity and some degree of mistrust on both sides. Needless to say, I have 50% responsibility on this matter and I know how difficult it can be to convince older Engineers that a younger one can be as capable as them.

At that point, looking at the current status, we took a series of difficult decisions, starting with the layoff of three people in total, cutting office spaces and of course any benefit. \
In the meantime, another employee resigned to pursue a different career in tech.

Going forward, we decided to **pivot from cloud consultancy to product development** and things started to look a bit brighter.

### Rise or Fall?

The idea of the product started to be shaped and shifted from the initial [IaC](<https://en.wikipedia.org/wiki/Infrastructure_as_code>) templates generator to a [SaaS](<https://en.wikipedia.org/wiki/Software_as_a_service>) **Platform for [Kubernetes](<https://kubernetes.io/>) Management***.* \
Since then, we focused some of our efforts on developing a Python-based [CLI](<https://en.wikipedia.org/wiki/Command-line_interface>) tool that aimed to tie [kubectl](<https://kubernetes.io/docs/reference/kubectl/kubectl/>), cloud-specific CLIs and [Terraform](<https://www.terraform.io/>) together, as the first building block of our platform foundation.

Since it was supposed to be open-sourced at some point, in agreement with the company, I have released it [**on my GitHub**](<https://github.com/mbianchidev/klab-cli>).

On the side, after structuring the design of the Platform, we started focusing on fundraising activities. \
While we also planned to hire a [Golang](<https://go.dev/>) backend engineer, to help us in our journey towards the so-called [Product Market Fit](<https://en.wikipedia.org/wiki/Product/market_fit>).\
At that time, I was aware of the cashflow but having no figures on paper about the financials as a whole.\
Looking back, hiring another engineer might not have been the wisest financial choice for the company but **I do recognize having really pushed for it**, to advance our product development.

I had the wonderful opportunity to welcome a new member in the engineering team, one I have personally chosen out of 20+ CVs and after 6 engineers interviewed.\
[**Nuray**](<https://www.linkedin.com/in/nuray-ahm/>) has been **an amazing colleague**, capable of understanding the principles behind Kubernetes quite faster than any other software engineer I have worked with and without any previous background on the topic. \
She delivered quality code, from a different time zone and progressed our backend with little if any guidance, managing to provide sharp feedback on both software architecture choices and code.\
She is currently looking for her next engineering adventure and I am sure you would love to have her in your team.\
[**Contact her**](<https://www.linkedin.com/in/nuray-ahm/>) on LinkedIn, I will vouch for her, any day!

### The Fall

This chapter original title was supposed to be “the startup mafia” and I thought is was a bit exaggerated, even taunting if you will. [**Or was it?**](<https://medium.com/@slavasolodkiy_67243/revolut-mafia-is-bigger-than-you-think-936d53ff7e26>)

![A typical startup investor (once founder) consulting with an advisor.](https://miro.medium.com/v2/resize:fit:1400/0*wUnjgZm4plEfd3Jr.jpg)

*A typical startup investor (once founder) consulting with an advisor.*

As an investor would ask at this point: *What about the product?*

We had an infrastructure design, a set of APIs and a good-enough React frontend was in the making. We were so excited for it!

Even though, with a certain degree of uncertainity ahead, although typical of most early-stage startups, two more Engineers resigned to pursue their next challenge in tech.

*So, despite all the difficulties, you were still managing to continue product development. What has been the **real** **problem** then?*

**Money is a very finite resource, especially for a startup**. We can all agree on this.\
Without a product out, paying customers or a form of recurring revenues, any startup need to raise money.\
May it be from banks, VC funds, angels or even family and friends.

Picture working in a startup, idea-seed stage, building the product, pitching around, trying to find the right marketing plan and looking for investors money.

Cool, now let’s add some extra difficulty:

- nobody in the team has a degree from an **Ivy League** college;
- no one is considered to be a **second-time founder** with a substantial **exit***;*
- no key employee with a [**FAANG**](<https://www.investopedia.com/terms/f/faang-stocks.asp>)/notorious scaleup background;
- [**AI**](<https://www.youtube.com/watch?v=-P-ein58laA>) not being a key selling point — *and don’t get me wrong I am not implying most of the AI startups have an inflated evaluation driven mainly by hype and [FOMO](<https://en.wikipedia.org/wiki/Fear_of_missing_out>), you are saying that!*
- not being part of an **incubator/accelerator program** or applying to it;
- A **cap table** that might scare off some investors — *who may prefer, in the seed stage, to be either first joiners (high risk — high reward), to join in a larger round guided by an angel syndicate or to wait for a bigger shark to invest first;*
- not **having the product out there**;\*

\* If I already have a product and paying customers, why would I ask for Angels or VCs money to scale it? \
Can’t I, diminishing the risk of diluting capital, just ask a loan to a bank? \
*Startuppers, this is an actual question, not a rhetorical one!*

Well, checking some of those boxes, it is (almost) **impossible for a startup to raise money from investors**.

I said what I said, fight me over it.

### Realization Phase

![Le me going from the “full of hope start” to the “becoming aware” stage](https://miro.medium.com/v2/resize:fit:1400/1*cN0QsDqp6DCaD8pgV8pL5Q.gif)

*Le me going from the “full of hope start” to the “becoming aware” stage*

Following the story, on top of the future of the product being tied to what I considered being a frail investment hope, **I started to feel quite overwhelmed** on the job.\
I then began to reflect about the way I have been feeling, on a personal level.

I was in a country where I barely lived and never really felt like home, or at least close to a second one. \
I’ve come to realize what I was missing out on in life, feeling like I had wasted a good part of this year being dissatisfied and not doing anything about it.\
All these feelings began to affect my balance and mental health too.\
I needed to do something, beginning with a plan to slowly **move out from the Netherlands**.

Believe me when I say to consider myself an advocate of **separating life and work**, but they do intertwine and influence each other, heavily.

When I communicated my intentions, that has been a key moment for everyone to realize at which stage we were in and the idea of stopping the project started to be taken into account.\
\
I proposed any way forward I could think of, but under the circumstances and despite the effort to make things work, the **product development has been shut down** and **the engineering team, myself included, has been laid off**.

> “This sucks.”

In light of my sense of responsibility and to help the company to honor its obligations, I renounced to any form of severance pay and I am providing pro-bono consultancy to our former clients; honoring the agreements the company signed before my lay off.

*Was it all your fault, Matteo?* \
I think some fingers are already pointed at me so I prefer leaving to them being judge, jury and executioner.\
At least I appreciate that, for the most part, we tried to maintain **open and honest communication** within the team.

### Lessons learned

![The end of my first journey in the startup world](https://miro.medium.com/v2/resize:fit:1400/1*pYcyGOw4bDrNeg2sI7Nvuw.gif)

Ten plus one points that I learnt about during this journey, the hard way.

- **Managing a highly distributed team is challenging** but doable with the right software tools and well-written documentation — *Talking about docs, I had the opportunity to bump into [**Joggr**](<https://www.joggr.io/>) lately, keep them on your radar, their product is cool and uses AI (for real).*
- **Having a company playbook is (kinda) useless if not demanded by the team**. You shouldn’t build it as just some people will read it or give feedback. *I can see now why processes are meant to be created bottom up.*
- **Scrum is not always the best choice,** especially at the beginning. Rituals are not useful for everybody anyway — *I will elaborate further about this hot take on a separate post.*
- **Not everyone likes to work remotely** and there is nothing wrong with that, some people enjoy the office or hybrid workplaces — *I personally love WFA (work from anywhere) and visit the office whenever.*
- **Cultural friction is a real thing** and needs to be dealt with, with kindess, understanding and an open mind.
- **It is ok not to get along with someone on the job as long as you keep it professional,** one should not take it so heavily nor try to appeal to people at all costs. *Sometimes it just does not work.*
- **Some people will never tell a manager how uncomfortable they feel, until it is too late**, a good manager should ask and care, even on a personal level.
- **Building a product from scratch is not the easiest journey**, especially if there is only one person structuring it, with no one else able or willing to challenge the choices.
- **Envisioning an MVP is not easy**, at all. Imagining an end product is a thing, but reducing its functionalities to the bare minimum? Amongst the hardest tasks in product development, if you ask me.
- **Code review should not be introduced in an early-stage code base** because it slows down the whole development process, unnecessarily.

Last but not least…

- **Fundraising is a full time job.** I did not believe it at first but it is so true. Getting funds requires a lot of handshakes, utmost dedication, up to the point to give up (some) vacation time or even joining calls from the other side of the world!

### Was it ALL bad?

Not at all. \
I had a good time with my former colleagues both in and outside the office, despite how it ended.

To Aleksander, Antonio, Blagoj, Christel, Daniel, Ivan, Marko, Nuray, Peter and to everyone else I met during this journey:

**Thanks a lot**.

![That would be me at the Golden Gate Bridge, this July (I was kinda suprised by the fog)](https://miro.medium.com/v2/resize:fit:1400/1*y-fkxHXyuOizov7UJLjmFg.png)

*That would be me at the Golden Gate Bridge, this July (I was kinda suprised by the fog)*

### Next steps

*So, would work for a startup again?*

Sure, why not. \
I just might want to check carefully and have more pulse on financial records, team composition, background of the founders — which I think should always be more than one — and cash runway.

*What about a CTO or Engineering Management role?*

Difficult to say but I guess only time will tell!

I will surely keep reading one of my favorites newsletters about Engineering Management by [Irina Stanescu](<https://www.linkedin.com/in/irinastanescu/>), which I had the pleasure to meet during my latest trip in San Francisco.\
Check it out if you really want to dive into EM:

[**Musings Of A Caring Techie**](<https://www.thecaringtechie.com/>)

Insightful even if you are not and not looking to be an Engineering Manager, trust me!

*Are you staying in the Netherlands?*

This is so, very Dutch of you to ask! \
The answer is: most probably not, for multiple, mostly subjective, reasons. \
Language and cultural barrier, definitely missing good food and groceries, lack of a sizable/open *metal* music scene, housing issues, police brutality (*that’s a long and quite funny story, ask me about it*), expensive *and lowkey bad* healthcare, no points of reference… I could go on for a while.

Dutch friends, don’t get too mad at me, I am sure your country can be a lovely place to live in, just not in this stage of my life.

Wrapping it up, **everything will turn out fine in the end**, I only need to take some time and decide what’s next for me:

- Re-start my **freelancing** career?
- With a **renewed love for coding,** maybe considering an individual contributor role?
- with a different mindset and **lots** **of lessons learned**: take another shot at an EM role?
- Going “back” to Italy? Staying in Europe? **Move oversea**?

For sure I will take a small break to consider all the options.

*Break as in “career break”?*\
Sort of! I have quite a list to pick items from:

- Maintaining and evolving [**klab-cli**](<https://github.com/mbianchidev/klab-cli>);
- Contributing to [**open-tofu**](<https://github.com/opentofu/opentofu>) (Terraform but better);
- Start mentoring more people [**through MentorCruise**](<https://mentorcruise.com/mentor/matteobianchi/>);
- Continue to offer [**tech advisory for startups**](<https://www.mb-consulting.dev/service/mentoring-services>);
- Polishing and publishing the draft blog posts that I have been neglecting until now;
- creating a Udemy course, based on my **DevOps course**, adapted from Italian to English and updated to 2023!
- building a website ([in public](<https://mb-consulting.dev/tw>)?) [**for my metal(core) music projects**](<https://www.youtube.com/watch?v=Qod39zRvfns>) in [Astro](<https://astro.build/>) — [Fabio Biondi](<https://medium.com/u/6811aef7b11>) posts on LinkedIn inspired me to try the framework instead of my comfortable Nextjs, thanks!
- revamping my [**substack newsletter**](<https://funews.substack.com/>);
- keep **getting back in shape** — I lost 10 kg of weight in the last year, 10 more to go.

I will not have time to check all the boxes, but some? Definitely.

*Are you open to work?*\
Yes and looking forward to relocate too!\
Feel free to [**send me a LinkedIn message**](<http://mb-consulting.dev/li>) if you think you can offer me a cool role :)

*How can I reach out for mentoring?* \
[**Here**](<https://mentors.to/mbianchidev>) or just shoot a LinkedIn message, don’t be shy.

![The end of my first journey in the startup world](https://miro.medium.com/v2/resize:fit:1400/1*4vF6v02yCmfZJ23NCcgiSw.png)

### The end?

![I just needed a good cover image for the blog](https://miro.medium.com/v2/resize:fit:1400/1*3eJfTWYjshJGmkexRo5bvw.png)

*I just needed a good cover image for the blog*

For reading until the end, here’s a cookie for you: 🍪

Now I’m off to a new chapter of my life, hoping that someone can learn from my first startup experience!

Feel free to comment, share and tag me to discuss.\
Find all my links 👉 [**here**](<https://mb-consulting.dev/all-links>).

That’s all for now, ciao :)

---

*Originally published on [blog.mb-consulting.dev](https://blog.mb-consulting.dev/the-end-of-my-first-journey-in-the-startup-world-236c2292c250).*
