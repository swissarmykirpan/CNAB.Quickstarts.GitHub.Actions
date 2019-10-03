import * as core from '@actions/core';

export async function run() {
  try {
    let porterPath = core.getInput("porter_path");
    let bundleDir = core.getInput("bundle_dir");
    let invocationImage = core.getInput("invocation_image");

    const execa = require('execa');
    const {stdout} = await execa(porterPath, ['build'], { cwd: bundleDir });
	  core.info(stdout);
  } catch (error) {
    throw error;
  }
}

run().catch(error => core.setFailed(error.message));