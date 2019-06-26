# JS Output to File Webpack Plugin

Webpack plugin that Useful for generating files like [manifest.json](https://developers.google.com/web/fundamentals/web-app-manifest/).

## Installation

```
yarn add --dev js-output-file-webpack-plugin
```

or

```
npm i --save-dev js-output-file-webpack-plugin
```

## Usage

In `webpack.config.js`:

```js
const JSOutputFilePlugin = require('js-output-file-webpack-plugin');

const config = {
  context: path.join(__dirname, 'src'),
  output: {
    path: path.join(__dirname, 'dist')
  },
  plugins: [
    new JSOutputFilePlugin({
      source: 'manifest.json.js'
    })
  ]
};

module.exports = config;
```

In `src/manifest.json.js`:

```js
const pkg = require('./package.json');

module.exports = env => {
  const manifest = {
    name: 'Example manifest',
    // use some dynamically generated variables
    version: pkg.version,
    icons: {
      '16': 'icons/icon16.png',
      '48': 'icons/icon48.png',
      '128': 'icons/icon128.png'
    },
    background: {
      scripts: ['bg.js'],
      persistent: false
    }
  };
  // environment specific rendering
  if (env === 'development') {
    manifest['content_security_policy'] =
      "script-src 'self' 'unsafe-eval'; object-src 'self'";
  }
  return manifest;
};
```

`JSOutputFilePlugin` will output a file of the same name in output directory, with the `.js` extension stripped.

Running the webpack compiler will yield `dist/manifest.json`:

```json
// prettified for example purposes
// actual JSON output will be minified unless the return value is a string
{
  "name": "Example manifest",
  "version": "2.0.1",
  "icons": {
    "16": "icons/icon16.png",
    "48": "icons/icon48.png",
    "128": "icons/icon128.png"
  },
  "background": {
    "scripts": [
      "bg.js"
    ],
    "persistent": false
  },
  "content_security_policy": "script-src 'self' 'unsafe-eval'; object-src 'self'"
}
```


## License

[MIT](https://choosealicense.com/licenses/mit/)
