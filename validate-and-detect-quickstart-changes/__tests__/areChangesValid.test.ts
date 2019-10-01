import * as functions from '../src/functions'

test('changes are valid when changing a single file in the root', async() => {
    let changes = [
        "readme.md"
    ];

    let changesAreValid = functions.areChangesValid(changes);

    expect(changesAreValid).toBe(true);
});

test('changes are valid when changing a file in the root and a file in a direct subfolder', async() => {
    let changes = [
        "readme.md",
        "porter/readme.md"
    ];

    let changesAreValid = functions.areChangesValid(changes);

    expect(changesAreValid).toBe(true);
});

test('changes are valid when changing a file in the root, a file in a direct subfolder, and a file in a quickstart solution folder', async() => {
    let changes = [
        "readme.md",
        "porter/readme.md",
        "porter/qs1/porter.yaml"
    ];

    let changesAreValid = functions.areChangesValid(changes);

    expect(changesAreValid).toBe(true);
});

test('changes are valid when changing a single file in a quickstart solution folder', async() => {
    let changes = [
        "porter/qs1/porter.yaml"
    ];

    let changesAreValid = functions.areChangesValid(changes);

    expect(changesAreValid).toBe(true);
});

test('changes are valid when changing a multiple files in a quickstart solution folder', async() => {
    let changes = [
        "porter/qs1/porter.yaml",
        "porter/qs1/cnab/dockerfile"
    ];

    let changesAreValid = functions.areChangesValid(changes);

    expect(changesAreValid).toBe(true);
});

test('changes are invalid when changing a files in 2 different quickstart solution folders', async() => {
    let changes = [
        "porter/qs1/porter.yaml",
        "porter/qs2/porter.yaml"
    ];

    let changesAreValid = functions.areChangesValid(changes);

    expect(changesAreValid).toBe(false);
});

test('changes are invalid when changing files in 2 different tool folders', async() => {
    let changes = [
        "porter/qs1/porter.yaml",
        "duffle/qs1/porter.yaml"
    ];

    let changesAreValid = functions.areChangesValid(changes);

    expect(changesAreValid).toBe(false);
});