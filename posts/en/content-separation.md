# Blog Architecture Upgrade: Separating Content from Framework

## Why Separate Them

Previously, articles and the Astro framework lived in the same repository. Switching to a different static site generator meant migrating all the articles from scratch.

Now the articles live in their own Git repository, and the framework references them via a submodule. Want to switch to Hugo or Next.js? Just create a new framework repo and point it at the same submodule.

## How It Works

- Articles use a generic `date` field with no dependency on any framework-specific frontmatter
- Image compression (sharp + husky) travels with the content and runs automatically on commit
- The framework side only needs a single Zod transform to map the fields

The writing workflow stays the same: write Markdown, paste images, git push, and CI handles the build and deployment.

## The Result

One set of content, multiple frameworks, zero migration cost.
