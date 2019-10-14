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
const fs_1 = require("fs");
const functions_1 = require("./functions");
function run() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let manifestPath = core.getInput("manifest_path");
            let version = core.getInput("version");
            let tag = core.getInput("tag");
            let registry = core.getInput("registry");
            let manifestContents = yield fs_1.promises.readFile(manifestPath, 'utf8');
            manifestContents = functions_1.updateManifest(manifestContents, version, tag, registry);
            core.info("Updated manifest:\n");
            core.info(manifestContents);
            yield fs_1.promises.writeFile(manifestPath, manifestContents);
        }
        catch (error) {
            throw error;
        }
    });
}
exports.run = run;
run().catch(error => core.setFailed(error.message));
