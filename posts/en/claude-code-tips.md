# 10 Tips from the Creator of Claude Code That Anyone Can Learn

> This article is based on a [tweet thread](https://x.com/bcherny/status/2017742741636321619) by Boris Cherny, the creator of Claude Code. I've combined his insights with practical demonstrations to walk you through everything from getting started to becoming proficient.

Boris made one really important point: **"There's no single right way to use it. Everyone's workflow is different, and you should experiment to find what works best for you."**

So think of this article not as a rulebook, but as a menu -- pick whatever catches your eye and give it a try.

---

## Table of Contents

- [Tip 1: Run Multiple Sessions in Parallel](#tip-1-run-multiple-sessions-in-parallel)
- [Tip 2: Start with a Plan](#tip-2-start-with-a-plan)
- [Tip 3: Maintain Your CLAUDE.md](#tip-3-maintain-your-claudemd)
- [Tip 4: Create Reusable Skills](#tip-4-create-reusable-skills)
- [Tip 5: Auto-Fix Bugs](#tip-5-auto-fix-bugs)
- [Tip 6: Advanced Prompting Techniques](#tip-6-advanced-prompting-techniques)
- [Tip 7: Terminal and Environment Optimization](#tip-7-terminal-and-environment-optimization)
- [Tip 8: Leverage Subagents](#tip-8-leverage-subagents)
- [Tip 9: Data and Analytics](#tip-9-data-and-analytics)
- [Tip 10: Learning Mode](#tip-10-learning-mode)
- [Getting Started Guide](#getting-started-guide)

---

## Tip 1: Run Multiple Sessions in Parallel

### What Is It

Run 3 to 5 Claude Code sessions at the same time, each working on a different task, without any of them stepping on each other's toes.

### An Analogy

Imagine you have a kitchen (your code repository). You clone that kitchen three times and hire three chefs (Claude instances) to cook different dishes simultaneously. Once everything is ready, you bring all the dishes together and serve them at once.

### How to Do It

The key here is Git's **worktree** feature, which lets you create multiple independent working directories within the same repository:

```bash
# Create 3 worktrees, each on its own branch
git worktree add ../my-project-feature-a -b feature-a
git worktree add ../my-project-feature-b -b feature-b
git worktree add ../my-project-bugfix    -b bugfix

# List all worktrees
git worktree list
# Output:
# /home/you/my-project              abc1234 [main]
# /home/you/my-project-feature-a    abc1234 [feature-a]
# /home/you/my-project-feature-b    abc1234 [feature-b]
# /home/you/my-project-bugfix       abc1234 [bugfix]
```

Then open a separate terminal in each directory and run `claude`:

```bash
# Terminal 1
cd ../my-project-feature-a && claude
# "Help me implement user login"

# Terminal 2
cd ../my-project-feature-b && claude
# "Help me write unit tests"

# Terminal 3
cd ../my-project-bugfix && claude
# "Fix the slow homepage loading issue"
```

Three Claudes working at the same time -- triple the productivity.

### Going Further: Add Shortcuts

Add aliases to your `~/.bashrc` or `~/.zshrc` so you can jump between worktrees with a single letter:

```bash
alias za="cd /home/you/my-project"
alias zb="cd /home/you/my-project-feature-a"
alias zc="cd /home/you/my-project-feature-b"
```

Don't forget to clean up when you're done:

```bash
git worktree remove ../my-project-feature-a
git branch -D feature-a
```

---

## Tip 2: Start with a Plan

### What Is It

Get Claude to think things through before it starts writing code, rather than diving in headfirst.

### An Analogy

Before renovating a house, you draw up blueprints first. You don't just start knocking down walls.

### How to Do It

**Method 1: Use Plan Mode**

While in a Claude Code session, press **Shift + Tab** to switch to Plan mode, or type:

```
/plan
```

Then describe what you need:

```
I want to add user registration to the project, supporting both email and phone number sign-up
```

Claude will produce a detailed plan covering:
- Which files need to be created
- Which files need to be modified
- Step-by-step implementation details
- Potential risks and pitfalls

Once you've reviewed the plan and it looks good, tell Claude to go ahead and execute it.

**Method 2: Just Use Natural Language**

```
Make a plan first, don't write any code. I want to build a shopping cart feature.
```

**Method 3: Cross-Review with Two Claudes (Advanced)**

```
Claude A: "Help me plan how to refactor the auth module"  ->  outputs a plan
Claude B: "Review this plan for any issues: [paste the plan]"  ->  finds gaps
```

Having two Claudes review each other's work produces a much higher quality plan.

---

## Tip 3: Maintain Your CLAUDE.md

### What Is It

Create a `CLAUDE.md` file in your project root. Claude automatically reads it every time it starts up. Think of it as a set of house rules for Claude.

### An Analogy

It's like the employee handbook you give to a new hire on their first day -- what tech stack the company uses, what the coding style is, what pitfalls to avoid.

### How to Do It

Create a `CLAUDE.md` file in your project root:

```markdown
# Project Notes

This is a Node.js e-commerce backend project.

## Code Standards
- Use ES Modules (import/export), not CommonJS (require)
- Use camelCase for variable names
- Indent with 2 spaces
- Use single quotes for strings

## Common Mistakes to Avoid
- Don't use var -- use const or let
- API responses must include error handling
- Database queries must use parameterized queries to prevent SQL injection

## Project Structure
- src/routes/   - API routes
- src/models/   - Data models
- src/utils/    - Utility functions
- tests/        - Test files

## Testing
- Run tests: npm test
- Test framework: vitest
```

### The Key Practice: Iterate Continuously

This is the most important part. CLAUDE.md isn't a write-it-once-and-forget-it file. It's something you keep updating:

```
1. Claude makes a mistake (say, using require instead of import)
2. You correct it: "Don't use require, use import"
3. Then immediately say: "Add this rule to CLAUDE.md"
```

Over time, CLAUDE.md becomes more and more comprehensive, and Claude makes fewer and fewer mistakes. In Boris's own words, **"ruthlessly edit"** -- delete what's no longer needed, add what's missing, keep it lean and useful.

---

## Tip 4: Create Reusable Skills

### What Is It

Save the things you frequently ask Claude to do as command files, then trigger them anytime by typing `/command-name`.

### An Analogy

It's like Shortcuts on your phone -- "Hey Siri, I'm home" automatically turns off navigation, switches on the lights, and starts playing music.

### How to Do It

**Step 1: Create the commands directory**

```bash
mkdir -p .claude/commands
```

**Step 2: Create command files**

Each `.md` file is a command. The filename becomes the command name.

Example 1: Code review command `.claude/commands/review.md`

```markdown
Check the current project for code quality issues:

1. Find all uses of var and change them to const or let
2. Find all uses of require() and change them to import
3. Check for unhandled errors (missing try/catch or .catch())
4. List all issues found and fix them one by one
```

Example 2: Daily health check `.claude/commands/daily.md`

```markdown
Daily code health check:

1. Run git status to see if there are any uncommitted files
2. Run git log --oneline -5 to see what was done recently
3. Check package.json for unused dependencies
4. Give a brief project status summary
```

Example 3: Pre-commit check `.claude/commands/pre-commit.md`

```markdown
Run a pre-commit check for me:

1. Run all tests and make sure they pass
2. Check for any leftover console.log debug statements
3. Check for any sensitive information (API keys, passwords) that might be accidentally committed
4. If everything looks good, generate a commit message and commit
```

**Step 3: Use them**

In Claude Code, simply type:

```
/review
/daily
/pre-commit
```

And the corresponding command runs automatically. I'd recommend committing the `.claude/commands/` directory to git so your whole team can share these commands.

---

## Tip 5: Auto-Fix Bugs

### What Is It

Throw an error message at Claude and let it figure out the cause and fix it on its own.

### An Analogy

You snap a photo of the warning light on your car's dashboard and send it to your mechanic. The mechanic tells you exactly what's wrong and how to fix it.

### How to Do It

**The simplest approach: paste the error message**

```
Running node index.js gives me this error:

TypeError: Cannot read properties of undefined (reading 'name')
    at getUser (/home/user/project/index.js:9:20)

Fix it for me
```

Claude will:
1. Read the code around line 9 of `index.js`
2. Analyze why `name` is undefined
3. Automatically fix it and verify the fix works

**Going further: Docker logs**

```
Check docker logs my-container for recent errors and fix them
```

**Going further: Slack integration**

If you've set up a Slack MCP Server, you can just say:

```
Check the latest bug report in the #bugs channel and fix it
```

Claude will automatically pull the bug details from Slack and fix the issue in your code.

### A Real Example

Buggy code:

```javascript
var users = [
  { name: "Alice", age: 25 },
  { name: "Bob", age: 30 }
]

function getUser(id) {
  var user = users[id]
  console.log(user.name)  // Blows up if id is out of range!
}

getUser(5)  // There is no user at index 5
```

Error:

```
TypeError: Cannot read properties of undefined (reading 'name')
```

After Claude fixes it:

```javascript
const users = [
  { name: "Alice", age: 25 },
  { name: "Bob", age: 30 }
]

function getUser(id) {
  const user = users[id]
  if (!user) {
    console.log(`User ${id} does not exist`)
    return null
  }
  console.log(user.name)
  return user
}

getUser(5)  // Output: User 5 does not exist
```

Notice that Claude didn't just fix the bug -- it also changed `var` to `const` along the way (because that rule was in CLAUDE.md).

---

## Tip 6: Advanced Prompting Techniques

### What Is It

Better ways to describe what you need so Claude delivers higher quality results.

### Technique A: Have Claude Review Its Own Work

```
After you're done, review your own work and see if there are any issues
```

Or:

```
Pretend you're a strict code reviewer and review the code you just wrote
```

Claude can often spot problems in its own first draft that it missed the first time around.

### Technique B: Push for a Better Solution

When Claude gives you something that works but isn't great:

```
No:  "Okay" (accepting a mediocre solution)
Yes: "This solution is ugly. Is there a more elegant way to write it?"
Yes: "Can you implement this more concisely?"
Yes: "Is there a better approach from a performance standpoint?"
```

### Technique C: Write a Clear Spec Before Handing It to Claude

```
Vague requirement:
"Add a login feature"

Detailed spec:
"Add a login feature with the following requirements:
 1. Support both email and phone number login
 2. Password must be at least 8 characters, including uppercase, lowercase, and numbers
 3. Lock the account for 15 minutes after 3 failed attempts
 4. Use JWT tokens with a 24-hour expiration
 5. Refresh token expires after 7 days
 6. Response format: { success: boolean, token: string, error?: string }"
```

**The golden rule: the clearer your description, the better Claude's output.**

---

## Tip 7: Terminal and Environment Optimization

### What Is It

Fine-tune your development environment for a smoother Claude Code experience.

### Terminal Choices

Boris recommends **Ghostty** (https://ghostty.org) -- great rendering quality and fast performance. Other solid options:

| Terminal | Platform | Highlights |
|----------|----------|------------|
| Ghostty | Cross-platform | Boris's pick, great rendering |
| iTerm2 | Mac | Most popular on Mac |
| Warp | Mac/Linux | Modern AI-powered terminal |
| Windows Terminal | Windows | Microsoft's official terminal |

### Status Bar

Claude Code supports a customizable status bar that can display:
- Current context usage percentage
- Current git branch name
- Token consumption

This way you'll know ahead of time when context is running low and can start a fresh session.

### Voice Input (Highly Recommended!)

This is a technique that many people on Boris's team actually use:

- **Mac**: Double-tap the Fn key to activate system dictation
- **Windows**: Win + H to start voice input
- **Universal**: Use a speech-to-text app on your phone, then paste the result

Why is this so good? Because talking is 3 to 5 times faster than typing, and you naturally include more detail when speaking. When typing, you might write "add login." But when speaking, you'll say something like "help me add a login feature that supports email and phone number, with password strength validation..."

---

## Tip 8: Leverage Subagents

### What Is It

Have Claude dispatch multiple "sub-agents" to work on different subtasks simultaneously.

### An Analogy

You're the CEO, Claude is the project manager, and subagents are the developers. The project manager can send five developers off to work on five different things at the same time.

### How to Do It

Just add **"use subagents"** to the end of your request:

```
Refactor all the API route files in this project, use subagents
```

Claude will automatically break the task into pieces and dispatch multiple subagents to handle different files in parallel.

### When to Use It

```
Good use cases:
- Modifying many files ("change all var to const across the codebase")
- Searching multiple locations ("find all code that touches the payment feature")
- Tasks that can be split into independent subtasks

Not ideal for:
- Simple single-file changes
- Tasks where steps depend on each other (step 2 needs the result of step 1)
```

### Going Further: Security Reviews

Boris's team routes permission checks to a stronger model for security scanning:

```
Use a subagent to review this change for security vulnerabilities
```

---

## Tip 9: Data and Analytics

### What Is It

Query data and run analyses directly in Claude Code, without switching to another tool.

### How to Do It

**Query a database:**

```
Connect to the database and tell me how many users registered in the last 7 days, grouped by day
```

Claude will generate and run the SQL for you.

**Call an API:**

```
Use curl to hit https://api.example.com/health and check if the service is running
```

**Analyze JSON:**

```
Read data.json and tell me how many records are in it, broken down by type
```

**BigQuery (if you're on GCP):**

Boris's team built a BigQuery skill that lets you query with natural language:

```
What's the DAU for the past month? Group by week and show the trend
```

You don't need to remember query syntax. Just describe what data you want in plain language, and Claude will generate and execute the query for you.

---

## Tip 10: Learning Mode

### What Is It

Use Claude Code as your personal programming tutor to help you understand code and learn new concepts.

### How to Do It

**Have Claude explain code:**

```
Explain what this function does. I'm a beginner, so please use simple language
```

```
What design pattern does this code use? Why was it written this way?
```

**Generate visualizations:**

```
Draw an ASCII diagram showing the request flow in this system
```

Example output:

```
+---------+     +----------+     +--------+
| Browser |---->| Node.js  |---->| MySQL  |
| (User)  |<----| (API)    |<----| (Data) |
+---------+     +----------+     +--------+
                      |
                      v
                +----------+
                |  Redis   |
                | (Cache)  |
                +----------+
```

You can also have Claude generate HTML pages for presentations:

```
Turn this project's architecture into a nice-looking HTML presentation page
```

**Interactive learning:**

```
Give me 5 practice problems about JavaScript Promises, from easy to hard
```

```
I'll write some code, and you tell me if it's correct and explain why
```

---

## Getting Started Guide

Trying to learn all 10 tips at once isn't realistic. Here's a three-phase approach:

### Phase 1: Start with These 3 (Immediately Useful)

| Priority | Tip | Why |
|----------|-----|-----|
| Must-have | Tip 3: CLAUDE.md | Write it once, benefit forever. Claude gets smarter about your project over time |
| Must-have | Tip 5: Auto-Fix Bugs | The most direct productivity boost -- paste an error and it's fixed |
| Must-have | Tip 6: Prompting Techniques | No setup required, just change how you ask and see instant results |

### Phase 2: Try These 3 Next (Noticeable Productivity Gains)

| Priority | Tip | Why |
|----------|-----|-----|
| Recommended | Tip 2: Plan Mode | Fewer wrong turns on complex tasks |
| Recommended | Tip 4: Skills | One-click automation for repetitive tasks |
| Recommended | Tip 10: Learning Mode | Learn while you build -- the fastest way to grow |

### Phase 3: Advanced Tips (Once You're Comfortable)

| Priority | Tip | Why |
|----------|-----|-----|
| Optional | Tip 1: Parallel Sessions | You need multi-task scenarios to benefit |
| Optional | Tip 7: Terminal Optimization | Nice to have, not essential |
| Optional | Tip 8: Subagents | Really only needed for larger projects |
| Optional | Tip 9: Data Analytics | Depends on whether your work involves data |

---

## Final Thoughts

Remember what Boris said: **there's no single right way to do it.**

These 10 tips are what the Claude Code team uses internally, but everyone applies them differently. Don't try to learn everything at once. Pick one or two that seem most useful to you, start experimenting, and gradually find the workflow that's uniquely yours.

Happy coding!
