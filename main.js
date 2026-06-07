/* ══════════════════════════════════════════
   main.js  –  BENefit Portfolio Logic
══════════════════════════════════════════ */

/* --- 1. 이미지 로딩 에러 시 대체 처리 --- */
document.querySelectorAll('img').forEach(img => {
  img.addEventListener('error', () => {
    img.style.display = 'none';
  });
});

/* --- 2. 스크롤 시 네비게이션 바 스타일 토글 --- */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 20);
}, { passive: true });

/* --- 3. 모바일 햄버거 메뉴 토글 --- */
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('nav-links');

hamburger.addEventListener('click', () => {
  const isOpen = hamburger.classList.toggle('open');
  navLinks.classList.toggle('open', isOpen);
  hamburger.setAttribute('aria-label', isOpen ? '메뉴 닫기' : '메뉴 열기');
});

// 메뉴 링크 클릭 시 모바일 메뉴 닫기
navLinks.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    navLinks.classList.remove('open');
  });
});

/* --- 4. 스크롤 위치에 따른 네비게이션 링크 활성화 (IntersectionObserver) --- */
const sections = document.querySelectorAll('section[id]');
const navItems = document.querySelectorAll('.nav-link');

const sectionObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.getAttribute('id');
      navItems.forEach(link => {
        link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
      });
    }
  });
}, { rootMargin: '-40% 0px -55% 0px' });

sections.forEach(s => sectionObserver.observe(s));

/* --- 5. 카운터 애니메이션 (주요 수치 지표) --- */
function animateCounter(el, target, duration = 1600) {
  let start = null;
  const step = ts => {
    if (!start) start = ts;
    const progress = Math.min((ts - start) / duration, 1);
    // ease-out cubic 효과 적용
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.floor(eased * target);
    if (progress < 1) requestAnimationFrame(step);
    else el.textContent = target;
  };
  requestAnimationFrame(step);
}

const counterObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const el     = entry.target;
      const target = parseInt(el.dataset.target, 10);
      animateCounter(el, target);
      counterObserver.unobserve(el);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('.stat-number[data-target]').forEach(el => {
  counterObserver.observe(el);
});

/* --- 6. 스크롤 등장 애니메이션 (Scroll Reveal) --- */
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('revealed');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll(
  '.service-card, .exp-item, .work-card, .testimonial-card, .stat-item, .purchase-card, .entity-card, .lifecycle-step'
).forEach(el => {
  el.classList.add('reveal');
  revealObserver.observe(el);
});

/* --- 7. 부드러운 스크롤 이동 (Smooth Scroll) --- */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const offset = navbar.offsetHeight + 16;
    const top    = target.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});
