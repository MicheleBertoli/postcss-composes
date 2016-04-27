var postcss = require('postcss');
var path = require('path');
var fs = require('fs');

var regex = {
    composes: /composes|compose-with/,
    from: /^(.+?)\s+from\s+("([^"]*)"|'([^']*)'|([\w-]+))$/,
    classNames: /\s+/,
    trim: /[\'"]/g
};

function getCSS(decl, css) {
    var matches = decl.value.match(regex.from);
    var dirname = path.dirname(css.source.input.file);
    var file = path.join(dirname, matches[2].replace(regex.trim, ''));
    var external = fs.readFileSync(file);

    return postcss.parse(external);
}

function getNodes(nodes, rule, css) {
    rule.walkDecls(function (decl) {
        if (regex.composes.test(decl.prop)) {
            if (regex.from.test(decl.value)) {
                css = getCSS(decl, css);
            }
            var classNames = decl.value.split(regex.classNames);
            classNames.forEach(function (className) {
                css.walkRules('.' + className, function (composes) {
                    nodes = getNodes(nodes, composes, css);
                });
            });
        } else {
            nodes.push(decl);
        }
    });

    return nodes;
}

module.exports = postcss.plugin('postcss-composes', function (opts) {
    opts = opts || {};

    return function (css) {
        css.walkRules(/:/, function (rule) {
            rule.nodes = getNodes([], rule, css);
        });
    };
});
