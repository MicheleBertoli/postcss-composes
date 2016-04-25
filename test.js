import postcss from 'postcss';
import test    from 'ava';

import plugin from './';

function run(t, input, output, opts = { }) {
    return postcss([ plugin(opts) ]).process(input)
        .then( result => {
            t.deepEqual(result.css, output);
            t.deepEqual(result.warnings().length, 0);
        });
}

test('single', t => {
    const input = `
.a {
  color: red;
}
.b:hover {
  composes: a;
}
    `;
    const output = `
.a {
  color: red;
}
.b:hover {
  color: red;
}
    `;
    return run(t, input, output, { });
});

test('multiple', t => {
    const input = `
.a {
  color: red;
}
.b {
  backround-color: green;
}
.c:hover {
  composes: a b;
}
    `;
    const output = `
.a {
  color: red;
}
.b {
  backround-color: green;
}
.c:hover {
  color: red;
  backround-color: green;
}
    `;
    return run(t, input, output, { });
});

test('recursive', t => {
    const input = `
.a {
  color: red;
}
.b {
  composes: a;
}
.c:hover {
  composes: b;
}
    `;
    const output = `
.a {
  color: red;
}
.b {
  composes: a;
}
.c:hover {
  color: red;
}
    `;
    return run(t, input, output, { });
});
