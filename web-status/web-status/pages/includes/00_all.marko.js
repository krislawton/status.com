// Compiled using marko@4.13.8 - DO NOT EDIT
"use strict";

var marko_template = module.exports = require("marko/src/html").t(__filename),
    marko_componentType = "/web-status$0.0.0/pages/includes/00_all.marko",
    components_helpers = require("marko/src/components/helpers"),
    marko_renderer = components_helpers.r,
    marko_defineComponent = components_helpers.c,
    marko_helpers = require("marko/src/runtime/html/helpers"),
    marko_escapeXml = marko_helpers.x,
    marko_loadTag = marko_helpers.t,
    include_tag = marko_loadTag(require("marko/src/taglibs/core/include-tag")),
    component_globals_tag = marko_loadTag(require("marko/src/components/taglib/component-globals-tag")),
    init_components_tag = marko_loadTag(require("marko/src/components/taglib/init-components-tag")),
    await_reorderer_tag = marko_loadTag(require("marko/src/taglibs/async/await-reorderer-tag"));

function render(input, out, __component, component, state) {
  var data = input;

  out.w("<!doctype html><html lang=\"en\"><head><meta charset=\"utf-8\"><title>" +
    marko_escapeXml(input.title) +
    " - Status Krislawton</title><script src=\"/c/jquery-3.2.1.min.js\"></script><script src=\"/c/common.js\"></script><link rel=\"stylesheet\" href=\"/c/common.css\">");

  include_tag({
      _target: input.head
    }, out, __component, "7");

  out.w("</head><body>");

  component_globals_tag({}, out);

  out.w("<div id=\"page-header\"><a href=\"https://www.n.krislawton.com/\"><img src=\"https://www.n.krislawton.com/c/LogoWhite.png\"><span id=\"header-text\">krislawton.com</span></a></div><div id=\"page-non-header\"><div id=\"page-body\">");

  include_tag({
      _target: input.body
    }, out, __component, "15");

  out.w("</div><canvas id=\"bg-animation\"></canvas></div><div id=\"page-footer\">Powered by me</div>");

  init_components_tag({}, out);

  await_reorderer_tag({}, out, __component, "18");

  out.w("</body></html>");
}

marko_template._ = marko_renderer(render, {
    ___implicit: true,
    ___type: marko_componentType
  });

marko_template.Component = marko_defineComponent({}, marko_template._);

marko_template.meta = {
    id: "/web-status$0.0.0/pages/includes/00_all.marko",
    tags: [
      "marko/src/taglibs/core/include-tag",
      "marko/src/components/taglib/component-globals-tag",
      "marko/src/components/taglib/init-components-tag",
      "marko/src/taglibs/async/await-reorderer-tag"
    ]
  };
