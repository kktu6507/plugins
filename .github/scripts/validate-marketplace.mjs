import assert from 'node:assert/strict';
import fs from 'node:fs';

const marketplace = JSON.parse(fs.readFileSync('.claude-plugin/marketplace.json', 'utf8'));
assert.equal(marketplace.name, 'kktu');
assert.equal(marketplace.owner?.url, 'https://github.com/kktu6507');
assert.ok(Array.isArray(marketplace.plugins) && marketplace.plugins.length > 0);
const names = new Set();
for (const plugin of marketplace.plugins) {
  assert.match(plugin.name, /^[a-z][a-z0-9-]*$/);
  assert.ok(!names.has(plugin.name), `Duplicate plugin: ${plugin.name}`);
  names.add(plugin.name);
  assert.equal(plugin.defaultEnabled, false);
  assert.equal(plugin.source?.source, 'git-subdir');
  assert.match(plugin.source?.path, /^[a-zA-Z0-9_-]+(?:\/[a-zA-Z0-9_-]+)*$/);
  const source = new URL(plugin.source.url);
  assert.equal(source.origin, 'https://github.com');
  assert.equal(source.search, '');
  assert.equal(source.hash, '');
  assert.match(source.pathname, /^\/kktu6507\/[a-zA-Z0-9_.-]+$/);
  const response = await fetch(`https://api.github.com/repos${source.pathname}`, {
    headers: {
      Accept: 'application/vnd.github+json',
      'User-Agent': 'kktu-public-marketplace-validator',
      ...(process.env.GITHUB_TOKEN ? { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` } : {}),
    },
    signal: AbortSignal.timeout(30_000),
  });
  assert.ok(response.ok, `Source is unavailable: ${plugin.source.url} (HTTP ${response.status})`);
  const repository = await response.json();
  assert.equal(repository.visibility, 'public', `Source must be public: ${plugin.source.url}`);
}
assert.ok(names.has('ctide'), 'The public Cressetide listing must remain available');
console.log(`Validated ${names.size} public marketplace listing(s).`);
