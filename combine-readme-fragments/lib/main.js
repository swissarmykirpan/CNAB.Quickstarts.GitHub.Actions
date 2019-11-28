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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const core = __importStar(require("@actions/core"));
const fs_1 = require("fs");
const fs = __importStar(require("fs"));
const json2md_1 = __importDefault(require("json2md"));
const yaml = __importStar(require("js-yaml"));
function run() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let manifestPath = core.getInput("manifest_path");
            let instructionsPath = core.getInput("instructions_path");
            let deploymentPath = core.getInput("deployment_path");
            let issuesPath = core.getInput("issues_path");
            let outputPath = core.getInput("output_path");
            let manifestContents = yield fs_1.promises.readFile(manifestPath, 'utf8');
            let manifest = yaml.safeLoad(manifestContents);
            let title = manifest.description || manifest.name;
            let readme = "";
            readme += json2md_1.default({ h1: title });
            readme += insertNewLine();
            readme += yield fs_1.promises.readFile(instructionsPath, "utf8");
            readme += insertNewLine(2);
            readme += yield fs_1.promises.readFile(deploymentPath, "utf8");
            if (fs.existsSync(issuesPath)) {
                let issues = yield fs_1.promises.readFile(issuesPath, "utf8");
                if (issues) {
                    readme += json2md_1.default({ h2: "Known issues" });
                    readme += issues;
                }
            }
            core.info(`Readme generated. Writing out to: ${outputPath}`);
            yield fs_1.promises.writeFile(outputPath, readme);
        }
        catch (error) {
            throw error;
        }
    });
}
exports.run = run;
function insertNewLine(count = 1) {
    return "\n".repeat(count);
}
run().catch(error => core.setFailed(error.message));
