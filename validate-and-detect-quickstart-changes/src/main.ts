import * as core from '@actions/core';
import './functions';
import { getFiles, areChangesValid, isBuildRequired } from './functions';

async function run() {
  try {
    let trigger = core.getInput('trigger');
    let repoName = core.getInput('repo_name');
    let sourceVersion = core.getInput('source_version');
    let prNumberStr = core.getInput('pr_number');

    let prNumber : number | undefined;
    if (prNumberStr) {
        prNumber = parseInt(prNumberStr);
    }

    let files = await getFiles(trigger, repoName, sourceVersion, prNumber);

    let changesAreValid = areChangesValid(files);
    let buildIsRequired = isBuildRequired(files);

    core.setOutput("changes_are_valid", `${changesAreValid}`);

  } catch (error) {
    core.setFailed(error.message);
    throw error;
  }
}

run();