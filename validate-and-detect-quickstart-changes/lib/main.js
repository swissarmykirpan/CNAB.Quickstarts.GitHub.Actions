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
const functions_1 = require("./functions");
function run() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let trigger = core.getInput('trigger');
            let repoName = core.getInput('repo_name');
            let sourceVersion = core.getInput('source_version');
            let prNumberStr = core.getInput('pr_number');
            let prNumber;
            if (prNumberStr) {
                prNumber = parseInt(prNumberStr);
            }
            let files = yield functions_1.getFiles(trigger, repoName, sourceVersion, prNumber);
            let changesAreValid = functions_1.areChangesValid(files);
            core.setOutput("changes_are_valid", `${changesAreValid}`);
            if (changesAreValid) {
                let buildIsRequired = functions_1.isBuildRequired(files);
                core.setOutput("build_is_required", `${buildIsRequired}`);
                if (buildIsRequired) {
                    let quickstartSolutionPath = functions_1.getQuickstartSolutionPath(files);
                    let quickstartTool = functions_1.getQuickstartTool(files);
                    core.setOutput("quickstart_solution_path", quickstartSolutionPath);
                    core.setOutput("quickstart_tool", quickstartTool);
                }
            }
            else {
                throw new Error("Set of changes in commit or PR are invalid.");
            }
        }
        catch (error) {
            throw error;
        }
    });
}
exports.run = run;
run().catch(error => core.setFailed(error.message));
