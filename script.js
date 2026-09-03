document.addEventListener('DOMContentLoaded', () => {
  
  /* --- 1. Theme Toggle Logic --- */
  const themeBtn = document.getElementById('theme-toggle');
  const htmlElement = document.documentElement;

  // Check if the user previously saved a theme preference
  const savedTheme = localStorage.getItem('portfolio-theme');
  if (savedTheme) {
    htmlElement.setAttribute('data-theme', savedTheme);
  }

  // Toggle theme on click
  themeBtn.addEventListener('click', () => {
    const currentTheme = htmlElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    htmlElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('portfolio-theme', newTheme);
  });

  /* --- 2. Project Filtering & Pagination Logic --- */
  const projectFilterBtns = document.querySelectorAll('#projects .filter-btn');
  const projects = Array.from(document.querySelectorAll('#projects .project-card'));
  const dotsContainer = document.getElementById('project-dots');

  let currentProjectPage = 1;
  // Shows 3 projects on desktop, but switches to 1 project on mobile/tablets
  let projectItemsPerPage = window.innerWidth <= 850 ? 1 : 3;
  let activeProjects = [...projects]; // Holds the currently filtered projects

  // Update items per page dynamically if the window is resized
  window.addEventListener('resize', () => {
    const newItemsPerPage = window.innerWidth <= 850 ? 1 : 3;
    if (newItemsPerPage !== projectItemsPerPage) {
      projectItemsPerPage = newItemsPerPage;
      currentProjectPage = 1; // Reset to page 1 on layout shift
      renderProjects();
    }
  });

  function renderProjects() {
    // 1. Hide ALL projects first
    projects.forEach(p => p.style.display = 'none');

    // 2. Calculate indices for current page
    const startIndex = (currentProjectPage - 1) * projectItemsPerPage;
    const endIndex = startIndex + projectItemsPerPage;

    // 3. Show only projects for the current active page
    activeProjects.forEach((p, index) => {
      if (index >= startIndex && index < endIndex) {
        p.style.display = 'flex'; 
      }
    });

    // 4. Generate the clickable dots
    renderDots();
  }

  function renderDots() {
    if (!dotsContainer) return;
    dotsContainer.innerHTML = '';
    const totalPages = Math.ceil(activeProjects.length / projectItemsPerPage);

    // Hide the dots container entirely if everything fits on 1 page
    if (totalPages <= 1) {
      dotsContainer.style.display = 'none';
      return;
    }

    dotsContainer.style.display = 'flex';
    
    // Create dots based on total pages
    for (let i = 1; i <= totalPages; i++) {
      const dot = document.createElement('div');
      dot.classList.add('dot');
      if (i === currentProjectPage) dot.classList.add('active');
      
      // Add click event to swap pages
      dot.addEventListener('click', () => {
        currentProjectPage = i;
        renderProjects();
      });
      
      dotsContainer.appendChild(dot);
    }
  }

  // Filter Button Click Events
  projectFilterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Highlight active button
      projectFilterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      // Filter the array of active projects based on category
      activeProjects = projects.filter(project => {
        return filterValue === 'all' || project.getAttribute('data-category') === filterValue;
      });

      // Reset to page 1 and re-render the grid and dots
      currentProjectPage = 1;
      renderProjects();
    });
  });

  // Initial render on page load
  renderProjects();

  /* --- 3. Certificate Filtering & Pagination Logic --- */
  const certFilterBtns = document.querySelectorAll('#certificates .filter-btn');
  const certs = Array.from(document.querySelectorAll('#certificates .cert-card'));
  const certDotsContainer = document.getElementById('cert-dots');

  let currentCertPage = 1;
  let certItemsPerPage = window.innerWidth <= 850 ? 1 : 3;
  let activeCerts = [...certs];

  // Update certificate items per page dynamically on window resize
  window.addEventListener('resize', () => {
    const newItemsPerPage = window.innerWidth <= 850 ? 1 : 3;
    if (newItemsPerPage !== certItemsPerPage) {
      certItemsPerPage = newItemsPerPage;
      currentCertPage = 1; 
      renderCerts();
    }
  });

  function renderCerts() {
    // 1. Hide ALL certificates first
    certs.forEach(c => c.style.display = 'none');

    // 2. Calculate indices for current page
    const startIndex = (currentCertPage - 1) * certItemsPerPage;
    const endIndex = startIndex + certItemsPerPage;

    // 3. Show only certificates for the current active page
    activeCerts.forEach((c, index) => {
      if (index >= startIndex && index < endIndex) {
        c.style.display = 'flex'; 
      }
    });

    // 4. Generate the clickable dots
    renderCertDots();
  }

  function renderCertDots() {
    if (!certDotsContainer) return;
    certDotsContainer.innerHTML = '';
    const totalPages = Math.ceil(activeCerts.length / certItemsPerPage);

    if (totalPages <= 1) {
      certDotsContainer.style.display = 'none';
      return;
    }

    certDotsContainer.style.display = 'flex';
    
    for (let i = 1; i <= totalPages; i++) {
      const dot = document.createElement('div');
      dot.classList.add('dot');
      if (i === currentCertPage) dot.classList.add('active');
      
      dot.addEventListener('click', () => {
        currentCertPage = i;
        renderCerts();
      });
      
      certDotsContainer.appendChild(dot);
    }
  }

  // Filter Button Click Events
  certFilterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      certFilterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      activeCerts = certs.filter(cert => {
        return filterValue === 'all' || cert.getAttribute('data-category') === filterValue;
      });

      currentCertPage = 1;
      renderCerts();
    });
  });

  // Initial render on page load
  renderCerts();

  /* --- 4. Modal Popup Logic (Shared Window) --- */
  const modal = document.getElementById('project-modal');
  const modalBody = document.querySelector('.modal-body');
  const modalContent = document.querySelector('.modal-content'); // Controls box size
  const closeBtn = document.querySelector('.close-modal');

  // 4a. Add click event to all PROJECT cards
  projects.forEach(card => {
    card.addEventListener('click', () => {
      // Keep the project modal at its original compact size
      modalContent.style.maxWidth = '650px';

      // Grab data from the clicked card
      const title = card.querySelector('.project-name').innerText;
      const details = card.querySelector('.project-details').innerHTML;
      const pills = card.querySelector('.pill-group').innerHTML;
      const imgSrc = card.querySelector('.project-thumb img').src;

      // Check if this project has a demo link attached
      const demoLinkEl = card.querySelector('.demo-link');
      let demoButton = '';
      if (demoLinkEl) {
        // Formats the link as a button matching the certificates section
        demoButton = `<div style="margin-top: 2rem;"><a href="${demoLinkEl.href}" target="_blank" class="filter-btn active" style="text-decoration: none; display: inline-block;">${demoLinkEl.innerText}</a></div>`;
      }

      // Build the interior HTML of the modal WITH the image and the new button
      modalBody.innerHTML = `
        <div style="width: 100%; height: 280px; border-radius: 8px; overflow: hidden; margin-bottom: 1.5rem;">
          <img src="${imgSrc}" style="width: 100%; height: 100%; object-fit: cover;" alt="${title}">
        </div>
        <h2 style="font-size: 2rem; margin-bottom: 1rem;">${title}</h2>
        <div class="pill-group small" style="margin-bottom: 1.5rem;">${pills}</div>
        <p style="color: var(--text-muted); line-height: 1.8; font-size: 1.05rem;">${details}</p>
        ${demoButton}
      `;

      // Show the modal
      modal.classList.add('show');
    });
  });

  // 4b. Add click event to all CERTIFICATE cards
  certs.forEach(card => {
    card.addEventListener('click', () => {
      // Grab text data
      const title = card.querySelector('.project-name').innerText;
      const pills = card.querySelector('.pill-group').innerHTML;
      const fullDesc = card.querySelector('.full-desc').innerHTML;
      
      // Grab link data
      const linkElement = card.querySelector('.cert-link');
      const linkUrl = linkElement ? linkElement.href : '#';
      const linkText = linkElement ? linkElement.innerText : 'View Credential';

      // Check if this certificate has an image attached
      const imgElement = card.querySelector('.cert-img');
      
      if (imgElement) {
        // Expand the modal width so they can sit side-by-side
        modalContent.style.maxWidth = '950px'; 

        // SPLIT LAYOUT: Image on the left, text on the right (stacks on mobile)
        modalBody.innerHTML = `
          <div style="display: flex; flex-wrap: wrap; gap: 2.5rem; align-items: center;">
            
            <!-- Left Side: Image -->
            <div style="flex: 1 1 400px; background: #ffffff; padding: 15px; border-radius: 8px; box-shadow: 0 5px 15px rgba(0,0,0,0.2);">
              <img src="${imgElement.src}" style="width: 100%; height: auto; display: block;" alt="${title}">
            </div>

            <!-- Right Side: Content -->
            <div style="flex: 1 1 300px; display: flex; flex-direction: column; justify-content: center;">
              <h2 style="font-size: 2.2rem; margin-bottom: 1rem; line-height: 1.1;">${title}</h2>
              <div class="pill-group small" style="margin-bottom: 1.5rem;">${pills}</div>
              <p style="color: var(--text-muted); line-height: 1.8; font-size: 1.05rem; margin-bottom: 2rem;">${fullDesc}</p>
              <div>
                <a href="${linkUrl}" target="_blank" class="filter-btn active" style="text-decoration: none; display: inline-block;">${linkText}</a>
              </div>
            </div>

          </div>
        `;
      } else {
        // STANDARD TEXT LAYOUT: Fallback for certs without images (In Progress)
        modalContent.style.maxWidth = '650px'; 
        
        modalBody.innerHTML = `
          <h2 style="font-size: 2rem; margin-bottom: 1rem;">${title}</h2>
          <div class="pill-group small" style="margin-bottom: 1.5rem;">${pills}</div>
          <p style="color: var(--text-muted); line-height: 1.8; font-size: 1.05rem; margin-bottom: 2.5rem;">${fullDesc}</p>
          <a href="${linkUrl}" target="_blank" class="filter-btn active" style="text-decoration: none; display: inline-block;">${linkText}</a>
        `;
      }

      // Show the modal
      modal.classList.add('show');
    });
  });

  // Close project/certificate modal when clicking the 'X'
  closeBtn.addEventListener('click', () => {
    modal.classList.remove('show');
  });

  // Close modal when clicking on the dark background outside the box
  window.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.classList.remove('show');
    }
  });

  /* --- 5. Mobile Menu Logic --- */
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const mobileMenuOverlay = document.getElementById('mobile-menu-overlay');
  const closeMobileMenuBtn = document.querySelector('.close-mobile-menu');
  const mobileLinks = document.querySelectorAll('.mobile-link');

  if (mobileMenuBtn && mobileMenuOverlay) {
    // Open menu and lock background scrolling
    mobileMenuBtn.addEventListener('click', () => {
      mobileMenuOverlay.classList.add('show');
      document.body.style.overflow = 'hidden'; 
    });

    // Close menu on 'X' click and restore scrolling
    if (closeMobileMenuBtn) {
      closeMobileMenuBtn.addEventListener('click', () => {
        mobileMenuOverlay.classList.remove('show');
        document.body.style.overflow = 'auto';
      });
    }

    // Close menu automatically when a link is clicked
    mobileLinks.forEach(link => {
      link.addEventListener('click', () => {
        mobileMenuOverlay.classList.remove('show');
        document.body.style.overflow = 'auto';
      });
    });
  }

});