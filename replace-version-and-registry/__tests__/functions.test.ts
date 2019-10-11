import { updateManifest } from '../src/functions'

const before = 
`name: sql-server-always-on
version: 0.1.0
description: SQL Server Always On for AKS
dockerfile: cnab/app/Dockerfile.base
invocationImage: 'cnabquickstarts.azurecr.io/porter/sql-server-always-on:latest'
tag: 'cnabquickstarts.azurecr.io/porter/sql-server-always-on:latest'
`

const after = 
`name: sql-server-always-on
version: 0.2.0-feature1.1
description: SQL Server Always On for AKS
dockerfile: cnab/app/Dockerfile.base
invocationImage: 'myregistry.io/porter/sql-server-always-on:0.2.0-feature1.1'
tag: 'myregistry.io/porter/sql-server-always-on:0.2.0-feature1.1'
`

test('update manifest is correct', async () => {

    let version = "0.2.0-feature1.1"
    let tag = "0.2.0-feature1.1"
    let registry = "myregistry.io"

    let manifestContents = updateManifest(before, version, tag, registry);

    expect(manifestContents).toBe(after);
});