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
const tc = __importStar(require("@actions/tool-cache"));
const exec = __importStar(require("@actions/exec"));
const io = __importStar(require("@actions/io"));
const path = __importStar(require("path"));
function run() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const execa = require('execa');
            let porterUrl = core.getInput("porter_url");
            let porterVersion = core.getInput("porter_version");
            let feedUrl = core.getInput("feed_url");
            let mixinsStr = core.getInput("mixins");
            let mixinsVersion = core.getInput("mixins_version");
            let fullPorterUrl = `${porterUrl}/${porterVersion}/porter-linux-amd64`;
            core.info(`Installing porter from ${fullPorterUrl}`);
            let downloadPath = yield tc.downloadTool(fullPorterUrl);
            core.info(`Download path: ${downloadPath}`);
            yield exec.exec("chmod", ["+x", downloadPath]);
            const binPath = "/home/runner/bin";
            yield io.mkdirP(binPath);
            yield io.mv(downloadPath, path.join(binPath, "porter"));
            core.addPath(binPath);
            // fs.mkdir('.porter', { recursive: true }, (err) => { if(err) throw err; });
            // let porterTool = '.porter/porter';
            // fs.copyFile(downloadPath, porterTool, (err) => { if(err) throw err; });
            // fs.chmod(porterTool, 555, (err) => { if(err) throw err; });
            // core.addPath('.porter');
            core.info("Installed porter");
            core.info("Installing mixins");
            let mixins = mixinsStr.split(',');
            mixins.forEach((mixin) => __awaiter(this, void 0, void 0, function* () {
                const { stdout, stderr } = yield execa('porter', ['mixin', 'install', mixin, '--version', mixinsVersion, '--feed-url', feedUrl]);
                if (stdout)
                    core.info(stdout);
                if (stderr) {
                    core.error(stderr);
                    throw new Error(stderr);
                }
            }));
            core.info("Installed mixins");
            let cachedPath = yield tc.cacheDir('.porter', 'porter', porterVersion);
            core.info(`Cache path: ${cachedPath}`);
            core.addPath(cachedPath);
        }
        catch (error) {
            throw error;
        }
    });
}
exports.run = run;
run().catch(error => core.setFailed(error.message));
