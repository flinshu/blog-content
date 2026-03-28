#!/bin/bash
# Pre-commit hook: ensure zh/ and en/ content stay in sync
# For every changed file in posts/zh/, the corresponding posts/en/ file must also be staged.

changed_zh=$(git diff --cached --name-only --diff-filter=ACMR | grep '^posts/zh/' || true)

if [ -z "$changed_zh" ]; then
  exit 0
fi

missing=()
for zh_file in $changed_zh; do
  en_file="${zh_file/posts\/zh\//posts\/en\/}"
  if ! git diff --cached --name-only | grep -q "^${en_file}$"; then
    missing+=("$en_file")
  fi
done

if [ ${#missing[@]} -gt 0 ]; then
  echo ""
  echo "⚠ 中英文内容不同步！以下英文文件未更新："
  echo "  Missing English counterparts:"
  for f in "${missing[@]}"; do
    echo "    - $f"
  done
  echo ""
  echo "请同时更新英文版本，或使用 git commit --no-verify 跳过检查。"
  exit 1
fi
