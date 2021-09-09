import fs from "fs";
import path from "path";
import writeFileAtomic from "write-file-atomic";

// generate ./.semaphore/semaphore.yml
async function semaphore({ state }) {
  const allPackages = fs
    .readdirSync(path.resolve("../"))
    .filter(
      (packageName) =>
        typeof packageName === "string" &&
        packageName.length &&
        fs
          .statSync(path.join(path.resolve("../"), packageName))
          .isDirectory() &&
        fs.statSync(
          path.join(path.resolve("../"), packageName, "package.json")
        ) &&
        !JSON.parse(
          fs.readFileSync(
            path.join(path.resolve("../"), packageName, "package.json"),
            "utf8"
          )
        ).private
    );

  // console.log(
  //   `${`\u001b[${33}m${`allPackages`}\u001b[${39}m`} = ${JSON.stringify(
  //     allPackages,
  //     null,
  //     4
  //   )}`
  // );

  const content = `version: v1.0
name: CODSEN
agent:
  machine:
    type: e1-standard-2
    os_image: ubuntu1804
# The "Stop" fail-fast strategy (not "Cancel")
fail_fast:
  stop:
    when: "true"
execution_time_limit:
  hours: 2
blocks:
  - name: "Set things up"
    task:
      jobs:
        - name: Bootstrap
          commands:
            - checkout
            - nvm install node
            - node --version
            - npm --version
            - npm run bootstrap
            # dump freshly-bootstrapped ./packages/ into cache
            - cache store raw-packages-folder packages
            - cache store node_modules-folder node_modules
  # "Fan-in and Fan-out"
  - name: "Unit-test everything"
    task:
      prologue:
        commands:
          - checkout
          - cache restore raw-packages-folder
          - cache restore node_modules-folder
      jobs:
${allPackages
  .map(
    (packagesName) => `        - name: "test ${packagesName}"
          commands:
            - cd packages/${packagesName}
            - npm run test
            - cd ...
            - cache store ${packagesName}-cache-1 packages/${packagesName}`
  )
  .join("\n")}
  - name: "Bump versions"
    task:
      secrets:
        - name: GIT setup
      prologue:
        commands:
          - checkout
${allPackages.map((p) => `          - cache restore ${p}-cache-1`).join("\n")}
          - cache restore node_modules-folder
          - git config --global user.email "\${USER_EMAIL}"
          - git config --global user.name "\${YOUR_NAME_SURNAME}"
          - git config user.name
          - git remote -v
      jobs:
        - name: Bump semver
          commands:
            - npm run info
            - cache store stats-folder stats
            - npm run readme:generate
            - git status
            - git add packages
            - git add stats
            - git add README.md
            - "git diff-index --quiet HEAD || git commit -m 'chore: automated build tasks [skip ci]' --no-verify"
            - npm run pub:vers
            - git status
            - git add packages
            - git add README.md
            - git status
            - "git commit -m 'chore: automated build tasks [skip ci]' --no-verify"
            - git push
            - cache store bumped-packages-folder packages
  - name: "Publish to npm"
    task:
      secrets:
        - name: GIT setup
        - name: NPM setup
      prologue:
        commands:
          - checkout
          - cache restore bumped-packages-folder
          - cache restore node_modules-folder
          - cache restore stats-folder
          - npm set unsafe-perm true -g
          - npm set //registry.npmjs.org/:_authToken \${NPM_TOKEN} -g
          - npm set username \${NPM_USERNAME} -g
          - npm set email \${NPM_EMAIL} -g
      jobs:
${allPackages
  .map(
    (packagesName) => `        - name: "publish ${packagesName}"
          commands:
            - cd packages/${packagesName}
            - "npm run publish || :"`
  )
  .join("\n")}
  - name: "Purge JSDelivr"
    task:
      jobs:
        - name: Purge detergent
          commands:
            - curl https://purge.jsdelivr.net/npm/detergent/dist/detergent.umd.js || echo 'detergent unreachable on jsdelivr'
        - name: Purge html-crush
          commands:
            - curl https://purge.jsdelivr.net/npm/html-crush/dist/html-crush.umd.js || echo 'html-crush unreachable on jsdelivr'
        - name: Purge email-comb
          commands:
            - curl https://purge.jsdelivr.net/npm/email-comb/dist/email-comb.umd.js || echo 'email-comb unreachable on jsdelivr'
        - name: Purge string-strip-html
          commands:
            - curl https://purge.jsdelivr.net/npm/string-strip-html/dist/string-strip-html.umd.js || echo 'string-strip-html unreachable on jsdelivr'
        - name: Purge stristri
          commands:
            - curl https://purge.jsdelivr.net/npm/stristri/dist/stristri.umd.js || echo 'stristri unreachable on jsdelivr'
        - name: Purge emlint
          commands:
            - curl https://purge.jsdelivr.net/npm/emlint/dist/emlint.umd.js || echo 'emlint unreachable on jsdelivr'
        - name: Purge codsen-tokenizer
          commands:
            - curl https://purge.jsdelivr.net/npm/codsen-tokenizer/dist/codsen-tokenizer.umd.js || echo 'codsen-tokenizer unreachable on jsdelivr'
        - name: Purge codsen-parser
          commands:
            - curl https://purge.jsdelivr.net/npm/codsen-parser/dist/codsen-parser.umd.js || echo 'codsen-parser unreachable on jsdelivr'
        - name: Purge json-variables
          commands:
            - curl https://purge.jsdelivr.net/npm/json-variables/dist/json-variables.umd.js || echo 'json-variables unreachable on jsdelivr'
`;

  // lect is ran inside each of the packages - we don't need to write
  // the CI yml 122 times! We need it written once. Let's piggyback on one
  // of the packages
  if (state.pack.name === "all-named-html-entities") {
    writeFileAtomic(path.resolve("../../.semaphore/semaphore.yml"), content);
  }
}

export default semaphore;
