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
const exec = __importStar(require("@actions/exec"));
const path = __importStar(require("path"));
const fs_1 = require("fs");
function run() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let branch = core.getInput("branch");
            let addPathSpec = core.getInput("add_path_spec");
            let commitMessage = core.getInput("commit_message");
            let wd = process.env.GITHUB_REPOSITORY;
            core.info("Input: branch = " + branch);
            core.info("Input: add_path_spec = " + addPathSpec);
            core.info("Input: commit_message = " + commitMessage);
            let githubActor = process.env.GITHUB_ACTOR;
            let githubToken = process.env.GITHUB_TOKEN;
            let home = process.env.HOME;
            core.info("Updating .netrc file");
            let netrcContents = `machine github.com
login ${githubActor}
password ${githubToken}
machine api.github.com
login ${githubActor}
password ${githubToken}`;
            yield fs_1.promises.writeFile(path.join(home, '.netrc'), netrcContents);
            core.info("Setting git config email and user name");
            yield exec.exec("git", ["config", "--global", "user.email", "actions@github.com"]);
            yield exec.exec("git", ["config", "--global", "user.name", "GitHub Actions"]);
            core.info("Checking if any relevant changes to commit.");
            let statusOutput = '';
            let options = {};
            options.listeners = {
                stdout: (data) => {
                    statusOutput += data.toString();
                }
            };
            let files = addPathSpec.split(" ");
            yield exec.exec('git', ['status'].concat(files), options);
            let changes = statusOutput != '';
            if (changes) {
                core.info(`Git status output:\n${statusOutput}\n`);
                core.info("Changes found. Committing changes...");
                branch = branch.replace("refs/heads/", "");
                core.info("Branch is: " + branch);
                yield exec.exec('git', ['checkout', branch]);
                yield exec.exec('git', ['add'].concat(files));
                yield exec.exec('git', ['commit', '-m', commitMessage, `--author="${githubActor} <${githubActor}@users.noreply.github.com>`]);
                yield exec.exec('git', ['push', '--set-upstream', 'origin', `HEAD:${branch}`]);
                core.info("Changes committed and pushed to origin.");
            }
            else {
                core.info("No relevant changes found. Nothing to commit");
            }
        }
        catch (error) {
            throw error;
        }
    });
}
exports.run = run;
run().catch(error => core.setFailed(error.message));
