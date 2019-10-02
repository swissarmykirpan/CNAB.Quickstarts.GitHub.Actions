import * as core from '@actions/core';
import { getFiles, areChangesValid, isBuildRequired, getQuickstartSolutionPath, getQuickstartTool } from './functions';
import * as os from 'os';

export async function run() {
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
    core.setOutput("changes_are_valid", `${changesAreValid}`);

    if (changesAreValid) {
      let buildIsRequired = isBuildRequired(files);
      core.setOutput("build_is_required", `${buildIsRequired}`);

      if (buildIsRequired) {

        let quickstartSolutionPath = getQuickstartSolutionPath(files);
        let quickstartTool = getQuickstartTool(files);

        core.setOutput("quickstart_solution_path", quickstartSolutionPath);
        core.setOutput("quickstart_tool", quickstartTool);
      }
    } else{
      throw new Error("Set of changes in commit or PR are invalid.");
    }
  } catch (error) {
    throw error;
  }
}

run().catch(error => core.setFailed(error.message));