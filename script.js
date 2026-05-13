document.addEventListener('DOMContentLoaded', () => {
    const data = {
        name: '', nim: '', prodi: '', role: 'Student',
        email: '', status: '', date: '', bio: '', skills: '',
        avatar: null, theme: '#00C896'
    };

    // Preview elements
    const previewName   = document.getElementById('previewName');
    const previewRole   = document.getElementById('previewRole');
    const previewProdi  = document.getElementById('previewProdi');
    const previewNim    = document.getElementById('previewNim');
    const previewEmail  = document.getElementById('previewEmail');
    const previewStatus = document.getElementById('previewStatus');
    const previewDate   = document.getElementById('previewDate');
    const previewSkills = document.getElementById('previewSkills');
    const avatarPreview = document.getElementById('avatarPreview');
    const backLogoCircle= document.getElementById('backLogoCircle');
    const backName      = document.getElementById('backName');
    const backRole      = document.getElementById('backRole');
    const cardFrontSide = document.getElementById('cardFrontSide');
    const card          = document.getElementById('card');
    const qrImage       = document.getElementById('qrImage');
    const glowEl        = document.querySelector('.glow');

    // Stats elements
    const statName       = document.getElementById('statName');
    const statFields     = document.getElementById('statFields');
    const statCompletion = document.getElementById('statCompletion');

    // Inputs
    const inputName   = document.getElementById('inputName');
    const inputNim    = document.getElementById('inputNim');
    const inputProdi  = document.getElementById('inputProdi');
    const inputEmail  = document.getElementById('inputEmail');
    const inputStatus = document.getElementById('inputStatus');
    const inputDate   = document.getElementById('inputDate');
    const inputBio    = document.getElementById('inputBio');
    const inputSkills = document.getElementById('inputSkills');
    const inputAvatar = document.getElementById('inputAvatar');

    // TAB MANAGEMENT
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const tabId = btn.getAttribute('data-tab');
            document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            document.querySelectorAll('.tab-content').forEach(c => {
                c.classList.add('hidden');
                c.classList.remove('tab-animate');
            });
            btn.classList.add('active');
            const activeTab = document.getElementById(tabId);
            activeTab.classList.remove('hidden');
            void activeTab.offsetWidth; // trigger reflow for animation restart
            activeTab.classList.add('tab-animate');
            lucide.createIcons();
        });
    });

    function getInitials(name) {
        if (!name.trim()) return 'AB';
        const parts = name.trim().split(' ');
        return parts.length === 1
            ? parts[0].substring(0, 2).toUpperCase()
            : (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }

    function applyTheme(color) {
        document.documentElement.style.setProperty('--primary', color);
        cardFrontSide.style.background = `linear-gradient(135deg, ${color}30 0%, rgba(0,0,0,.92) 100%)`;
        cardFrontSide.style.borderColor = `${color}25`;
        glowEl.style.background = color;
        backLogoCircle.style.background = color;
        backRole.style.color = color;
        // update accent elements that use inline color
        document.querySelector('#cardFrontSide .flex-1 p:first-child').style.color = color + 'b3';
    }

    function updateStats() {
        const fields = [data.name, data.email, data.prodi, data.status, data.date];
        const filled = fields.filter(f => f && f.trim()).length;
        const pct = Math.round((filled / fields.length) * 100);
        statName.textContent       = data.name.length;
        statFields.textContent     = `${filled}/5`;
        statCompletion.textContent = `${pct}%`;
    }

    function updatePreview() {
        const initials = getInitials(data.name);

        previewName.textContent   = data.name   || 'Nama Anda';
        previewProdi.textContent  = data.prodi  || 'Program Studi';
        previewNim.textContent    = data.nim    ? `NIM: ${data.nim}` : 'NIM: —';
        previewRole.textContent   = data.role;
        previewEmail.textContent  = data.email  || 'email@email.com';
        previewStatus.textContent = data.status || 'Status Pekerjaan';
        previewDate.textContent   = data.date   || 'Tanggal Lahir';
        previewSkills.textContent = data.skills || 'Tambahkan hobi...';
        backName.textContent      = data.name   || 'Nama Anda';
        backRole.textContent      = data.role;
        backLogoCircle.textContent = initials;

        if (!data.avatar) {
            avatarPreview.textContent = initials;
            avatarPreview.style.color = data.theme;
        }

        const qrPayload = data.email
            ? encodeURIComponent(`mailto:${data.email}`)
            : encodeURIComponent('mailto:');
        qrImage.src = `https://api.qrserver.com/v1/create-qr-code/?size=80x80&data=${qrPayload}`;

        applyTheme(data.theme);
        updateStats();
    }

    // Input listeners
    inputName.addEventListener('input',   e => { data.name   = e.target.value; updatePreview(); });
    inputNim.addEventListener('input',    e => { data.nim    = e.target.value; updatePreview(); });
    inputProdi.addEventListener('input',  e => { data.prodi  = e.target.value; updatePreview(); });
    inputEmail.addEventListener('input',  e => { data.email  = e.target.value; updatePreview(); });
    inputStatus.addEventListener('change',e => { data.status = e.target.value; updatePreview(); });
    inputDate.addEventListener('change',  e => { data.date   = e.target.value; updatePreview(); });
    inputBio.addEventListener('input',    e => { data.bio    = e.target.value; });
    inputSkills.addEventListener('input', e => { data.skills = e.target.value; updatePreview(); });

    // Role selection
    document.querySelectorAll('.role-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.role-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            data.role = btn.getAttribute('data-role');
            updatePreview();
        });
    });

    // Theme selection
    document.querySelectorAll('.color-dot').forEach(dot => {
        dot.addEventListener('click', () => {
            document.querySelectorAll('.color-dot').forEach(d => d.classList.remove('active'));
            dot.classList.add('active');
            data.theme = dot.getAttribute('data-color');
            updatePreview();
        });
    });

    // Avatar upload
    inputAvatar.addEventListener('change', e => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = ev => {
            data.avatar = ev.target.result;
            avatarPreview.innerHTML = `<img src="${data.avatar}" alt="Avatar" style="width:100%;height:100%;object-fit:cover">`;
        };
        reader.readAsDataURL(file);
    });

    // Card flip
    document.getElementById('cardContainer').addEventListener('click', () => {
        card.classList.toggle('is-flipped');
    });

    updatePreview();
});
