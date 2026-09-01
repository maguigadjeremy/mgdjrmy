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

  /* --- 2. Project Filtering Logic --- */
  // Strictly select buttons and cards ONLY inside the #projects section
  const projectFilterBtns = document.querySelectorAll('#projects .filter-btn');
  const projects = document.querySelectorAll('#projects .project-card');

  projectFilterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Remove 'active' styling from all project buttons
      projectFilterBtns.forEach(b => b.classList.remove('active'));
      
      // Add 'active' styling to the clicked button
      btn.classList.add('active');

      // Get the category we want to show
      const filterValue = btn.getAttribute('data-filter');

      // Loop through projects and hide/show them
      projects.forEach(project => {
        if (filterValue === 'all' || project.getAttribute('data-category') === filterValue) {
          project.classList.remove('hide');
        } else {
          project.classList.add('hide');
        }
      });
    });
  });

  /* --- 3. Certificate Filtering Logic --- */
  // Strictly select buttons and cards ONLY inside the #certificates section
  const certFilterBtns = document.querySelectorAll('#certificates .filter-btn');
  const certs = document.querySelectorAll('#certificates .cert-card');

  certFilterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Remove 'active' styling from all cert buttons
      certFilterBtns.forEach(b => b.classList.remove('active'));
      
      // Add 'active' styling to the clicked button
      btn.classList.add('active');

      // Get the category we want to show
      const filterValue = btn.getAttribute('data-filter');

      // Loop through certs and hide/show them
      certs.forEach(cert => {
        if (filterValue === 'all' || cert.getAttribute('data-category') === filterValue) {
          cert.classList.remove('hide');
        } else {
          cert.classList.add('hide');
        }
      });
    });
  });

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

      // Build the interior HTML of the modal WITH the image
      modalBody.innerHTML = `
        <div style="width: 100%; height: 280px; border-radius: 8px; overflow: hidden; margin-bottom: 1.5rem;">
          <img src="${imgSrc}" style="width: 100%; height: 100%; object-fit: cover;" alt="${title}">
        </div>
        <h2 style="font-size: 2rem; margin-bottom: 1rem;">${title}</h2>
        <div class="pill-group small" style="margin-bottom: 1.5rem;">${pills}</div>
        <p style="color: var(--text-muted); line-height: 1.8; font-size: 1.05rem;">${details}</p>
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