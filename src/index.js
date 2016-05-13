var postcss = require('postcss');
var localByDefault = require('postcss-modules-local-by-default');
var Tokenizer = require('css-selector-tokenizer');
var path = require('path');
var fs = require('fs');

var regex = {
    composes: /composes|compose-with/,
    from: /^(.+?)\s+from\s+("([^"]*)"|'([^']*)'|([\w-]+))$/,
    classNames: /\s+/,
    trim: /[\'"]/g
};

module.exports = postcss.plugin('postcss-composes', function (opts) {
    opts = opts || {};

    function isAllowed(selector) {
        var result = true;
        selector.nodes.map(function (node) {
            if (node.type !== 'selector' ||
                node.nodes.length !== 1) {
                result = false;
            }
            if (node.nodes) {
                node = node.nodes[0];
                if (node.type !== 'nested-pseudo-class' ||
                    node.name !== 'local' ||
                    node.nodes.length !== 1) {
                    result = false;
                }
            }
            if (node.nodes) {
                node = node.nodes[0];
                if (node.type !== 'selector' ||
                    node.nodes.length !== 1) {
                    result = false;
                }
            }
            if (node.nodes) {
                node = node.nodes[0];
                if (node.type !== 'class') {
                    result = false;
                }
            }
        });
        return result;
    }

    function processFile(source) {
        return postcss([localByDefault(opts)]).process(source).css;
    }

    function getCSS(source, css) {
        var dirname = path.dirname(css.source.input.file);
        var file = path.join(dirname, source.replace(regex.trim, ''));
        var external = fs.readFileSync(file);
        var processed = processFile(external);

        return postcss.parse(processed);
    }

    function getNodes(nodes, rule, css) {
        rule.walkDecls(function (decl) {
            if (regex.composes.test(decl.prop)) {
                var classString;
                if (regex.from.test(decl.value)) {
                    var matches = decl.value.match(regex.from);
                    classString = matches[1];
                    css = getCSS(matches[2], css);
                } else {
                    classString = decl.value;
                }
                var classNames = classString.split(regex.classNames);
                classNames.forEach(function (className) {
                    var filter = ':local(.' + className + ')';
                    css.walkRules(filter, function (composes) {
                        nodes = getNodes(nodes, composes, css);
                    });
                });
            } else {
                nodes.push(decl);
            }
        });

        return nodes;
    }

    return function (css) {
        processFile(css);
        css.walkRules(function (rule) {
            var selector = Tokenizer.parse(rule.selector);
            if (!isAllowed(selector)) {
                rule.nodes = getNodes([], rule, css);
            }
        });
    };
});
