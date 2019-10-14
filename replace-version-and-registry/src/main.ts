import * as core from '@actions/core';
import { promises as fs } from 'fs';
import { updateManifest } from './functions'

export async function run() {
  try {

    let manifestPath = core.getInput("manifest_path");
    let version = core.getInput("version");
    let tag = core.getInput("tag");
    let registry = core.getInput("registry");

    let manifestContents = await fs.readFile(manifestPath, 'utf8');

    manifestContents = updateManifest(manifestContents, version, tag, registry);

    core.info("Update manifest:\n");
    core.info(manifestContents + "\n");

    await fs.writeFile(manifestPath, manifestContents);

  } catch (error) {
    throw error;
  }
}

run().catch(error => core.setFailed(error.message));