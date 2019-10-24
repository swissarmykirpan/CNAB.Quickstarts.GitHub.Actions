import * as core from '@actions/core';
import * as exec from '@actions/exec';
import * as path from 'path';
import { promises as fs } from 'fs';

export async function run() {
  try {

    let branch = core.getInput("branch");
    let addPathSpec = core.getInput("add_path_spec");
    let commitMessage = core.getInput("commit_message");

    let wd = <string>process.env.GITHUB_REPOSITORY

    core.info("Input: branch = " + branch);
    core.info("Input: add_path_spec = " + addPathSpec);
    core.info("Input: commit_message = " + commitMessage);

    let githubActor = <string>process.env.GITHUB_ACTOR;
    let githubToken = <string>process.env.GITHUB_TOKEN;
    let home = <string>process.env.HOME;

    core.info("Updating .netrc file")

    let netrcContents = 
`machine github.com
login ${githubActor}
password ${githubToken}
machine api.github.com
login ${githubActor}
password ${githubToken}`;

    await fs.writeFile(path.join(home, '.netrc'), netrcContents);

    core.info("Setting git config email and user name");

    await exec.exec("git", ["config", "--global", "user.email", "actions@github.com"]);
    await exec.exec("git", ["config", "--global", "user.name", "GitHub Actions"]);

    core.info("Checking if any relevant changes to commit.");

    let statusOutput = '';

    let options : any = {};
    options.listeners = {
      stdout: (data: Buffer) => {
        statusOutput += data.toString();
      }
    };
    let files = addPathSpec.split(" ");
    await exec.exec('git', ['status'].concat(files).concat('--porcelain'), options);

    let changes = statusOutput != '';

    if (changes) {
      core.info(`Git status output:\n${statusOutput}\n`);
      core.info("Changes found. Committing changes...");

      branch = branch.replace("refs/heads/", "");

      core.info("Branch is: " + branch);

      await exec.exec('git', ['checkout', branch]);
      await exec.exec('git', ['add'].concat(files));
      await exec.exec('git', ['commit', '-m', commitMessage, `--author="${githubActor} <${githubActor}@users.noreply.github.com>`]);
      await exec.exec('git', ['push', '--set-upstream', 'origin', `HEAD:${branch}`]);

      core.info("Changes committed and pushed to origin.");
    } else {
      core.info("No relevant changes found. Nothing to commit");
    }

  } catch (error) {
    throw error;
  }
}

run().catch(error => core.setFailed(error.message));