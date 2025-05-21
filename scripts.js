// Smooth‑scroll navigation
document.querySelectorAll('nav a').forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    const target = document.querySelector(link.getAttribute('href'));
    window.scrollTo({top: target.offsetTop - 70, behavior: 'smooth'});
  });
});

// Highlight active section in navigation
window.addEventListener('scroll', () => {
  const sections = document.querySelectorAll('section');
  const navLinks = document.querySelectorAll('nav a');
  
  let currentSection = '';
  
  sections.forEach(section => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.clientHeight;
    
    if (pageYOffset >= sectionTop - 100) {
      currentSection = section.getAttribute('id');
    }
  });
  
  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href').substring(1) === currentSection) {
      link.classList.add('active');
    }
  });
});

// Animate sections when they come into view
const observerOptions = {
  threshold: 0.25,
  rootMargin: "0px 0px -100px 0px"
};

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
    }
  });
}, observerOptions);

document.querySelectorAll('section').forEach(section => {
  observer.observe(section);
});

// Add hover animation to gallery images
document.querySelectorAll('.gallery img').forEach(img => {
  img.addEventListener('mouseover', () => {
    img.style.transform = 'scale(1.05)';
    img.style.boxShadow = '0 15px 25px rgba(58, 123, 213, 0.3)';
  });
  
  img.addEventListener('mouseout', () => {
    img.style.transform = 'scale(1)';
    img.style.boxShadow = '0 8px 20px rgba(0,0,0,0.1)';
  });
});

// Shrink navigation on scroll
window.addEventListener('scroll', () => {
  const nav = document.querySelector('nav');
  if (window.scrollY > 100) {
    nav.style.padding = '0.2rem 0';
  } else {
    nav.style.padding = '0';
  }
});

// Add active class style to navigation
const style = document.createElement('style');
style.innerHTML = `
  nav a.active {
    background: rgba(58, 123, 213, 0.8);
    color: white;
  }
`;
document.head.appendChild(style);


