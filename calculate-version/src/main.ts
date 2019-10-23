import * as core from '@actions/core';
import * as exec from '@actions/exec';
import * as path from 'path';
import * as yaml from 'js-yaml';
import { promises as fs } from 'fs';

export async function run() {
  try {
    let manifestPath = core.getInput("manifest_path");

    let workspacePath = <string>process.env.GITHUB_WORKSPACE;

    let bundleDir = path.dirname(manifestPath);

    let wd = path.join(workspacePath, bundleDir);

    let manifestContents = await fs.readFile(manifestPath, 'utf8');
    let manifest = yaml.safeLoad(manifestContents);
    let manifestVersion = manifest.version;

    core.info(`Version from Porter manifest: ${manifestVersion}`);

    let gitversionConfigPath = path.join(wd, 'GitVersion.yml');
    let contents = `next-version: ${manifestVersion}`;
    core.info(`Writing temporary Gitversion config file with contents '${contents}' to path '${gitversionConfigPath}'`)
    await fs.writeFile(gitversionConfigPath, contents);

    core.info(`Running GitVersion in working directory '${wd}'`)

    let gvOutput = '';
    
    const options : any = {};
    options.listeners = {
      stdout: (data: Buffer) => {
        gvOutput += data.toString();
      }
    };
    options.cwd = wd;

    await exec.exec('docker', ['run', '--rm', '-v', `${workspacePath}:/repo`, 'gittools/gitversion:latest-linux-netcoreapp2.1', `/repo/${bundleDir}`], options);

    let gv = JSON.parse(gvOutput);

    let fullSemver = <string>gv.FullSemVer;

    let version = fullSemver.replace('.', '-').replace('+', '-');

    core.setOutput("version", version);

  } catch (error) {
    throw error;
  }
}

run().catch(error => core.setFailed(error.message));