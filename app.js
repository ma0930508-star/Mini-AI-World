// رابط فيديو تعليمي مضمن احتياطي (يمكنك تغييره لأي رابط YouTube embed مناسب)
const sampleYoutubeEmbedUrl = 'https://www.youtube.com/embed/2ePf9rue1Ao';

const activityMessages = {
    1: {
        ok: 'ممتاز! التصنيف صحيح؛ القطة والشجرة كائنات حية، والسيارة آلة.',
        no: 'ليست دقيقة بعد. راجع الفرق بين الكائن الحي والآلة ثم حاول مرة أخرى.'
    },
    2: {
        ok: 'أحسنت! التدريب على البيانات يساعد النظام على اكتشاف الأنماط وتحسين دقته.',
        no: 'حاول مجدداً! البيانات والأمثلة هي التي تساعد النموذج على التعلم.'
    },
    3: {
        ok: 'رائع! رفض مشاركة البيانات وإخبار الوالدين أو المعلم هو التصرف الآمن.',
        no: 'تنبيه أمان! لا نشارك المعلومات الشخصية أو كلمات المرور أبداً، حاول مرة أخرى.'
    }
};

function showSection(sectionId, clickedBtn) {
    document.querySelectorAll('.page-section').forEach(sec => {
        sec.classList.remove('active');
    });

    const targetSec = document.getElementById(sectionId);
    if (targetSec) {
        targetSec.classList.add('active');
    }

    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.classList.remove('active');
    });

    if (clickedBtn) {
        clickedBtn.classList.add('active');
    } else {
        const matchingNav = document.querySelector(`.nav-btn[data-target="${sectionId}"]`);
        if (matchingNav) matchingNav.classList.add('active');
    }
}

function jumpToSection(sectionId) {
    showSection(sectionId, null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function switchVideoSource(mode) {
    const localBox = document.getElementById('local-video-container');
    const ytBox = document.getElementById('youtube-video-container');
    const ytIframe = document.getElementById('yt-iframe');
    const localVideo = document.getElementById('local-video');

    if (mode === 'youtube') {
        if (localVideo) localVideo.pause();
        if (localBox) localBox.style.display = 'none';
        if (ytBox) ytBox.style.display = 'block';
        if (ytIframe && !ytIframe.src) {
            ytIframe.src = sampleYoutubeEmbedUrl;
        }
    } else {
        if (ytIframe) ytIframe.src = '';
        if (ytBox) ytBox.style.display = 'none';
        if (localBox) localBox.style.display = 'block';
    }
}

function handleActivity(num, isCorrect) {
    const box = document.getElementById(`act-feedback-${num}`);
    const msg = activityMessages[num];
    if (!box || !msg) return;

    if (isCorrect) {
        box.style.color = '#4ade80';
        box.innerHTML = `
            <img src="happy.png" alt="إجابة صحيحة" class="feedback-face" onerror="this.style.display='none'">
            <div>${msg.ok}</div>
        `;
    } else {
        box.style.color = '#f87171';
        box.innerHTML = `
            <img src="angry.png" alt="حاول مجدداً" class="feedback-face" onerror="this.style.display='none'">
            <div>${msg.no}</div>
        `;
    }
}

function gradeFinalQuiz() {
    const answers = ['q1', 'q2', 'q3'];
    let score = 0;
    let answeredCount = 0;

    answers.forEach(qName => {
        const selected = document.querySelector(`input[name="${qName}"]:checked`);
        if (selected) {
            answeredCount++;
            if (selected.value === 'correct') {
                score++;
            }
        }
    });

    const resultBox = document.getElementById('quiz-result');
    if (!resultBox) return;

    if (answeredCount < answers.length) {
        resultBox.style.display = 'block';
        resultBox.innerHTML = `
            <h3>⚠️ أكمل الإجابة عن جميع الأسئلة</h3>
            <p>لقد أجبت عن ${answeredCount} من أصل ${answers.length} أسئلة.</p>
        `;
        return;
    }

    const passed = score >= 2;
    resultBox.style.display = 'block';
    resultBox.innerHTML = `
        <img src="${passed ? 'star.png' : 'angry.png'}" alt="نتيجة التقويم" class="feedback-face" style="margin:0 auto 10px;" onerror="this.style.display='none'">
        <h3>${passed ? '🏅 تهانينا! حصلت على وسام "خبير الذكاء الاصطناعي الصغير"' : '📘 بداية جيدة! راجع الشرح وأعد المحاولة'}</h3>
        <p>نتيجتك النهائية: <strong>${score}</strong> من <strong>${answers.length}</strong></p>
        <button type="button" class="btn btn-outline" onclick="window.print()">طباعة أو حفظ النتيجة 🖨️</button>
    `;
}

function resetQuiz() {
    const form = document.getElementById('final-quiz-form');
    const resultBox = document.getElementById('quiz-result');
    if (form) form.reset();
    if (resultBox) {
        resultBox.style.display = 'none';
        resultBox.innerHTML = '';
    }
}