const { withAppBuildGradle } = require('@expo/config-plugins');
const path = require('path');
const fs = require('fs');

function findBlock(contents, keyword, fromIndex = 0) {
  const idx = contents.indexOf(keyword, fromIndex);
  if (idx === -1) return null;

  // find the opening brace after the keyword
  let i = idx + keyword.length;
  while (i < contents.length && contents[i] !== '{') i++;
  if (i >= contents.length) return null;
  const open = i;

  // find the matching closing brace, skipping comments and quoted strings
  let depth = 1;
  let j = open + 1;
  while (j < contents.length && depth > 0) {
    const ch = contents[j];

    // skip block comments /* ... */
    if (ch === '/' && contents[j + 1] === '*') {
      j += 2;
      while (j + 1 < contents.length && !(contents[j] === '*' && contents[j + 1] === '/')) j++;
      j += 2;
      continue;
    }

    // skip line comments // ...
    if (ch === '/' && contents[j + 1] === '/') {
      j += 2;
      while (j < contents.length && contents[j] !== '\n') j++;
      continue;
    }

    // skip quoted strings '...' or "..." (handle escapes)
    if (ch === '"' || ch === "'") {
      const quote = ch;
      j++;
      while (j < contents.length) {
        if (contents[j] === '\\') j += 2;
        else if (contents[j] === quote) { j++; break; }
        else j++;
      }
      continue;
    }

    if (ch === '{') { depth++; j++; continue; }
    if (ch === '}') { depth--; j++; continue; }
    j++;
  }

  if (depth === 0) {
    return { keywordIndex: idx, openIndex: open, closeIndex: j - 1 };
  }
  return null;
}

