const navLinks = document.querySelectorAll('.nav-list li a'); // ✅ Selecciona los <a>
const sections = document.querySelectorAll('section');
const header = document.querySelector("header");

let isScrollingProgrammatically = false;
let scrollTimeout;

function updateHeaderHeight() {
  document.documentElement.style.setProperty(
    "--header-height",
    `${header.offsetHeight}px`
  );
}

updateHeaderHeight();

window.addEventListener("resize", updateHeaderHeight);

function removeActive() {
  document.querySelectorAll('.nav-list li').forEach(li => li.classList.remove('active')); // ✅ Remueve de todos los <li>
}

navLinks.forEach(link => {
  link.addEventListener('click', e => {
    removeActive();
    link.parentElement.classList.add('active'); // ✅ Agrega al <li> padre del <a>
    isScrollingProgrammatically = true;
  });
});

window.addEventListener('scroll', () => {
  let scrollPos = window.scrollY + 100;

  clearTimeout(scrollTimeout);
  scrollTimeout = setTimeout(() => {
    isScrollingProgrammatically = false;
  }, 150);

  if (!isScrollingProgrammatically) {
    sections.forEach(section => {
      if (scrollPos >= section.offsetTop && scrollPos < section.offsetTop + section.offsetHeight) {
        removeActive();
        const activeLink = document.querySelector(`.nav-list li a[href="#${section.id}"]`);
        if (activeLink) activeLink.parentElement.classList.add('active'); // ✅ Agrega al <li> padre
      }
    });
  }

  const backToTop = document.getElementById('back-to-top');
  if (backToTop) {
    if(window.scrollY > 500){
      backToTop.style.display = "flex";
    } else {
      backToTop.style.display = "none";
    }
  }

  const revealElements = document.querySelectorAll('.home-container, .about-container, .projects-container, .services-container, .contact-content');
  revealElements.forEach(el => {
    const windowHeight = window.innerHeight;
    const elementTop = el.getBoundingClientRect().top;
    const revealPoint = 150;

    if(elementTop < windowHeight - revealPoint){
      el.classList.add('active-reveal');
    }
  });
});

