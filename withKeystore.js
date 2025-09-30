const { withGradleProperties } = require("@expo/config-plugins");

module.exports = function withKeystore(config) {
  return withGradleProperties(config, (config) => {
    const props = config.modResults;

    const addOrUpdateProp = (key, value) => {
      const idx = props.findIndex(
        (item) => item.type === "property" && item.key === key
      );
      if (idx > -1) props[idx].value = value;
      else props.push({ type: "property", key, value });
    };

    addOrUpdateProp(
      "MYAPP_UPLOAD_STORE_FILE",
      process.env.MYAPP_UPLOAD_STORE_FILE || "onecommit.keystore"
    );
    addOrUpdateProp(
      "MYAPP_UPLOAD_KEY_ALIAS",
      process.env.MYAPP_UPLOAD_KEY_ALIAS || "key0"
    );
    addOrUpdateProp(
      "MYAPP_UPLOAD_STORE_PASSWORD",
      process.env.MYAPP_UPLOAD_STORE_PASSWORD || "onecommit"
    );
    addOrUpdateProp(
      "MYAPP_UPLOAD_KEY_PASSWORD",
      process.env.MYAPP_UPLOAD_KEY_PASSWORD || "onecommit"
    );

    return config;
  });
};
