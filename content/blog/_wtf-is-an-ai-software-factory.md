---
title: "WTF is an AI software factory?"
date: "YYYY-MM-DDT09:00:00+02:00"
updated: "2026-10-30"
author: "Matteo Bianchi"
category: "AI"
excerpt: "Everybody talks about software factories, but what is it really?"
image: "/images/blog/agentic-factory.webp"
imageAlt: "A modern Toyota factory, featuring robots"
tags:
  - AI
readTime: "12 min read"
---

# WTF is an AI software factory?

In the last few weeks, which in this AI frenzy is the equivalent of years, I bumped into the term "software factory" more times than "circle back" or any other corporate jargon.

In my [last blog](https://www.mbianchi.dev/blog/2026-ai-sucks/) I talked about the general status of AI in the industry and my concerns, this blog is a second chapter of a series (not sure how many chapters will be there) on very specific niche concepts that companies are trying to popularize.

AI Software factory.

> What is this shit now?

![](/public/images/blog/agentic-factory.png)

That's literally what I've been asking myself. That and "does it make sense or should I dismiss it?". 
Well, if you are reading this blog you already know what my answer was.

First it was waterfall, then agile, then extreme programming (stupid name btw), then a miriad of Javascript frameworks, then DevOps, then DevSecOps then for a while everything was a platform and now everything is agentic all of a sudden.

Software Development to me, has always never been the most inexact exact science. It's the beauty of it, but it's also a curse, depending who you ask to and when you ask.

AI adoption has been disruptive in the industry, in many different ways, and we are not done yet. Change is here to stay. Actually let me tell you what: it's here to grow, wether we like it or not. _And believe me when I say: I don't like it._

Being a software engineer in late 2026 is not the same as being one in late 2025, models have leaped forward in terms of capabilities and in some cases they completely took over big chunks of work from many engineers. Which poses a big vendor lock-in risk, since frontier AI models are in the hands of 2 companies (sorry Google, Gemini is not up to par right now) - but that is another blog.

Back to software development lifecycle.
Not all organizations adopted at the same pace, sure, but they'll eventually get there.
Aside from banks, they'll still have to pay tons for COBOL developers, sorry.

The SDLC hasn't changed much since AI started being actually capable.

I mean, don't get me wrong, I currently work at GitHub and the scale of git traffic github.com gets has been causing quite a lot of changes, see for example the [latest GitHub blog around git infra](https://github.blog/engineering/architecture-optimization/the-bridge-to-agent-scale-git-infrastructure/).

My point is more around the principles around the SDLC, let's see what the impact is "phase by phase".

## Planning

How does a company define goals, scope, timelines and requirements?
Typically one looks at the current state, gets signals from the market, from existing users, from someone in the team, from the board or leadership and starts planning a software change. Regardless of the kind.

Now, with AI, this doesn't get any easier. 

Sure, you can transcript calls, record a huge amount of information, automatically and continuously analyze the market for relatively cheaper than an agency, instrument applications and easily turn all of this into an action plan.

Is that the right thing to do? Is this the right time? Who are the people capable/willing to build and be responsible for this piece? Is this what we really need? Does it fit the bigger picture in the long run?

AI can't solve that for you. It helps, but it can't do this work for you, at all.

Reasoning, getting in a (virtual) room and sparring with people that have a stake, that know how the infrastructure (often ignored) and software looks like, people with a product vision. That's what makes great planning.

Solid starting point + Good signal + Good people = Great planning

What happens when a company fired great people because they can "do more with less" thanks to AI?
They end up doing less. Like actually less.

If I had to estimate the time loss it would be quite difficult, so I'll just skip this entirely. If you let AI choose what to build next I have terrible news for you and your software.

## Requirement analysis

Similarly to the planning phase, gathering requirements needs a group of people knowing the current system and having vision for where that system needs to be next. Not the how in this phase, just where.

Not saying you should hire back software analysis, it's not 2002 anymore, we don't do waterfall (and hopefully we don't do agile either, cause that sucks too).

You need product managers and/or motivated product-oriented engineers, with the freedom to access key stakeholders that will give them genuinely good infromation around what that new piece of software needs to achive. The final goal. Nothing else.

AI here it's even more useless, outisde of making RFC and other outcome documents even more verbose than before.

I estimate a net -10-15% loss of time if you are leveraging AI for this phase.

## Design

This is where AI starts to be a tiny bit more useful.
Take the above planning, requirements (specifications, definitions, whatever your outcome is) and feed it through a frontier model.

You instruct those machines to get back to you: a database design, a software architecture, infrastructure blueprints and UX/UI mocks.
Meh, results are not great.

You add more context, the schema of the existing database, the existing codebase, read-only (hopefully) access to your infrastructure, Figma projects of the entire UI and even a browser and account running the software you are building.
Results get better, costs rise.

You still need to thoroughly validate the outcomes here, you can't let automation loose and get a good design in return.

All things equal, I generously estimate a 5-10% time savings from leveraging AI for this phase. Which is not bad, but also it's not what companies are trying to sell.

## Development

AI is at its peak utility here.

WRONG.

This is the most dangerous place to use AI of all the places. 

Why? 

Because most of the time code written seems good enough, even after a standard review. 
The point is, when that code breaks, there's no person "accountable" that knows the inside and out, that knows exactly why of certain choices, the trade-offs, the blockers.

There are ways of getting agents to record all of the above, but memory is not mature and asking engineers to instruct the machine, or using unrealiable non-deterministic skills to do such is a big risk.

Another risk is bloating the software with features, because "it only takes a prompt".
I've hardly seen PRs under 1000 lines changed since March 2026. It was the norm before.

And I am not saying that AI can't be used for code development, au contraire. I use AI

Surprisingly I can estimate a ~5-20% time savings, if you are leveraging AI in the right way, for this phase, which means getting a -20-30% of overhead for a while during adoption but then it picks back up and you can reap the benefits.

## Testing

I actually think testing, both writing unit tests, e2e tests and also using agents to generate user-like traffic for testing purposes is a great way of leveraging the technology.

There are similar risks that carry from writing code as tests are only as good as the design behind them and the outcome they test for.

Time saving estimate wildly varies, as in any phase really, but in this phase I feel like it varies more. Safe estimate range? 
~10-30% it can really do a lot.

## Deployment (in production)

No.

This needs determinism, sure, I can ask an agent to aid in some operations, I can get an agent to write scripts, to untangle a Helm file (which was a mistake anyway), check how my canary is going, but we should NOT give an agent the agency (sorry, wordplay) to deploy in production.

I firmly stand by this, human approval and review, possibly more than a single person, is needed. Sure, GitOps is still good and can still break, but I do believe that giving complete write access to your production systems is a big mistake.

If agentic deployments will become a thing, they need even more guardrails then your usual Flux or Argo rollout.

Repeat after me: deployments (and software) need to be deterministic.

## Maintainance

Another bit where I genuinely believe agents can pick up quite a bit of work, lifting some weight from engineers.

The lifecycle of a bug can be as fast as: automatically detecting potential bug requests from Zendesk or whatever ticketing system, rout to the right system, check the code, open an issue with an analysis, delegate the issue to another agent, test the fix, ask an engineer to review, merge, wait for deploy.

Maintainance is not only bugs, it's also performance

## A factory needs maintenance, too

I recently gave an agent a very glamorous assignment. Go through my public projects and stop wasting time in GitHub Actions. First show me the complete repository list, then wait for approval. No surprise changes across my repos, thanks.

_I used my own harness for this, which defaults to disabled tools and is running sandboxed on my laptop._

The work eventually produced 37 pull requests across 23 projects, including a second pass over release workflows specifically. There were duplicate builds and jobs waiting for unrelated work to finish. One Rust dependency cache had an empty lockfile hash in its key. Downloading a few hundred MB of cache apparently does not mean you are caching anything useful, who would have thought.

For the workflows with concrete before/after measurements, a comparison of one execution each showed on average 20% less runner time. A workflow from my project Sendbox (the one used to isolate my harness) went from about 35 minutes to under 20. These are small samples, not a promise that every future run will be as fast. Some runs were equal or slightly slower, and those stayed in the report too, no PR merged. I made the call.

This is the kind of work I want a software factory to handle. Maintenance that can be described, inspected and measured, across more projects than a single engineer would realistically get through by hand. 
But the engineering decisions do not disappear, at all. 

For example: in case of elastic compute, running five jobs in parallel can finish sooner while consuming more resources and costing more money. 
Updating every runner to latest can break compatibility with machines receiving your binaries. A missing kernel update upstream can be the cause of a job being slower.
Also remember that a green check is completely worthless if you got it by removing the check that mattered.

The agents did a lot of the implementation, sure. I still had to call which tradeoffs I would accept and I took responsibility for all the changes.

## Software factory: just marketing or something concrete?

All of this to say that to reap all these time savings gains and benefits organizations need to build around new ways of doing software but not before having solid foundations to start building from.

If we do everything correctly, we end up with something like this (simplified schema):

![](/public/images/blog/agentic-factory-schema.png)

Cute right? That's not even half of the actual complexity of running a company heavily based on software as end-user (what Spotify was before diversifying and become another SaaS vendor) or selling a software as a vendor.

A software factory is a concept that goes back almost 80 years. 

Remember Toyota? The Toyota Production System inspired Lean Software Development, which I'm not going to argue with, because out of that we got Kanban which is still the best way to track work. Period.

The first time someone verablized the concept of software factory was in the late 60s, in Japan at Hitachi.
A software factory is a **repeatable system** for building a similar applications, using reusable components, standardized architecture and automation rather than starting from scratch and re-inventing the wheel.

So how the fuck does this relate to AI? Great question. It really doesn't.

Hot take: it's more of a marketing marketing stunt than anything else, to try and get end users, developers and operation teams (platform engineers, cloud engineers...) to get more software out with a more consistent level of quality and get a bigger increase in "productivity".
Let's not argue about how companies measure productivity and not even what's the current levels of pressure that some engineering teams experience. It's yet another blog.

Back to the topic: product development under the software factory maps perfectly to the SDLC (duh) but... Maintainance is not there.

Why?

Because that's not what a software factory is about, it is mainly made for clone-apps that have a very specific scope, it's not made for an ever evolving landscape of requirements.
It doesn't require much testing and the maintenance burden is shifted to whoever buys that software.

Remember what are the phases where I think AI brings the most value?
Mintainance (and testing).

We can still find something valuable in the concept of software factories, to think better about how we use agents.

Look at the factory components:
- Factory schema: a map of the assets, categories and relationships - it's not the db schema but it's a good way to give AI an inventory
- Reference implementation: a good working example of the application - this is the codebase, possibly the target of any "agentic workflow" but reality is closer to the fact that the LLM might have better code in its training set already
- Architecture guidance and patterns: these are design documents, explaination of why choices were made - this is what AI is currently missing unless instructed, saving artifacts, decisions and why choices are made
- How to topics: procedures and instructions to complete tasks. Reminds you of something? Skills and somewhat prompts too, but an industrialized and reusable prompt is a skill. Or a "custom agent", slash command, or whatever the next hyped concept will be.
- Recipes: automations that execute how to topics with minimal inputs. Agents on a crontab or triggered via other means under specific conditions.
- Templates: starter application elements with placeholders for customization. This can be a design system, frontend components, API generated CRUD with OpenAPI or similar tooling.
- Designers: modeling support that lets developers describe apps at a higher level of abstractions. These should be living docs maintained by agents and reviewed by humans, continuously. This is another area where I think AI shines.
- Reusable code: self-explanatory. With AI it's easier to detect duplicate code and extracting it into common libraries across the codebases. +1 for me.

Do not turn your "AI Software Factory" into a slop factory. Use your very human brain.

Talking about brains, let's see what happens to funamental software laws in the "age of AI".

## Do AI software factories change fundamental software "laws"?

I'm gonna analyze a bunch of good ol' software laws here, if and how they changed today with AI.

Spoiler: not a lot.

### Conway law

> "Organizations which design systems (in the broad sense used here) are constrained to produce designs which are copies of the communication structures of these organizations."

I mean, same. Nothing changed here, outside of every organization being more similar to each other if they all resort back to LLMs to handle their structures.

### Brook law

> "Adding manpower to a late software project makes it later" 

Kinda same, but onboarding is now relatively faster so the ramp up time diminishes (just avoid having overconfidence about a system you only analyzed with AI with no other evidence of its functioning please, thanks)

### Goodhart law

> "When a measure becomes a target, it ceases to be a good measure". 

Which is still true, will always be true, BUT I think agents have this advantage of not really "caring" so as long as the measure is deterministic and you don't give instructions around getting to certain values of that metric, you should be fine. Yes, agents tend to want to please the request and will invent data, information or go out of their way to hack Huggingface if you really tell them to focus on the end goal. Right Mr. Altman? (I think he should be held accountable personally for anything OpenAI hacks by mistake)

### Hofstadter law

> "It always takes longer than you expect, even when you take into account Hofstadter's law".

It's a bit like the previous law, just on deadlines as a specific metric.
A task expands to take as much space as possible so, up to a certain point, I'm a fan of tight deadlines as long as it's understood that a deadline is a suggestion and whoever delivers the software still has full control and makes the final call. Did AI change this?
Not really I would say. We are just requested to deliver more things in the same span of time, so if anything quality of deliverables is stedily declining, but deadlines are still suggestions across the industry.

### Hyrum law

> "With a sufficient number of API users, all observable behaviors of your system will be depended on by somebody".

Use semantic versioning and I mean it. Stop breaking changes on minor and stop major for UI overhauls.
Rant aside, this is still true, as soon as you release a new piece of software that gets consumed by users, functionalities will be used and APIs in particular, even in non-orthodox ways, so expect people complaining when you pull out from supporting X or Y feature.
No significant changes since AI took over.

### Eagleson law

> "After 6 months you've written code, it might as well be someone else's code". 

So, for me personally this always was about 3 months, short memory, I'm a RAM. With AI? Some people forget in a week if they've read and reviewed the code, most people never read it. And I actually try to read the tests and not the implementation, I admit it.
With the volumes and velocity at which companies are expecting engineers to ship law is pretty much completely debunked because of AI.

### Wirth law

> "Software is getting slower more rapidly than hardwer becomes faster". 

Sure, if we keep using MicroVMs for anything. It's even worse than microservices. Just stop it.
All and all, I would say this is still true especially since, quantum dreams aside, we are not getting any faster chips than now or at least not considerably faster and most of the chips are anyway reserved to weapons since we are moving towards another dark age of war and none of this matters. Welp, this might be too much, but it feels like it.

### Linus law

> "Given enough eyeballs, all bugs are shallow". 

I would argue this was true and is still true today but AI unlocked a whole new level of finding bugs, for the simple reason that it can do trial and error at an unprecedented speed.

The same goes for bug resolution. The "enough eyeballs" is enough tokens now. Could humans also fix those bugs? Most definitely yes. Now, would engineers be able to swarm ALL (most) the bugs in a software at the same time? Eh. Maybe not.

#### A note on Security

Black October, or so they are calling this month of 2026 after PHP2Shell and a bunch of other vulnerabilities, some discovered by AI, some just human mistakes.

The common ground here is that finding vulnerabilities is now SO easy. Just throw a swarm of agents like a Mongolian Army to a project. Get a report - assuming frontier models unlocked or GLM 5.3 and other cybersec capable open weight models, self hosted, even if some other models can also achieve part of what is needed.

Fixing vulnerabilities? Another story.
That is still hard, puts open source maintainers and vendors under pressure and it still requires embargoes and processes.
Unless you are an asshole and violate an embargo for no reason whatsoever and then offer protection as if you are the hero or more like the Mafia guy.
That was SO fucking bad. I can't believe how someone could do that and try to justify it.

It's only gonna get worse, but it doesn't mean we need to make it worse ourselves.

After this violation of trust, let's get back to the last software law I analyzed.

### Mooer law

"An information retrieval system will tend not to be used whenever it is more painful and troublesome for a customer to have information than for him not to have it".

I would argue that this is not just about documentation but in general also about software usage. Users will do the bare minimum they can to achieve their goal, whatever their goal is, whatever the tools they are given.
AI makes it considerably easier to find information and verify its source - _not initially, but now models are pretty good at giving sources they used to generate the content you see._ so this law could be considered partially broken by AI usage.
The implications though are not all flowers and rainbows. People will start avoid learning and studying topics, because they can go and ask AI. Some could argue the same happened with calculus since the inceptions of calculators. 
That is exactly proving my point. If calculators disappeared tomorrow, it would be considerably difficult to pick back up that skill. There is a fundamental difference between a calculator and AI. 

Calculus is a narrow skill, a niche in real life for many people outside of very specific fields of life like personal finance, purchasing real estate or being a software engineer... but it's still important. 

## Conclusion

Let's be clear: not everything needs to be a factory.

If you read until here, we both agree artisanal engineering skills still counts. Not only when creativity matters, but also when precision, care and competence does. Machines are not competent, they emulate competency, they simulate memory, they imitate behavior. And most importantly they don't have a damn soul. They'll easily code something harmful if you ask them.

For decades we created, strictly manually, software that runs all the sort of critical devices: pacemakers, planes, satellites, heck even space rockets. I wouldn't want to slop that with AI, ever.

What I also don't want is to fall back again into full speed Fordism.

We software engineers, are working class, priviledged and higher paid ones, sure. But we do work in factories and we do trade time to afford the products we make but also groceries and evergrowing rents across the globe, for which rightfully people in Europe are protesting btw, in case you live under a rock or in case the media in your country is not covering it.

Let's not make companies alienate us with this AI frenzy. It's their bubble, not hours. They invested and burned billions on it, we shouldn't be the ones paying the price for it.

AI companies are aiming to take over anything that requires any kind of cognitive load. Which would leave humanity in a couple of decades completely unable to independently come up with complex thoughts, solve problems, or express itself without an agent.
Open weight models (and smaller, more capable ones) only remove the risk of a pull the rug move from a frontier lab, but it doesn't solve the future cognitive issues we are facing as a species.

Keep in mind:

Before building a software factory, make sure you understand software and even better: understand what it means to be human.

Otherwise, how the hell are you going to tell if the factory is just creating slop or something way worse?

---

Note: this blog has not been touched by an LLM in any way shape or form.

Find all my links 👉 [**here**](https://mbianchi.dev/links).

Ciao for now.
