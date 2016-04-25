# PostCSS Composes [![Build Status][ci-img]][ci]

[PostCSS] plugin to make `composes` work anywhere.

[PostCSS]: https://github.com/postcss/postcss
[ci-img]:  https://travis-ci.org/MicheleBertoli/postcss-composes.svg
[ci]:      https://travis-ci.org/MicheleBertoli/postcss-composes

```css
.foo {
  color: red;
}
.bar:hover {
  composes: foo;
}
```

```css
.foo {
  color: red;
}
.bar:hover {
  color: red;
}
```

## Usage

```js
postcss([ require('postcss-composes') ])
```

See [PostCSS] docs for examples for your environment.
