// Project data
const projects = [
  {
    title: "Fresh & Fast",
    description:
      "A responsive food delivery app with user authentication, real-time order tracking, and a dynamic menu.",
    image: "https://i.postimg.cc/HL0yvLTM/canteen.png",
    technologies: ["HTML", "CSS", "JavaScript"],
    liveLink: "https://freshandfastgmit.netlify.app/",
    githubLink: "https://github.com/Soumen-dev-ux/soumenpore/ecommerce-platform",
  },
  {
    title: "SafeSpace",
    description:
      "Protecting students, women, the elderly, and travelers with advanced AI technology that works silently in the background.",
    
    technologies: ["Next.js", "React", "Tailwind CSS", "Radix UI", "Supabse", "PostgreSQL", "PNPM"],
    liveLink: " https://i.postimg.cc/qByTBRpy/Screenshot-2025-07-09-223805.png",
    githubLink: "https://github.com/Debraj1001/safespace-2-0",
  },
  {
    title : "Edumorph",
    description: "Personalized education powered by artificial intelligence. Learn faster, retain more, and achieve your goals with EduMorph.",
    image: "https://i.postimg.cc/VkD1yVmh/Screenshot-2025-07-09-214541.png",
    technologies: ["Ongoing"],
    livelink:"https://edu-morph.netlify.app/",
    githubLink: "https://github.com/Soumen-dev-ux/EduMorph",
  },
  {
    title : "Campus Club",
    description : "Campus Club is a centralized platform that showcases all club activities happening across college campuses",
    image : "https://i.postimg.cc/Gh8kt7Rc/Screenshot-2025-07-20-135101.png",
    technologies : ["HTML", "CSS", "JavaScript"],
    livelink : "https://campus-club.netlify.app/",
    githubLink : "https://github.com/Soumen-dev-ux/Campus-Club",
  }
]

// Theme toggle functionality
const themeToggle = document.getElementById("themeToggle")
const html = document.documentElement
const themeIcon = themeToggle.querySelector("i")

function toggleTheme() {
  const currentTheme = html.getAttribute("data-theme")
  const newTheme = currentTheme === "dark" ? "light" : "dark"

  // Add page transition effect
  const pageTransition = document.querySelector(".page-transition")

  // Position the transition origin based on the theme toggle button
  const toggleRect = themeToggle.getBoundingClientRect()
  pageTransition.style.transformOrigin = `${toggleRect.left + toggleRect.width / 2}px ${toggleRect.top + toggleRect.height / 2}px`

  // Set the transition background color based on the new theme
  pageTransition.style.backgroundColor = newTheme === "dark" ? "#111827" : "#ffffff"

  // Activate the transition
  pageTransition.classList.add("active")

  setTimeout(() => {
    html.setAttribute("data-theme", newTheme)
    themeIcon.className = newTheme === "dark" ? "fas fa-sun" : "fas fa-moon"

    // Save theme preference
    localStorage.setItem("theme", newTheme)

    setTimeout(() => {
      pageTransition.classList.remove("active")
    }, 600)
  }, 400)
}

// Load saved theme
const savedTheme = localStorage.getItem("theme") || "light"
html.setAttribute("data-theme", savedTheme)
themeIcon.className = savedTheme === "dark" ? "fas fa-sun" : "fas fa-moon"

themeToggle.addEventListener("click", toggleTheme)

// Header scroll animation
function handleScroll() {
  const navbar = document.getElementById("navbar")
  const scrollPosition = window.scrollY

  if (scrollPosition > 50) {
    navbar.classList.add("scrolled")
  } else {
    navbar.classList.remove("scrolled")
  }

  // Highlight active section in navigation
  const sections = document.querySelectorAll("section")
  const navLinks = document.querySelectorAll(".nav-link")

  let currentSection = ""

  sections.forEach((section) => {
    const sectionTop = section.offsetTop - 100
    const sectionHeight = section.offsetHeight

    if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
      currentSection = section.getAttribute("id")
    }
  })

  navLinks.forEach((link) => {
    link.classList.remove("active")
    if (link.getAttribute("href") === `#${currentSection}`) {
      link.classList.add("active")
    }
  })

  // Reveal sections on scroll
  revealSections()
}

