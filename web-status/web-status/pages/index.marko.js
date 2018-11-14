// Compiled using marko@4.13.8 - DO NOT EDIT
"use strict";

var marko_template = module.exports = require("marko/src/html").t(__filename),
    marko_componentType = "/web-status$0.0.0/pages/index.marko",
    components_helpers = require("marko/src/components/helpers"),
    marko_renderer = components_helpers.r,
    marko_defineComponent = components_helpers.c,
    marko_loadTemplate = require("marko/src/runtime/helper-loadTemplate"),
    ___all_template = marko_loadTemplate(require.resolve("./includes/00_all.marko")),
    hasRenderBodyKey = Symbol.for("hasRenderBody"),
    marko_merge = require("marko/src/runtime/helper-merge"),
    marko_helpers = require("marko/src/runtime/html/helpers"),
    marko_loadTag = marko_helpers.t,
    include_tag = marko_loadTag(require("marko/src/taglibs/core/include-tag"));

function render(input, out, __component, component, state) {
  var data = input;

  include_tag({
      _target: ___all_template,
      _arg: marko_merge({
          head: {
              renderBody: function renderBody(out) {
                out.w("<script src=\"/c/index.js\"></script>");
              }
            },
          body: {
              renderBody: function renderBody(out) {
                out.w("Hello there! ayo!");
              }
            },
          [hasRenderBodyKey]: true
        }, {
          title: "Home page"
        })
    }, out, __component, "0");
}

marko_template._ = marko_renderer(render, {
    ___implicit: true,
    ___type: marko_componentType
  });

marko_template.Component = marko_defineComponent({}, marko_template._);

marko_template.meta = {
    id: "/web-status$0.0.0/pages/index.marko",
    tags: [
      "./includes/00_all.marko",
      "marko/src/taglibs/core/include-tag"
    ]
  };
