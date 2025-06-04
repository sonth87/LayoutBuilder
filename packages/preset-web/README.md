# GrapesJS Ostendis Preset

This preset configures GrapesJS to be used with some unique features and blocks for the [Ostendis E-Recrui­ting sys­tem](https://www.ostendis.com/en)

## Summary

TODO

## Download

Download using one of the options:

- `npm i grapesjs-preset-ostendis-adv`
- Latest release link https://github.com/ostendisorg/grapesjs-preset-ostendis-adv/releases

## Usage

Directly in the browser

```html
<link href="path/to/grapes.min.css" rel="stylesheet" />
<link href="path/to/grapesjs-preset-ostendis-adv.css" rel="stylesheet" />

<script src="path/to/grapes.min.js"></script>
<script src="path/to/grapesjs-preset-ostendis-adv.min.js"></script>

<div id="gjs"></div>

<script type="text/javascript">
  var editor = grapesjs.init({
    container: "#gjs",
    plugins: ["grapesjs-preset-ostendis-adv"],
    pluginsOpts: {
      "grapesjs-preset-ostendis-adv": {
        // options
      },
    },
  });
</script>
```

Modern javascript

```js
import grapesjs from 'grapesjs';
import plugin from 'grapesjs-preset-ostendis-adv';

const editor = grapesjs.init({
  container : '#gjs',
  // ...
  plugins: [plugin],
  pluginsOpts: {
    [plugin]: { /* options */ }
  }
  // or
  plugins: [
    editor => plugin(editor, { /* options */ }),
  ],
});
```

## Development

Clone the repository

```sh
$ git clone https://github.com/ostendisorg/grapesjs-preset-ostendis-adv.git
$ cd grapesjs-preset-ostendis
```

Install dependencies (use Node version 18.x)

```sh
$ npm i
```

Start the dev server

```sh
$ npm start
```

Build before the commit. This will also increase the patch level version of the package

```sh
$ npm run build
```

## Test Version (test.html)

The file test.html was created for testing purposes. It can be used either with the Ostendis plugin or in its original version (see comments for details).

URL: http://localhost:8080/test.html

## Release

To install publishing dependency

```sh
$ npm install --global np
```

Publish the package

```sh
$ npm run release
```

**ONLY** workes with package:
https://www.npmjs.com/package/np

## License

BSD 3-Clause

Based on: [GrapesJS Newsletter Preset](http://grapesjs.com/demo-newsletter-editor.html)
Copyright (c) 2016, [Artur Arseniev](https://github.com/artf)
All rights reserved.
