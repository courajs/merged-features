#!/usr/bin/env node

if (!process.env['GITHUB_OAUTH_TOKEN']) {
  console.error("No GitHub Authorization token found. See the README section on Authentication");
  process.exit(1);
}

console.log("This is the module");
