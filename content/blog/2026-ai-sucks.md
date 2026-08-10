---
title: "2026 AI sucks."
date: "2026-08-10"
updated: "2026-08-10"
author: "Matteo Bianchi"
category: "AI"
excerpt: "My previous blog on AI started with me complaining: I cannot take it anymore, ChatGPT is everywhere. Let me rephrase: I cannot take it anymore, AI is everywhere."
image: "/images/blog/2026-ai-sucks.webp"
imageAlt: "Dario Amodei (Anthropic) and Sam Altman (OpenAI)"
tags:
  - AI
  - Open Source
readTime: "10 min read"
---

# 2026 AI sucks.

My [previous blog on AI](https:/mbianchi.dev/i-dont-like-chatgpt) started with me complaining: I cannot take it anymore, ChatGPT is everywhere.

Let me rephrase: I cannot take it anymore, AI is everywhere.

The point is for me to write down something to understand if I still dislike AI as much as I did in 2022 or not.

> Note: I am still no AI expert, but I'm surrounded by quite some, I read papers as a pass time activity, I use AI heavily every day for coding and I haven't been living under a rock.  I mean, I wish, but I did not.

Since I want this to be sharable and readable by the masses: let's build a condensed glossary and pardon in advance, my fellow Machine Learning engineers and LinkedIn AI PhDs. I won't DELVE super deep into any topic, because that is not the point of this blog.

One last thing before we dive into this.
This blog has not been drafted nor reviewed by AI, it has been written by me, a human, and it will contain some mistake since English is not my native language. Enjoy.

## Glossary

> Note: You can skip this part if you work in tech and know about AI, but read if it not.

**Artificial Intelligence (AI}**, the all encompassing term, do not use it unless you refer to the industry as a whole or you use it as a specifier for what comes next. 

Example: AI (powered? infused? assisted?) Software Engineering.

It is still not so precise, but still.
Artificial Intelligence existed way before LLMs. We trace back to the 50s, after Turing shared his theory of computation. (p.s. have you seen the Imitation Game? Great movie.)
Artificial intelligence was already used in many different fields: pattern recognition in packaging/manufacturing industry, cancer research (been there, deployed those very useful models), gaming even, to make NPGs able to navigate areas of the map, and so on.

_So no, Billy, AI was not born yesterday, it was born a couple of decades before._

**Training** it's the loop that Machine Learning engineers use to make better AI models, it takes data (big data), lots of GPUs or TPUs (TensorFlow Processor Unit - which is a very fancy GPU but for AI, owned by Google), takes a lot of resources - _yes, water, electricity and all that a datacenter needs_ and lots of time.
I'm not going to venture into the environmental implication of AI training, or usage.

**Large Language Model** also known as LLMs, these are AI models, mostly neural networks which are trained on a giant amount of copyrighted text, the aim was to making them good at Natural Language Processing (NLP) which boils down to: language generation. This branch of Machine Learning studies exploded quietly when in 2017 Google DeepMind released the infamous paper "Attention is All You Need", which is an ironic choice of names since AI is basically destroying the concept of attention for most office workers.
Anyway, after that it was a slippery slope. OpenAI took the concept of transformer, which, not to go too in depth, made sure that once stupid language models could actually ""focus"" and read entire words (if you ever hear token, tokenizer, imagine those as syllables) and created their first GPT model. GPT-1.
GPT should mean Generative Pre-trained Transformer, or something, it's not so relevant.
This gave birth to the name GenAI, which is so 2023. We don't use that.

**Foundational Models** are standard AI models (not just LLMs) but trained with so much data that they (can) become multimodal, which means they accept and elaborate text, audio, video in the same iteration. These models become the foundation of other smaller models (distilled/quantized) or they are used in building other models, building software. You probably used some of these if you touched ChatGPT/Codex recently, or Claude (any Claude: Code, Desktop, whatever CoWork something something), Microsoft Copilot, GitHub Copilot  _yes, they are two very distinguished products despite what the unfortunate naming suggests_.

**Frontier Models** are the most modern AI models out there, think Fable and GPT 5.6 at the time of writing this.
_Fun to write something that could be obsolete in 2 months, huh?_
These models have emergent abilities, allegedly (or not): self-improving, faking alignment, multi-step reasoning, taking over HuggingFace when unsupervised by escaping a machine that was virtually isolated from the underlying network, and so on... Depends on which marketing you believe the most.

**(AI) Model** - a general term that I will use to refer to the above.

**Reasoning**, is a sort of internal loop that the model is trained to perform before solving a given task. It breaks down the user request into smaller chunks, it can create graphs and todo lists to increase its success rate.

