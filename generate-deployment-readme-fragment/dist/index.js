module.exports =
/******/ (function(modules, runtime) { // webpackBootstrap
/******/ 	"use strict";
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	__webpack_require__.ab = __dirname + "/";
/******/
/******/ 	// the startup function
/******/ 	function startup() {
/******/ 		// Load entry module and return exports
/******/ 		return __webpack_require__(198);
/******/ 	};
/******/
/******/ 	// run startup
/******/ 	return startup();
/******/ })
/************************************************************************/
/******/ ({

/***/ 87:
/***/ (function(module) {

module.exports = require("os");

/***/ }),

/***/ 198:
/***/ (function(__unusedmodule, exports, __webpack_require__) {

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
const core = __importStar(__webpack_require__(470));
const generator_1 = __webpack_require__(211);
const fs_1 = __webpack_require__(747);
function run() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let bundleMetadataPath = core.getInput("bundle_metadata_path");
            let outputPath = core.getInput("output_path");
            let simpleTemplateUri = core.getInput("simple_template_uri");
            let advancedTemplateUri = core.getInput("advanced_template_uri");
            core.info(`Reading and parsing bundle metadata from: ${bundleMetadataPath}`);
            let bundleMetadata = JSON.parse(yield fs_1.promises.readFile(bundleMetadataPath, "utf8"));
            core.info("Generating deployment readme fragment...");
            let generator = new generator_1.Generator(bundleMetadata, simpleTemplateUri, advancedTemplateUri);
            let readme = generator.generateReadme();
            core.info(`Fragment generated. Writing out to: ${outputPath}`);
            yield fs_1.promises.writeFile(outputPath, readme);
        }
        catch (error) {
            throw error;
        }
    });
}
exports.run = run;
run().catch(error => core.setFailed(error.message));


/***/ }),

/***/ 211:
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const json2md_1 = __importDefault(__webpack_require__(640));
class Generator {
    constructor(bundleMetadata, simpleTemplateUri, advancedTemplateUri) {
        this.bundleMetadata = bundleMetadata;
        this.simpleTemplateUri = simpleTemplateUri;
        this.advancedTemplateUri = advancedTemplateUri;
    }
    generateReadme() {
        let readme = "";
        readme += this.generateDeployFromAzureSection();
        readme += this.insertNewLine(2);
        readme += this.generateDeployFromCloudShellSection();
        readme += this.insertNewLine(2);
        readme += this.generateParametersAndCredentials();
        return readme;
    }
    generateDeployFromAzureSection() {
        return json2md_1.default([
            { h2: "Deploy from Azure" },
            { p: "You will need to create a service principal in order to use the 'Deploy from Azure' buttons." },
            { p: "For detailed instructions on deploying from Azure, including how to setup the service principal, see [Consuming: Deploy from Azure](../../docs/consuming.md#deploy-from-azure)" },
            { h3: "Simple deployment" },
            { p: this.generateDeployFromAzureButton(this.simpleTemplateUri) },
            { h3: "Advanced deployment" },
            { p: this.generateDeployFromAzureButton(this.advancedTemplateUri) },
        ]);
    }
    generateDeployFromAzureButton(templateUri) {
        let portalUri = "https://portal.azure.com/#create/Microsoft.Template/uri/";
        let buttonImageUri = "https://raw.githubusercontent.com/endjin/CNAB.Quickstarts/master/images/Deploy-from-Azure.png";
        let deployUri = portalUri + encodeURIComponent(templateUri);
        return `<a href=\"${deployUri}\" target=\"_blank\"><img src=\"${buttonImageUri}\"/></a>`;
    }
    generateDeployFromCloudShellSection() {
        return json2md_1.default([
            { h2: "Deploy from Cloud Shell" },
            { p: "For detailed instructions on deploying from Cloud Shell, including how to setup the Cloud Shell environment, see [Consuming: Deploy from Cloud Shell](../../docs/consuming.md#deploy-from-cloud-shell)" },
            {
                p: `\`\`\`porter install --tag ${this.bundleMetadata.invocationImages[0].image} -d azure\`\`\``
            }
        ]);
    }
    generateParametersAndCredentials() {
        let parametersAndCredentials = [];
        if (this.bundleMetadata.parameters) {
            let parameters = Object.entries(this.bundleMetadata.parameters);
            parametersAndCredentials = parametersAndCredentials.concat(parameters);
        }
        if (this.bundleMetadata.credentials) {
            let credentials = Object.entries(this.bundleMetadata.credentials);
            parametersAndCredentials = parametersAndCredentials.concat(credentials);
        }
        parametersAndCredentials = parametersAndCredentials.sort((a, b) => (a[0] > b[0]) ? 1 : -1);
        return json2md_1.default([
            {
                h2: "Parameters and Credentials"
            },
            {
                table: {
                    headers: ["Name", "Description", "Default", "Required"],
                    rows: parametersAndCredentials.map(x => {
                        return {
                            Name: x[0],
                            Description: x[1].description || "",
                            Default: x[1].default || "",
                            Required: x[1].required ? "Yes" : "No"
                        };
                    })
                }
            }
        ]);
    }
    insertNewLine(count = 1) {
        return "\n".repeat(count);
    }
}
exports.Generator = Generator;


