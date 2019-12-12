import * as core from '@actions/core';
import * as tc from '@actions/tool-cache';
import * as exec from '@actions/exec';
import * as io from '@actions/io';
import * as path from 'path';

export async function run() {
  try {

    let porterUrl = core.getInput("porter_url");
    let porterVersion = core.getInput("porter_version");
    let feedUrl = core.getInput("feed_url");
    let mixinsStr = core.getInput("mixins");
    let mixinsVersion = core.getInput("mixins_version");

    let fullPorterUrl = `${porterUrl}/${porterVersion}/porter-linux-amd64`;

    core.info(`Installing porter from ${fullPorterUrl}`);

    let downloadPath = await tc.downloadTool(fullPorterUrl);
    core.info(`Download path: ${downloadPath}`);

    await exec.exec("chmod", ["+x", downloadPath]);
   
    const binPath: string = "/home/runner/bin/.porter";
    await io.mkdirP(binPath);
    const porterToolPath = path.join(binPath, "porter");
    await io.mv(downloadPath, porterToolPath);
    const porterRuntimePath = path.join(binPath, "porter-runtime");
    await io.cp(porterToolPath, porterRuntimePath);

    core.addPath(binPath);
    core.exportVariable('PORTER_HOME', binPath);
    core.info("Installed porter");
    core.info("Porter version: ");
    await exec.exec('porter', ['version']);

    core.info("Installing mixins");

    let mixins = mixinsStr.split(',');

    for (let i = 0; i < mixins.length; i++) {
      const mixin = mixins[i];
      await exec.exec('porter', ['mixin', 'install', mixin, '--version', mixinsVersion, '--feed-url', feedUrl]);
    }

    core.info("Installed mixins");    
    
  } catch (error) {
    throw error;
  }
}

run().catch(error => core.setFailed(error.message));