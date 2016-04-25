var postcss = require('postcss');

function getNodes(nodes, rule, css) {
    rule.walkDecls(function (decl) {
        if (/composes|compose-with/.test(decl.prop)) {
            var classNames = decl.value.split(/\s+/);
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
