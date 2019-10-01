import * as functions from '../src/functions'

test('pull_request trigger files are correct', async() => {
    jest.setTimeout(20000);
    
    let files = await functions.getFiles("pull_request", "deislabs/porter", "4c412b8019046cea187a8fc2db9207202127f013", 648);

    let expected = ["build/azure-pipelines.pr-automatic.yml", "build/azure-pipelines.pr-manual.yml", "build/azure-pipelines.setup-go-workspace.sh"]

    expect(files).toEqual(expect.arrayContaining(expected));
});

test('push trigger files are correct', async() => {
    jest.setTimeout(20000);

    let files = await functions.getFiles("push", "deislabs/porter", "4c412b8019046cea187a8fc2db9207202127f013");

    let expected = ["build/azure-pipelines.pr-automatic.yml", "build/azure-pipelines.setup-go-workspace.sh"]

    expect(files).toEqual(expect.arrayContaining(expected));
});