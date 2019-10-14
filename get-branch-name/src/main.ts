import * as core from '@actions/core';
import { env } from 'process';

export async function run() {
  try {
    let ref = env.GITHUB_REF || "";
    let headRef = env.GITHUB_HEAD_REF || "";

    let branch = headRef || ref.replace("refs/heads/", "");

    core.setOutput("branch_name", branch);

  } catch (error) {
    throw error;
  }
}

run().catch(error => core.setFailed(error.message));