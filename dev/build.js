const Bundler = require('parcel-bundler');
const elmCSSModules = require('../src/index');
const path = require('path');

process.env.NODE_ENV = 'production';

async function main() {
  const bundler = new Bundler(path.join(__dirname, 'test-data', 'index.html'), {
    watch: false,
    cache: false,
    hmr: false,
    logLevel: 4,
    outDir: path.join(__dirname, 'dist'),
  });
  elmCSSModules(bundler);
  await bundler.bundle();

}

main().catch(console.error);