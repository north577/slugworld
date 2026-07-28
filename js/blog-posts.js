const posts = [
  {
    title: 'EVERYONE LOVES ME!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!',
    date: '2026-07-28',
    content: '<h3>this is a very good test.</h3><br><img src="../assets/crispy-air-fryer-onion-rings-recipe-0775.jpg"><br> yay<br> yaygkjdflshgiufdkghjefsihulghsuiedguhfil im retarrrdedddddddddddddd yayaayayayayay 2200c jidfogkliuhgofejhyuetrwykuthrfdytruawesJ FgyukaJSDuihlgkfrdeshiugltrsd gukyhitu467b8y8ol hrtiugxf'
  }
];




function escapeHtml(text) {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
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
      fullHtml = escapeHtml(contentMarkup)
        .replace(/\n\n/g, '</p><p>')
        .replace(/\n/g, '<br>');

      if (!fullHtml.startsWith('<p>')) {
        fullHtml = `<p>${fullHtml}</p>`;
      }

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
