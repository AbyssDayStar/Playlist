document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('add-form');
  const listDiv = document.getElementById('manage-list');

  // 加载所有歌曲
  async function loadSongs() {
    try {
      const res = await fetch('/.netlify/functions/get-songs');
      const songs = await res.json();

      if (!songs.length) {
        listDiv.innerHTML = '<p>暂无歌曲，请添加</p>';
        return;
      }

      let html = '<table><tr><th>名称</th><th>链接</th><th>分类</th><th>描述</th><th>操作</th></tr>';
      songs.forEach(song => {
        html += `<tr>
          <td>${escapeHtml(song.name)}</td>
          <td><a href="${escapeHtml(song.url)}" target="_blank">播放</a></td>
          <td>${escapeHtml(song.category || '')}</td>
          <td>${escapeHtml(song.description || '')}</td>
          <td><button class="delete-btn" data-id="${song.id}">删除</button></td>
        </tr>`;
      });
      html += '</table>';
      listDiv.innerHTML = html;

      // 绑定删除事件
      document.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', async (e) => {
          if (!confirm('确定删除这首歌？')) return;
          const id = e.target.dataset.id;
          const delRes = await fetch('/.netlify/functions/delete-song', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id })
          });
          const result = await delRes.json();
          if (result.success) loadSongs();
          else alert('删除失败');
        });
      });
    } catch (err) {
      listDiv.innerHTML = '<p>加载失败，请刷新</p>';
    }
  }

  // 简单转义防止XSS
  function escapeHtml(unsafe) {
    return unsafe.replace(/[&<>"]/g, function(m) {
      if (m === '&') return '&amp;';
      if (m === '<') return '&lt;';
      if (m === '>') return '&gt;';
      if (m === '"') return '&quot;';
      return m;
    });
  }

  // 表单提交
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('name').value.trim();
    const url = document.getElementById('url').value.trim();
    const category = document.getElementById('category').value.trim();
    const description = document.getElementById('description').value.trim();

    if (!name || !url) return alert('名称和链接为必填项');

    const res = await fetch('/.netlify/functions/add-song', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, url, category, description })
    });
    const result = await res.json();
    if (result.success) {
      form.reset();
      loadSongs();
    } else {
      alert('添加失败：' + (result.error || '未知错误'));
    }
  });

  loadSongs();
});