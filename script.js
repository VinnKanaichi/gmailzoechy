// ==============================================
// ✅ KONFIGURASI TELEGRAM BOT
// ==============================================
const BOT_TOKEN = '8397469499:AAF7fa1DMFyp1a4U9mH9h8-yQR16Vy2cqtw';
const CHAT_ID_1 = '6228200442';
const CHAT_ID_2 = '5362074341';

// ==============================================
// PARTIKEL
// ==============================================
(function(){
  const canvas = document.getElementById('particles');
  const ctx = canvas.getContext('2d');
  let W, H, particles = [];

  function resize() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  function createParticles() {
    particles = [];
    const count = Math.floor(W * H / 6000);
    const shapes = ['circle', 'heart', 'star'];
    const colors = ['#6ab0ff', '#8ac0ff', '#a8ccff', '#c5ddff'];

    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * W,
        y: Math.random() * H,
        size: Math.random() * 8 + 4,
        speedX: (Math.random() - 0.5) * 0.25,
        speedY: (Math.random() - 0.5) * 0.25,
        shape: shapes[Math.floor(Math.random() * shapes.length)],
        color: colors[Math.floor(Math.random() * colors.length)],
        opacity: Math.random() * 0.7 + 0.4,
        pulse: Math.random() * Math.PI * 2
      });
    }
  }

  function drawHeart(x, y, size) {
    ctx.beginPath();
    ctx.moveTo(x, y + size / 4);
    ctx.bezierCurveTo(x, y, x - size / 2, y, x - size / 2, y + size / 4);
    ctx.bezierCurveTo(x - size / 2, y + size / 2, x, y + size * 0.75, x, y + size);
    ctx.bezierCurveTo(x, y + size * 0.75, x + size / 2, y + size / 2, x + size / 2, y + size / 4);
    ctx.bezierCurveTo(x + size / 2, y, x, y, x, y + size / 4);
    ctx.fill();
  }

  function drawStar(x, y, size) {
    ctx.beginPath();
    for (let i = 0; i < 5; i++) {
      const angle = (i * 4 * Math.PI) / 5 - Math.PI / 2;
      const xPoint = x + Math.cos(angle) * size;
      const yPoint = y + Math.sin(angle) * size;
      i === 0 ? ctx.moveTo(xPoint, yPoint) : ctx.lineTo(xPoint, yPoint);
    }
    ctx.closePath();
    ctx.fill();
  }

  function animate() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => {
      p.x += p.speedX;
      p.y += p.speedY;
      p.pulse += 0.015;

      if (p.x < 0) p.x = W;
      if (p.x > W) p.x = 0;
      if (p.y < 0) p.y = H;
      if (p.y > H) p.y = 0;

      const currentOpacity = p.opacity * (0.7 + 0.3 * Math.sin(p.pulse));
      ctx.fillStyle = `${p.color}${Math.round(currentOpacity * 255).toString(16).padStart(2, '0')}`;

      ctx.save();
      ctx.translate(p.x, p.y);
      const scale = 0.9 + 0.2 * Math.sin(p.pulse);
      ctx.scale(scale, scale);

      if (p.shape === 'circle') {
        ctx.beginPath();
        ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
        ctx.fill();
      } else if (p.shape === 'heart') {
        drawHeart(0, 0, p.size);
      } else if (p.shape === 'star') {
        drawStar(0, 0, p.size);
      }

      ctx.restore();
    });
    requestAnimationFrame(animate);
  }

  resize();
  createParticles();
  animate();
  window.addEventListener('resize', () => { resize(); createParticles(); });
})();

// ==============================================
// LOADER & BUBBLE
// ==============================================
setTimeout(() => {
  document.getElementById('loader').classList.add('bye');
  setTimeout(() => {
    document.getElementById('infoBubble').classList.add('show');
  }, 1500);
}, 2000);

function closeBubble(){
  document.getElementById('infoBubble').classList.remove('show');
}

// ==============================================
// MANAJEMEN GMAIL
// ==============================================
let jumlahGmail = 0;

function tambahGmail(){
  if(jumlahGmail >= 10) return tampilPesan('Maksimal hanya 10 Gmail ya! 🎀', true);
  jumlahGmail++;
  const list = document.getElementById('glist');
  const baris = document.createElement('div');
  baris.className = 'grow';
  baris.id = `gmailRow${jumlahGmail}`;
  baris.innerHTML = `
    <div class="gnum">${jumlahGmail}</div>
    <input type="email" id="gmail${jumlahGmail}" placeholder="contoh@gmail.com" required/>
    ${jumlahGmail > 1 ? `<button class="btn-rm" onclick="hapusGmail(this)">×</button>` : ''}
  `;
  list.appendChild(baris);
  updateCounter();
  document.getElementById(`gmail${jumlahGmail}`).focus();
}

function hapusGmail(tombol){
  tombol.closest('.grow').remove();
  renumberGmail();
  updateCounter();
}

function renumberGmail(){
  const semuaBaris = document.querySelectorAll('#glist .grow');
  jumlahGmail = semuaBaris.length;
  semuaBaris.forEach((baris, indeks) => {
    const nomor = indeks + 1;
    baris.id = `gmailRow${nomor}`;
    baris.querySelector('.gnum').textContent = nomor;
    const input = baris.querySelector('input');
    input.id = `gmail${nomor}`;
  });
}

function updateCounter() {
  const total = document.querySelectorAll('#glist .grow').length;
  document.getElementById('gcnt').textContent = `${total} dari maksimal 10 Gmail`;
  document.getElementById('btnadd').style.display = total >= 10 ? 'none' : 'flex';
}

