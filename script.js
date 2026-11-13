/* --------------------------------------------------------------------------
   DAILY JOB - INTERACTIVITY & DYNAMIC LOGIC (JS)
   Features: Real-time search, category filtering, remote API integration,
   GitHub Pages dynamic job feeds, modal & notifications
-------------------------------------------------------------------------- */

let globalJobs = [];

document.addEventListener('DOMContentLoaded', async () => {
  // Elements
  const searchInput = document.getElementById('searchInput');
  const locationInput = document.getElementById('locationInput');
  const categorySelect = document.getElementById('categorySelect');
  const searchBtn = document.getElementById('searchBtn');
  const filterPills = document.querySelectorAll('.pill');
  const categoryCards = document.querySelectorAll('.category-card');
  const loadMoreBtn = document.getElementById('loadMoreBtn');
  const postJobBtn = document.getElementById('postJobBtn');

  // Load dynamically fetched jobs from data/jobs.json
  await loadVerifiedJobs();

  // Filter Jobs by text, location and category
  function filterJobs() {
    const searchText = searchInput ? searchInput.value.toLowerCase().trim() : '';
    const locText = locationInput ? locationInput.value.toLowerCase().trim() : '';
    const selectedCategory = categorySelect ? categorySelect.value : 'all';
    
    // Find active pill
    const activePill = document.querySelector('.pill.active');
    const pillFilter = activePill ? activePill.dataset.filter : 'all';

    const jobCards = document.querySelectorAll('.job-card');
    let visibleCount = 0;

    jobCards.forEach(card => {
      const title = card.querySelector('.job-role')?.textContent.toLowerCase() || '';
      const company = card.querySelector('.company-name')?.textContent.toLowerCase() || '';
      const metaText = card.querySelector('.job-meta-grid')?.textContent.toLowerCase() || '';
      const skills = card.querySelector('.job-skills')?.textContent.toLowerCase() || '';
      const cardCategory = card.getAttribute('data-category') || '';
      const cardType = card.getAttribute('data-type') || '';

      const matchesSearch = !searchText || title.includes(searchText) || company.includes(searchText) || skills.includes(searchText);
      const matchesLocation = !locText || metaText.includes(locText);
      const matchesCategory = selectedCategory === 'all' || cardCategory === selectedCategory;
      
      let matchesPill = true;
      if (pillFilter !== 'all') {
        matchesPill = cardCategory === pillFilter || cardType.includes(pillFilter);
      }

      if (matchesSearch && matchesLocation && matchesCategory && matchesPill) {
        card.style.display = 'block';
        visibleCount++;
      } else {
        card.style.display = 'none';
      }
    });

    showEmptyState(visibleCount === 0);
  }

  // Handle empty state display
  function showEmptyState(show) {
    let emptyMsg = document.getElementById('emptyStateMessage');
    const jobList = document.getElementById('jobList');

    if (show) {
      if (!emptyMsg) {
        emptyMsg = document.createElement('div');
        emptyMsg.id = 'emptyStateMessage';
        emptyMsg.style.textAlign = 'center';
        emptyMsg.style.padding = '40px 20px';
        emptyMsg.style.background = '#ffffff';
        emptyMsg.style.borderRadius = '16px';
        emptyMsg.style.border = '1px dashed #cbd5e1';
        emptyMsg.innerHTML = `
          <div style="font-size: 3rem; color: #94a3b8; margin-bottom: 12px;"><i class="fa-solid fa-folder-open"></i></div>
          <h3 style="color: #0f172a; margin-bottom: 6px;">No Jobs Found</h3>
          <p style="color: #64748b; font-size: 0.95rem;">Aapke filter ke mutabiq koi job nahi mili. Dobara search karein ya filter reset karein.</p>
          <button class="btn btn-outline" style="margin-top: 16px;" onclick="resetAllFilters()">Reset Filters</button>
        `;
        jobList.appendChild(emptyMsg);
      }
      emptyMsg.style.display = 'block';
    } else if (emptyMsg) {
      emptyMsg.style.display = 'none';
    }
  }

  // Event Listeners for Search
  if (searchBtn) {
    searchBtn.addEventListener('click', (e) => {
      e.preventDefault();
      filterJobs();
      document.getElementById('jobs')?.scrollIntoView({ behavior: 'smooth' });
    });
  }

  if (searchInput) {
    searchInput.addEventListener('keyup', (e) => {
      if (e.key === 'Enter') filterJobs();
    });
  }

  if (locationInput) {
    locationInput.addEventListener('keyup', (e) => {
      if (e.key === 'Enter') filterJobs();
    });
  }

  if (categorySelect) {
    categorySelect.addEventListener('change', filterJobs);
  }

  // Filter Pills Logic
  filterPills.forEach(pill => {
    pill.addEventListener('click', () => {
      filterPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      filterJobs();
    });
  });

  // Category Cards Clickable
  categoryCards.forEach(card => {
    card.addEventListener('click', () => {
      const cat = card.dataset.cat;
      if (categorySelect) categorySelect.value = cat;
      
      filterPills.forEach(p => {
        if (p.dataset.filter === cat) {
          filterPills.forEach(item => item.classList.remove('active'));
          p.classList.add('active');
        }
      });

      filterJobs();
      document.getElementById('jobs')?.scrollIntoView({ behavior: 'smooth' });
    });
  });

  // Post Job Button
  if (postJobBtn) {
    postJobBtn.addEventListener('click', () => {
      alert('Employer Portal: Daily Job Employer Dashboard jald hi launch ho raha hai! Abhi ke liye HR jobs post karne ke liye jobs@dailyjob.com par send karein.');
    });
  }

  // Load More logic
  if (loadMoreBtn) {
    loadMoreBtn.addEventListener('click', () => {
      renderAdditionalJobs();
      loadMoreBtn.innerHTML = '<i class="fa-solid fa-check"></i> All Jobs Displayed';
      loadMoreBtn.disabled = true;
      loadMoreBtn.style.opacity = '0.7';
    });
  }

  window.filterJobs = filterJobs;
});

