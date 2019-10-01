import * as core from '@actions/core';
import { getFiles, areChangesValid, isBuildRequired, getQuickstartSolutionPath } from './functions';

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
    let buildIsRequired : boolean = false;
    if (changesAreValid) {
      let buildIsRequired = isBuildRequired(files);
      if (buildIsRequired) {
        let quickstartSolutionPath = getQuickstartSolutionPath(files);
        core.setOutput("quickstart_solution_path", quickstartSolutionPath);
      }
    }

    core.setOutput("changes_are_valid", `${changesAreValid}`);
    core.setOutput("build_is_required", `${buildIsRequired}`);

  } catch (error) {
    core.setFailed(error.message);
    throw error;
  }
}

run();