/***/ }),

/***/ 222:
/***/ (function(module) {

"use strict";


var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var converters = module.exports = {};

var generateHeader = function generateHeader(repeat) {
    return function (input, json2md) {
        return "#".repeat(repeat) + " " + json2md(input);
    };
};

var indent = function indent(content, spaces, ignoreFirst) {
    var lines = content;

    if (typeof content === "string") {
        lines = content.split("\n");
    }

    if (ignoreFirst) {
        if (lines.length <= 1) {
            return lines.join("\n");
        }
        return lines[0] + "\n" + indent(lines.slice(1), spaces, false);
    }

    return lines.map(function (c) {
        return " ".repeat(spaces) + c;
    }).join("\n");
};

var parseTextFormat = function parseTextFormat(text) {

    var formats = {
        strong: "**",
        italic: "*"
    };

    return text.replace(/<\/?strong\>/gi, formats.strong).replace(/<\/?bold\>/gi, formats.strong).replace(/<\/?em\>/gi, formats.italic).replace(/<\/?italic\>/gi, formats.italic);
};

// Headings
converters.h1 = generateHeader(1);
converters.h2 = generateHeader(2);
converters.h3 = generateHeader(3);
converters.h4 = generateHeader(4);
converters.h5 = generateHeader(5);
converters.h6 = generateHeader(6);

converters.blockquote = function (input, json2md) {
    return json2md(input, "> ");
};

converters.img = function (input, json2md) {
    if (Array.isArray(input)) {
        return json2md(input, "", "img");
    }
    if (typeof input === "string") {
        return converters.img({ source: input, title: "" });
    }
    input.title = input.title || "";
    return "![" + input.title + "](" + input.source + ")";
};

converters.ul = function (input, json2md) {
    var c = "";
    for (var i = 0; i < input.length; ++i) {
        var marker = "";

        var type = Object.keys(input[i])[0];
        if (type !== "ul" && type !== "ol") {
            marker += "\n - ";
        }

        c += marker + parseTextFormat(indent(json2md(input[i]), 4, true));
    }
    return c;
};

converters.ol = function (input, json2md) {
    var c = "";
    var jumpCount = 0;
    for (var i = 0; i < input.length; ++i) {
        var marker = "";
        var type = Object.keys(input[i])[0];
        if (type !== "ul" && type !== "ol") {
            marker = "\n " + (i + 1 - jumpCount) + ". ";
        } else {
            jumpCount++;
        }

        c += marker + parseTextFormat(indent(json2md(input[i]), 4, true));
    }
    return c;
};

converters.code = function (input, json2md) {
    var c = "```" + (input.language || "") + "\n";
    if (Array.isArray(input.content)) {
        c += input.content.join("\n");
    } else {
        c += input.content;
    }
    c += "\n```";
    return c;
};

converters.p = function (input, json2md) {
    return parseTextFormat(json2md(input, "\n"));
};

converters.table = function (input, json2md) {

    if ((typeof input === "undefined" ? "undefined" : _typeof(input)) !== "object" || !input.hasOwnProperty("headers") || !input.hasOwnProperty("rows")) {
        return "";
    }

    var header = " | " + input.headers.join(" | ") + " | ",
        spaces = " | " + input.headers.map(function () {
        return "---";
    }).join(" | ") + " | ",
        data = " | " + input.rows.map(function (r) {
        return Array.isArray(r) ? r.map(function (el) {
            return parseTextFormat(json2md(el));
        }).join(" | ") : input.headers.map(function (h) {
            return parseTextFormat(json2md(r[h]));
        }).join(" | ");
    }).join("\n") + " | ";

    return [header, spaces, data].join("\n");
};

converters.link = function (input, json2md) {
    if (Array.isArray(input)) {
        return json2md(input, "", "link");
    }
    if (typeof input === "string") {
        return converters.link({ source: input, title: "" });
    }
    return "[" + input.title + "](" + input.source + ")";
};

/***/ }),

