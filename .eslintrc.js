const _ = require('lodash')
module.exports = _.merge(require('@tuimao/eslint/ts-uni@2.js'), {
  rules: {
    'import/no-unresolved': 'off',
    '@typescript-eslint/no-namespace': 'off'
  }
})
