import { Generator } from '../src/generator'
import uuid = require('uuid');
import { promises as fs } from 'fs';
import { Bundle } from 'cnabjs';

test('generate readme runs for standard bundle', async () => {
    await testBase("standard");
});

test('generate readme runs for bundle with missing descriptions', async () => {
    await testBase("missing-descriptions");
});


async function testBase(prefix: string) {
    let expected = await fs.readFile(`./__tests__/data/${prefix}/DEPLOYMENT.md`, "utf8");

    let bundleMetadata : Bundle = JSON.parse(await fs.readFile(`./__tests__/data/${prefix}/bundle.json`, "utf8"));

    let simpleTemplateUri = "https://raw.githubusercontent.com/endjin/CNAB.Quickstarts/master/porter/sql-server-always-on/azuredeploy-simple.json"
    let advancedTemplateUri = "https://raw.githubusercontent.com/endjin/CNAB.Quickstarts/master/porter/sql-server-always-on/azuredeploy-advanced.json"

    let generator = new Generator(bundleMetadata, simpleTemplateUri, advancedTemplateUri);
    let readme = generator.generateReadme();
    expect(readme).toBe(expected);
}