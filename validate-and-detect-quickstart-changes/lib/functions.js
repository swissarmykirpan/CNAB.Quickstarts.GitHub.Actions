"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const core = __importStar(require("@actions/core"));
function getFiles(octokit, trigger, ownerAndRepoName, sourceVersion, prNumber) {
    return __awaiter(this, void 0, void 0, function* () {
        let repoSplits = splitWithRemainder(ownerAndRepoName, "/", 1);
        let owner = repoSplits[0];
        let repoName = repoSplits[1];
        let files;
        if (trigger == "push") {
            core.info(`Getting commit files for owner '${owner}', repo '${repoName}', source version '${sourceVersion}'`);
            let response = yield octokit.repos.getCommit({
                owner: owner,
                repo: repoName,
                commit_sha: sourceVersion
            });
            let data = response.data;
            files = data.files.map(item => item.filename);
        }
        else if (trigger == "pull_request") {
            core.info(`Getting PR files for owner '${owner}', repo '${repoName}', PR number '${prNumber}'`);
            let response = yield octokit.pulls.listFiles({
                owner: owner,
                repo: repoName,
                pull_number: prNumber
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
    });
}
exports.getFiles = getFiles;
function areChangesValid(changes) {
    changes = removeFilesWithPathThatBeginsWithDot(changes);
    let changesAreValid = true;
    let noChangesInQuickstartSolutions = changes.every(function (path) {
        return path.split('/').length < 3;
    });
    let previousQuickstartSolutionPath;
    if (!noChangesInQuickstartSolutions) {
        let allQuickstartSolutionChangesAreInTheSameFolder = changes.every(function (path) {
            let segments = path.split('/');
            let quickstartSolutionPath = segments.slice(0, 2).join('/');
            if (segments.length > 2) {
                if (previousQuickstartSolutionPath && previousQuickstartSolutionPath != quickstartSolutionPath) {
                    return false;
                }
                else {
                    previousQuickstartSolutionPath = quickstartSolutionPath;
                    return true;
                }
            }
            else {
                return true;
            }
        });
        changesAreValid = allQuickstartSolutionChangesAreInTheSameFolder;
    }
    return changesAreValid;
}
exports.areChangesValid = areChangesValid;
function isBuildRequired(changes) {
    changes = removeFilesWithPathThatBeginsWithDot(changes);
    return changes.length > 0
        && !changes.every(function (path) {
            return path.split('/').length < 3;
        });
}
exports.isBuildRequired = isBuildRequired;
function getQuickstartSolutionPath(changes) {
    changes = removeFilesWithPathThatBeginsWithDot(changes);
    let found = changes.find(function (path) { return path.split('/').length > 2; });
    if (found) {
        return found
            .split('/')
            .splice(0, 2)
            .join('/');
    }
    else {
        throw "No quickstart solution changes found.";
    }
}
exports.getQuickstartSolutionPath = getQuickstartSolutionPath;
function getQuickstartTool(changes) {
    changes = removeFilesWithPathThatBeginsWithDot(changes);
    let found = changes.find(function (path) { return path.split('/').length > 2; });
    if (found) {
        return found.split('/')[0];
    }
    else {
        throw "No quickstart solution changes found.";
    }
}
exports.getQuickstartTool = getQuickstartTool;
function removeFilesWithPathThatBeginsWithDot(changes) {
    return changes.filter(function (path) {
        return path[0] != '.';
    });
}
function splitWithRemainder(input, separator, limit) {
    let splits = input.split(separator);
    let result;
    if (splits.length > limit) {
        result = splits.splice(0, limit);
        result.push(splits.join(separator));
    }
    else {
        result = splits;
    }
    return result;
}
