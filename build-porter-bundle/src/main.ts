import * as core from '@actions/core';
import { spawn } from 'child_process';

export async function run() {
  try {
    let porterPath = core.getInput("porter_path");
    let bundleDir = core.getInput("bundle_dir");
    let invocationImage = core.getInput("invocation_image");

    process.chdir(bundleDir);

    runPorterBuild(porterPath);
  } catch (error) {
    throw error;
  }
}

function runPorterBuild(porterPath: string) {
  const porter = spawn(porterPath, ['build']);
  porter.stdout.on('data', (chunk) => {
    core.info(chunk);
  });
  porter.stderr.on('data', (chunk) => {
    core.error(chunk);
  });
  porter.on('close', (code) => {
    core.info(`child process exited with code ${code}`);
    if (code !== 0) {
      throw new Error();
    }
  });
}

run().catch(error => core.setFailed(error.message));