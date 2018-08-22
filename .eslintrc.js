// https://eslint.org/docs/user-guide/configuring

module.exports = {
  root: true,
  parserOptions: {
    parser: 'babel-eslint'
  },
  env: {
    browser: true,
  },
  extends: [
    // https://github.com/vuejs/eslint-plugin-vue#priority-a-essential-error-prevention
    // consider switching to `plugin:vue/strongly-recommended` or `plugin:vue/recommended` for stricter rules.
    'plugin:vue/essential',
    // https://github.com/standard/standard/blob/master/docs/RULES-en.md
    'standard'
  ],
  // required to lint *.vue files
  plugins: [
    'vue'
  ],
  // add your custom rules here
  rules: {
    // 是否强制回调错误处理
    "handle-callback-err":"off",
    // 是否强制变量使用驼峰命名
    "camelcase":"off",
    // 是否强制使用三等号
    "eqeqeq": "off",
    // 是否禁止多个空格
    'no-multi-spaces': 'off',
    // 是否开启分号检查, off不检查, always强制使用分号, never强制不使用分号，还有其他选项 http://eslint.cn/docs/rules/semi
    'semi': 'warn',
    // indent 数组第一个指定是否启用这个规则
    // "off" 或 0 - 关闭规则
    // "warn" 或 1 - 开启规则，使用警告级别的错误：warn (不会导致程序退出)
    // "error" 或 2 - 开启规则，使用错误级别的错误：error (当被触发的时候，程序会退出)
    // 数组第二个指定空几个空格
    'indent': ['warn', 2],
    // allow async-await
    'generator-star-spacing': 'off',
    // allow debugger during development
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off'

    
      
  },
  globals: {
    'AMap': 'AMap'
  }
}