/***/ 431:
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const os = __webpack_require__(87);
/**
 * Commands
 *
 * Command Format:
 *   ##[name key=value;key=value]message
 *
 * Examples:
 *   ##[warning]This is the user warning message
 *   ##[set-secret name=mypassword]definitelyNotAPassword!
 */
function issueCommand(command, properties, message) {
    const cmd = new Command(command, properties, message);
    process.stdout.write(cmd.toString() + os.EOL);
}
exports.issueCommand = issueCommand;
function issue(name, message = '') {
    issueCommand(name, {}, message);
}
exports.issue = issue;
const CMD_STRING = '::';
class Command {
    constructor(command, properties, message) {
        if (!command) {
            command = 'missing.command';
        }
        this.command = command;
        this.properties = properties;
        this.message = message;
    }
    toString() {
        let cmdStr = CMD_STRING + this.command;
        if (this.properties && Object.keys(this.properties).length > 0) {
            cmdStr += ' ';
            for (const key in this.properties) {
                if (this.properties.hasOwnProperty(key)) {
                    const val = this.properties[key];
                    if (val) {
                        // safely append the val - avoid blowing up when attempting to
                        // call .replace() if message is not a string for some reason
                        cmdStr += `${key}=${escape(`${val || ''}`)},`;
                    }
                }
            }
        }
        cmdStr += CMD_STRING;
        // safely append the message - avoid blowing up when attempting to
        // call .replace() if message is not a string for some reason
        const message = `${this.message || ''}`;
        cmdStr += escapeData(message);
        return cmdStr;
    }
}
function escapeData(s) {
    return s.replace(/\r/g, '%0D').replace(/\n/g, '%0A');
}
function escape(s) {
    return s
        .replace(/\r/g, '%0D')
        .replace(/\n/g, '%0A')
        .replace(/]/g, '%5D')
        .replace(/;/g, '%3B');
}
//# sourceMappingURL=command.js.map

/***/ }),