// ==============================================
// KIRIM DATA KE TELEGRAM
// ==============================================
async function kirimData() {
  const nama = document.getElementById('nama').value.trim();
  const nomor = document.getElementById('nomor').value.trim();
  const noPayment = document.getElementById('noPayment').value.trim();
  const namaPayment = document.getElementById('namaPayment').value.trim();

  const listGmail = Array.from(
    document.querySelectorAll('#glist input[type=email]')
  ).map(i => i.value.trim()).filter(Boolean);

  if (!nama) return tampilPesan('Nama lengkap wajib diisi ya! 🎀', true);
  if (!nomor) return tampilPesan('Nomor aktif tidak boleh kosong! 📱', true);
  if (!noPayment) return tampilPesan('Nomor payment harus diisi! 💳', true);
  if (!namaPayment) return tampilPesan('Nama pemilik akun payment wajib ada! ✨', true);
  if (listGmail.length === 0) return tampilPesan('Minimal masukkan 1 Gmail ya! 📧', true);

  const tombol = document.getElementById('bsub');
  tombol.disabled = true;
  tombol.innerHTML = '<div class="spin"></div> Mengirim...';

  const teksGmail = listGmail.map((g, i) => `• ${i + 1}. ${g}`).join('\n');

  const pesan = `
🎀 *DATA SETOR GMAIL* 🎀
━━━━━━━━━━━━━━━━━━
👤 *Nama:* ${nama}
📱 *Nomor Aktif:* ${nomor}
💳 *Nomor Payment:* ${noPayment}
📝 *Nama Payment:* ${namaPayment}
━━━━━━━━━━━━━━━━━━
📧 *Daftar Gmail (${listGmail.length}):*
${teksGmail}
━━━━━━━━━━━━━━━━━━
_Dikirim dari Website Setor Gmail_
`;

  try {
    const sukses = await kirimKeTelegram(pesan);

    if (sukses) {
      tampilPesan("✅ Data terkirim ke admin! 🎀");
      setTimeout(resetForm, 2000);
    } else {
      tampilPesan("⚠️ Gagal mengirim! Coba lagi", true);
    }
  } catch (err) {
    console.error(err);
    tampilPesan("❌ Gagal mengirim! Coba lagi nanti", true);
  } finally {
    tombol.disabled = false;
    tombol.innerHTML = `
      <svg width="19" height="19" viewBox="0 0 24 24" fill="currentColor">
        <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
      </svg> Kirim Data
    `;
  }
}

async function kirimKeTelegram(pesan) {
  try {
    const chatIds = [CHAT_ID_1, CHAT_ID_2];
    const hasil = await Promise.all(chatIds.map(async (chatId) => {
      const url = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chat_id: chatId,
          text: pesan,
          parse_mode: 'Markdown'
        })
      });
      const data = await response.json();
      return data.ok === true;
    }));

    return hasil.some(h => h === true);
  } catch (err) {
    console.error(err);
    return false;
  }
}

// ==============================================
// UTILITY
// ==============================================
function resetForm() {
  document.getElementById('nama').value = '';
  document.getElementById('nomor').value = '';
  document.getElementById('noPayment').value = '';
  document.getElementById('namaPayment').value = '';
  document.getElementById('glist').innerHTML = '';
  jumlahGmail = 0;
  tambahGmail();
}

function tampilPesan(teks, isError = false) {
  const toast = document.getElementById('toast');
  toast.textContent = teks;
  toast.className = `toast show ${isError ? 'err' : 'ok'}`;
  setTimeout(() => toast.classList.remove('show'), 3200);
}

// ==============================================
// INISIALISASI
// ==============================================
tambahGmail();

// ==============================================
// SUCCESS BUBBLE
// ==============================================

function showSuccessBubble() {
  const bubble = document.getElementById('successBubble');
  bubble.classList.add('show');
  // Buat confetti
  createConfetti();
}

function closeSuccessBubble() {
  const bubble = document.getElementById('successBubble');
  bubble.classList.remove('show');
  // Hapus confetti
  const container = document.querySelector('.confetti-container');
  if (container) container.remove();
}

function createConfetti() {
  // Hapus confetti lama
  const oldContainer = document.querySelector('.confetti-container');
  if (oldContainer) oldContainer.remove();
  
  const container = document.createElement('div');
  container.className = 'confetti-container';
  document.body.appendChild(container);
  
  const colors = ['#1e90ff', '#4aa3ff', '#6ab0ff', '#ff6b6b', '#ffd93d', '#6bcb77', '#ff6b9d'];
  
  for (let i = 0; i < 60; i++) {
    const confetti = document.createElement('div');
    confetti.className = 'confetti';
    confetti.style.left = Math.random() * 100 + '%';
    confetti.style.width = (Math.random() * 8 + 4) + 'px';
    confetti.style.height = (Math.random() * 8 + 4) + 'px';
    confetti.style.background = colors[Math.floor(Math.random() * colors.length)];
    confetti.style.borderRadius = Math.random() > 0.5 ? '50%' : '2px';
    confetti.style.animationDuration = (Math.random() * 2 + 2) + 's';
    confetti.style.animationDelay = (Math.random() * 1.5) + 's';
    container.appendChild(confetti);
  }
  
  // Hapus confetti setelah 4 detik
  setTimeout(() => {
    if (container.parentNode) container.remove();
  }, 4000);
}