// Reveal sections when they come into view
function revealSections() {
  const revealSections = document.querySelectorAll(".reveal-section")
  const windowHeight = window.innerHeight
  const revealPoint = 150

  revealSections.forEach((section) => {
    const sectionTop = section.getBoundingClientRect().top

    if (sectionTop < windowHeight - revealPoint) {
      section.classList.add("visible")

      // If this is the stats section, start the counters
      if (section.id === "stats") {
        startCounters()
      }

      // Animate timeline items
      if (section.id === "achievements") {
        animateTimeline()
      }

      // Animate education cards
      if (section.id === "education") {
        animateEducation()
      }

      // Animate form inputs
      if (section.id === "contact") {
        animateFormInputs()
      }
    }
  })
}

// Animate timeline items with delay
function animateTimeline() {
  const timelineItems = document.querySelectorAll(".timeline-item")

  timelineItems.forEach((item, index) => {
    setTimeout(() => {
      item.classList.add("visible")
    }, 300 * index)
  })
}

// Animate education cards with delay
function animateEducation() {
  const educationCards = document.querySelectorAll(".education-card")

  educationCards.forEach((card, index) => {
    setTimeout(() => {
      card.classList.add("visible")
    }, 300 * index)
  })
}

// Animate form inputs with delay
function animateFormInputs() {
  const formInputs = document.querySelectorAll(".animate-input")

  formInputs.forEach((input, index) => {
    setTimeout(() => {
      input.classList.add("visible")
    }, 200 * index)
  })
}

// Start counter animation
function startCounters() {
  const counters = document.querySelectorAll(".counter-value")
  const counterItems = document.querySelectorAll(".counter-item")
  const speed = 200

  // First make counter items visible
  counterItems.forEach((item, index) => {
    setTimeout(() => {
      item.classList.add("visible")
    }, 200 * index)
  })

  // Then start counting
  setTimeout(() => {
    counters.forEach((counter) => {
      const target = +counter.dataset.target
      let count = 0

      const updateCount = () => {
        const increment = target / speed

        if (count < target) {
          count += increment
          counter.innerText = Math.ceil(count)
          setTimeout(updateCount, 1)
        } else {
          counter.innerText = target
        }
      }

      updateCount()
    })
  }, 800)
}

window.addEventListener("scroll", handleScroll)

// Render projects with animation
function renderProjects() {
  const projectGrid = document.getElementById("projectGrid")

  projects.forEach((project, index) => {
    const projectCard = document.createElement("div")
    projectCard.className = "project-card"
    projectCard.style.opacity = "0"
    projectCard.style.transform = "translateY(20px)"

    projectCard.innerHTML = `
            <img src="${project.image}" alt="${project.title}">
            <div class="project-info">
                <h3>${project.title}</h3>
                <p>${project.description}</p>
                <div class="technologies">
                    ${project.technologies.map((tech) => `<span>${tech}</span>`).join("")}
                </div>
                <div class="project-links">
                    <a href="${project.liveLink}" target="_blank" class="project-link live">
                        <i class="fas fa-external-link-alt"></i> Live Demo
                    </a>
                    <a href="${project.githubLink}" target="_blank" class="project-link github">
                        <i class="fab fa-github"></i> View Code
                    </a>
                </div>
            </div>
        `

    projectGrid.appendChild(projectCard)

    // Animate cards
    setTimeout(() => {
      projectCard.style.transition = "opacity 0.5s ease, transform 0.5s ease"
      projectCard.style.opacity = "1"
      projectCard.style.transform = "translateY(0)"
    }, index * 200)
  })
}

// Handle form submission with animation
const contactForm = document.getElementById("contactForm")
contactForm.addEventListener("submit", async (e) => {
  e.preventDefault()
  const submitButton = contactForm.querySelector(".submit-button")

  // Animate button
  submitButton.style.transform = "scale(0.95)"
  submitButton.innerHTML = '<span>Sending...</span> <i class="fas fa-spinner fa-spin"></i>'

  try {
    // Simulate sending (replace with actual API call)
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Success animation
    submitButton.style.backgroundColor = "#10B981"
    submitButton.innerHTML = '<span>Message Sent!</span> <i class="fas fa-check"></i>'

    // Reset form
    e.target.reset()

    // Reset button after delay
    setTimeout(() => {
      submitButton.style.transform = ""
      submitButton.style.backgroundColor = ""
      submitButton.innerHTML = '<span>Send Message</span> <i class="fas fa-paper-plane"></i>'
    }, 2000)
  } catch (error) {
    // Error handling
    submitButton.style.backgroundColor = "#EF4444"
    submitButton.innerHTML = '<span>Error! Try Again</span> <i class="fas fa-exclamation-circle"></i>'

    setTimeout(() => {
      submitButton.style.transform = ""
      submitButton.style.backgroundColor = ""
      submitButton.innerHTML = '<span>Send Message</span> <i class="fas fa-paper-plane"></i>'
    }, 2000)
  }
})