/***/ 470:
/***/ (function(__unusedmodule, exports, __webpack_require__) {

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
Object.defineProperty(exports, "__esModule", { value: true });
const command_1 = __webpack_require__(431);
const os = __webpack_require__(87);
const path = __webpack_require__(622);
/**
 * The code to exit an action
 */
var ExitCode;
(function (ExitCode) {
    /**
     * A code indicating that the action was successful
     */
    ExitCode[ExitCode["Success"] = 0] = "Success";
    /**
     * A code indicating that the action was a failure
     */
    ExitCode[ExitCode["Failure"] = 1] = "Failure";
})(ExitCode = exports.ExitCode || (exports.ExitCode = {}));
//-----------------------------------------------------------------------
// Variables
//-----------------------------------------------------------------------
/**
 * Sets env variable for this action and future actions in the job
 * @param name the name of the variable to set
 * @param val the value of the variable
 */
function exportVariable(name, val) {
    process.env[name] = val;
    command_1.issueCommand('set-env', { name }, val);
}
exports.exportVariable = exportVariable;
/**
 * Registers a secret which will get masked from logs
 * @param secret value of the secret
 */
function setSecret(secret) {
    command_1.issueCommand('add-mask', {}, secret);
}
exports.setSecret = setSecret;
/**
 * Prepends inputPath to the PATH (for this action and future actions)
 * @param inputPath
 */
function addPath(inputPath) {
    command_1.issueCommand('add-path', {}, inputPath);
    process.env['PATH'] = `${inputPath}${path.delimiter}${process.env['PATH']}`;
}
exports.addPath = addPath;
/**
 * Gets the value of an input.  The value is also trimmed.
 *
 * @param     name     name of the input to get
 * @param     options  optional. See InputOptions.
 * @returns   string
 */
function getInput(name, options) {
    const val = process.env[`INPUT_${name.replace(/ /g, '_').toUpperCase()}`] || '';
    if (options && options.required && !val) {
        throw new Error(`Input required and not supplied: ${name}`);
    }
    return val.trim();
}
exports.getInput = getInput;
/**
 * Sets the value of an output.
 *
 * @param     name     name of the output to set
 * @param     value    value to store
 */
function setOutput(name, value) {
    command_1.issueCommand('set-output', { name }, value);
}
exports.setOutput = setOutput;
//-----------------------------------------------------------------------
// Results
//-----------------------------------------------------------------------
/**
 * Sets the action status to failed.
 * When the action exits it will be with an exit code of 1
 * @param message add error issue message
 */
function setFailed(message) {
    process.exitCode = ExitCode.Failure;
    error(message);
}
exports.setFailed = setFailed;
//-----------------------------------------------------------------------
// Logging Commands
//-----------------------------------------------------------------------
/**
 * Writes debug message to user log
 * @param message debug message
 */
function debug(message) {
    command_1.issueCommand('debug', {}, message);
}
exports.debug = debug;
/**
 * Adds an error issue
 * @param message error issue message
 */
function error(message) {
    command_1.issue('error', message);
}
exports.error = error;
/**
 * Adds an warning issue
 * @param message warning issue message
 */
function warning(message) {
    command_1.issue('warning', message);
}
exports.warning = warning;
/**
 * Writes info to log with console.log.
 * @param message info message
 */
function info(message) {
    process.stdout.write(message + os.EOL);
}
exports.info = info;
/**
 * Begin an output group.
 *
 * Output until the next `groupEnd` will be foldable in this group
 *
 * @param name The name of the output group
 */
function startGroup(name) {
    command_1.issue('group', name);
}
exports.startGroup = startGroup;
/**
 * End an output group.
 */
function endGroup() {
    command_1.issue('endgroup');
}
exports.endGroup = endGroup;
/**
 * Wrap an asynchronous function call in a group.
 *
 * Returns the same type as the function itself.
 *
 * @param name The name of the group
 * @param fn The function to wrap in the group
 */
function group(name, fn) {
    return __awaiter(this, void 0, void 0, function* () {
        startGroup(name);
        let result;
        try {
            result = yield fn();
        }
        finally {
            endGroup();
        }
        return result;
    });
}
exports.group = group;
//# sourceMappingURL=core.js.map

/***/ }),

/***/ 479:
/***/ (function(module) {

"use strict";


/**
 * indento
 * Indents the input string.
 *
 * @name indento
 * @function
 * @param {String} input The input string.
 * @param {Number} width The indent width.
 * @param {String} char The character to use for indentation (default: `" "`).
 * @return {String} The indented string.
 */
function indento(input, width, char) {
  char = typeof char !== "string" ? " " : char;
  return String(input).replace(/^/gm, char.repeat(width));
}

module.exports = indento;

/***/ }),

/***/ 622:
/***/ (function(module) {

module.exports = require("path");

/***/ }),

