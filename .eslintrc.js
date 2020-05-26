module.exports = {
  root: true,
  extends: ['@elastic/eslint-config-kibana', 'plugin:@elastic/eui/recommended'],
  settings: {
    'import/resolver': {
      '@kbn/eslint-import-resolver-kibana': {
        rootPackageName: 'deep_intel',
      },
    },
  },
  overrides: [
    {
      files: ['**/public/**/*'],
      settings: {
        'import/resolver': {
          '@kbn/eslint-import-resolver-kibana': {
            forceNode: false,
            rootPackageName: 'deep_intel',
          },
        },
      },
    },
  ]
};
