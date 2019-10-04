import * as core from '@actions/core';
import * as tc from '@actions/tool-cache';
import * as exec from '@actions/exec';
import * as io from '@actions/io';
import * as path from 'path';

export async function run() {
  try {
    const execa = require('execa');

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

    core.info("Installing mixins");

    let mixins = mixinsStr.split(',');

    mixins.forEach(async mixin => {
      const {stdout, stderr} = await execa('porter', ['mixin', 'install', mixin, '--version', mixinsVersion, '--feed-url', feedUrl]);
      if (stdout) core.info(stdout);
      if (stderr) {
        core.error(stderr);
        throw new Error(stderr);
      }
    });

    core.info("Installed mixins");    
    
  } catch (error) {
    throw error;
  }
}

run().catch(error => core.setFailed(error.message));