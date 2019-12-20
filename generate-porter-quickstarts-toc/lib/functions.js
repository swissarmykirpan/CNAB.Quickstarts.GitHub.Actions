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
const fs_1 = require("fs");
const path = __importStar(require("path"));
const yaml = __importStar(require("js-yaml"));
const json2md_1 = __importDefault(require("json2md"));
function generateTocAsync(porterBundlesPath, outputPath) {
    return __awaiter(this, void 0, void 0, function* () {
        const porterBundleDirs = yield getDirectoriesAsync(porterBundlesPath);
        let rows = [];
        for (let i = 0; i < porterBundleDirs.length; i++) {
            const dir = porterBundleDirs[i];
            const porterManifestPath = path.join(porterBundlesPath, dir, 'porter.yaml');
            let manifestContents = yield fs_1.promises.readFile(porterManifestPath, 'utf8');
            let manifest = yaml.safeLoad(manifestContents);
            let name = manifest.name;
            let description = manifest.description;
            let version = manifest.version;
            let url = path.join(path.relative(path.dirname(outputPath), porterBundlesPath), dir);
            let row = {
                Name: `[${name}](${url})`,
                Version: version,
                Description: description,
            };
            rows.push(row);
        }
        let table = json2md_1.default([
            {
                table: {
                    headers: ["Name", "Version", "Description"],
                    rows: rows
                },
            }
        ]);
        return table;
    });
}
exports.generateTocAsync = generateTocAsync;
function getDirectoriesAsync(source) {
    return __awaiter(this, void 0, void 0, function* () {
        const dirents = yield fs_1.promises.readdir(source, { withFileTypes: true });
        return dirents.filter(dirent => dirent.isDirectory()).map(dirent => dirent.name);
    });
}
