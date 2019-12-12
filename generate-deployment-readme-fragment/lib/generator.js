"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const json2md_1 = __importDefault(require("json2md"));
class Generator {
    constructor(bundleTag, bundleMetadata, simpleTemplateUri, advancedTemplateUri) {
        this.bundleTag = bundleTag;
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
                p: `\`\`\`porter install --tag ${this.bundleTag} -d azure\`\`\``
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