**Alignment**: have you played Dungeons & Dragons?
Exactly that same mechanic. A model's alignment is the sum of "believes" (I hate humanizing models) and how the model sees the world in its different aspects.

**Inference**. Very simplified since I'm already writing too much: the act of serving an LLM to users via an endpoint / API. So that a user can... use it.

**Agent**, how many times have you heard this word in the last 24 hours? I propose a shot every time someone says "agent". How about that? Drunk in about 12 minutes. 
An agent is not a single unit, it's made of the AI model (can be any form of AI model), tools which are hopefully deterministic (right, MCPs?), an orchestrator which can be a model or can be a human set of instructions in a loop, optionally memory about the context the agent is working on/with.

**Harness** a piece of software used to launch agent(s), typically for coding tasks.
There are many harnesses out there, some I quoted already, some are open source like OpenCode and I am even building one - which is a fork of OpenCode, nothing too fancy but I just want the agent to be steered as I intend.

## AI is changing the way of working (with code)

First of all, I do not use AI and do not support its usage for:

- **Human interactions** - At least in our private life, while at work I understand it could happen and to me it does. Especially if I'm requested detailed report involving multiple sources including Salesforce data. Everything still gets double checked by me.
- **Music** - Fuck whoever composes music exclusively with AI. I personally will never use it to compose music or write lyrics. I am using it to develop systems like a VST (plugin for a Digital Audio Workstation), a software to split track for vocal covers, extracting instrumentals from YouTube and such, but never to directly create music.
- **Art** - Fuck AI art. Even if I am developing a videogame with the aid of AI, it's an experiment. For any artwork in case I ever publish a proper game I would ALWAYS pay an artist. I don't draw/paint but I would not use it for that either. I would also not buy an AI generated painting. Different is if someone uses AI to get a draft/guideline but then they paint on a canva, that can be fair.

![Dario Amodei (Anthropic) and Sam Altman (OpenAI)](/images/Amodei-Altman.jpg)

*Photo © AFP*

This is despite what the two AI Overlords above think.
You are not gonna substitute any profession, you are not gonna take any jobs.
Whoever fired for AI had to re-hire after realizing the grave mistake they made. I have seen this happen in multiple companies.

I think I am open to use it for everything else. 
Education can benefit from AI, when used wisely, scientific reasearch surely does - e.g. see AlphaFold, used to find new proteins at a cheaper cost. There are good applications of this technology, I can't and won't deny that.

### So how do I use AI today?

My main use case is coding, in different ways, but mainly for:

- **Maintaining** my side-projects.
- **Creating MVPs** based on ideas I have had for years but had not time to develop.
- **Enable** me to contribute more on the engineering side, since my current role is Sales and I do not get time for doing that.
- Generally to get **more things done quicker**, compromising just a tiny bit on quality and maybe a bit more on direct code knowledge.

I can only talk for code, I am an office worker in that domain, but I genuinely think AI is also changing how lawyers look stuff up for their cases, how doctors look in their patients folders - assuming they digitalized them, but not every country has that priviledge...

In short. The following chapter is mainly about code and it is my very personal experience and view on coding agents.
I tried many tools, from Claude Code, to Codex, OpenCode and also, obviously, GitHub Copilot, since I get it to do my job and because I'm an open source maintainer I also had it before joining GitHub in late 2024.

I didn't use AI heavily for coding since about February or March this year. I would mark this to when the model known as Opus 4.6 came out.
Before then LLMs generated shit code. Let's face reality. It was good for boilerplate or for annoying manual tasks, maybe some very bare bone interface, but real backend code? Meh.

Opus 4.6 is the first model that made me go "oh, I didn't think about that" and later models like Opus 4.8 and GPT 5.5 (xhigh) made me go "I couldn't have written better code or actually I just plain had no idea this was possible".

I developed my own method, possibly shared with other tech workers, to direct agents in a way that works for my brain.

I tend to adopt these ten phases whenever I get AI to perform a non-trivial coding task:

0. **Instructions**, AGENTS.md drafting, context gathering/cleaning
   Stating the obvious here, but what I tend to do is ensure that any coding agent has a breakdown of the composition of the current code, tech stack, aim, features, particular patterns, architectural choices, or that the agents generates it, when I work on greenfield projects.
   
1. **Idea / Brainstorming**
   I do the so called rubber-ducking with the agent, which has been possible only with frontier models, since the older ones where basically a bunch of sycophants.
   New models seem to know how to be adversarial and contest wrong assumptions.
   
2. **Planning**
   This is one of the phases where I iterate the most and I interact with the agent asking to get clarifying questions. For one project I actually got 200 questions and I've spent over a day in the planning phase. 
   
