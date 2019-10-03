import * as core from '@actions/core';
import * as path from 'path';

export async function run() {
  try {
    let porterPath = core.getInput("porter_path");
    let bundleDir = core.getInput("bundle_dir");
    let invocationImage = core.getInput("invocation_image");

    let gitHubWorkspace = process.env.GITHUB_WORKSPACE || '';
    let wd = path.join(gitHubWorkspace, bundleDir);
    
    core.info(`Running '${porterPath} build' in working directory '${wd}'`)

    const execa = require('execa');
    const {stdout, stderr} = await execa(porterPath, ['build'], { cwd: wd});
    core.info(stdout);
    core.error(stderr);
  } catch (error) {
    throw error;
  }
}

run().catch(error => core.setFailed(error.message));