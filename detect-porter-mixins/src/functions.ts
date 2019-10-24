import * as yaml from 'js-yaml'

export function getMixins(manifestContents: string) : string {
    let manifest = yaml.safeLoad(manifestContents);
    let mixins = manifest.mixins.join(',');
    return mixins
}