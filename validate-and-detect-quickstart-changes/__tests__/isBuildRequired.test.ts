import * as functions from '../src/functions'

test('build is not required when changing a single file in the root', async() => {
    let changes = [
        "readme.md"
    ];

    let buildIsRequired = functions.isBuildRequired(changes);

    expect(buildIsRequired).toBe(false);
});

test('build is not required when changing a file in the root and a file in a direct subfolder', async() => {
    let changes = [
        "readme.md",
        "porter/readme.md"
    ];

    let buildIsRequired = functions.isBuildRequired(changes);

    expect(buildIsRequired).toBe(false);
});

test('build is not required when changing files that begin with a dot in the path', async() => {
    let changes = [
        ".github/workflow/ci.yml"
    ];

    let buildIsRequired = functions.isBuildRequired(changes);

    expect(buildIsRequired).toBe(false);
});

test('build is required when changing a file in the root, a file in a direct subfolder, and a file in a quickstart solution folder', async() => {
    let changes = [
        "readme.md",
        "porter/readme.md",
        "porter/qs1/porter.yaml"
    ];

    let buildIsRequired = functions.isBuildRequired(changes);

    expect(buildIsRequired).toBe(true);
});

test('build is required when changing a single file in a quickstart solution folder', async() => {
    let changes = [
        "porter/qs1/porter.yaml"
    ];

    let buildIsRequired = functions.isBuildRequired(changes);

    expect(buildIsRequired).toBe(true);
});

test('build is required when changing a multiple files in a quickstart solution folder', async() => {
    let changes = [
        "porter/qs1/porter.yaml",
        "porter/qs1/cnab/dockerfile"
    ];

    let buildIsRequired = functions.isBuildRequired(changes);

    expect(buildIsRequired).toBe(true);
});