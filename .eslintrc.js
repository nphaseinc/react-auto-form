const initEslintConfig = require('./.eslintrc.init.js');

module.exports = initEslintConfig({
  tsParserOptionsProject: `./tsconfig.lint.json`
});
