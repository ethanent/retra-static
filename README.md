# retra-static
> Serve static files from your retra server, in Node!

[GitHub](https://github.com/ethanent/retra-static) | [NPM](https://www.npmjs.com/package/retra-static)

## Install

```shell
npm i retra-static
```

## About retra

[retra](https://github.com/ethanent/retra) is a powerful, lightweight, and extensible Node.js HTTP server framework.

## Use retra-static

First, require the extension.

```js
const static = require('retra-static')
```

Then enable it through your retra app.

```js
// ... require path module
// ...create your retra app

app.use(static(path.join(__dirname, 'static')))
// This will instruct retra-static to serve out files from the /static directory
```

### Use a custom index file name

The index file for directories defaults to `index.html`.

```js
app.use(static(path.join(__dirname, 'static')), 'main.html')

// This will serve out directories' main.html files (if present) when directories are requested.
```