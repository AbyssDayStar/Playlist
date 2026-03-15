document.addEventListener('DOMContentLoaded', () => {
  const songList = document.getElementById('song-list');
  const countSpan = document.getElementById('song-count');

  fetch('/.netlify/functions/get-songs')
    .then(res => res.json())
    .then(songs => {
      if (countSpan) countSpan.textContent = songs.length;

      if (!songs.length) {
        songList.innerHTML = '<p>暂无歌曲，去 <a href="html/update.html">提交</a> 吧！</p>';
        return;
      }

      songList.innerHTML = ''; // 清空加载提示
      songs.forEach(song => {
        const card = document.createElement('div');
        card.className = 'song';

        const h2 = document.createElement('h2');
        const link = document.createElement('a');
        link.href = song.url;
        link.textContent = song.name;
        h2.appendChild(link);
        card.appendChild(h2);

        const typeDiv = document.createElement('div');
        typeDiv.className = 'type';
        typeDiv.style.textAlign = 'right';
        typeDiv.textContent = song.category || '未分类';
        card.appendChild(typeDiv);

        card.appendChild(document.createElement('hr'));

        const descDiv = document.createElement('div');
        descDiv.className = 'infor';
        descDiv.textContent = song.description || '';
        card.appendChild(descDiv);

        songList.appendChild(card);
      });
    })
    .catch(err => {
      songList.innerHTML = '<p>加载失败，请刷新页面重试。</p>';
      console.error(err);
    });
});