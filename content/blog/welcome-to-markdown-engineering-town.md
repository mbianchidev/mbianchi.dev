---
title: "Welcome to Markdown engineering town"
date: "2026-08-23"
author: "Matteo Bianchi"
category: "AI"
excerpt: "Markdown still documents software. Now it also tells coding agents how to work, where to look, what not to touch, and when to stop."
image: "brand"
imageAlt: "Matteo human platform brand mark"
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

## The layers of Markdown engineering

I see five layers. You do not need all of them on day one.

### 1. Instructions tell the agent what normal looks like

This is where most people start and stop.

GitHub Copilot supports repository-wide instructions in [`.github/copilot-instructions.md`](https://docs.github.com/en/enterprise-cloud@latest/copilot/reference/custom-instructions-support). Depending on the tool, you may also see `AGENTS.md`, `CLAUDE.md`, or `GEMINI.md`.

The filenames vary. The job does not.

An instructions file should explain your stack, conventions, commands, constraints, and definition of done.

"Write clean code" means nothing.

This is better:

```markdown
- Use strict TypeScript. Do not add `any`.
- Run `npm test` before finishing.
- Do not change files outside the requested feature.
- Return errors with enough context to identify the failed operation.
- Delete temporary files before completing the task.
```

A human can ask when something is unclear. An agent may fill the gap with plausible nonsense. Write accordingly.

### 2. Agents own repeatable jobs

Once the common rules work, you can define specialists.

In GitHub Copilot CLI, [custom agents](https://docs.github.com/en/enterprise-cloud@latest/copilot/how-tos/copilot-cli/customize-copilot/create-custom-agents-for-cli) are Markdown files with an `.agent.md` extension. Project agents live under `.github/agents/`.

I have built agents for CI/CD migrations, Salesforce integrations, frontend work, and debugging. Each agent owns a narrow job.

A useful agent defines:

- when it should be used
- which task it owns
- which tools it may access
- how it makes decisions
- when it must stop
- what it returns

A persona is not enough.

"You are a world-class security engineer" tells the agent almost nothing.

"Inspect the changed authentication code, trace untrusted input, report only exploitable findings, and do not modify files" describes a job.

A prompt asks for something once. An agent defines how a class of tasks should be handled repeatedly.

### 3. Skills package reusable expertise

Agents should not repeat the same instructions everywhere.

[Agent skills](https://docs.github.com/en/enterprise-cloud@latest/copilot/how-tos/copilot-cli/customize-copilot/add-skills) package one capability inside a directory. Each skill has a `SKILL.md` file and may include scripts, examples, or reference material.

```text
.github/skills/actions-troubleshooting/
├── SKILL.md
├── examples/
└── scripts/
```

A skill might teach an agent how to debug GitHub Actions, design a database migration, audit accessibility, or test a web application.

Write it once. Reuse it where needed.

An agent owns a job. A skill teaches a capability that several agents may need.

This is DRY for agent instructions.

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

Do not paste all of this into one giant instruction file. Tell the agent which source to read and when.

Put these files in version control. Review them like code and give someone ownership. A wrong migration mapping can break production whether it lives in Go, YAML, or English.

### 5. Workflows make Markdown operational

The last layer makes Markdown operational.

With [GitHub Agentic Workflows](https://github.github.com/gh-aw/), Markdown source files live under `.github/workflows/`. The `gh aw compile` command turns them into `.lock.yml` workflows that GitHub Actions can execute.

Deterministic work such as builds, tests, and deployments should remain normal GitHub Actions. Agentic workflows fit work that requires interpretation, such as investigating a CI failure or triaging an issue.

Permissions matter here. Supported agent jobs use read-only access and sandboxed execution by default. Configured writes can go through safe outputs with narrower permissions.

That security policy is also Markdown engineering. Which tools can the agent call? What can it write? How much can it spend? What happens when it fails?

At this point, the Markdown file is no longer documentation about a workflow.

It is source for the workflow.

## The uncomfortable truth

Markdown engineering is just engineering.

It is requirements gathering, system design, permissions, contracts, failure handling, and testing.

The people who already wrote good design documents, ADRs, and runbooks have a head start. They learned how to remove ambiguity before an LLM could turn that ambiguity into a pull request.

Natural language removes syntax. It does not remove the need for precision.

In some ways, it makes precision more important. A confusing document can waste an hour-long meeting. A confusing agent definition can touch 50 repositories before lunch.

## How to get good at it

1. **Write observable instructions.** "Run `npm test` and stop if it fails" has a result you can check. "Produce high-quality code" does not.

2. **Say what the agent must not do.** Agents are enthusiastic. They refactor unrelated code, create files nobody requested, and keep going after failure. Name those behaviors before they happen.

3. **Separate permanent rules from task context.** Coding conventions belong in repository instructions. Details about one feature belong in its issue, specification, or prompt.

4. **Make structure carry meaning.** Put prerequisites, decision points, and stop conditions where the agent can find them. A pretty wall of prose is still a wall.

5. **Restrict tools and permissions.** A documentation agent probably does not need deployment credentials. Give each agent enough access to complete its job, then stop.

6. **Reuse skills instead of copying instructions.** Duplication will drift. One agent will use the new process while another follows six-month-old advice.

7. **Test agents on real work.** Inspect the diff. Check whether the agent touched the correct files, ran the expected commands, handled failure, and reported uncertainty.

8. **Version everything.** Review instruction changes in pull requests. A one-line edit can change how every future agent behaves.

9. **Split files that own too much.** I start getting nervous around 1,300 lines for an agent definition. That number is not a standard. It is a smell. A file that large is probably hiding several agents, reusable skills, or reference documents.

Markdown engineering will not save a bad engineering process.

It will automate it.

You can put "Markdown Engineer" on LinkedIn. I dare you.

Just make sure you deserve the second word.
