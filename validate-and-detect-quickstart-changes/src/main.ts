import * as core from '@actions/core';
import { getFiles, areChangesValid, isBuildRequired, getQuickstartSolutionPath, getQuickstartTool } from './functions';

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
    setOutput("changes_are_valid", `${changesAreValid}`);

    if (changesAreValid) {
      let buildIsRequired = isBuildRequired(files);
      setOutput("build_is_required", `${buildIsRequired}`);

      if (buildIsRequired) {

        let quickstartSolutionPath = getQuickstartSolutionPath(files);
        let quickstartTool = getQuickstartTool(files);

        setOutput("quickstart_solution_path", quickstartSolutionPath);
        setOutput("quickstart_tool", quickstartTool);
      }
    } else{
      throw new Error("Set of changes in commit or PR are invalid.");
    }
  } catch (error) {
    throw error;
  }
}

// core.setOutput currently erroneously appends an extra comma to the logging command,
// so we need to use our own function until this is fixed
function setOutput(name: string, value: string) {
  process.stdout.write(`::set-output name=${name}::${value}`)
}

run().catch(error => core.setFailed(error.message));