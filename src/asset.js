const path = require('path');
const fse = require('fs-extra');;
const camelcase = require('camelcase');
const CSSAsset = require('parcel-bundler/src/assets/CSSAsset');

module.exports = class ElmCSSModules extends CSSAsset {

  constructor(name, options) {
    super(name, options);
  }

  async generate() {
    const generated = await super.generate();
    for (const asset of generated) {
      if (asset.type === 'css') {
        // If Parcel is configured to use CSS modules (e.g., via .postcssrc file), the postcss-modules transformer will
        // add a "cssModules" property to the "asset" object. This object maps the CSS class names to their "scoped"
        // (i.e., mangled to be unique) versions that appear in the CSS content. For more info see 
        // https://en.parceljs.org/transforms.html#postcss and https://github.com/css-modules/postcss-modules.
        if (asset.cssModules) {
          const relativePath = path.parse(path.relative(this.options.rootDir, this.name));
          const moduleName = camelcase(relativePath.name, { pascalCase: true });
          const middlePaths =
            relativePath.dir.split(path.sep)
            .filter((s) => s)
            .map((p) => camelcase(p, { pascalCase: true }));
          const outputDir = path.join.apply(null, [process.cwd(), 'autogenerated'].concat(middlePaths));
          const fullModuleName = middlePaths.concat([moduleName]).join('.');
          await fse.outputFile(path.join(outputDir, `${moduleName}.elm`), generateElmFileContent(fullModuleName, asset.cssModules));
        }
      }
    }
    return generated;
  }
}

function generateElmFileContent(moduleName, cssModules) {
  const styles =
    Object.entries(cssModules)
    .map(([originalCssClass, scopedCssClass]) => {
      const funcName = camelcase(originalCssClass);
      return `\n${funcName} : String\n${funcName} =\n    "${scopedCssClass}"\n`;
    }).join('\n');
  let template = `module ${moduleName} exposing (..)

-- This file was autogenerated by parcel-plugin-elm-css-modules.
-- Do not edit it manually.

${styles}`
  return template;
}