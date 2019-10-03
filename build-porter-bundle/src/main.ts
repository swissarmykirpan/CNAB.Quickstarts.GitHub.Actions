import * as core from '@actions/core';
import * as path from 'path';

export async function run() {
  try {
    let bundleDir = core.getInput("bundle_dir");
    let invocationImage = core.getInput("invocation_image");

    let workspacePath = <string>process.env.GITHUB_WORKSPACE;
    let wd = path.join(workspacePath, bundleDir);
    
    core.info(`Running 'porter build' in working directory '${wd}'`)

    const execa = require('execa');
    const {stdout, stderr} = await execa('porter', ['build'], { cwd: wd});
    core.info(stdout);
    core.error(stderr);
  } catch (error) {
    throw error;
  }
}

run().catch(error => core.setFailed(error.message));