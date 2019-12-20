import { promises as fs, PathLike as PathLike } from 'fs';
import * as path from 'path';
import * as yaml from 'js-yaml';
import { default as json2md } from 'json2md';

export async function generateTocAsync(porterBundlesPath: string): Promise<string> {
    const porterBundleDirs = await getDirectoriesAsync(porterBundlesPath);

    let rows : any[] = [];

    for (let i = 0; i < porterBundleDirs.length; i++) {
        const dir = porterBundleDirs[i];
        const porterManifestPath = path.join(porterBundlesPath, dir, 'porter.yaml');
        let manifestContents = await fs.readFile(porterManifestPath, 'utf8');
        let manifest = yaml.safeLoad(manifestContents);

        let name = manifest.name;
        let description = manifest.description;
        let version = manifest.version;

        let row = {
            Name: `[${name}](porter/${dir})`,
            Version: version,
            Description: description,
        };

        rows.push(row);
    }

    let table = json2md([
        {
            table: {
                headers: ["Name", "Version", "Description"],
                rows: rows
            },
        }
    ]);

    return table;
}

async function getDirectoriesAsync(source: PathLike) {
    const dirents = await fs.readdir(source, { withFileTypes: true });
    return dirents.filter(dirent => dirent.isDirectory()).map(dirent => dirent.name);
}