/// Gallery Carousel Functionality
function initGalleryCarousel() {
  const galleryContainer = document.querySelector('.gallery-container');
  const galleryNavDots = document.querySelector('.gallery-dots');
  const prevButton = document.querySelector('.prev-button');
  const nextButton = document.querySelector('.next-button');
  const images = [
    "Images/service1.jpg",
    "Images/service2.jpg",
    "Images/service3.jpg",
    "Images/service4.jpg",
    "Images/service5.jpg",
    "Images/service6.jpg",
    "Images/service7.jpg",
    "Images/service8.jpg",
    "Images/service9.jpg",
    "Images/service10.jpg"
  ];
  
  // Clear existing content
  galleryContainer.innerHTML = '';
  
  // Calculate total slides needed
  const totalSlides = images.length;
  let currentSlide = 0;
  let animationFrame;
  let lastTimestamp = 0;
  let pixelsPerSecond = 100; // Speed of continuous movement
  let currentOffset = 0;
  
  // Create cloned images for infinite loop effect (add extra images at beginning and end)
  const allImages = [
    ...images.slice(images.length - 3),  // Add last 3 images at beginning
    ...images,                           // Original images
    ...images.slice(0, 3)                // Add first 3 images at end
  ];
  
  // Create slides
  allImages.forEach((src, index) => {
    const slide = document.createElement('div');
    slide.className = 'gallery-slide';
    
    const img = document.createElement('img');
    img.src = src;
    img.alt = `Service image ${(index + images.length - 3) % images.length + 1}`;
    
    slide.appendChild(img);
    galleryContainer.appendChild(slide);
  });
  
  // Create dots
  for (let i = 0; i < images.length; i++) {
    const dot = document.createElement('div');
    dot.className = 'gallery-dot';
    if (i === 0) dot.classList.add('active');
    
    dot.addEventListener('click', () => {
      stopAnimation();
      goToSlide(i);
      setTimeout(startAnimation, 1000);
    });
    
    galleryNavDots.appendChild(dot);
  }
  
  // Initial position - start at the first real image (after clones)
  currentSlide = 3; // Skip the 3 prepended clone images
  updateGallery(false);
  updateDots(0);
  
  // Event listeners for navigation
  prevButton.addEventListener('click', () => {
    stopAnimation();
    navigateSlide(-1);
    setTimeout(startAnimation, 1000);
  });
  
  nextButton.addEventListener('click', () => {
    stopAnimation();
    navigateSlide(1);
    setTimeout(startAnimation, 1000);
  });
  
  function updateDots(currentIndex) {
    const dots = document.querySelectorAll('.gallery-dot');
    dots.forEach((dot, index) => {
      if (index === currentIndex) {
        dot.classList.add('active');
      } else {
        dot.classList.remove('active');
      }
    });
  }
  
  function navigateSlide(direction) {
    currentSlide += direction;
    
    // Update actual index for dot navigation
    const actualIndex = (currentSlide - 3 + totalSlides) % totalSlides;
    updateDots(actualIndex);
    
    // First perform the normal transition
    updateGallery(true);
    
    // If we've moved to a clone, prepare to jump to the real slide
    if (currentSlide <= 2 || currentSlide >= totalSlides + 3) {
      // Wait for transition to finish, then jump without animation
      setTimeout(() => {
        // If at beginning clone, jump to end of real slides
        if (currentSlide <= 2) {
          currentSlide = totalSlides + currentSlide;
        }
        // If at end clone, jump to beginning of real slides
        else if (currentSlide >= totalSlides + 3) {
          currentSlide = (currentSlide - totalSlides);
        }
        
        // Update without animation
        updateGallery(false);
      }, 500);
    }
  }
  
  function goToSlide(slideIndex) {
    // Adjust for clone offset
    currentSlide = slideIndex + 3;
    currentOffset = -currentSlide * document.querySelector('.gallery-slide').offsetWidth;
    updateGallery(true);
    updateDots(slideIndex);
  }
  
  function updateGallery(animate) {
    const slideWidth = document.querySelector('.gallery-slide').offsetWidth;
    
    if (!animate) {
      // Disable transition for instant movement
      galleryContainer.style.transition = 'none';
      galleryContainer.style.transform = `translateX(-${currentSlide * slideWidth}px)`;
      currentOffset = -currentSlide * slideWidth;
      
      // Force reflow to make sure the style change takes effect immediately
      galleryContainer.offsetHeight;
      
      // Re-enable transition
      setTimeout(() => {
        galleryContainer.style.transition = 'transform 0.5s ease-in-out';
      }, 10);
    } else {
      galleryContainer.style.transition = 'transform 0.5s ease-in-out';
      galleryContainer.style.transform = `translateX(-${currentSlide * slideWidth}px)`;
      currentOffset = -currentSlide * slideWidth;
    }
  }
  
  // Continuous smooth animation
  function animate(timestamp) {
    if (!lastTimestamp) lastTimestamp = timestamp;
    const deltaTime = timestamp - lastTimestamp;
    lastTimestamp = timestamp;
    
    const slideWidth = document.querySelector('.gallery-slide').offsetWidth;
    const containerWidth = slideWidth * allImages.length;
    
    // Move by a small amount based on time passed
    currentOffset -= (pixelsPerSecond * deltaTime) / 1000;
    
    // If we've moved past the width of one slide
    if (Math.abs(currentOffset) >= ((currentSlide + 1) * slideWidth)) {
      currentSlide++;
      
      // Update actual index for dot navigation
      const actualIndex = (currentSlide - 3 + totalSlides) % totalSlides;
      updateDots(actualIndex);
      
      // If we've moved to a clone at the end, jump back to the real slides
      if (currentSlide >= totalSlides + 3) {
        // We'll continue the smooth movement, but also plan a jump
        setTimeout(() => {
          galleryContainer.style.transition = 'none';
          currentSlide = (currentSlide - totalSlides);
          currentOffset = -currentSlide * slideWidth;
          galleryContainer.style.transform = `translateX(${currentOffset}px)`;
          
          // Force reflow
          galleryContainer.offsetHeight;
          galleryContainer.style.transition = '';
        }, 50);
      }
    }
    
    // Apply the transform
    galleryContainer.style.transform = `translateX(${currentOffset}px)`;
    
    // Continue the animation
    animationFrame = requestAnimationFrame(animate);
  }
  
  function startAnimation() {
    if (!animationFrame) {
      lastTimestamp = 0;
      galleryContainer.style.transition = '';
      animationFrame = requestAnimationFrame(animate);
    }
  }
  
  function stopAnimation() {
    if (animationFrame) {
      cancelAnimationFrame(animationFrame);
      animationFrame = null;
    }
  }
  
  // Handle window resize
  window.addEventListener('resize', () => {
    const slideWidth = document.querySelector('.gallery-slide').offsetWidth;
    currentOffset = -currentSlide * slideWidth;
    galleryContainer.style.transition = 'none';
    galleryContainer.style.transform = `translateX(${currentOffset}px)`;
    galleryContainer.offsetHeight;
    setTimeout(() => {
      galleryContainer.style.transition = '';
    }, 50);
  });

  // Handle visibility change to prevent stuttering when tab is inactive
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      stopAnimation();
    } else {
      startAnimation();
    }
  });
  
  // Improve gallery smoothness by preloading images
  allImages.forEach(src => {
    const preloadImg = new Image();
    preloadImg.src = src;
  });
    
  // Start the continuous animation
  setTimeout(startAnimation, 500);
}

// Initialize gallery when DOM is loaded
document.addEventListener('DOMContentLoaded', initGalleryCarousel);

