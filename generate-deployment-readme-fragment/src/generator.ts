import { Bundle } from 'cnabjs';
import { default as json2md } from 'json2md';

export class Generator {
    private readonly bundleMetadata: Bundle;
    private readonly simpleTemplateUri: string;
    private readonly advancedTemplateUri: string;

    constructor(bundleMetadata: Bundle, simpleTemplateUri: string, advancedTemplateUri: string) {
        this.bundleMetadata = bundleMetadata;
        this.simpleTemplateUri = simpleTemplateUri;
        this.advancedTemplateUri = advancedTemplateUri;
    }
    
    generateReadme() : string {
        let readme = "";

        readme += this.generateDeployFromAzureSection()
        readme += this.insertNewLine(2);
        readme += this.generateDeployFromCloudShellSection();
        readme += this.insertNewLine(2);
        readme += this.generateParametersAndCredentials();

        return readme;
    }

    private generateDeployFromAzureSection(): string {
        return json2md([
            { h2: "Deploy from Azure" },
            { p: "You will need to create a service principal in order to use the 'Deploy from Azure' buttons." },
            { p: "For detailed instructions on deploying from Azure, including how to setup the service principal, see [Consuming: Deploy from Azure](../../docs/consuming.md#deploy-from-azure)" },
            { h3: "Simple deployment" },
            { p: this.generateDeployFromAzureButton(this.simpleTemplateUri)},
            { h3: "Advanced deployment" },
            { p: this.generateDeployFromAzureButton(this.advancedTemplateUri)},
        ]);
    }

    private generateDeployFromAzureButton(templateUri): string {
        let portalUri = "https://portal.azure.com/#create/Microsoft.Template/uri/"
        let buttonImageUri = "https://raw.githubusercontent.com/endjin/CNAB.Quickstarts/master/images/Deploy-from-Azure.png"
        
        let deployUri = portalUri + encodeURIComponent(templateUri);

        return `<a href=\"${deployUri}\" target=\"_blank\"><img src=\"${buttonImageUri}\"/></a>`;
    }

    private generateDeployFromCloudShellSection(): string {
        return json2md([
            { h2: "Deploy from Cloud Shell" },
            { p: "For detailed instructions on deploying from Cloud Shell, including how to setup the Cloud Shell environment, see [Consuming: Deploy from Cloud Shell](../../docs/consuming.md#deploy-from-cloud-shell)" },
            { 
                p: `\`\`\`porter install --tag ${this.bundleMetadata.invocationImages[0].image} -d azure\`\`\`` 
            }
        ]);
    }

    private generateParametersAndCredentials(): string {
        let parametersAndCredentials: [string, any][] = [];
        
        if (this.bundleMetadata.parameters){
            let parameters = Object.entries(this.bundleMetadata.parameters);
            parametersAndCredentials = parametersAndCredentials.concat(parameters);
        }

        if (this.bundleMetadata.credentials){
            let credentials = Object.entries(this.bundleMetadata.credentials);
            parametersAndCredentials = parametersAndCredentials.concat(credentials);
        }
        
        parametersAndCredentials = parametersAndCredentials.sort((a, b) => (a[0] > b[0]) ? 1 : -1)

        return json2md([
            { 
                h2: "Parameters and Credentials" 
            },
            {
                table: {
                    headers: ["Name", "Description", "Default", "Required"],
                    rows: parametersAndCredentials.map(
                        x => { 
                            return { 
                                Name: x[0], 
                                Description: x[1].description || "", 
                                Default: x[1].default || "",
                                Required: x[1].required ? "Yes" : "No" 
                            } 
                        })
                }
            }
        ])
    }

    private insertNewLine(count: number = 1): string {
        return "\n".repeat(count);
    }
}