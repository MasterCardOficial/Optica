/**
 * NAVBAR COMPONENT
 * Handles mobile menu toggle and scroll effects
 */

document.addEventListener('DOMContentLoaded', function() {
  const navToggle = document.getElementById('navToggle');
  const navbar = document.querySelector('.navbar');
  const navMenu = document.querySelector('.navbar__menu');
  
  // Mobile menu toggle
  if (navToggle) {
    navToggle.addEventListener('click', function() {
      this.classList.toggle('active');
      navMenu?.classList.toggle('active');
      document.body.classList.toggle('menu-open');
    });
  }
  
  // Close menu when clicking on a link
  const navLinks = document.querySelectorAll('.navbar__link');
  navLinks.forEach(link => {
    link.addEventListener('click', function() {
      navToggle?.classList.remove('active');
      navMenu?.classList.remove('active');
      document.body.classList.remove('menu-open');
    });
  });
  
  // Add scroll effect to navbar
  let lastScroll = 0;
  
  window.addEventListener('scroll', function() {
    const currentScroll = window.pageYOffset;
    
    // Add shadow on scroll
    if (currentScroll > 50) {
      navbar?.classList.add('scrolled');
    } else {
      navbar?.classList.remove('scrolled');
    }
    
    // Hide/show navbar on scroll (optional)
    if (currentScroll > lastScroll && currentScroll > 500) {
      navbar?.classList.add('hidden');
    } else {
      navbar?.classList.remove('hidden');
    }
    
    lastScroll = currentScroll;
  });
  
  // Close menu when clicking outside
  document.addEventListener('click', function(event) {
    const isClickInsideNav = navbar?.contains(event.target);
    
    if (!isClickInsideNav && navMenu?.classList.contains('active')) {
      navToggle?.classList.remove('active');
      navMenu?.classList.remove('active');
      document.body.classList.remove('menu-open');
    }
  });
});
