import * as core from '@actions/core';
import { promises as fsAsync } from 'fs';
import * as fs from 'fs';
import { default as json2md } from 'json2md';
import * as yaml from 'js-yaml';

export async function run() {
  try {

    let manifestPath = core.getInput("manifest_path");
    let instructionsPath = core.getInput("instructions_path");
    let deploymentPath = core.getInput("deployment_path");
    let issuesPath = core.getInput("issues_path");
    let outputPath = core.getInput("output_path");

    let manifestContents = await fsAsync.readFile(manifestPath, 'utf8');
    let manifest = yaml.safeLoad(manifestContents);
    let title = manifest.description || manifest.name;

    let readme = "";

    readme += json2md({ h1: title });
    readme += insertNewLine();
    readme += await fsAsync.readFile(instructionsPath, "utf8");
    readme += insertNewLine(2);
    readme += await fsAsync.readFile(deploymentPath, "utf8");

    if (fs.existsSync(issuesPath)) {
      let issues = await fsAsync.readFile(issuesPath, "utf8");

      if (issues) {
        readme += json2md({ h2: "Known issues" });
        readme += issues;
      }
    }

    core.info(`Readme generated. Writing out to: ${outputPath}`);
    await fsAsync.writeFile(outputPath, readme);
    
  } catch (error) {
    throw error;
  }
}

function insertNewLine(count: number = 1): string {
  return "\n".repeat(count);
}

run().catch(error => core.setFailed(error.message));