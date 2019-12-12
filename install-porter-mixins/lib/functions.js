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
function getMixins(manifestContents) {
    let manifest = yaml.safeLoad(manifestContents);
    let mixins = manifest.mixins.join(',');
    return mixins;
}
exports.getMixins = getMixins;
