const navToggle = document.querySelector('.nav-toggle');
const siteNavigation = document.querySelector('.site-navigation');

if (navToggle && siteNavigation) {
  navToggle.addEventListener('click', () => {
    const expanded = navToggle.getAttribute('aria-expanded') === 'true';
    navToggle.setAttribute('aria-expanded', String(!expanded));
    siteNavigation.classList.toggle('mobile-open');
  });
}

// Close/open helpers and extra behaviors for mobile nav
function closeMobileNav(){
  if(!siteNavigation || !navToggle) return;
  siteNavigation.classList.remove('mobile-open');
  navToggle.setAttribute('aria-expanded','false');
}

function openMobileNav(){
  if(!siteNavigation || !navToggle) return;
  siteNavigation.classList.add('mobile-open');
  navToggle.setAttribute('aria-expanded','true');
}

if (siteNavigation) {
  // close when clicking a link
  siteNavigation.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => closeMobileNav());
  });

  // close when clicking outside the nav on mobile
  document.addEventListener('click', (e) => {
    const isOpen = siteNavigation.classList.contains('mobile-open');
    if (!isOpen) return;
    const clickedInside = siteNavigation.contains(e.target) || (navToggle && navToggle.contains(e.target));
    if (!clickedInside) closeMobileNav();
  });

  // close on Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeMobileNav();
  });
}

/* Interactive about chart */
(function(){
  const canvas = document.getElementById('aboutChart');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let dpr = window.devicePixelRatio || 1;

  const labels = ['Jan','Fev','Mar','Apr','Mai','Jun','Jul'];
  const data = [12,18,8,22,17,25,19];

  function resize(){
    const rect = canvas.getBoundingClientRect();
    canvas.width = Math.round(rect.width * dpr);
    canvas.height = Math.round(rect.height * dpr);
    ctx.scale(dpr, dpr);
    draw();
  }

  function getCSSVar(name){
    return getComputedStyle(document.documentElement).getPropertyValue(name) || '#4a8eff';
  }

  function draw(highlightIndex){
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    ctx.clearRect(0,0,w,h);
    const pad = 24;
    const max = Math.max(...data) * 1.15;
    const stepX = (w - pad*2) / (data.length - 1);

    // gradient fill
    const accent = getCSSVar('--clr-accent').trim() || '#4a8eff';
    const grad = ctx.createLinearGradient(0,0,0,h);
    grad.addColorStop(0, accent + '44');
    grad.addColorStop(1, 'rgba(10,42,122,0)');

    // path
    ctx.beginPath();
    data.forEach((v,i)=>{
      const x = pad + i * stepX;
      const y = h - pad - (v / max) * (h - pad*2);
      if(i===0) ctx.moveTo(x,y); else ctx.lineTo(x,y);
    });
    ctx.lineWidth = 2.5;
    ctx.strokeStyle = accent;
    ctx.stroke();

    // fill under line
    ctx.lineTo(pad + (data.length-1)*stepX, h - pad);
    ctx.lineTo(pad, h - pad);
    ctx.closePath();
    ctx.fillStyle = grad;
    ctx.fill();

    // points
    data.forEach((v,i)=>{
      const x = pad + i * stepX;
      const y = h - pad - (v / max) * (h - pad*2);
      ctx.beginPath();
      ctx.arc(x,y,4,0,Math.PI*2);
      ctx.fillStyle = i===highlightIndex ? '#fff' : '#fff';
      ctx.strokeStyle = accent;
      ctx.lineWidth = 2;
      ctx.fill();
      ctx.stroke();
    });
  }

  function showTooltip(idx, x, y){
    const tip = document.getElementById('chartTooltip');
    if(!tip) return;
    tip.innerText = labels[idx] + ': ' + data[idx];
    tip.style.left = x + 'px';
    tip.style.top = (y - 36) + 'px';
    tip.setAttribute('aria-hidden','false');
    tip.classList.add('visible');
  }

  function hideTooltip(){
    const tip = document.getElementById('chartTooltip');
    if(!tip) return;
    tip.setAttribute('aria-hidden','true');
    tip.classList.remove('visible');
  }

  function onMove(e){
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX != null ? e.clientX : e.touches[0].clientX) - rect.left;
    const y = (e.clientY != null ? e.clientY : e.touches[0].clientY) - rect.top;
    const pad = 24;
    const stepX = (canvas.clientWidth - pad*2) / (data.length - 1);
    let nearest = 0; let best = Infinity;
    data.forEach((v,i)=>{
      const px = pad + i * stepX;
      const dist = Math.abs(px - x);
      if(dist < best){ best = dist; nearest = i; }
    });
    draw(nearest);
    showTooltip(nearest, pad + nearest*stepX + rect.left - canvas.offsetLeft, y + rect.top - canvas.offsetTop);
  }

  canvas.addEventListener('mousemove', onMove);
  canvas.addEventListener('mouseleave', ()=>{ draw(); hideTooltip(); });
  window.addEventListener('resize', ()=>{ dpr = window.devicePixelRatio || 1; ctx.setTransform(1,0,0,1,0,0); resize(); });

  // initial size adapt: ensure canvas box-size (taller)
  canvas.style.width = '100%';
  canvas.style.height = '420px';
  resize();
})();
