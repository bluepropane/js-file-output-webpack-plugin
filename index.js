const path = require('path');

const MATCH_ENDING_JS = /(.js)$/;

class JSOutputFilePlugin {
  constructor(options) {
    this.sourceFile = options.sourceFile;
    this.contextPath = options.contextPath;
    this.outputFileName =
      options.outputFileName || this.sourceFile.replace(MATCH_ENDING_JS, '');
  }
  apply(compiler) {
    compiler.hooks.emit.tapPromise('JSOutputFilePlugin', async compilation => {
      const exported = require(path.join(
        this.contextPath || compiler.context,
        this.sourceFile
      ));
      let payload = exported;
      if (typeof exported === 'function') {
        payload = await exported(compiler.options.mode);
      }
      if (typeof payload !== 'string') {
        payload = JSON.stringify(payload);
      }

      compilation.assets[this.outputFileName] = {
        source: () => payload,
        size: () => payload.length
      };
    });
  }
}

module.exports = JSOutputFilePlugin;
