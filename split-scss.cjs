const fs = require('fs');
const path = require('path');

const inputFile = path.join(__dirname, 'src', 'styles', '_portfolio.scss');
const outputDir = path.join(__dirname, 'src', 'styles', 'components');

const content = fs.readFileSync(inputFile, 'utf-8');

// A function to extract top-level blocks from SCSS
function extractBlocks(text) {
  const blocks = [];
  let currentBlock = '';
  let braceDepth = 0;
  let inCommentBlock = false;
  let inLineComment = false;

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const nextChar = text[i + 1] || '';

    // Handle comments
    if (!inCommentBlock && !inLineComment && char === '/' && nextChar === '*') {
      inCommentBlock = true;
    }
    if (inCommentBlock && char === '*' && nextChar === '/') {
      inCommentBlock = false;
      currentBlock += '*/';
      i++;
      continue;
    }
    if (!inCommentBlock && !inLineComment && char === '/' && nextChar === '/') {
      inLineComment = true;
    }
    if (inLineComment && char === '\n') {
      inLineComment = false;
    }

    currentBlock += char;

    if (!inCommentBlock && !inLineComment) {
      if (char === '{') {
        braceDepth++;
      } else if (char === '}') {
        braceDepth--;
        if (braceDepth === 0) {
          blocks.push(currentBlock.trim());
          currentBlock = '';
        }
      }
    }
  }

  // push any remaining text (like orphan comments or keyframes)
  if (currentBlock.trim()) {
    blocks.push(currentBlock.trim());
  }

  return blocks;
}

const blocks = extractBlocks(content);

// Mapping logic
const files = {
  '_header.scss': [],
  '_user-profile.scss': [],
  '_project-card.scss': [],
  '_experience.scss': [],
  '_skills-radar.scss': [],
  '_ai-assistant.scss': [],
  '_blog.scss': [],
  '_utilities.scss': [],
  '_animations.scss': [],
  '_leftovers.scss': []
};

blocks.forEach(block => {
  if (block.includes('.portfolio-header') || block.includes('.nav-item')) {
    files['_header.scss'].push(block);
  } else if (block.includes('.user-profile') || block.includes('.pulse-dot')) {
    files['_user-profile.scss'].push(block);
  } else if (block.includes('.project-card') || block.includes('.hscroll-carousel') || block.includes('.store-badge')) {
    files['_project-card.scss'].push(block);
  } else if (block.includes('.cv-experience') || block.includes('.tech-chip') || block.includes('.cv-section')) {
    files['_experience.scss'].push(block);
  } else if (block.includes('.skills-radar') || block.includes('.radar-polygon') || block.includes('.radar-axis')) {
    files['_skills-radar.scss'].push(block);
  } else if (block.includes('.ai-assistant')) {
    files['_ai-assistant.scss'].push(block);
  } else if (block.includes('.blog-issue')) {
    files['_blog.scss'].push(block);
  } else if (block.includes('.btn-') || block.includes('.badge-') || block.includes('.option-slider')) {
    files['_utilities.scss'].push(block);
  } else if (block.startsWith('@keyframes')) {
    files['_animations.scss'].push(block);
  } else {
    // Check if it's a media query block, we try to parse inner rules
    if (block.startsWith('@media')) {
      // For simplicity, we just put @media blocks in utilities or leave them.
      // But wait, the media queries contain multiple selectors. Let's just put the media queries in leftovers for now.
      files['_leftovers.scss'].push(block);
    } else {
      files['_leftovers.scss'].push(block);
    }
  }
});

// Write files
for (const [filename, contentArray] of Object.entries(files)) {
  if (contentArray.length > 0) {
    const fileHeader = `@use '../variables' as *;\n\n`;
    fs.writeFileSync(path.join(outputDir, filename), fileHeader + contentArray.join('\n\n'));
  }
}

console.log('Successfully split into components!');
