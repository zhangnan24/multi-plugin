"use strict";

function MultiRegionPlugin(options) {
    this.options = options
}

MultiRegionPlugin.prototype.apply = function (compiler) {
  const opts = this.options;
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
