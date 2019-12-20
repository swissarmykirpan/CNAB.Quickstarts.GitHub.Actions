import { generateTocAsync } from '../src/functions';
import { promises as fs } from 'fs';

test('generate toc', async () => {
    let result = await generateTocAsync("./__tests__/data/porter");
    let expected = await fs.readFile("./__tests__/data/toc.md", "utf8");
    expect(result).toBe(expected);
});