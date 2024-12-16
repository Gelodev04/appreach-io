#!/bin/bash
echo "VERCEL_GIT_COMMIT_REF: $VERCEL_GIT_COMMIT_REF"
echo "VERCEL_ENV: $VERCEL_ENV"

if [[ "$VERCEL_ENV" == "dev" ]] || [[ "$VERCEL_GIT_COMMIT_REF" == "dev" ]]; then
  # Build on dev branch or push to dev
  echo "✅ - Build can proceed for dev branch"
  exit 1
elif [[ "$VERCEL_ENV" == "main" ]] || [[ "$VERCEL_GIT_COMMIT_REF" == "main" ]]; then
  # Build on release branch or push to release
  echo "✅ - Build can proceed for main branch"
  exit 1
else
  # Don't build
  echo "🛑 - Build cancelled"
  exit 0
fi