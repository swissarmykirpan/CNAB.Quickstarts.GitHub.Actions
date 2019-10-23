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
const yaml = __importStar(require("js-yaml"));
const fs_1 = require("fs");
function run() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let manifestPath = core.getInput("manifest_path");
            let workspacePath = process.env.GITHUB_WORKSPACE;
            let bundleDir = path.dirname(manifestPath);
            let wd = path.join(workspacePath, bundleDir);
            let manifestContents = yield fs_1.promises.readFile(manifestPath, 'utf8');
            let manifest = yaml.safeLoad(manifestContents);
            let manifestVersion = manifest.version;
            core.info(`Version from Porter manifest: ${manifestVersion}`);
            let gitversionConfigPath = path.join(wd, 'GitVersion.yml');
            let contents = `next-version: ${manifestVersion}`;
            core.info(`Writing temporary Gitversion config file with contents '${contents}' to path '${gitversionConfigPath}'`);
            fs_1.promises.writeFile(gitversionConfigPath, contents);
            core.info(`Running GitVersion in working directory '${wd}'`);
            let gvOutput = '';
            const options = {};
            options.listeners = {
                stdout: (data) => {
                    gvOutput += data.toString();
                }
            };
            options.cwd = wd;
            yield exec.exec('docker', ['run', '--rm', '-v', `${workspacePath}:/repo`, 'gittools/gitversion:latest-linux-netcoreapp2.1', `/repo/${bundleDir}`], options);
            let gv = JSON.parse(gvOutput);
            let fullSemver = gv.FullSemVer;
            let version = fullSemver.replace('.', '-').replace('+', '-');
            core.setOutput("version", version);
        }
        catch (error) {
            throw error;
        }
    });
}
exports.run = run;
run().catch(error => core.setFailed(error.message));
