const { withDangerousMod } = require("@expo/config-plugins");
const fs = require("fs");
const path = require("path");

/**
 * Expo Config Plugin to patch Hermes Pod to generate dSYMs
 * and prevent stripping of symbols in Release builds.
 */
module.exports = function withHermesDsyms(config) {
  return withDangerousMod(config, [
    "ios",
    (config) => {
      const podfilePath = path.join(
        config.modRequest.platformProjectRoot,
        "Podfile"
      );
      let podfile = fs.readFileSync(podfilePath, "utf8");

      // Check if the patch is already applied
      if (!podfile.includes("hermes-engine") || !podfile.includes("STRIP_INSTALLED_PRODUCT")) {
        // Find or create post_install block
        const postInstallRegex = /post_install do \|installer\|[\s\S]*?end/m;

        if (postInstallRegex.test(podfile)) {
          // Patch existing post_install
          podfile = podfile.replace(postInstallRegex, (match) => {
            return match.replace(
              "end",
              `
  installer.pods_project.targets.each do |target|
    if target.name == 'hermes-engine'
      target.build_configurations.each do |config|
        config.build_settings['DEBUG_INFORMATION_FORMAT'] = 'dwarf-with-dsym'
        config.build_settings['GCC_GENERATE_DEBUGGING_SYMBOLS'] = 'YES'
        config.build_settings['STRIP_INSTALLED_PRODUCT'] = 'NO'
        config.build_settings['COPY_PHASE_STRIP'] = 'NO'
      end
    end
  end
end`
            );
          });
        } else {
          // Create a new post_install block
          podfile += `
post_install do |installer|
  installer.pods_project.targets.each do |target|
    if target.name == 'hermes-engine'
      target.build_configurations.each do |config|
        config.build_settings['DEBUG_INFORMATION_FORMAT'] = 'dwarf-with-dsym'
        config.build_settings['GCC_GENERATE_DEBUGGING_SYMBOLS'] = 'YES'
        config.build_settings['STRIP_INSTALLED_PRODUCT'] = 'NO'
        config.build_settings['COPY_PHASE_STRIP'] = 'NO'
      end
    end
  end
end
`;
        }

        fs.writeFileSync(podfilePath, podfile, "utf8");
        console.log("✅ Hermes dSYM patch applied to Podfile");
      }

      return config;
    },
  ]);
};