3. **Tests creation**
   The first code I get the agent to write is backend tests, in whichever language, even if I tend to prefer one that I am proficient in so Golang or Python, I can still read pretty well Rust test code.
   Interface is usually not in scope, I avoid implementing frontend until I actually see green tests in the backend.
   
4. **Tests review**
   After I review carefully the test cases, correct them and explain my aim better, I get another review pass and I feel confident at this point that the results of the workflow are going to be satisfying.
   
5. **Execution**
   Since I use agents either via my work laptop, in a cloud virtual machine or in a local [sendbox](https://github.com/mbianchidev/sendbox) (it's not a typo, it's a sandbox for agents that I am building... with agents) I leave the coding agent to just execute freely in "yolo mode" or autopilot, whatever that is called by the tool I am leveraging.
   
6. **Automated checks**
   I heavily use CI (lint, build, test) and automated code review, to surface findings. These are all reviewed by hand, slightly corrected if needed and applied to the current code.
   
7. **Human code review**
   After every check is green and I'm happy with the result, I perform a human code review, focused on the core parts of the code, especially anything touching cryptography/network or manipulating data.
   
8. **End to end testing**
   I then make sure to either add automated e2e tests or launch a Playwright session where I make the coding agent itself actually try the feature and catch any UI/UX (minor at this point) problem.
   
9. **Manual testing**
   Round of manual testing for a couple of uses of the feature/product that the coding agent has built.
   
10. **Merge**
    Last but not least: merging and starting again from number one.

This is how I've built a bunch of different projects since March, some of which I use daily:

- **[sendbox](https://github.com/mbianchidev/sendbox)** - An all-in-one sandbox for agents, integrated with devcontainers based on kata-containers
- **[porto](https://github.com/mbianchidev/porto)** - A self-hosted apps orchestrator
- **[SQL not-so-lite](https://github.com/mbianchidev/sql-not-so-lite)** - Lightweight SQLite-as-a-service daemon with gRPC API and web GUI
- **[killswitch](https://github.com/mbianchidev/kill-switch)** - A low footprint resource manager and utility for your MacOS
- **yt2karaoke** - The must have for all good parties, convert youtube videos into karaoke experiences (powered by track2stem)
- **Scream Forge** - A VST for metal singers, includes a chain with: a compressor, EQ, pitch up/down, echo/reverb, de-esser and more
- **[Track2Stem](https://github.com/mbianchidev/track2stem)** - Separate any track into multiple stems, with the cool kind of AI (Hybrid Spectrogram and Waveform Source Separation)
- **[AnyTrack Converter](https://github.com/mbianchidev/anytrack-converter)** - Convert any audio file or YouTube video to any format, with metadata editing
- **[Open Playlist Engine](https://github.com/mbianchidev/mbianchidev/blob/master/mbianchidev/open-playlist-engine)** - The first implementation on top of the open playlist idea, mainly helping users migrating off Spotify to various targets

You can find more of these right in [my GitHub profile](https://github.com/mbianchidev/mbianchidev/blob/master/README.md).

## Then why do I STILL hate AI?

First of all, I don't.
I would be a hypocrite, I sell AI for a living (for now).
I just do not think it's magic and it's going to solve all the problems in the world in a whiff.
Sure, it has benefits, but there's another side of the coin as well and nobody talks about it (enough).

> **Full disclosure**: I work for GitHub (Microsoft) and what I write is only my personal views, this does not reflect the views of the company I work for, clearly. 
> Hi colleagues, if you are reading this!

I hate when people use AI blindly, for everything, almost stopping to user their once functioning brains.
I definitely hate seeing my local metal venue using AI for posters when there are plenty of talented and hard working artists they could go to.

I like when it's used for refactoring a legacy project or porting a library from Python to Rust to enhance performance.
I like it when it's used as a tool.

_BUT I would still like software that is deployed on airplanes, self-driving cars, banking systems or healthcare apparatuses to actually be carefully written by humans, and well qualified ones, thanks a lot._
Your webapp will not save the world, we can afford an impossible-to-find bug that is so well written to actually seem pretty ok, even to an experienced engineer reviewing _been there, approved that_.

I hate when companies, even good ones, have been convinced that changing their copy to include AI in every single sentence in their website will make it better for them.
I honestly feel betrayed by those.

I like when companies, use AI for what is good and understand that engineering has never (ever) been about writing code, but a lot about understanding reality, codifying it into abstracts, human and system interactions, design, integrations and finding patterns in data. Possibly without selling them on the black market. Right, Meta?

I always hear this phrase and it sickens me: _"Humans in the loop"_.
Humans are not in the loop, they must be loop.
What do you mean you gave access to OpenClaw to your entire machine?
What do you mean you named your agent and you TALK to it and address it as a friend? Maybe about your (mental) health too?

I'm not saying AI in 2026 sucks, I'm saying that how a lot of people use AI or plan to use it, sucks. 

## A hope in the open, maybe?

Ethical stances and ranting aside, which can go much deeper into how AI data labelling at the beginning was performed by underpaid workers in third World countries and how copyrighted material has been used for nearly all models developed so far.

I have in mind a romanticized version of a better world in which corporations do not own generative AI models and everyone can self-host their little AI, in the comfort of their home.

This has been made possible by a myriad of open wight models, mainly by Chinese labs in opposition to the American giants (mainly OpenAI and Anthropic).
These models are making it possible, even if so far just with tens of thousands of dollar spend, to buy hardware and build an off-the-grid AI lab.
Examples: Kimi (Moonshot), GLM (Z.ai), DeepSeek, but also: Qwen (Alibaba), Llama (Meta), Gemma (Google), MinMax, Codestral (Mistral)... there might be more but I didn't hear of those.

Oh an please repeat after me: the Open Source AI Definition (OSAID) is a joke and there is no such thing as an open source model if you do not provide, on top of the model: raw data, training methods, complete hardware specs AND weights. Yes, not everyone can reproduce it at home, sure. But anyone should be able to re-train the closest model possible in order for one to be truly Open Source. Otherwise we are just enabling companies to do Open Source washing.

Another issue of closed source AI is the environmental price of training, which seems pretty massive if compared with some of the open weight models and the actual price people are supposed to pay, which is currently fully sponsored by VC money or NVidia money which comes back in a fake accounting trick, not so different to what Lucent Technology and Cisco did back in the days.

![A schema showing the 2026 circular investment schema between various companies: Microsoft, OpenAI, NVidia, Oracle, AMD...](/images/OpenAI-circle-investing.jpg)

Marvellous. I am very very interested in seeing where the open road brings us in the future and how does the investment-jerking ends up.

## Is AI a bubble or not? 

The current AI Bubble is very different from the dot com bubble of the early 2000. 
And no, I don't mean it as "this time is different". I mean it in a bad way.

This time there is not a problem to solve. 
Back then connectivity did not exist.

This time the problem has been artificially created (and scarcity of resources too).
Back then it was a need, amplified, hyped up, but still a need.

Now companies and investors are seeking to assign AI some sort of value AFTER all the investments and money circle-jerking that NVidia, Anthropic, OpenAI, SpaceX, AWS, Microsoft and Google did between themselves.

So it is a bubble or not?
The right question is not whether this is a bubble, the right question is: when will this burst?

And if it doesn't I'll be filthy rich and early retired well before 40, so good job me.
I unfortunately don't think so.

## Are we living an AI Cold War?

AI is fundamentally broken. 
It is not democratic, like the internet was not democratic back then. It could be commoditized at some point, but costs are still painfully high.

Not only it is broken as an industry, but the war on chips is real.
Sure, there's no "two united front classic humanity move" going on, so far.
It's slower, it's the hegemony on Taiwan, it's making sure ASML keeps improving.
There are so many moving parts and this probably deserve a separate blog.

But,have you seen regulations around AI and trade? Have you seen what happens when someone decides that AI is suddenly of national interest?

I'm not saying there's an AI Cold War, you are saying that.
Maybe I'm being pessimistic, right?
I mean, I definitely am a pessimist by nature but I have some signals to share.

Look at the economy. Inflated as ever.
AI is not the trillions of addressable market that everyone believes it is and the SpaceX IPO kinda proves my point.
Anthropic and OpenAI will probably take that demonstration even further, if you ask me.

What about AGI (Artificial General Intelligence) or, what will happen when AI will be better at any single given task compared to a human?
Let's say we get this so called superintelligence.
Will it be State controlled? Nothing good can come out of it.
Will it still be in the hands of a few AI players? Guess.

Nothing good can come out of it.

It's utopistic to think that we will only use AI for good.
We have proof in Palantir and other AI Military companies. AI, as any other tool created by mankind, is used for war.
Superintelligence makes no exception.

On top of this, we already saw what social media algorithms turned the world into.
Imagine an algorithm that tailors everything even more, AI ads, AI generated content convincing people who to vote for, it's already happening it is not written in a sci-fi book.
1984 is more likely to happen in 2036.

AI can create a personal echo chamber, a scarily realistic alternate reality, built on top of one's beliefs.

This is why we cannot afford to delegate thinking to AI.
We need to stay vigilant and we need to stay human.

---

Find all my links 👉 [**here**](https://mbianchi.dev/links).

Ciao for now.
