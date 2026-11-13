/* --------------------------------------------------------------------------
   DAILY JOB - INTERACTIVITY & DYNAMIC LOGIC (JS)
   Features: Real-time search, category filtering, tabs, dynamic modal & notifications
-------------------------------------------------------------------------- */

document.addEventListener('DOMContentLoaded', () => {
  // Elements
  const searchInput = document.getElementById('searchInput');
  const locationInput = document.getElementById('locationInput');
  const categorySelect = document.getElementById('categorySelect');
  const searchBtn = document.getElementById('searchBtn');
  const filterPills = document.querySelectorAll('.pill');
  const jobCards = document.querySelectorAll('.job-card');
  const categoryCards = document.querySelectorAll('.category-card');
  const loadMoreBtn = document.getElementById('loadMoreBtn');
  const postJobBtn = document.getElementById('postJobBtn');

  // Filter Jobs by text, location and category
  function filterJobs() {
    const searchText = searchInput.value.toLowerCase().trim();
    const locText = locationInput.value.toLowerCase().trim();
    const selectedCategory = categorySelect.value;
    
    // Find active pill
    const activePill = document.querySelector('.pill.active');
    const pillFilter = activePill ? activePill.dataset.filter : 'all';

    let visibleCount = 0;

    jobCards.forEach(card => {
      const title = card.querySelector('.job-role').textContent.toLowerCase();
      const company = card.querySelector('.company-name').textContent.toLowerCase();
      const metaText = card.querySelector('.job-meta-grid').textContent.toLowerCase();
      const skills = card.querySelector('.job-skills').textContent.toLowerCase();
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

    if (visibleCount === 0) {
      showEmptyState(true);
    } else {
      showEmptyState(false);
    }
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
  searchBtn.addEventListener('click', (e) => {
    e.preventDefault();
    filterJobs();
    document.getElementById('jobs').scrollIntoView({ behavior: 'smooth' });
  });

  searchInput.addEventListener('keyup', (e) => {
    if (e.key === 'Enter') filterJobs();
  });

  locationInput.addEventListener('keyup', (e) => {
    if (e.key === 'Enter') filterJobs();
  });

  categorySelect.addEventListener('change', filterJobs);

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
      categorySelect.value = cat;
      
      // Update pills if matching exists
      filterPills.forEach(p => {
        if (p.dataset.filter === cat) {
          filterPills.forEach(item => item.classList.remove('active'));
          p.classList.add('active');
        }
      });

      filterJobs();
      document.getElementById('jobs').scrollIntoView({ behavior: 'smooth' });
    });
  });

  // Post Job Button
  if (postJobBtn) {
    postJobBtn.addEventListener('click', () => {
      alert('Employer Portal: Daily Job Employer Dashboard jald hi launch ho raha hai! Abhi ke liye HR jobs post karne ke liye jobs@dailyjob.com par send karein.');
    });
  }

  // Load More Simulation
  if (loadMoreBtn) {
    loadMoreBtn.addEventListener('click', () => {
      loadMoreBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Loading Fresh Openings...';
      setTimeout(() => {
        addNewDemoJobs();
        loadMoreBtn.innerHTML = '<i class="fa-solid fa-check"></i> All Jobs Loaded for Today';
        loadMoreBtn.disabled = true;
        loadMoreBtn.style.opacity = '0.7';
      }, 900);
    });
  }

  // Add more dynamic jobs
  function addNewDemoJobs() {
    const jobList = document.getElementById('jobList');
    const extraJobs = [
      {
        role: "Data Analyst & Power BI Expert",
        company: "FinCorp Analytics",
        logoClass: "logo-sales",
        logoIcon: "fa-solid fa-chart-simple",
        cat: "finance",
        type: "remote urgenthiring",
        badge: "Urgent",
        badgeClass: "urgent",
        meta: [
          { icon: "fa-solid fa-location-dot", text: "Remote (India / Global)" },
          { icon: "fa-solid fa-briefcase", text: "1-3 Years Experience" },
          { icon: "fa-solid fa-money-bill-wave", text: "₹8 - ₹12 LPA" },
          { icon: "fa-regular fa-clock", text: "Just now" }
        ],
        skills: ["Power BI", "SQL", "Excel", "Data Cleaning"],
        applicants: "8 applicants"
      },
      {
        role: "IBPS Probationary Officer (PO) 2026",
        company: "Institute of Banking Personnel Selection",
        logoClass: "logo-govt",
        logoIcon: "fa-solid fa-landmark",
        cat: "govt",
        type: "govt",
        badge: "Govt Banking",
        badgeClass: "govt-badge",
        meta: [
          { icon: "fa-solid fa-location-dot", text: "Public Sector Banks Across India" },
          { icon: "fa-solid fa-graduation-cap", text: "Graduation Any Stream" },
          { icon: "fa-solid fa-money-bill-wave", text: "Basic Pay ₹36,000 + Allowances" },
          { icon: "fa-regular fa-clock", text: "10 mins ago" }
        ],
        skills: ["Govt Exam", "Bank PO", "Prelims + Mains"],
        applicants: "Registration Active"
      }
    ];

    extraJobs.forEach(job => {
      const card = document.createElement('div');
      card.className = 'job-card';
      card.setAttribute('data-category', job.cat);
      card.setAttribute('data-type', job.type);
      card.innerHTML = `
        <div class="job-card-header">
          <div class="company-badge-wrap">
            <div class="company-logo ${job.logoClass}"><i class="${job.logoIcon}"></i></div>
            <div>
              <h3 class="job-role">${job.role}</h3>
              <p class="company-name">${job.company} <span class="verified-tick"><i class="fa-solid fa-circle-check"></i> Verified</span></p>
            </div>
          </div>
          <span class="tag-status ${job.badgeClass}">${job.badge}</span>
        </div>

        <div class="job-meta-grid">
          ${job.meta.map(m => `<div class="meta-item"><i class="${m.icon}"></i> ${m.text}</div>`).join('')}
        </div>

        <div class="job-skills">
          ${job.skills.map(s => `<span class="skill-tag">${s}</span>`).join('')}
        </div>

        <div class="job-card-footer">
          <span class="applied-count"><i class="fa-solid fa-user-group"></i> ${job.applicants}</span>
          <button class="btn btn-apply" onclick="openApplyModal('${job.role}', '${job.company}')">Apply Now <i class="fa-solid fa-arrow-up-right-from-square"></i></button>
        </div>
      `;
      jobList.appendChild(card);
    });
  }
});