// Smooth scroll for navigation links
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault()
    document.querySelector(this.getAttribute("href")).scrollIntoView({
      behavior: "smooth",
    })
  })
})

// Create particles for background animation
function createParticles() {
  const hero = document.querySelector(".hero")
  const particleCount = 30

  for (let i = 0; i < particleCount; i++) {
    const particle = document.createElement("div")
    particle.className = "particle"

    // Random styling
    particle.style.width = Math.random() * 5 + 3 + "px"
    particle.style.height = particle.style.width
    particle.style.background = `rgba(${Math.random() * 100 + 100}, ${Math.random() * 100 + 100}, 255, ${Math.random() * 0.3 + 0.1})`

    // Random position
    particle.style.left = Math.random() * 100 + "vw"
    particle.style.top = Math.random() * 100 + "vh"

    // Animation
    particle.style.animation = `float ${Math.random() * 10 + 10}s linear infinite`
    particle.style.opacity = "0"

    hero.appendChild(particle)

    // Delayed appearance
    setTimeout(() => {
      particle.style.transition = "opacity 1s ease"
      particle.style.opacity = Math.random() * 0.5 + 0.1
    }, Math.random() * 1000)
  }
}

// Initialize
document.addEventListener("DOMContentLoaded", () => {
  renderProjects()
  handleScroll() // Initialize active section
  createParticles() // Add particle animation

  // Mobile menu toggle
  const mobileMenuToggle = document.getElementById("mobileMenuToggle")
  const navLinks = document.getElementById("navLinks")

  mobileMenuToggle.addEventListener("click", () => {
    navLinks.classList.toggle("active")
    const icon = mobileMenuToggle.querySelector("i")
    if (navLinks.classList.contains("active")) {
      icon.className = "fas fa-times"
      mobileMenuToggle.style.transform = "rotate(90deg)"
    } else {
      icon.className = "fas fa-bars"
      mobileMenuToggle.style.transform = "rotate(0deg)"
    }
  })

  // Close mobile menu when a link is clicked
  document.querySelectorAll(".nav-link").forEach((link) => {
    link.addEventListener("click", () => {
      if (window.innerWidth <= 768) {
        navLinks.classList.remove("active")
        mobileMenuToggle.querySelector("i").className = "fas fa-bars"
        mobileMenuToggle.style.transform = "rotate(0deg)"
      }
    })
  })

  // Add entrance animation for the header
  const navbar = document.getElementById("navbar")
  navbar.style.transform = "translateY(-100%)"
  navbar.style.opacity = "0"

  setTimeout(() => {
    navbar.style.transition = "transform 0.5s ease, opacity 0.5s ease"
    navbar.style.transform = "translateY(0)"
    navbar.style.opacity = "1"
  }, 300)

  // Initial reveal of sections that are already in view
  revealSections()

  // Carousel functionality
  const slider = document.querySelector('.project-slider');
  const prevButton = document.querySelector('.carousel-button.prev');
  const nextButton = document.querySelector('.carousel-button.next');
  const projects = document.querySelectorAll('.project-card');

  let currentSlide = 0;

  // Function to go to a specific slide
  function goToSlide(slideIndex) {
      if (slideIndex < 0) {
          currentSlide = projects.length - 1;
      } else if (slideIndex >= projects.length) {
          currentSlide = 0;
      } else {
          currentSlide = slideIndex;
      }

      slider.style.transform = `translateX(-${currentSlide * 100}%)`;
  }

  // Event listener for previous button
  prevButton.addEventListener('click', () => {
      goToSlide(currentSlide - 1);
  });

  // Event listener for next button
  nextButton.addEventListener('click', () => {
      goToSlide(currentSlide + 1);
  });

  // Optional: Auto-advance slides every 5 seconds
  setInterval(() => {
      goToSlide(currentSlide + 1);
  }, 5000);
})