import * as core from '@actions/core';
import { generateTocAsync } from './functions';
import { promises as fs } from 'fs';


export async function run() {
  try {

    let porterBundlesPath = core.getInput("porter_bundles_path");    
    let outputPath = core.getInput("output_path");    
    let toc = await generateTocAsync(porterBundlesPath, outputPath);
    await fs.writeFile(outputPath, toc);

  } catch (error) {
    throw error;
  }
}

run().catch(error => core.setFailed(error.message));