document.addEventListener('DOMContentLoaded', () => {
  // Agregar clase reveal a los elementos
  const revealElements = document.querySelectorAll('.home-container, .about-container, .projects-container, .services-container, .contact-content');
  revealElements.forEach(el => el.classList.add('reveal'));

  // Crear botón "Back to Top"
  const backToTop = document.createElement('div');
  backToTop.innerHTML = '<i class="fa-solid fa-chevron-up"></i>';
  backToTop.id = "back-to-top";
  document.body.appendChild(backToTop);

  backToTop.style.cssText = `
    position: fixed;
    bottom: 40px;
    right: 40px;
    background: #474af0;
    color: white;
    width: 50px;
    height: 50px;
    border-radius: 50%;
    display: none;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    z-index: 1000;
    transition: transform 0.3s ease;
  `;

  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  backToTop.addEventListener('mouseover', () => backToTop.style.transform = 'scale(1.2)');
  backToTop.addEventListener('mouseout', () => backToTop.style.transform = 'scale(1)');

  // Agregar efectos hover a las tarjetas
  const cards = document.querySelectorAll('.project-card, .c1, .service-card');
  cards.forEach(card => {
    card.addEventListener('mouseenter', () => card.style.transform = 'translateY(-8px) scale(1.05)');
    card.addEventListener('mouseleave', () => card.style.transform = 'translateY(0) scale(1)');
  });

  // ========================================
  // LOADING SCREEN ANIMATION
  // ========================================
  const loadingText = document.getElementById("loading-text");
  const mainIcon = document.querySelector(".main-icon");
  const subIcons = document.querySelectorAll(".sub-icons i");
  const designerText = document.getElementById("designer-text");
  const loadingScreen = document.getElementById("loading-screen");

  function showElement(element, delay=0){
    if (element) {
      setTimeout(() => {
        element.classList.remove("hidden");
        element.classList.add("fall");
      }, delay);
    }
  }

  showElement(loadingText, 0);          
  showElement(mainIcon, 800);         
  subIcons.forEach((icon, idx) => {
    showElement(icon, 1600 + idx*400);  
  });
  showElement(designerText, 2800);    

  setTimeout(() => {
    if (loadingScreen) {
      loadingScreen.style.opacity = '0';
      setTimeout(() => loadingScreen.style.display='none', 500);
    }
    // Mostrar el body después de la animación
    document.body.style.opacity = '1';
  }, 4000);

  // ========================================
  // TYPING EFFECT
  // ========================================
  const typingElement = document.querySelector('.home-content h3');
  
  if (typingElement) {
    const words = ["Frontend Developer", "UI/UX Designer", "Web Enthusiast", "React Developer"];
    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 100;

    function type() {
      const currentWord = words[wordIndex];
      let displayedText = currentWord.substring(0, charIndex);
      
      typingElement.innerHTML = displayedText + '<span class="cursor">|</span>';

      if (!isDeleting && charIndex < currentWord.length) {
        charIndex++;
        setTimeout(type, typingSpeed);
      } else if (isDeleting && charIndex > 0) {
        charIndex--;
        setTimeout(type, typingSpeed / 2);
      } else {
        isDeleting = !isDeleting;
        if (!isDeleting) {
          wordIndex = (wordIndex + 1) % words.length;
        }
        setTimeout(type, 1000);
      }
    }

    // Iniciar el efecto de escritura
    type();
  }

  // ========================================
  // THEME TOGGLE FUNCTIONALITY
  // ========================================
  const themeButtons = document.querySelectorAll('.theme-button');
  const body = document.body;

  // Detectar tema del sistema operativo
  function getSystemTheme() {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    return 'light';
  }

  // Cargar tema: 1) localStorage, 2) sistema, 3) 'light' por defecto
  const savedTheme = localStorage.getItem('theme');
  const initialTheme = savedTheme || getSystemTheme();
  applyTheme(initialTheme);

  // Escuchar cambios en el tema del sistema (opcional pero útil)
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    // Solo aplicar si el usuario no ha seleccionado manualmente un tema
    if (!localStorage.getItem('theme')) {
      applyTheme(e.matches ? 'dark' : 'light');
    }
  });

  // Event listeners para cada botón de tema
  themeButtons.forEach(button => {
    button.addEventListener('click', () => {
      const theme = button.id.replace('theme-', ''); // 'light' o 'dark'
      
      // Remover clase 'active' de todos los botones
      themeButtons.forEach(btn => btn.classList.remove('active'));
      
      // Agregar clase 'active' al botón clickeado
      button.classList.add('active');
      
      // Aplicar el tema y guardarlo en localStorage
      applyTheme(theme);
      localStorage.setItem('theme', theme);
    });
  });

  // Función para aplicar el tema
  function applyTheme(theme) {
    // Remover 'active' de todos los botones primero
    themeButtons.forEach(btn => btn.classList.remove('active'));
    
    // Activar el botón correcto
    const activeButton = document.getElementById(`theme-${theme}`);
    if (activeButton) {
      activeButton.classList.add('active');
    }
    
    if (theme === 'dark') {
      body.classList.add('dark-mode');
    } else {
      body.classList.remove('dark-mode');
    }
  }

  // ========================================
  // 📧 EMAILJS - CONTACT FORM
  // ========================================
  
  // Inicializa EmailJS con tu Public Key
  emailjs.init("Ivns8Wj3rw2_-OjQX"); // ⚠️ Reemplaza con tu Public Key

  // Maneja el envío del formulario de contacto
  const contactForm = document.getElementById('contact-form');
  
  if (contactForm) {
    contactForm.addEventListener('submit', function(event) {
      event.preventDefault();
      
      const btn = this.querySelector('.btn-send');
      const originalText = btn.textContent;
      
      // Cambia el estado del botón mientras se envía
      btn.textContent = 'Sending...';
      btn.disabled = true;
      btn.style.opacity = '0.6';
      
      // Envía el email usando EmailJS
      emailjs.sendForm('service_rn2nrjq', 'template_mutqlbv', this)
        .then(function() {
          // ✅ Éxito
          btn.textContent = '✓ Message Sent!';
          btn.style.background = '#00b894';
          
          setTimeout(() => {
            btn.textContent = originalText;
            btn.style.background = '';
            btn.disabled = false;
            btn.style.opacity = '1';
            contactForm.reset();
          }, 2500);
        }, function(error) {
          // ❌ Error
          btn.textContent = '✗ Failed to Send';
          btn.style.background = '#d63031';
          
          setTimeout(() => {
            btn.textContent = originalText;
            btn.style.background = '';
            btn.disabled = false;
            btn.style.opacity = '1';
          }, 2500);
          
          console.error('EmailJS Error:', error);
        });
    });
  }
});