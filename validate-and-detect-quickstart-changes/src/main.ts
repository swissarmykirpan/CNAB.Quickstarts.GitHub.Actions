import * as core from '@actions/core';
import './functions';
import { getFiles } from './functions';

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

    getFiles(trigger, repoName, sourceVersion, prNumber);

  } catch (error) {
    core.setFailed(error.message);
    throw error;
  }
}

run();