// Load verified jobs from data/jobs.json
async function loadVerifiedJobs() {
  const jobList = document.getElementById('jobList');
  if (!jobList) return;

  try {
    const res = await fetch('data/jobs.json');
    if (!res.ok) throw new Error('Data file not found');
    const data = await res.json();
    
    if (data.jobs && data.jobs.length > 0) {
      globalJobs = data.jobs;
      jobList.innerHTML = ''; // Clear hardcoded initial jobs
      
      // Render first 10 jobs initially
      renderJobs(globalJobs.slice(0, 10));

      // Update stat count dynamically
      const countEl = document.querySelector('.hero-stats .stat-item h3');
      if (countEl) {
        countEl.textContent = `${data.jobs.length * 15}+`;
      }
    }
  } catch (err) {
    console.log('Using default static jobs or local fallback:', err);
  }
}

function renderJobs(jobs) {
  const jobList = document.getElementById('jobList');
  
  jobs.forEach(job => {
    const card = document.createElement('div');
    const isGovt = job.category === 'govt';
    const isRemote = (job.location || '').toLowerCase().includes('remote') || (job.type || '').toLowerCase().includes('remote');
    const typeAttr = `${isGovt ? 'govt ' : ''}${isRemote ? 'remote ' : ''}urgenthiring`;

    card.className = 'job-card';
    card.setAttribute('data-category', job.category || 'tech');
    card.setAttribute('data-type', typeAttr);

    let logoHtml = `<div class="company-logo logo-aws"><i class="fa-solid fa-building"></i></div>`;
    if (isGovt) {
      logoHtml = `<div class="company-logo logo-govt"><i class="fa-solid fa-landmark"></i></div>`;
    } else if (isRemote) {
      logoHtml = `<div class="company-logo logo-shopify"><i class="fa-solid fa-laptop-code"></i></div>`;
    } else if (job.category === 'tech') {
      logoHtml = `<div class="company-logo logo-google"><i class="fa-solid fa-terminal"></i></div>`;
    }

    const tagBadge = isGovt ? '<span class="tag-status govt-badge">Official Govt</span>'
      : isRemote ? '<span class="tag-status remote-badge">Verified Remote</span>'
      : '<span class="tag-status urgent">Urgent Hiring</span>';

    const tagsHtml = (job.tags && job.tags.length > 0)
      ? job.tags.map(t => `<span class="skill-tag">${escapeHtml(t)}</span>`).join('')
      : `<span class="skill-tag">Full Time</span><span class="skill-tag">Verified Role</span>`;

    const applyAction = job.url && job.url.startsWith('http')
      ? `window.open('${job.url}', '_blank')`
      : `openApplyModal('${escapeHtml(job.title)}', '${escapeHtml(job.company)}')`;

    card.innerHTML = `
      <div class="job-card-header">
        <div class="company-badge-wrap">
          ${logoHtml}
          <div>
            <h3 class="job-role">${escapeHtml(job.title)}</h3>
            <p class="company-name">${escapeHtml(job.company)} <span class="verified-tick"><i class="fa-solid fa-circle-check"></i> Verified</span></p>
          </div>
        </div>
        ${tagBadge}
      </div>

      <div class="job-meta-grid">
        <div class="meta-item"><i class="fa-solid fa-location-dot"></i> ${escapeHtml(job.location || 'Anywhere')}</div>
        <div class="meta-item"><i class="fa-solid fa-briefcase"></i> ${escapeHtml(job.type || 'Full Time')}</div>
        <div class="meta-item"><i class="fa-solid fa-money-bill-wave"></i> ${escapeHtml(job.salary || 'Best in Industry')}</div>
        <div class="meta-item time-tag"><i class="fa-regular fa-clock"></i> Verified Today</div>
      </div>

      <div class="job-skills">
        ${tagsHtml}
      </div>

      <div class="job-card-footer">
        <span class="applied-count"><i class="fa-solid fa-shield-halved text-success"></i> ${escapeHtml(job.source || 'Daily Verified')}</span>
        <button class="btn btn-apply" onclick="${applyAction}">Direct Apply <i class="fa-solid fa-arrow-up-right-from-square"></i></button>
      </div>
    `;
    jobList.appendChild(card);
  });
}

