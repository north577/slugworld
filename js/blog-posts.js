const posts = [
  {
    title: 'EVERYONE LOVES ME!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!',
    date: '2026-07-28',
    content: '### this is a very good test.\n\n![crispy onion rings](assets/crispy-air-fryer-onion-rings-recipe-0775.jpg)\n\nThis is a **great** test post with *emphasis* and a [link](https://example.com).'
  },
   {
    title: 'the night of',
    date: '2026-07',
    content: 'testing\ the syntax *this* freaking silly **AWESOME** >>>shit'
  },
];

function escapeHtml(text) {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function markdownToHtml(markdown) {
  let html = escapeHtml(markdown);

  html = html
    .replace(/```([\s\S]*?)```/g, (_, code) => `<pre><code>${code}</code></pre>`)
    .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1">')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>');

  const lines = html.split('\n');
  const blocks = [];
  let paragraph = [];

  const flushParagraph = () => {
    if (!paragraph.length) return;

    const text = paragraph.join('<br>');
    blocks.push(`<p>${text}</p>`);
    paragraph = [];
  };

  lines.forEach((line) => {
    const trimmed = line.trim();

    if (!trimmed) {
      flushParagraph();
      return;
    }

    if (/^#{1,3}\s+/.test(trimmed)) {
      flushParagraph();
      const level = trimmed.match(/^#+/)[0].length;
      const content = trimmed.replace(/^#{1,3}\s+/, '');
      const headingLevel = Math.min(level, 3);
      blocks.push(`<h${headingLevel}>${content}</h${headingLevel}>`);
    } else {
      paragraph.push(trimmed);
    }
  });

  flushParagraph();
  return blocks.join('');
}

function renderPosts() {
  const container = document.getElementById('blog-posts');

  if (!container) return;

  container.innerHTML = '';

  const reversedPosts = [...posts].reverse();

  reversedPosts.forEach((post) => {
    const article = document.createElement('article');
    article.className = 'post-card';

    const title = document.createElement('h2');
    title.className = 'post-title';
    title.textContent = post.title;

    const date = document.createElement('p');
    date.className = 'post-date';
    date.textContent = post.date;

    const content = document.createElement('div');
    content.className = 'post-content';

    const contentMarkup = post.content || '';
    const hasHtml = /<([a-z][\w:-]*)(\s[^>]*)?>/i.test(contentMarkup);

    let previewHtml = '';
    let fullHtml = '';

    if (hasHtml) {
      fullHtml = contentMarkup;
      previewHtml = contentMarkup.replace(/<img[^>]*>/gi, '');
    } else {
      fullHtml = markdownToHtml(contentMarkup);
      previewHtml = fullHtml;
    }

    const previewText = contentMarkup.replace(/<[^>]+>/g, '').trim();
    const needsToggle = previewText.length > 220;

    if (needsToggle) {
      const preview = document.createElement('div');
      preview.className = 'post-preview';
      preview.innerHTML = previewHtml.length > 220 ? `${previewHtml.slice(0, 220)}...` : previewHtml;

      const full = document.createElement('div');
      full.className = 'post-full';
      full.innerHTML = fullHtml;
      full.style.display = 'none';

      const toggle = document.createElement('button');
      toggle.className = 'post-toggle';
      toggle.textContent = 'Show more';
      toggle.addEventListener('click', () => {
        const isHidden = full.style.display === 'none';
        full.style.display = isHidden ? 'block' : 'none';
        toggle.textContent = isHidden ? 'Show less' : 'Show more';
      });

      content.appendChild(preview);
      content.appendChild(full);
      content.appendChild(toggle);
    } else {
      content.innerHTML = fullHtml;
    }

    article.appendChild(title);
    article.appendChild(date);
    article.appendChild(content);
    container.appendChild(article);
  });
}

document.addEventListener('DOMContentLoaded', renderPosts);
