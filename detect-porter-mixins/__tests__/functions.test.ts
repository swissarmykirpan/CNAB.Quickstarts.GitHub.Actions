import { getMixins } from '../src/functions'

const example = 
`name: sql-server-always-on
version: 0.1.0
description: SQL Server Always On for AKS
dockerfile: cnab/app/Dockerfile.base
invocationImage: 'cnabquickstarts.azurecr.io/porter/sql-server-always-on:latest'
tag: 'cnabquickstarts.azurecr.io/porter/sql-server-always-on:latest'

mixins:
  - exec
  - helm
  - terraform
`

test('get mixins is correct', async () => {

    let mixins = getMixins(example);

    expect(mixins).toBe('exec,helm,terraform');
});