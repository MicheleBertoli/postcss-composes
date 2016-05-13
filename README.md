# PostCSS Composes [![Build Status][ci-img]][ci]

[PostCSS] plugin to make [CSS Modules]' `composes` work with any selectors.

**Caution: use at your own risk.**

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

## Why?

[CSS Modules]' `composes` is great but it only works with classes (see: [33], [41], [42], [68] and [80]).

For example, the [suggested] way of composing pseudo-classes with [CSS Modules] requires the creation of extra classes:
```css
.red {
  color: red;
}
.blue-on-hover:hover {
  color: blue;
}

.foo {
  composes: red blue-on-hover;
}
```

## Credits

Thanks [Aaron7] for the idea.

[CSS Modules]: https://github.com/css-modules/css-modules
[PostCSS]: https://github.com/postcss/postcss
[ci-img]: https://travis-ci.org/MicheleBertoli/postcss-composes.svg
[ci]: https://travis-ci.org/MicheleBertoli/postcss-composes
[33]: https://github.com/css-modules/css-modules/issues/33
[41]: https://github.com/css-modules/css-modules/issues/41
[42]: https://github.com/css-modules/css-modules/issues/42
[68]: https://github.com/css-modules/css-modules/issues/68
[80]: https://github.com/css-modules/css-modules/issues/80
[suggested]: https://github.com/css-modules/css-modules/issues/80#issuecomment-155497797
[Aaron7]: https://github.com/Aaron7
