"use strict";

/**
 * 初始化Plugin
 * @param {Object} options 传入的配置对象，请提供键名regionVariable
 */
function MultiRegionPlugin(options) {
    this.options = options
}

MultiRegionPlugin.prototype.apply = function (compiler) {
  const opts = this.options;

  if (!opts) {
    throw new Error("missing the parameter 'options' when instantiate multi-region plugin")
  }

  if (!opts.regionVariable) {
    throw new Error("missing the parameter 'regionVariable' in options")
  }

  compiler.plugin("entryOption", function () {
    // 不同情景变量
    const region = process.env[opts.regionVariable];

    const extensions = compiler.options.resolve.extensions;

    compiler.options.resolve.extensions = extensions
      .map((extension) =>
        region ? [`.${region}${extension}`, extension] : extension
      )
      .flat(1);
  });
};

module.exports = MultiRegionPlugin;
