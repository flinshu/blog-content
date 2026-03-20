---
title: 博客架构升级：内容与框架分离
date: 2026-03-20
tags:
  - 技术
  - 博客
description: 记录博客从内容耦合到独立仓库的架构演进，实现一份内容多框架复用。
slug: content-separation
draft: false
featured: false
---

## 为什么要分离

之前文章和 Astro 框架放在同一个仓库，切换静态生成器意味着重新迁移所有文章。

现在文章独立成 Git 仓库，框架通过 submodule 引用。想换 Hugo、Next.js？新建一个框架仓库，挂上同一个 submodule 就行。

## 怎么做的

- 文章用通用的 `date` 字段，不依赖任何框架特有的 frontmatter
- 图片压缩（sharp + husky）跟着内容走，commit 时自动处理
- 框架侧只需一行 Zod transform 做字段映射

写作流程不变：写 Markdown、粘贴图片、git push，CI 自动构建部署。

## 效果

一份内容，多个框架，零迁移成本。
