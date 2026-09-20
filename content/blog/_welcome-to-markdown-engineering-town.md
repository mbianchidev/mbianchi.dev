---
title: "Welcome to Markdown engineering town"
date: "YYYY-MM-DDT09:00:00+02:00"
author: "Matteo Bianchi"
category: "AI"
excerpt: "Markdown still documents software. Now it also tells coding agents how to work, where to look, what not to touch, and when to stop."
image: "TODO"
imageAlt: "TODO"
tags:
  - AI
  - Engineering
  - GitHub Copilot
---

# Welcome to Markdown engineering town

*Markdown still documents software. Now it also tells agents how to work.*

Back in my day, Markdown was for notes and documentation.

By "back in my day", I mean roughly five years ago. Still.

*It's Markdown engineering time, bitch.*

Today we use Markdown to give coding agents persistent instructions, define specialists, package reusable skills, load knowledge, and automate repository work.

In February 2026, GitHub put [Agentic Workflows](https://github.blog/changelog/2026-02-13-github-agentic-workflows-are-now-in-technical-preview/) into technical preview. You describe repository automation in Markdown, compile it into a GitHub Actions workflow, and let an agent handle work such as issue triage, CI investigations, code review, or documentation updates.

Markdown now carries decisions that used to live in YAML, runbooks, and somebody's head.

I call the practice **Markdown engineering**.

> **Full disclosure:** I work for GitHub. These are my personal views, not my employer's.

## What I mean by Markdown engineering

> Markdown engineering is the practice of translating engineering knowledge into structured, versioned instructions that agents can use to plan, act, and verify work.

I see it as prompt engineering v3.

Prompt engineering was about phrasing one request.

Context engineering was about deciding what the model could see while answering it.

Markdown engineering turns both into files that persist across sessions, compose with other files, and control repeated work.

Yes, I made up the term. We have all suffered worse terms.

## The second word matters

How do you become a good Markdown engineer?

The emphasis is on **engineer**.

There is no shortcut. You need enough engineering knowledge to describe the system, recognize a bad decision, predict failure modes, and verify the result.

AI does not remove that responsibility. It makes the consequences of weak judgment arrive faster.

Does this mean juniors should avoid AI?

No, Jimmy.

Use it to learn. Ask it to explain unfamiliar code, generate tests, challenge your assumptions, and show you alternatives. Do not ship code you cannot explain.

If an agent produces 500 lines in 30 seconds, somebody still needs to know whether those lines solve the problem or quietly create three new ones.

I trust Linus Torvalds with a coding agent. I do not trust Bob, who lets an agent reply to me on Slack while he's on vacation. Or my uncle who asked ChatGPT to make him an app to generate infinite money.

## The layers of Markdown engineering

I see about five layers. You do not need all of them on day one.

### 1. Instructions tell the agent what your standard(s) looks like

This is where most people start and stop.

GitHub Copilot supports repository-wide instructions in [`.github/copilot-instructions.md`](https://docs.github.com/en/enterprise-cloud@latest/copilot/reference/custom-instructions-support). Depending on the tool, you may also see `AGENTS.md`, `CLAUDE.md`, `GEMINI.md` or whatever else.

Filenames vary. Job's the same.

An instructions file should explain your stack, conventions, commands, constraints, and most importantly: definition of done.

"Write clean code" means nothing. Zero. Nisba. Nichts.

This is better:

```markdown
- Use strict TypeScript. Do not ever use `any`.
- Run `npm test` before committing any code.
- Do not change files outside the ones strictly necessary to achieve the requested feature, when in doubt ask the user.
- Return errors with enough context to identify the failed operation.
- Delete temporary files before completing the task and committing code.
```

A human can ask when something is unclear. An agent may fill the gap with plausible nonsense. Write accordingly.

And needless to say: this is not a 100% guardrail. It's all probabilistic, but we should improve an iterate on these instructions in time. 
Models change, they get better (or worse) and so does the harness we use.

### 2. Agents own repeatable jobs

Warning: this concept seems to be deprecated since a couple months, and even if it might be less useful I would still leave it here as I do think it still has a use and specific spaces where this makes sense.

Once the common rules work, you can define specialists.

In GitHub Copilot CLI, [custom agents](https://docs.github.com/en/enterprise-cloud@latest/copilot/how-tos/copilot-cli/customize-copilot/create-custom-agents-for-cli) are Markdown files with an `.agent.md` extension. Project agents live under `.github/agents/`.

I have built agents for CI/CD migrations, Salesforce integrations, frontend work, and debugging. Each agent owns a narrow job.

A useful agent defines:

- when it should be used (clear start condition)
- which task it owns (the what)
- which tools it may access (the skills, scripts, MCPs, APIs)
- how it makes decisions (the process)
- when it is done (clear stop condition)
- what it returns (clear outcome)

Defining a persona is not enough. And please stop anthropomorphizing agents like Anthropic does. They are fancy state machines. No feelings, no conscience.

"You are a world-class security engineer" tells the agent almost nothing and has been proven to have zero impact on results.

"Inspect the changed authentication code, trace untrusted input, report only exploitable findings, and do not modify files" describes a job.

A prompt asks for something once. An agent defines how a class of tasks should be handled repeatedly.

I don't have an example at hand as I mainly use skills now, but the idea is that custom agents should define processes and repeatable steps in your own context

### 3. Skills package reusable expertise

Agents should not repeat the same instructions everywhere.

[Agent skills](https://docs.github.com/en/enterprise-cloud@latest/copilot/how-tos/copilot-cli/customize-copilot/add-skills) package one capability inside a directory. Each skill has a `SKILL.md` file and may include scripts, examples, or reference material.

```text
.github/skills/actions-troubleshooting/
├── SKILL.md
├── references/
└── scripts/
```

A skill might teach an agent how to debug GitHub Actions, design a database migration, audit accessibility, or test a web application with Playwright.

Write it once. Reuse it where needed.

An agent owns a job. A skill teaches a capability that several agents may need.

This is a sort of DRY pricinple for agent instructions.

### 4. Knowledge gives agents somewhere reliable to look

Your agents do not need to know everything. They need to know where the correct information lives.

A migration agent, for example, could use a repository like this:

```text
knowledge/
├── migration-workflow.md
├── migration-standards.md
├── migration-guardrails.md
├── actions-mapping/
│   ├── jenkins.md
│   ├── gitlab.md
│   └── circleci.md
└── patterns/
    └── jenkins/
        ├── pipeline.md
        ├── groovy.md
        └── secrets.md
```

Do not paste all of this into one giant instruction file. Tell the agent which source to read and when. Give them an index to start from.

Put these files in version control. Review them like code and give someone ownership. A wrong migration mapping can break production whether it lives in Go, YAML, or plain English.

### 5. Workflows make Markdown operational

The last layer makes Markdown operational.

With [GitHub Agentic Workflows](https://github.github.com/gh-aw/), Markdown source files live under `.github/workflows/`. The `gh aw compile` command turns them into `.lock.yml` workflows that GitHub Actions can execute.

Deterministic work such as builds, tests, and deployments should remain standard GitHub Actions. Agentic workflows fit work that requires interpretation and choices, such as investigating a CI failure or triaging an issue.

Permissions matter here. Supported agent jobs use read-only access and sandboxed execution by default. Configured writes can go through safe outputs with narrower permissions.

That security policy is also Markdown engineering. Which tools can the agent call? What can it write? How much can it spend? What happens when it fails?

At this point, the Markdown file is no longer documentation about a workflow.

It is the compilation source for the workflow.

## The uncomfortable truth

Markdown engineering is just engineering. Always has been.

It is requirements gathering, system design, permissions, contracts, failure handling, and testing.

The people who already wrote good design documents, ADRs, RFCs and runbooks have a head start. They learned how to remove ambiguity before an LLM could turn that ambiguity into a pull request.

The companies who already did the above, are really thriving and achieving more with AI.

Natural language removes the need for syntax. It does not remove the need for precision, determinism, testing, CI and reproducibility.

In some ways, it makes precision even more important. A confusing document can waste an hour-long meeting. A confusing agent definition can touch 50 repositories before lunch, on a Friday.

## How to get good (enough) at it

1. **Write observable instructions.** "Run `npm test` and stop if it fails" has a result you can check. "Produce high-quality code" does not.

2. **Say what the agent must not do.** Agents are usually enthusiastic. They refactor unrelated code, create files nobody requested, and keep going after failure. Name those behaviors before they happen. This depends on both the model and the harness, but all things equal, try with and without "guardrail" instructions. You'll see the difference.

3. **Separate permanent rules from single task context.** Coding conventions belong in repository instructions. Details about one feature belong in its issue, spec document, or prompt. Memory and docs about features and implementations is good, if kept updated. Possibly (forgive me for the word I'm about to say) agentically.

4. **Make structure carry meaning.** Add sections: prerequisites, decision points, and stop conditions in a way the agent can easily find them.

5. **Restrict tools and permissions.** A documentation agent probably does not need deployment credentials. Give each agent enough access to complete its job, then stop. Agents should not bear secrets or access to them directly. Limit destructive commands and don't let an agent run any of your `kubectl` commands applying a new shiny Helm chart. You'll thank me later.

6. **Reuse skills instead of copying instructions.** Duplication will drift. One agent will use the new process while another follows six-month-old advice. Self-improving skills are also a thing.

7. **Test agents on real work.** Inspect the diff. Check whether the agent touched the correct files, ran the expected commands, handled failure, and reported uncertainty. This is true even when you've built trust in the agent. Verify, always. By reading but also in all the good old deterministic ways.

8. **Version everything.** Review instruction changes in pull requests. A one-line edit can change how every future agent behaves.

9. **Split files that own too much.** I start getting nervous around 500 lines for a skill/agent spec. That number is not a standard. It is when it starts smelling fishy to me personally. A file that large is probably hiding several agents, reusable skills, or reference documents.

All and all: markdown engineering will not save a bad engineering process.

It will automate it.

Now you can use the title "Markdown Engineer" on LinkedIn.

Just make sure you deserve the second word.
