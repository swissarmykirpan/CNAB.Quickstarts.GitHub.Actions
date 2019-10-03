import * as core from '@actions/core';
import * as exec from '@actions/exec';

export async function run() {
  try {
    let porterPath = core.getInput("porter_path");
    let bundleDir = core.getInput("bundle_dir");
    let invocationImage = core.getInput("invocation_image");

    await exec.exec('cd', [bundleDir])
    await exec.exec(porterPath, ['build']); 
  } catch (error) {
    throw error;
  }
}

run().catch(error => core.setFailed(error.message));