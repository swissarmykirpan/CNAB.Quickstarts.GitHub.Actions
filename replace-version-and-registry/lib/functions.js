"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const yaml = __importStar(require("js-yaml"));
const docker_reference_parser_1 = require("docker-reference-parser");
function updateManifest(manifestContents, version, tag, registry) {
    let manifest = yaml.safeLoad(manifestContents);
    manifest.version = version;
    let invocationImage = manifest.invocationImage;
    let invocationImageParsed = docker_reference_parser_1.parse(invocationImage);
    invocationImage = `${registry}/${invocationImageParsed.path}:${tag}`;
    manifest.invocationImage = invocationImage;
    let bundle = manifest.tag;
    let bundleParsed = docker_reference_parser_1.parse(bundle);
    bundle = `${registry}/${bundleParsed.path}:${tag}`;
    manifest.tag = bundle;
    manifestContents = yaml.safeDump(manifest);
    return manifestContents;
}
exports.updateManifest = updateManifest;
