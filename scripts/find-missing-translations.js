#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Define directories and files
const rootDir = path.resolve(__dirname, '..');
const localesDir = path.join(rootDir, 'src', 'locales');
const enTranslationPath = path.join(localesDir, 'en', 'translation.json');
const trTranslationPath = path.join(localesDir, 'tr', 'translation.json');
const arTranslationPath = path.join(localesDir, 'ar', 'translation.json');

// Load translation files
const enTranslation = JSON.parse(fs.readFileSync(enTranslationPath, 'utf8'));
const trTranslation = JSON.parse(fs.readFileSync(trTranslationPath, 'utf8'));
const arTranslation = JSON.parse(fs.readFileSync(arTranslationPath, 'utf8'));

// Helper function to find missing keys in nested objects
function findMissingKeys(baseObj, compareObj, prefix = '') {
  const missingKeys = [];

  for (const key in baseObj) {
    const newPrefix = prefix ? `${prefix}.${key}` : key;

    if (typeof baseObj[key] === 'object' && baseObj[key] !== null && !Array.isArray(baseObj[key])) {
      // For nested objects, recursively check
      if (!compareObj[key] || typeof compareObj[key] !== 'object') {
        missingKeys.push({ key: newPrefix, value: 'Missing section' });
      } else {
        // Continue recursion
        const nestedMissing = findMissingKeys(baseObj[key], compareObj[key], newPrefix);
        missingKeys.push(...nestedMissing);
      }
    } else {
      // For simple values, check if key exists
      if (compareObj[key] === undefined) {
        missingKeys.push({ key: newPrefix, value: baseObj[key] });
      }
    }
  }

  return missingKeys;
}

// Find missing translations
console.log('\n===== MISSING IN TURKISH =====');
const missingInTr = findMissingKeys(enTranslation, trTranslation);
missingInTr.forEach(item => {
  console.log(`${item.key}: ${typeof item.value === 'string' ? item.value : JSON.stringify(item.value)}`);
});

console.log('\n===== MISSING IN ARABIC =====');
const missingInAr = findMissingKeys(enTranslation, arTranslation);
missingInAr.forEach(item => {
  console.log(`${item.key}: ${typeof item.value === 'string' ? item.value : JSON.stringify(item.value)}`);
});

// Get statistics
const countKeysRecursively = (obj) => {
  let count = 0;

  for (const key in obj) {
    if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
      count += countKeysRecursively(obj[key]);
    } else {
      count++;
    }
  }

  return count;
};

const totalEnKeys = countKeysRecursively(enTranslation);
const missingTrPercent = (missingInTr.length / totalEnKeys * 100).toFixed(2);
const missingArPercent = (missingInAr.length / totalEnKeys * 100).toFixed(2);

console.log('\n===== TRANSLATION STATISTICS =====');
console.log(`Total English Keys: ${totalEnKeys}`);
console.log(`Missing Turkish Keys: ${missingInTr.length} (${missingTrPercent}%)`);
console.log(`Missing Arabic Keys: ${missingInAr.length} (${missingArPercent}%)`);

// Write missing keys to files
const missingTrPath = path.join(rootDir, 'missing_tr_keys.txt');
const missingArPath = path.join(rootDir, 'missing_ar_keys.txt');

fs.writeFileSync(missingTrPath, missingInTr.map(item =>
  `${item.key}: ${typeof item.value === 'string' ? item.value : JSON.stringify(item.value)}`
).join('\n'));

fs.writeFileSync(missingArPath, missingInAr.map(item =>
  `${item.key}: ${typeof item.value === 'string' ? item.value : JSON.stringify(item.value)}`
).join('\n'));

console.log(`\nMissing Turkish keys written to: ${missingTrPath}`);
console.log(`Missing Arabic keys written to: ${missingArPath}`);