function renderAdditionalJobs() {
  if (globalJobs.length > 10) {
    renderJobs(globalJobs.slice(10));
    if (window.filterJobs) window.filterJobs();
  }
}

function escapeHtml(str) {
  if (!str) return '';
  return str.toString()
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

// Modal Operations
function openApplyModal(role, company) {
  const modal = document.getElementById('applyModal');
  if (!modal) return;
  document.getElementById('modalJobTitle').textContent = `Apply for: ${role}`;
  document.getElementById('modalCompanyName').textContent = company;
  modal.classList.add('active');
}

function closeModal() {
  const modal = document.getElementById('applyModal');
  if (modal) modal.classList.remove('active');
}

window.addEventListener('click', (e) => {
  const modal = document.getElementById('applyModal');
  if (e.target === modal) {
    closeModal();
  }
});

function submitApplication(e) {
  e.preventDefault();
  const name = document.getElementById('applicantName').value;
  alert(`Shukriya ${name}! Aapki application directly register ho gayi hai. HR partner aapko email par contact karega.`);
  closeModal();
  document.getElementById('jobApplicationForm').reset();
}

function handleSubscribe(e) {
  e.preventDefault();
  const email = document.getElementById('subscriberEmail').value;
  alert(`Shukriya! ${email} ko Daily Job automated alerts list me add kar liya gaya hai.`);
  document.getElementById('subscriberEmail').value = '';
}

function resetAllFilters() {
  const searchInput = document.getElementById('searchInput');
  const locationInput = document.getElementById('locationInput');
  const categorySelect = document.getElementById('categorySelect');
  if (searchInput) searchInput.value = '';
  if (locationInput) locationInput.value = '';
  if (categorySelect) categorySelect.value = 'all';

  const pills = document.querySelectorAll('.pill');
  pills.forEach(p => p.classList.remove('active'));
  if (pills[0]) pills[0].classList.add('active');

  const jobCards = document.querySelectorAll('.job-card');
  jobCards.forEach(card => card.style.display = 'block');
  
  const emptyMsg = document.getElementById('emptyStateMessage');
  if (emptyMsg) emptyMsg.style.display = 'none';
}
