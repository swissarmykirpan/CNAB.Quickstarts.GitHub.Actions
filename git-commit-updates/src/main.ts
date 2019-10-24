import * as core from '@actions/core';
import * as fs from 'fs';
import * as git from 'isomorphic-git';

export async function run() {
  try {
    git.plugins.set('fs', fs);

    let branch = core.getInput("branch");
    let addPathSpec = core.getInput("add_path_spec");
    let commitMessage = core.getInput("commit_message");

    core.info("Input: branch = " + branch);
    core.info("Input: add_path_spec = " + addPathSpec);
    core.info("Input: commit_message = " + commitMessage);

    let githubActor = <string>process.env.GITHUB_ACTOR;
    let githubToken = <string>process.env.GITHUB_TOKEN;

    await git.config({
      dir: '/',
      path: 'user.email',
      value: 'actions@github.com'
    });

    await git.config({
      dir: '/',
      path: 'user.name',
      value: 'GitHub Actions'
    });

    let files = addPathSpec.split(" ");

    let changes = false;

    files.forEach(async file => {
      let status = await git.status({ dir: '/', filepath: file });

      changes = 
        status == "*deleted" ||
        status == "*modified" ||
        status == "*added"
    });

    if (changes) {
      core.info("Committing changes...");

      branch = branch.replace("refs/heads/", "");

      core.info("Branch is: " + branch);

      await git.checkout({ dir: '/', ref: branch })

      await git.add({ dir: '/', filepath: addPathSpec })

      await git.commit({
        dir: '/',
        author: {
          name: githubActor,
          email: `${githubActor}@users.noreply.github.com`
        },
        message: commitMessage
      });

      await git.push({
        dir: '/',
        remote: 'origin',
        ref: branch,
        token: githubToken
      });

      core.info("Changes committed and pushed to origin.");
    } else {
      core.info("Nothing to commit");
    }

  } catch (error) {
    throw error;
  }
}

run().catch(error => core.setFailed(error.message));