module.exports = function withReleaseOnly(config) {
  return withAppBuildGradle(config, (config) => {
    if (config.modResults.language !== 'groovy') {
      console.warn('Skipping modification: build.gradle is not Groovy.');
      return config;
    }


      // --- NEW: Copy keystore into android/app ---
    const projectRoot = config.modRequest.projectRoot;
    const keystoreSource = path.join(projectRoot, 'onecommit.keystore'); // where you keep the keystore in repo root
    const keystoreDest = path.join(projectRoot, 'android', 'app', 'onecommit.keystore');

    try {
      if (fs.existsSync(keystoreSource) && !fs.existsSync(keystoreDest)) {
        fs.copyFileSync(keystoreSource, keystoreDest);
        console.log('✅ Copied onecommit.keystore to android/app/');
      } else if (!fs.existsSync(keystoreSource)) {
        console.warn('⚠️ onecommit.keystore not found in project root. Please add it there.');
      }
    } catch (e) {
      console.warn('⚠️ Failed to copy keystore:', e);
    }

    let contents = config.modResults.contents;

    //
    // 1) Ensure signingConfigs.release { ... } exists (create or replace)
    //
    const releaseSigningConfigRaw = [
      'release {',
      "    storeFile file('onecommit.keystore')",
      "    storePassword 'onecommit'",
      "    keyAlias 'key0'",
      "    keyPassword 'onecommit'",
      '}'
    ].join('\n');

    const signingConfigsBlock = findBlock(contents, 'signingConfigs');
    if (!signingConfigsBlock) {
      // No signingConfigs: try to insert inside android, or create android if missing
      const androidBlock = findBlock(contents, 'android');
      const insertSC = '\n    signingConfigs {\n' + releaseSigningConfigRaw.split('\n').map(l => '        ' + l).join('\n') + '\n    }\n';
      if (androidBlock) {
        contents = contents.slice(0, androidBlock.closeIndex) + insertSC + contents.slice(androidBlock.closeIndex);
      } else {
        // append android with signingConfigs
        contents += '\n\nandroid {\n    signingConfigs {\n' + releaseSigningConfigRaw.split('\n').map(l => '        ' + l).join('\n') + '\n    }\n}\n';
      }
    } else {
      // signingConfigs exists: replace release inside it or append
      const releaseInSC = findBlock(contents, 'release', signingConfigsBlock.keywordIndex + 1);
      if (releaseInSC && releaseInSC.closeIndex <= signingConfigsBlock.closeIndex) {
        // replace existing release inside signingConfigs (preserve indent)
        const lineStart = contents.lastIndexOf('\n', releaseInSC.keywordIndex) + 1;
        const indentMatch = contents.slice(lineStart, releaseInSC.keywordIndex).match(/^\s*/);
        const indent = indentMatch ? indentMatch[0] : '';
        const formatted = releaseSigningConfigRaw.split('\n').map(line => indent + line).join('\n');
        contents = contents.slice(0, releaseInSC.keywordIndex) + formatted + contents.slice(releaseInSC.closeIndex + 1);
      } else {
        // append release inside signingConfigs
        const scLineStart = contents.lastIndexOf('\n', signingConfigsBlock.keywordIndex) + 1;
        const scIndentMatch = contents.slice(scLineStart, signingConfigsBlock.keywordIndex).match(/^\s*/);
        const innerIndent = scIndentMatch ? scIndentMatch[0] + '    ' : '    ';
        const formatted = releaseSigningConfigRaw.split('\n').map(line => innerIndent + line).join('\n');
        contents = contents.slice(0, signingConfigsBlock.closeIndex) + '\n' + formatted + '\n' + contents.slice(signingConfigsBlock.closeIndex);
      }
    }

    //
    // 2) Replace (or append) release { ... } inside buildTypes { ... }
    //
    const newReleaseRaw = [
      'release {',
      '    signingConfig signingConfigs.release',
      "    shrinkResources (findProperty('android.enableShrinkResourcesInReleaseBuilds')?.toBoolean() ?: false)",
      '    minifyEnabled enableProguardInReleaseBuilds',
      '    proguardFiles getDefaultProguardFile("proguard-android.txt"), "proguard-rules.pro"',
      "    crunchPngs (findProperty('android.enablePngCrunchInReleaseBuilds')?.toBoolean() ?: true)",
      '}'
    ].join('\n');

    const bt = findBlock(contents, 'buildTypes');
    if (!bt) {
      // buildTypes missing — insert into android if present, else append android
      const androidBlock = findBlock(contents, 'android');
      const insertBT = '\n    buildTypes {\n' + newReleaseRaw.split('\n').map(l => '        ' + l).join('\n') + '\n    }\n';
      if (androidBlock) {
        contents = contents.slice(0, androidBlock.closeIndex) + insertBT + contents.slice(androidBlock.closeIndex);
      } else {
        contents += '\n\nandroid {\n    buildTypes {\n' + newReleaseRaw.split('\n').map(l => '        ' + l).join('\n') + '\n    }\n}\n';
      }
    } else {
      const releaseInBT = findBlock(contents, 'release', bt.keywordIndex + 1);
      if (releaseInBT && releaseInBT.closeIndex <= bt.closeIndex) {
        // replace existing release block (preserve indent)
        const lineStart = contents.lastIndexOf('\n', releaseInBT.keywordIndex) + 1;
        const indentMatch = contents.slice(lineStart, releaseInBT.keywordIndex).match(/^\s*/);
        const indent = indentMatch ? indentMatch[0] : '';
        const formatted = newReleaseRaw.split('\n').map(line => indent + line).join('\n');
        contents = contents.slice(0, releaseInBT.keywordIndex) + formatted + contents.slice(releaseInBT.closeIndex + 1);
      } else {
        // append release block before closing brace of buildTypes
        const btLineStart = contents.lastIndexOf('\n', bt.keywordIndex) + 1;
        const btIndentMatch = contents.slice(btLineStart, bt.keywordIndex).match(/^\s*/);
        const btIndent = btIndentMatch ? btIndentMatch[0] + '    ' : '    ';
        const formatted = newReleaseRaw.split('\n').map(line => btIndent + line).join('\n');
        contents = contents.slice(0, bt.closeIndex) + '\n' + formatted + '\n' + contents.slice(bt.closeIndex);
      }
    }

    // finally write back
    config.modResults.contents = contents;
    return config;
  });
};
