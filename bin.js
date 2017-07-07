#!/usr/bin/env node

require('dotenv').config()

if (!process.env['GITHUB_OAUTH_TOKEN']) {
  console.error("No GitHub Authorization token found. See the README section on Authentication");
  process.exit(1);
}

const fetch = require('graphql-fetch')('https://api.github.com/graphql')


let headers = new Headers();
headers.append('Authorization', `bearer ${process.env['GITHUB_OAUTH_TOKEN']}`);
let opts = { headers };

 
var query = `
`
var queryVars = {
  // id: 'abcdef'
}

let refSha = `
query($owner:String!, $repo:String!, $refName:String!) {
  repository(owner: $owner, name: $repo) {
    ref(qualifiedName: $refName) {
      id
      target {
        oid
        commitResourcePath
        commitUrl
      }
    }
  }
}
`;

let pulls_merged_into = `
query($owner:String!, $repo:String!, $baseName:String!) {
  repository(owner: $owner, name: $repo) {
    pullRequests(last: 10, baseRefName: $baseName, states: MERGED) {
      nodes {
        id
        title
        headRefName
        merged
        mergeCommit {
          id
        }
      }
    }
  }
}
`;
  
  
  
let baseObject = fetch(refSha, {
    owner: "courajs",
    repo: "github-api-test",
    refName: "v2.0.0"
  }, opts).then(r => r.data.repository.ref.target);


let pull_requests = fetch(pulls_merged_into, {
    owner: "courajs",
    repo: "github-api-test",
    baseName: "master"
  }, opts).then(r => r.data.repository.pullRequests.nodes);



Promise.all([baseObject, pull_requests]).then(([base, pull_requests]) => {
  console.log("Base sha is", base.oid);
  console.log("Path:", base.commitResourcePath);
  console.log("URL", base.commitUrl);
  console.log("Merged PRs are", pull_requests.map(pr => pr.title));
});


function stringify(str) {
  return JSON.stringify(str, null, 2);
}

