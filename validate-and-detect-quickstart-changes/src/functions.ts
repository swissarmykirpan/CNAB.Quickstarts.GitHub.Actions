import * as core from '@actions/core';
import Octokit = require('@octokit/rest');

export async function getFiles(octokit: Octokit, trigger: string, ownerAndRepoName: string, sourceVersion?: string, prNumber?: number): Promise<string[]> {

    let repoSplits = splitWithRemainder(ownerAndRepoName, "/", 1);
    let owner = repoSplits[0];
    let repoName = repoSplits[1];

    let files: string[];

    if (trigger == "push") {
        core.info(`Getting commit files for owner '${owner}', repo '${repoName}', source version '${sourceVersion}'`)
        let response = await octokit.repos.getCommit({
            owner: owner,
            repo: repoName,
            commit_sha: <string>sourceVersion
        });

        let data = response.data;
        files = data.files.map(item => item.filename);
    }
    else if (trigger == "pull_request") {
        core.info(`Getting PR files for owner '${owner}', repo '${repoName}', PR number '${prNumber}'`)
        let response = await octokit.pulls.listFiles({
            owner: owner,
            repo: repoName,
            pull_number: <number>prNumber
        });

        let data = response.data;
        files = data.map(item => item.filename);
    }
    else {
        throw new Error(`Unsupported trigger type: ${trigger}`);
    }

    core.info("Files changed:");
    files.forEach(file => {
        core.info(file);
    });

    return files;
}

export function areChangesValid(changes: string[]): boolean {
    changes = removeFilesWithPathThatBeginsWithDot(changes);

    let changesAreValid = true;

    let noChangesInQuickstartSolutions = changes.every(function (path) {
        return path.split('/').length < 3;
    });

    let previousQuickstartSolutionPath: string;
    if (!noChangesInQuickstartSolutions) {
        let allQuickstartSolutionChangesAreInTheSameFolder = changes.every(function (path) {
            let segments = path.split('/');

            let quickstartSolutionPath = segments.slice(0, 2).join('/');

            if (segments.length > 2) {
                if (previousQuickstartSolutionPath && previousQuickstartSolutionPath != quickstartSolutionPath) {
                    return false;
                } else {
                    previousQuickstartSolutionPath = quickstartSolutionPath;
                    return true;
                }
            } else {
                return true;
            }
        });

        changesAreValid = allQuickstartSolutionChangesAreInTheSameFolder;
    }

    return changesAreValid;
}

export function isBuildRequired(changes: string[]): boolean {
    changes = removeFilesWithPathThatBeginsWithDot(changes);

    return changes.length > 0
        && !changes.every(function (path) {
            return path.split('/').length < 3;
        });
}

export function getQuickstartSolutionPath(changes: string[]): string {
    changes = removeFilesWithPathThatBeginsWithDot(changes);

    let found = changes.find(function (path) { return path.split('/').length > 2; });

    if (found) {
        return found
            .split('/')
            .splice(0, 2)
            .join('/');
    } else {
        throw "No quickstart solution changes found."
    }
}

export function getQuickstartTool(changes: string[]): string {
    changes = removeFilesWithPathThatBeginsWithDot(changes);
    let found = changes.find(function (path) { return path.split('/').length > 2; });

    if (found) {
        return found.split('/')[0];
    } else {
        throw "No quickstart solution changes found."
    }
}

function removeFilesWithPathThatBeginsWithDot(changes: string[]): string[] {
    return changes.filter(function (path) {
        return path[0] != '.';
    });
}

function splitWithRemainder(input: string, separator: string, limit: number) {
    let splits = input.split(separator);

    let result: string[];
    if (splits.length > limit) {
        result = splits.splice(0, limit);
        result.push(splits.join(separator));
    } else {
        result = splits;
    }

    return result;
}