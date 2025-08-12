const { withDangerousMod, IOSConfig } = require('expo-config-plugins');
const fs = require('fs');

module.exports = function withModularHeaders(config) {
  return withDangerousMod(config, [
    'ios',
    async (config) => {
      const podfilePath = IOSConfig.Paths.getPodfilePath(config.modRequest.projectRoot);
      let contents = fs.readFileSync(podfilePath, 'utf-8');

      if (!contents.includes('use_modular_headers!')) {
        contents = contents.replace(
          /require_relative .*react_native_pods.*\n/,
          match => `${match}use_modular_headers!\n`
        );
        fs.writeFileSync(podfilePath, contents);
        console.log('✅ Patched Podfile with use_modular_headers!');
      }

      return config;
    },
  ]);
};
