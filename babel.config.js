const presets = [
  [
    "@babel/env",
    {
      targets: {
        edge: "17",
        firefox: "60",
        chrome: "67",
        safari: "11.1",
        ie:"11"
      },
      useBuiltIns: "usage",//只包含你所需要的 polyfill
    },
  ],
];

module.exports = { presets };