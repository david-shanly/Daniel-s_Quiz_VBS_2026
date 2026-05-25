const fs = require('fs');

// 1. Update index.html
let indexHtml = fs.readFileSync('index.html', 'utf8');

// Replace modal-fill-input with textarea
indexHtml = indexHtml.replace(
  /<input type="text" id="modal-fill-input"[^>]*>/,
  `<textarea id="modal-fill-input" rows="3" placeholder="Type answer here..." autocomplete="off" style="width: 100%; border-radius: 8px; padding: 12px; border: 2px solid var(--panel-border-active); background: var(--cell-bg); color: var(--color-text); font-family: inherit; resize: vertical; margin-bottom: 15px; font-size: 1.1rem;"></textarea>`
);

// Remove custom video block
indexHtml = indexHtml.replace(/<div class="form-group" style="margin-top: 16px;">\s*<label>🎬 Custom Question Video[\s\S]*?<div id="per-question-emoji-options"/, '<div id="per-question-emoji-options"');

// Add points input
indexHtml = indexHtml.replace(
  /<div class="form-group">\s*<label for="q-text">Question Text<\/label>/,
  `<div class="form-group">\n                  <label for="q-points">Points</label>\n                  <input type="number" id="q-points" class="modern-input" value="100" min="0" step="10" required>\n                </div>\n                <div class="form-group">\n                  <label for="q-text">Question Text</label>`
);

fs.writeFileSync('index.html', indexHtml);

// 2. Update app.js
let appJs = fs.readFileSync('app.js', 'utf8');

// Add renderGameBoard() after saving question
appJs = appJs.replace(
  /saveDB\(\);\r?\n\s*document\.getElementById\('admin-question-editor'\)\.classList\.add\('hidden'\);\r?\n\s*selectedAdminCellId = null;\r?\n\s*renderAdminGrid\(\);\r?\n\s*renderGameBoard\(\);\r?\n\s*\}/g,
  `saveDB();\n  document.getElementById('admin-question-editor').classList.add('hidden');\n  selectedAdminCellId = null;\n  renderAdminGrid();\n  renderGameBoard();\n}`
);

// Make sure points are loaded into the editor
appJs = appJs.replace(
  /document\.getElementById\('q-type'\)\.value = [^;]+;/,
  `$&
  const qPointsEl = document.getElementById('q-points');
  if (qPointsEl) qPointsEl.value = q ? q.points : 100;`
);

// Remove per-question video event listeners (line 3820-3918)
appJs = appJs.replace(/\/\/ Question Editor - Main Video Upload[\s\S]*?\/\/ Dynamic Scaling Engine/, '// Dynamic Scaling Engine');

// Remove currentUploadedVideo variables and references
appJs = appJs.replace(/let currentUploadedVideoBase64 = null;\r?\nlet currentUploadedCorrectVideo = null;\r?\nlet currentUploadedWrongVideo = null;\r?\n/, '');
appJs = appJs.replace(/currentUploadedVideoBase64 = null;\r?\n\s*currentUploadedCorrectVideo = null;\r?\n\s*currentUploadedWrongVideo = null;\r?\n/g, '');

// Clean up openQuestionEditor video status resets
appJs = appJs.replace(/const statusEl = document\.getElementById\('q-video-status'\);[\s\S]*?if \(wrongClearBtn\) wrongClearBtn\.style\.display = 'none';/g, '');

// Clean up video from saveQuestion payload
appJs = appJs.replace(/video: currentUploadedVideoBase64 \? true : null,\r?\n\s*hasCustomCorrectVideo: currentUploadedCorrectVideo \? true : false,\r?\n\s*hasCustomWrongVideo: currentUploadedWrongVideo \? true : false,\r?\n/, '');

// Clean up video indexedDB save
appJs = appJs.replace(/\/\/ Handle custom video saving to IndexedDB[\s\S]*?if \(currentUploadedWrongVideo\) \{[\s\S]*?\} else \{[\s\S]*?deleteVideoFromIndexedDB\('q-' \+ qnIndex \+ '-wrong'\);\r?\n\s*\}/, '');

fs.writeFileSync('app.js', appJs);

console.log('Update successful');