/***/ 640:
/***/ (function(module, __unusedexports, __webpack_require__) {

"use strict";


var converters = __webpack_require__(222),
    indento = __webpack_require__(479);

/**
 * json2md
 * Converts a JSON input to markdown.
 *
 * **Supported elements**
 *
 * | Type         | Element            | Data                                                                                                                     | Example                                                                                                                                          |
 * |--------------|--------------------|--------------------------------------------------------------------------------------------------------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------|
 * | `h1`         | Heading 1          | The heading text as string.                                                                                              | `{ h1: "heading 1" }`                                                                                                                            |
 * | `h2`         | Heading 2          | The heading text as string.                                                                                              | `{ h2: "heading 2" }`                                                                                                                            |
 * | `h3`         | Heading 3          | The heading text as string.                                                                                              | `{ h3: "heading 3" }`                                                                                                                            |
 * | `h4`         | Heading 4          | The heading text as string.                                                                                              | `{ h4: "heading 4" }`                                                                                                                            |
 * | `h5`         | Heading 5          | The heading text as string.                                                                                              | `{ h5: "heading 5" }`                                                                                                                            |
 * | `h6`         | Heading 6          | The heading text as string.                                                                                              | `{ h6: "heading 6" }`                                                                                                                            |
 * | `p`          | Paragraphs         | The paragraph text as string or array (multiple paragraphs).                                                             | `{ p: "Hello World"}` or multiple paragraphs: `{ p: ["Hello", "World"] }`                                                                        |
 * | `blockquote` | Blockquote         | The blockquote as string or array (multiple blockquotes)                                                                 | `{ blockquote: "Hello World"}` or multiple blockquotes: `{ blockquote: ["Hello", "World"] }`                                                     |
 * | `img`        | Image              | An object or an array of objects containing the `title` and `source` fields.                                             | `{ img: { title: "My image title", source: "http://example.com/image.png" } }`                                                                   |
 * | `ul`         | Unordered list     | An array of strings representing the items.                                                                              | `{ ul: ["item 1", "item 2"] }`                                                                                                                   |
 * | `ol`         | Ordered list       | An array of strings representing the items.                                                                              | `{ ol: ["item 1", "item 2"] }`                                                                                                                   |
 * | `code`       | Code block element | An object containing the `language` (`String`) and `content` (`Array` or `String`)  fields.                              | `{ code: { "language": "html", "content": "<script src='dummy.js'></script>" } }`                                                                |
 * | `table`      | Table              | An object containing the `headers` (`Array` of `String`s) and `rows` (`Array` of `Array`s or `Object`s).                 | `{ table: { headers: ["a", "b"], rows: [{ a: "col1", b: "col2" }] } }` or `{ table: { headers: ["a", "b"], rows: [["col1", "col2"]] } }`         |
 * | `link`       | Link               | An object containing the `title` and the `source` fields.                                                                | `{ title: 'hello', source: 'https://ionicabizau.net' }
 *
 *
 * You can extend the `json2md.converters` object to support your custom types.
 *
 * ```js
 * json2md.converters.sayHello = function (input, json2md) {
 *    return "Hello " + input + "!"
 * }
 * ```
 *
 * Then you can use it:
 *
 * ```js
 * json2md({ sayHello: "World" })
 * // => "Hello World!"
 * ```
 *
 * @name json2md
 * @function
 * @param {Array|Object|String} data The input JSON data.
 * @param {String} prefix A snippet to add before each line.
 * @return {String} The generated markdown result.
 */
function json2md(data, prefix, _type) {
    prefix = prefix || "";
    if (typeof data === "string" || typeof data === "number") {
        return indento(data, 1, prefix);
    }

    var content = [];

    // Handle arrays
    if (Array.isArray(data)) {
        for (var i = 0; i < data.length; ++i) {
            content.push(indento(json2md(data[i], "", _type), 1, prefix));
        }
        return content.join("\n");
    } else {
        var type = Object.keys(data)[0],
            func = converters[_type || type];

        if (typeof func === "function") {
            return indento(func(_type ? data : data[type], json2md), 1, prefix) + "\n";
        }
        throw new Error("There is no such converter: " + type);
    }
}

/**
 * @param {Array|Object|String} data The input JSON data.
 * @param {String} prefix A snippet to add before each line.
 * @return {Promise.<String, Error>} The generated markdown result.
 */
json2md.async = function (data, prefix, _type) {
    return Promise.resolve().then(function () {
        prefix = prefix || "";
        if (typeof data === "string" || typeof data === "number") {
            return indento(data, 1, prefix);
        }

        var content = [];

        // Handle arrays
        if (Array.isArray(data)) {
            var promises = data.map(function (d, index) {
                return Promise.resolve().then(function () {
                    return json2md.async(d, "", _type);
                }).then(function (result) {
                    return indento(result, 1, prefix);
                }).then(function (result) {
                    content[index] = result;
                });
            });
            return Promise.all(promises).then(function () {
                return content.join("\n");
            });
        } else {
            var type = Object.keys(data)[0],
                func = converters[_type || type];

            if (typeof func === "function") {
                return Promise.resolve().then(function () {
                    return func(_type ? data : data[type], json2md);
                }).then(function (result) {
                    return indento(result, 1, prefix) + "\n";
                });
            }
            throw new Error("There is no such converter: " + type);
        }
    });
};

json2md.converters = converters;

module.exports = json2md;

/***/ }),

/***/ 747:
/***/ (function(module) {

module.exports = require("fs");

/***/ })

/******/ });