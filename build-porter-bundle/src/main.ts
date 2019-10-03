import * as core from '@actions/core';
import * as exec from '@actions/exec';
import * as path from 'path';

export async function run() {
  try {
    let bundleDir = core.getInput("bundle_dir");
    let invocationImage = core.getInput("invocation_image");

    let workspacePath = <string>process.env.GITHUB_WORKSPACE;
    let wd = path.join(workspacePath, bundleDir);
    
    core.info(`Running 'porter build' in working directory '${wd}'`)

    await exec.exec('porter', ['build'], { cwd: wd});
  } catch (error) {
    throw error;
  }
}

run().catch(error => core.setFailed(error.message));