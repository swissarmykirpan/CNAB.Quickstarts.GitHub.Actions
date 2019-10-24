import * as core from '@actions/core';
import * as path from 'path';
import { promises as fs } from 'fs';
import * as yaml from 'js-yaml';

export async function run() {
  try {
    let manifestPath = core.getInput("manifest_path");

    let workspacePath = <string>process.env.GITHUB_WORKSPACE;
    let fullPath = path.join(workspacePath, manifestPath);
    let manifestContents = await fs.readFile(manifestPath, 'utf8');

    let manifest = yaml.safeLoad(manifestContents);
    let mixins = manifest.mixins.join(',');

    core.setOutput("mixins", mixins);
   
  } catch (error) {
    throw error;
  }
}

run().catch(error => core.setFailed(error.message));