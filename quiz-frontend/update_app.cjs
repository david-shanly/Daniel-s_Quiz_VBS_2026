const fs = require('fs');
let content = fs.readFileSync('app.js', 'utf8');

// 1. cancelQuestion switch turn
content = content.replace(
  /document\.getElementById\('modal-turn-status'\)\.textContent = "Question Cancelled";\s*saveGameState\(\);/g,
  `document.getElementById('modal-turn-status').textContent = "Question Cancelled";\n  switchTurn();\n  saveGameState();`
);

// 2. penalty to 50%
content = content.replace(/const penalty = 50;/g, 'const penalty = Math.floor(pts * 0.5);');
content = content.replace(/const stealPts = 50;/g, 'const stealPts = Math.floor(q.points * 0.5);');

// 3. second wrong penalty to 50%
content = content.replace(
  /const finalizeSecondWrong = \(\) => \{\s*applyScore\(teamIndex, pts, true, true\);/g,
  `const finalizeSecondWrong = () => {\n        applyScore(teamIndex, Math.floor(pts * 0.5), true, true);`
);

// 4. openQuestionEditor type setting
content = content.replace(
  /document\.getElementById\('q-type'\)\.value = q\.type;/g,
  `document.getElementById('q-type').value = q.questionType || (q.type === 'fill' ? 'fill_blank' : 'mcq');`
);

// 5. openQuestionEditor toggle visibility
content = content.replace(
  /const isMCQ = q\.type === 'mcq';/g,
  `const isMCQ = (q.questionType || q.type) === 'mcq';`
);

// 6. renderQuestion type check
content = content.replace(
  /if \(q\.type === 'mcq'\) \{/g,
  `if ((q.questionType || q.type) === 'mcq') {`
);

// 7. saveQuestion modifications
content = content.replace(
  /type,\n\s*question: text,\n\s*options,\n\s*answer,\n\s*points: pts,/g,
  `type: type === 'mcq' ? 'mcq' : 'fill',\n    questionType: type,\n    question: text,\n    options,\n    answer,\n    correctAnswer: answer,\n    points: pts,`
);

// 8. btn-show-correct-answer
content = content.replace(
  /fillInput\.value = q\.answer;/g,
  `fillInput.value = q.correctAnswer || q.answer;`
);

// 9. resolveAnswer text validation
content = content.replace(
  /const correctAns = q\.answer\.trim\(\)\.toLowerCase\(\);/g,
  `const correctAns = (q.correctAnswer || q.answer).trim().toLowerCase();`
);

// 10. display correct answer in modal
content = content.replace(
  /document\.getElementById\('modal-correct-answer-text'\)\.textContent = q\.answer;/g,
  `document.getElementById('modal-correct-answer-text').textContent = q.correctAnswer || q.answer;`
);

fs.writeFileSync('app.js', content);
