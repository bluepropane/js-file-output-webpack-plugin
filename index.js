const path = require('path');

const MATCH_ENDING_JS = /(.js)$/;

class JSFileOutputPlugin {
  constructor(options) {
    this.fileName = options.fileName;
    this.context = Object.assign({}, process.env, options.context);
    this.outputFileName =
      options.outputFileName || this.fileName.replace(MATCH_ENDING_JS, '');
  }
  apply(compiler) {
    compiler.hooks.emit.tapAsync(
      'JSFileOutputPlugin',
      (compilation, callback) => {
        console.log(compiler.outputPath);
        const fileModule = require(path.join(compiler.context, this.fileName));
        compilation.fileDependencies.add(this.fileName);
        let payload = fileModule;
        if (typeof fileModule === 'function') {
          payload = fileModule(this.context);
        }

        if (typeof payload !== 'string') {
          payload = JSON.stringify(payload);
        }

        compilation.assets[this.outputFileName] = {
          source: () => payload,
          size: () => payload.length
        };
        callback();
      }
    );
  }
}

module.exports = JSFileOutputPlugin;
