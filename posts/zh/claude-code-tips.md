# Claude Code 创始人亲授 10 大使用技巧，小白也能学会！

> 本文整理自 Claude Code 创建者 Boris Cherny 的 [推文](https://x.com/bcherny/status/2017742741636321619)，结合实际操作演示，手把手教你从入门到上手。

Boris 说了一句很重要的话：**"没有唯一正确的使用方式，每个人的工作流都不同，你应该自己实验找到最适合你的方式。"**

所以这篇文章不是教条，而是一份菜单——挑你喜欢的先试试。

---

## 目录

- [技巧 1：并行运行多个会话](#技巧-1并行运行多个会话)
- [技巧 2：从规划开始](#技巧-2从规划开始)
- [技巧 3：维护 CLAUDE.md](#技巧-3维护-claudemd)
- [技巧 4：创建可复用的 Skills](#技巧-4创建可复用的-skills)
- [技巧 5：自动修 Bug](#技巧-5自动修-bug)
- [技巧 6：高级提示技巧](#技巧-6高级提示技巧)
- [技巧 7：终端与环境优化](#技巧-7终端与环境优化)
- [技巧 8：利用 Subagents](#技巧-8利用-subagents)
- [技巧 9：数据与分析](#技巧-9数据与分析)
- [技巧 10：学习功能](#技巧-10学习功能)
- [新手上路指南](#新手上路指南)

---

## 技巧 1：并行运行多个会话

### 是什么

同时开 3~5 个 Claude Code 会话，每个做不同的任务，互不干扰。

### 打个比方

你有一个厨房（代码仓库），你克隆了 3 个厨房，请了 3 个厨师（Claude）同时做不同的菜。菜做好后再合到一起上桌。

### 怎么做

核心是用 Git 的 **worktree** 功能，它能让你在同一个仓库下创建多个独立的工作目录：

```bash
# 创建 3 个 worktree，每个对应一个独立分支
git worktree add ../my-project-feature-a -b feature-a
git worktree add ../my-project-feature-b -b feature-b
git worktree add ../my-project-bugfix    -b bugfix

# 查看所有 worktree
git worktree list
# 输出：
# /home/you/my-project              abc1234 [main]
# /home/you/my-project-feature-a    abc1234 [feature-a]
# /home/you/my-project-feature-b    abc1234 [feature-b]
# /home/you/my-project-bugfix       abc1234 [bugfix]
```

然后在每个目录下分别开一个终端，运行 `claude`：

```bash
# 终端 1
cd ../my-project-feature-a && claude
# "帮我实现用户登录功能"

# 终端 2
cd ../my-project-feature-b && claude
# "帮我写单元测试"

# 终端 3
cd ../my-project-bugfix && claude
# "修复首页加载慢的问题"
```

三个 Claude 同时干活，效率翻 3 倍。

### 进阶：加快捷方式

在 `~/.bashrc` 或 `~/.zshrc` 里加别名，一个字母就能跳转：

```bash
alias za="cd /home/you/my-project"
alias zb="cd /home/you/my-project-feature-a"
alias zc="cd /home/you/my-project-feature-b"
```

用完后记得清理：

```bash
git worktree remove ../my-project-feature-a
git branch -D feature-a
```

---

## 技巧 2：从规划开始

### 是什么

让 Claude 先想清楚再动手，而不是一上来就写代码。

### 打个比方

装修房子之前先画图纸，别上来就砸墙。

### 怎么做

**方法 1：用 Plan Mode**

在 Claude Code 对话中按 **Shift + Tab** 切换到 Plan 模式，或者输入：

```
/plan
```

然后描述你的需求：

```
我想给项目加一个用户注册功能，支持邮箱注册和手机号注册
```

Claude 会输出一份详细计划：
- 需要创建哪些文件
- 需要修改哪些文件
- 每一步怎么做
- 可能的风险点

你审查完觉得 OK，再让它执行。

**方法 2：直接用自然语言**

```
先做个计划，不要写代码。我想实现一个购物车功能。
```

**方法 3：双 Claude 交叉审查（高级）**

```
Claude A："帮我规划怎么重构认证模块"  →  输出计划
Claude B："审查一下这个计划有没有问题：[粘贴计划]"  →  找出漏洞
```

两个 Claude 互相审查，方案质量更高。

---

## 技巧 3：维护 CLAUDE.md

### 是什么

在项目根目录创建一个 `CLAUDE.md` 文件，Claude 每次启动都会自动读取它。相当于给 Claude 立的"规矩表"。

### 打个比方

新员工入职时给他的工作手册——公司用什么技术栈、代码风格是什么、有哪些坑不能踩。

### 怎么做

在项目根目录创建 `CLAUDE.md`：

```markdown
# 项目说明

这是一个 Node.js 电商后台项目。

## 代码规范
- 使用 ES Module（import/export），不用 CommonJS（require）
- 变量命名用 camelCase
- 缩进用 2 个空格
- 字符串用单引号

## 常见错误提醒
- 不要用 var，用 const 或 let
- API 返回必须包含 error handling
- 数据库查询必须用参数化查询，防止 SQL 注入

## 项目结构
- src/routes/   - API 路由
- src/models/   - 数据模型
- src/utils/    - 工具函数
- tests/        - 测试文件

## 测试
- 运行测试：npm test
- 测试框架：vitest
```

### 核心用法：持续迭代

这是最重要的部分。CLAUDE.md 不是写一次就完了，而是不断更新的：

```
1. Claude 犯了错（比如用了 require 而不是 import）
2. 你纠正它："不要用 require，用 import"
3. 紧接着说："把这条规则加到 CLAUDE.md"
```

随着时间推移，CLAUDE.md 越来越完善，Claude 犯错越来越少。Boris 的原话是**"ruthlessly edit"（无情地编辑）**——该删的删，该加的加，保持精炼。

---

## 技巧 4：创建可复用的 Skills

### 是什么

把你经常让 Claude 做的事，保存成一个命令文件，以后输入 `/命令名` 就能一键触发。

### 打个比方

手机上的快捷指令——"嘿 Siri，我到家了" 自动关导航、开灯、放音乐。

### 怎么做

**第一步：创建命令目录**

```bash
mkdir -p .claude/commands
```

**第二步：创建命令文件**

每个 `.md` 文件就是一个命令。文件名就是命令名。

示例 1：代码审查命令 `.claude/commands/review.md`

```markdown
检查当前项目中的代码质量问题：

1. 找出所有使用 var 的地方，改成 const 或 let
2. 找出所有使用 require() 的地方，改成 import
3. 检查是否有未处理的 error（缺少 try/catch 或 .catch()）
4. 列出发现的所有问题，并逐一修复
```

示例 2：每日健康检查 `.claude/commands/daily.md`

```markdown
每日代码健康检查：

1. 运行 git status，看看有没有未提交的文件
2. 运行 git log --oneline -5，看看最近做了什么
3. 检查 package.json 里有没有未使用的依赖
4. 给出一个简短的项目状态总结
```

示例 3：提交前检查 `.claude/commands/pre-commit.md`

```markdown
帮我做提交前检查：

1. 运行所有测试，确保通过
2. 检查是否有 console.log 调试语句没删
3. 检查是否有敏感信息（API key、密码）被误提交
4. 如果都没问题，帮我生成 commit message 并提交
```

**第三步：使用**

在 Claude Code 里直接输入：

```
/review
/daily
/pre-commit
```

就会自动执行对应的命令。建议把 `.claude/commands/` 目录提交到 git，这样团队成员都能共享这些命令。

---

## 技巧 5：自动修 Bug

### 是什么

把报错信息直接丢给 Claude，让它自己定位原因并修复。

### 打个比方

你拍了一张汽车仪表盘故障灯的照片发给修车师傅，师傅直接告诉你哪里坏了、怎么修。

### 怎么做

**最简单的方式：粘贴报错信息**

```
运行 node index.js 报了这个错：

TypeError: Cannot read properties of undefined (reading 'name')
    at getUser (/home/user/project/index.js:9:20)

帮我修
```

Claude 会：
1. 读取 `index.js` 第 9 行附近的代码
2. 分析为什么 `name` 是 undefined
3. 自动修复并验证

**进阶：Docker 日志**

```
看一下 docker logs my-container 里最近的错误，帮我修
```

**进阶：Slack 集成**

如果你配置了 Slack MCP Server，可以直接说：

```
看一下 #bugs 频道最新的 bug 报告，帮我修
```

Claude 会自动去 Slack 读取 bug 信息，然后在代码里修复。

### 实际案例

有 bug 的代码：

```javascript
var users = [
  { name: "Alice", age: 25 },
  { name: "Bob", age: 30 }
]

function getUser(id) {
  var user = users[id]
  console.log(user.name)  // id 超出范围就会炸！
}

getUser(5)  // 💥 没有第 5 个用户
```

报错：

```
TypeError: Cannot read properties of undefined (reading 'name')
```

Claude 修复后：

```javascript
const users = [
  { name: "Alice", age: 25 },
  { name: "Bob", age: 30 }
]

function getUser(id) {
  const user = users[id]
  if (!user) {
    console.log(`用户 ${id} 不存在`)
    return null
  }
  console.log(user.name)
  return user
}

getUser(5)  // 输出：用户 5 不存在
```

注意 Claude 不仅修了 bug，还顺便把 `var` 改成了 `const`（因为 CLAUDE.md 里有这条规则）。

---

## 技巧 6：高级提示技巧

### 是什么

用更好的方式描述需求，让 Claude 给出更高质量的结果。

### 技巧 A：让 Claude 自己审查

```
改完之后，自己审查一遍，看看有没有问题
```

或者：

```
假装你是一个严格的 code reviewer，review 一下你刚才写的代码
```

Claude 经常能发现自己第一遍写的代码里的问题。

### 技巧 B：要求更好的方案

当 Claude 给了个"能用但不够好"的方案时：

```
❌ "好的"（接受平庸方案）
✅ "这个方案太丑了，有没有更优雅的写法？"
✅ "能不能用更简洁的方式实现？"
✅ "性能方面有没有更好的做法？"
```

### 技巧 C：写清楚 spec 再交给 Claude

```
❌ 模糊的需求：
"帮我加个登录功能"

✅ 详细的 spec：
"帮我加个登录功能，要求：
 1. 支持邮箱和手机号两种方式
 2. 密码至少 8 位，必须包含大小写字母和数字
 3. 登录失败 3 次锁定账号 15 分钟
 4. 用 JWT token，过期时间 24 小时
 5. refresh token 过期时间 7 天
 6. 返回格式：{ success: boolean, token: string, error?: string }"
```

**一条黄金法则：你描述得越清楚，Claude 给的结果越好。**

---

## 技巧 7：终端与环境优化

### 是什么

优化你的开发环境，让使用 Claude Code 的体验更好。

### 终端选择

Boris 推荐 **Ghostty**（https://ghostty.org），渲染质量好，速度快。其他好选择：

| 终端 | 平台 | 特点 |
|------|------|------|
| Ghostty | 跨平台 | Boris 推荐，渲染好 |
| iTerm2 | Mac | Mac 上最流行 |
| Warp | Mac/Linux | 现代 AI 终端 |
| Windows Terminal | Windows | 微软官方 |

### 状态栏

Claude Code 支持自定义状态栏，可以显示：
- 当前 context（上下文）用量百分比
- 当前 git 分支名
- token 消耗量

当 context 快用完时你能提前知道，及时开新会话。

### 语音输入（强烈推荐！）

这是 Boris 团队很多人都在用的技巧：

- **Mac**：按两下 Fn 键启动系统听写
- **Windows**：Win + H 启动语音输入
- **通用**：用手机语音转文字 App，转完粘贴过来

为什么推荐？因为说话比打字快 3-5 倍，而且你会自然地说出更多细节。打字时你可能写"加个登录"，但说话时你会说"帮我加一个登录功能，支持邮箱和手机号，密码要有强度校验……"

---

## 技巧 8：利用 Subagents

### 是什么

让 Claude 派出多个"子代理"同时执行不同的子任务。

### 打个比方

你是老板，Claude 是项目经理，subagent 是开发人员。项目经理可以同时派 5 个开发人员去做 5 件事。

### 怎么做

在你的请求后面加 **"use subagents"**：

```
重构这个项目里所有的 API 路由文件，use subagents
```

Claude 会自动拆分任务，同时派多个 subagent 处理不同文件。

### 什么时候用

```
✅ 适合用的场景：
- 需要修改很多文件（"把所有文件里的 var 改成 const"）
- 需要同时搜索多个地方（"找出所有用到支付功能的代码"）
- 任务可以拆成独立的小任务

❌ 不适合用的场景：
- 简单的单文件修改
- 步骤之间有依赖关系（第 2 步依赖第 1 步的结果）
```

### 进阶：安全审查

Boris 团队会把权限检查路由到更强的模型做安全扫描：

```
用 subagent 帮我审查这次改动有没有安全漏洞
```

---

## 技巧 9：数据与分析

### 是什么

直接在 Claude Code 里查数据、做分析，不用切换到其他工具。

### 怎么做

**查数据库：**

```
连接数据库，查一下最近 7 天注册了多少用户，按天分组
```

Claude 会生成 SQL 并运行。

**调 API：**

```
用 curl 调一下 https://api.example.com/health，看看服务是否正常
```

**分析 JSON：**

```
读一下 data.json，告诉我里面有多少条记录，按类型统计
```

**BigQuery（如果你用 GCP）：**

Boris 团队做了一个 BigQuery skill，可以用自然语言查询：

```
最近一个月 DAU 是多少？按周分组画个趋势
```

你不需要记命令语法，用自然语言描述你要什么数据，Claude 会帮你生成并执行查询。

---

## 技巧 10：学习功能

### 是什么

把 Claude Code 当成你的编程老师，帮你理解代码和学习新知识。

### 怎么做

**让 Claude 解释代码：**

```
解释一下这个函数在干什么，我是初学者，请用简单的语言
```

```
这段代码用了什么设计模式？为什么要这么写？
```

**生成可视化内容：**

```
画一个 ASCII 图，展示这个系统的请求流程
```

示例输出：

```
┌─────────┐     ┌──────────┐     ┌────────┐
│  浏览器  │────▶│  Node.js │────▶│  MySQL │
│ (用户)   │◀────│  (API)   │◀────│ (数据) │
└─────────┘     └──────────┘     └────────┘
                      │
                      ▼
                ┌──────────┐
                │  Redis   │
                │ (缓存)   │
                └──────────┘
```

也可以让 Claude 生成 HTML 页面做演示文稿：

```
把这个项目的架构做成一个 HTML 演示页面，要好看
```

**交互式学习：**

```
帮我出 5 道关于 JavaScript Promise 的练习题，从易到难
```

```
我写一段代码，你帮我判断对不对，然后讲解
```

---

## 新手上路指南

10 个技巧一下子全学不太现实，建议分三步走：

### 第一步：先学这 3 个（立刻有用）

| 优先级 | 技巧 | 原因 |
|--------|------|------|
| ⭐⭐⭐ | 技巧 3：CLAUDE.md | 写一次，永久受益，Claude 越来越懂你的项目 |
| ⭐⭐⭐ | 技巧 5：自动修 Bug | 最直接的效率提升，粘贴报错就能修 |
| ⭐⭐⭐ | 技巧 6：提示技巧 | 不需要任何配置，说话方式改一改就有效果 |

### 第二步：试试这 3 个（提效明显）

| 优先级 | 技巧 | 原因 |
|--------|------|------|
| ⭐⭐ | 技巧 2：Plan Mode | 复杂任务少走弯路 |
| ⭐⭐ | 技巧 4：Skills | 重复任务一键搞定 |
| ⭐⭐ | 技巧 10：学习功能 | 边做边学，成长最快 |

### 第三步：进阶技巧（熟练后再用）

| 优先级 | 技巧 | 原因 |
|--------|------|------|
| ⭐ | 技巧 1：并行会话 | 需要有多任务并行的场景 |
| ⭐ | 技巧 7：终端优化 | 锦上添花 |
| ⭐ | 技巧 8：Subagents | 大型项目才需要 |
| ⭐ | 技巧 9：数据分析 | 看你的工作是否涉及数据 |

---

## 最后

记住 Boris 说的：**没有唯一正确的方式**。

这 10 个技巧是 Claude Code 团队内部在用的，但每个人的用法都不一样。不要试图一次全学会，挑一两个对你最有用的开始实验，慢慢找到属于你自己的工作流。

祝你用得开心！
