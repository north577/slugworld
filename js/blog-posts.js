const posts = [
  {
    title: 'EVERYONE LOVES ME!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!',
    date: '2026-07-28',
    content: '### this is a very good test.\n\n![](assets/crispy-air-fryer-onion-rings-recipe-0775.jpg)\n\n![](assets/slug favorite.jpg)This is a **great** test post with *emphasis* and a [link](https://example.com).'
  },
   {
    title: 'the night of',
    date: '2026-07-29',
    content: 'testing\ the syntax OF \n\n*this* freaking silly \n **AWESOME** >>>shit'
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
    .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" loading="lazy" decoding="async">')
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

function stripMarkdown(text = '') {
  return text
    .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '$1')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '$1')
    .replace(/#{1,6}\s?/g, '')
    .replace(/\*\*(.+?)\*\*/g, '$1')
    .replace(/\*(.+?)\*/g, '$1')
    .replace(/[`>]/g, '')
    .replace(/\n+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function getExcerpt(text = '', maxLength = 200) {
  const plainText = stripMarkdown(text);
  if (plainText.length <= maxLength) return plainText;
  return `${plainText.slice(0, maxLength).trimEnd()}...`;
}

function getImageUrls(text = '') {
  const matches = [...text.matchAll(/!\[([^\]]*)\]\(([^)]+)\)/g)];
  return matches.map((match) => match[2]).slice(0, 5);
}

function buildPostUrl(postIndex) {
  return `blog-post.html?id=${postIndex}`;
}

function renderPosts() {
  const container = document.getElementById('blog-posts');

  if (!container) return;

  container.innerHTML = '';

  const reversedPosts = [...posts].reverse();

  reversedPosts.forEach((post, index) => {
    const article = document.createElement('article');
    article.className = 'post-card';
    article.tabIndex = 0;
    article.style.cursor = 'pointer';

    const title = document.createElement('h2');
    title.className = 'post-title';
    title.textContent = post.title;

    const date = document.createElement('p');
    date.className = 'post-date';
    date.textContent = post.date;

    const excerpt = document.createElement('p');
    excerpt.className = 'post-excerpt';
    excerpt.textContent = getExcerpt(post.content || '', 200);

    const readMore = document.createElement('a');
    readMore.className = 'post-read-more';
    readMore.href = buildPostUrl(posts.length - 1 - index);
    readMore.textContent = 'read more';

    const openPost = () => {
      window.location.href = buildPostUrl(posts.length - 1 - index);
    };

    article.addEventListener('click', openPost);
    article.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        openPost();
      }
    });

    article.appendChild(title);
    article.appendChild(date);
    article.appendChild(excerpt);

    const imageUrls = getImageUrls(post.content || '');
    if (imageUrls.length) {
      const previewImages = document.createElement('div');
      previewImages.className = 'post-preview-images';

      imageUrls.forEach((imageUrl, imageIndex) => {
        const previewImage = document.createElement('img');
        previewImage.className = 'post-preview-image';
        previewImage.src = imageUrl;
        previewImage.alt = `${post.title} preview ${imageIndex + 1}`;
        previewImage.loading = 'lazy';
        previewImage.decoding = 'async';
        previewImages.appendChild(previewImage);
      });

      article.appendChild(previewImages);
    }

    article.appendChild(readMore);
    container.appendChild(article);
  });
}

function renderSinglePost() {
  const container = document.getElementById('post-detail');
  if (!container) return;

  const params = new URLSearchParams(window.location.search);
  const postIndex = Number(params.get('id'));
  const post = posts[postIndex];

  if (!post) {
    container.innerHTML = '<p>Post not found.</p>';
    return;
  }

  const article = document.createElement('article');
  article.className = 'post-detail-card';

  const title = document.createElement('h1');
  title.className = 'post-title';
  title.textContent = post.title;

  const date = document.createElement('p');
  date.className = 'post-date';
  date.textContent = post.date;

  const content = document.createElement('div');
  content.className = 'post-content';
  content.innerHTML = markdownToHtml(post.content || '');

  article.appendChild(title);
  article.appendChild(date);
  article.appendChild(content);
  container.appendChild(article);
}

function renderBlogContent() {
  if (document.getElementById('blog-posts')) {
    renderPosts();
  }

  if (document.getElementById('post-detail')) {
    renderSinglePost();
  }
}

document.addEventListener('DOMContentLoaded', renderBlogContent);
