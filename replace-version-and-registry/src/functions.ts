import * as yaml from 'js-yaml'
import { parse } from 'docker-reference-parser';

export function updateManifest(manifestContents: string, version: string, tag: string, registry?: string) : string {
    let manifest = yaml.safeLoad(manifestContents);

    manifest.version = version;

    let invocationImage = manifest.invocationImage;
    let invocationImageParsed = parse(invocationImage);

    if (!registry) {
        invocationImage = `${invocationImageParsed.path}:${tag}`;
    } 
    else {
        invocationImage = `${registry}/${invocationImageParsed.path}:${tag}`;
    }

    manifest.invocationImage = invocationImage;
    
    let bundle = manifest.tag;
    let bundleParsed = parse(bundle);

    if (!registry) {
        bundle = `${bundleParsed.path}:${tag}`;
    } 
    else {
        bundle = `${registry}/${bundleParsed.path}:${tag}`;
    }

    manifest.tag = bundle;
    manifestContents = yaml.safeDump(manifest);

    return manifestContents;
}