// Modal Operations
function openApplyModal(role, company) {
  const modal = document.getElementById('applyModal');
  document.getElementById('modalJobTitle').textContent = `Apply for: ${role}`;
  document.getElementById('modalCompanyName').textContent = company;
  modal.classList.add('active');
}

function closeModal() {
  const modal = document.getElementById('applyModal');
  modal.classList.remove('active');
}

// Close modal on click outside
window.addEventListener('click', (e) => {
  const modal = document.getElementById('applyModal');
  if (e.target === modal) {
    closeModal();
  }
});

// Form Submission simulation
function submitApplication(e) {
  e.preventDefault();
  const name = document.getElementById('applicantName').value;
  alert(`Shukriya ${name}! Aapki application successfully submit ho gayi hai. Company ki taraf se confirmation email bhej diya gaya hai.`);
  closeModal();
  document.getElementById('jobApplicationForm').reset();
}

function handleSubscribe(e) {
  e.preventDefault();
  const email = document.getElementById('subscriberEmail').value;
  alert(`Badhai ho! ${email} ko Daily Job alerts ke liye subscribe kar liya gaya hai. Kal subah se aapko daily updates milengi.`);
  document.getElementById('subscriberEmail').value = '';
}

function resetAllFilters() {
  document.getElementById('searchInput').value = '';
  document.getElementById('locationInput').value = '';
  document.getElementById('categorySelect').value = 'all';
  const pills = document.querySelectorAll('.pill');
  pills.forEach(p => p.classList.remove('active'));
  pills[0].classList.add('active');

  const jobCards = document.querySelectorAll('.job-card');
  jobCards.forEach(card => card.style.display = 'block');
  
  const emptyMsg = document.getElementById('emptyStateMessage');
  if (emptyMsg) emptyMsg.style.display = 'none';
}
