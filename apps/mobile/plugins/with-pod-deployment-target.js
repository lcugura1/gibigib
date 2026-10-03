const { withPodfile } = require('expo/config-plugins');

const MARKER = 'with-pod-deployment-target';

const SNIPPET = `
    # ${MARKER}: Xcode 27 rejects pod targets (incl. resource bundles) below iOS 15
    app_target = podfile_properties['ios.deploymentTarget'] || '16.4'
    installer.pods_project.targets.each do |pod_target|
      pod_target.build_configurations.each do |build_config|
        current = build_config.build_settings['IPHONEOS_DEPLOYMENT_TARGET']
        if current.nil? || Gem::Version.new(current) < Gem::Version.new(app_target)
          build_config.build_settings['IPHONEOS_DEPLOYMENT_TARGET'] = app_target
        end
      end
    end`;

module.exports = function withPodDeploymentTarget(config) {
  return withPodfile(config, (config) => {
    const { contents } = config.modResults;
    if (contents.includes(MARKER)) {
      return config;
    }
    const postInstall = /(react_native_post_install\([\s\S]*?\n\s*\))/;
    if (!postInstall.test(contents)) {
      throw new Error(`${MARKER}: react_native_post_install call not found in Podfile`);
    }
    config.modResults.contents = contents.replace(postInstall, `$1\n${SNIPPET}`);
    return config;
  });
};
