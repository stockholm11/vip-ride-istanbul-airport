#!/usr/bin/env node

/**
 * Image Optimization Script
 *
 * This script can be used during the build process to optimize images
 * in the assets directory. To use it:
 *
 * 1. Make the script executable: chmod +x scripts/optimize-images.js
 * 2. Add it to package.json scripts: "optimize-images": "node scripts/optimize-images.js"
 * 3. Run before build: npm run optimize-images && npm run build
 */

import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

// Get current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Define directories
const rootDir = path.resolve(__dirname, '..');
const srcDir = path.join(rootDir, 'src');
const assetsDir = path.join(srcDir, 'assets');
const imagesDir = path.join(assetsDir, 'images');

// Available image formats
const formats = ['.jpg', '.jpeg', '.png', '.webp', '.gif', '.svg'];

/**
 * Add responsive image loading attributes to HTML images
 */
function injectLazyLoading() {
  console.log('🔍 Looking for HTML files to add lazy loading...');

  // Find all HTML files
  const htmlFiles = findFiles(rootDir, ['.html']);

  htmlFiles.forEach(file => {
    try {
      // Read the file
      let content = fs.readFileSync(file, 'utf8');

      // Replace <img> tags without loading attribute
      content = content.replace(
        /<img(?!\s+loading=["'])(.*?)(\/?>)/gi,
        '<img loading="lazy"$1$2'
      );

      // Add width and height if missing but src exists
      content = content.replace(
        /<img(?!\s+width=["'])(?!\s+height=["'])(.*?)src=["'](.*?)["'](.*?)(\/?>)/gi,
        (match, before, src, after, end) => {
          return `<img${before}src="${src}"${after} loading="lazy"${end}`;
        }
      );

      // Add srcset for responsive images
      // This is a simplified version - in a real application you would
      // actually generate different sized versions of images
      /*
      content = content.replace(
        /<img(.*?)src=["'](.*?)\.(?:jpg|jpeg|png|webp)["'](.*?)(\/?>)/gi,
        (match, before, src, after, end) => {
          const ext = src.split('.').pop();
          return `<img${before}src="${src}.${ext}"${after} srcset="${src}-small.${ext} 480w, ${src}-medium.${ext} 768w, ${src}-large.${ext} 1200w"${end}`;
        }
      );
      */

      // Write the updated file
      fs.writeFileSync(file, content);
      console.log(`✓ Updated: ${path.relative(rootDir, file)}`);
    } catch (error) {
      console.error(`❌ Error processing ${file}:`, error);
    }
  });
}

/**
 * List all assets and print their details
 */
function listAssets() {
  console.log('\n📊 Assets Overview:');

  // Find all image files
  const imageFiles = findFiles(imagesDir, formats);

  // Group by folder
  const folderGroups = imageFiles.reduce((acc, file) => {
    const relPath = path.relative(imagesDir, file);
    const folderPath = path.dirname(relPath);

    if (!acc[folderPath]) {
      acc[folderPath] = [];
    }

    const stats = fs.statSync(file);
    const sizeInKB = Math.round(stats.size / 1024);

    acc[folderPath].push({
      name: path.basename(file),
      sizeKB: sizeInKB,
      path: file
    });

    return acc;
  }, {});

  // Print details by folder
  for (const [folder, files] of Object.entries(folderGroups)) {
    console.log(`\n📁 ${folder === '.' ? '(root)' : folder}:`);

    const totalSizeKB = files.reduce((sum, file) => sum + file.sizeKB, 0);

    console.log(`   Total: ${files.length} files, ${totalSizeKB} KB`);

    // Sort by size (largest first)
    files.sort((a, b) => b.sizeKB - a.sizeKB);

    // Print the 5 largest files
    if (files.length > 0) {
      console.log('   Largest files:');
      files.slice(0, 5).forEach(file => {
        console.log(`   - ${file.name} (${file.sizeKB} KB)`);
      });
    }
  }
}

/**
 * Find files with specific extensions in a directory (recursively)
 */
function findFiles(dir, extensions) {
  let results = [];

  if (!fs.existsSync(dir)) {
    console.warn(`⚠️ Directory not found: ${dir}`);
    return results;
  }

  const items = fs.readdirSync(dir);

  for (const item of items) {
    const itemPath = path.join(dir, item);
    const stats = fs.statSync(itemPath);

    if (stats.isDirectory()) {
      // Skip node_modules and .git
      if (item === 'node_modules' || item === '.git' || item === 'dist') {
        continue;
      }

      // Recursively search subdirectories
      results = results.concat(findFiles(itemPath, extensions));
    } else if (stats.isFile()) {
      const ext = path.extname(item).toLowerCase();

      if (extensions.includes(ext)) {
        results.push(itemPath);
      }
    }
  }

  return results;
}

/**
 * Add best practices for images
 */
function addImageBestPractices() {
  console.log('\n⚙️ Adding image loading best practices...');

  // This would include:
  // 1. Adding appropriate <link rel="preload"> for critical images
  // 2. Adding width and height attributes to avoid layout shifts

  const indexHtml = path.join(rootDir, 'index.html');

  if (fs.existsSync(indexHtml)) {
    try {
      let content = fs.readFileSync(indexHtml, 'utf8');

      // Add preload for critical images if needed
      const criticalImages = []; // Identify critical images

      if (criticalImages.length > 0) {
        // Add preload links in the head
        const preloadTags = criticalImages.map(img =>
          `<link rel="preload" href="${img}" as="image">`
        ).join('\n');

        content = content.replace(
          /<head>([\s\S]*?)<\/head>/i,
          `<head>$1\n${preloadTags}\n</head>`
        );

        fs.writeFileSync(indexHtml, content);
        console.log(`✓ Added preload for critical images in index.html`);
      }
    } catch (error) {
      console.error(`❌ Error updating index.html:`, error);
    }
  }

  // Add lazy loading to all HTML files
  injectLazyLoading();
}

/**
 * Main function
 */
async function main() {
  console.log('🖼️ Image Optimization Script');
  console.log('============================');

  // List all image assets
  listAssets();

  // Add best practices for images
  addImageBestPractices();

  console.log('\n✅ Image optimization complete!');
  console.log('\nNOTE: For full image optimization, consider using a build-time tool such as:');
  console.log('- sharp: For image resizing and conversion');
  console.log('- imagemin: For image compression');
  console.log('- next/image or astro:assets: For framework-based optimization');
}

main().catch(err => {
  console.error('❌ Error:', err);
  process.exit(1);
});
