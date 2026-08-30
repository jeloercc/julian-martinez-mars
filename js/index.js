// footer element 

const body = document.querySelector('body');
body.appendChild(document.createElement('footer'));
// copyright with current year
const today = new Date();
const thisYear = today.getFullYear();

const footer = document.querySelector('footer');
const copyright= document.createElement('p');
copyright.textContent = `© Julian Martinez - class mars ${thisYear}`;
footer.appendChild(copyright);

// skills 
const skills = ['HTML', 'CSS', 'JavaScript', 'React', 'MCP', 'AWS', "Google Cloud", "Docker", "Metrology", "data analysis", "problem-solving", "ISO/IEC 17025", "quality management", "calibration", "technical support", "team collaboration"];
const skillsSection = document.querySelector('#skills');
const skillsList = skillsSection.querySelector('ul');

for (let i = 0; i < skills.length; i++) {
    const skill = document.createElement('li');
    skill.textContent = skills[i];
    skillsList.appendChild(skill);
    }


// social media links
const connectLinks = [
  { name: 'GitHub', url: 'https://github.com/jeloercc', icon: 'fa-brands fa-github-alt' },
  { name: 'LinkedIn', url: 'https://www.linkedin.com/in/julian-martinez-559492201/', icon: 'fa-brands fa-linkedin' }
];
const connectSection = document.querySelector('#connect');
const connectList = connectSection.querySelector('ul');

for (let i = 0; i < connectLinks.length; i++) {
    const linkItem = document.createElement('li');
    const link = document.createElement('a');
    
    link.href = connectLinks[i].url;
    link.target = "_blank";
    link.textContent = " " + connectLinks[i].name;

    const icon = document.createElement('i');
    icon.className = connectLinks[i].icon;
    
    link.prepend(icon);
    linkItem.appendChild(link);
    connectList.appendChild(linkItem);
    }

    // --- Pro Contact Form via Web3Forms API ---
    const contactForm = document.getElementById('contact-form');
    const resultDiv = document.getElementById('form-result');
    const submitButton = document.getElementById('submit-button');
    const buttonText = submitButton.querySelector('.button-text');
    const loader = submitButton.querySelector('.loader');

    contactForm.addEventListener('submit', async function(event) {
        event.preventDefault();

        // Show loading state
        buttonText.style.display = 'none';
        loader.style.display = 'inline-block';
        submitButton.disabled = true;
        resultDiv.textContent = 'Sending message...';
        resultDiv.className = '';

        const formData = new FormData(contactForm);

        try {
            const response = await fetch('https://api.web3forms.com/submit', {
                method: 'POST',
                body: formData
            });
            const data = await response.json();

            if (data.success) {
                resultDiv.textContent = 'Message sent successfully! I will get back to you soon.';
                resultDiv.className = 'text-success';
                contactForm.reset();
            } else {
                resultDiv.textContent = data.message || 'Something went wrong. Please try again.';
                resultDiv.className = 'text-error';
            }
        } catch (error) {
            console.error('Error submitting form:', error);
            resultDiv.textContent = 'Network error. Please try again later.';
            resultDiv.className = 'text-error';
        } finally {
            // Restore button state
            buttonText.style.display = 'inline-block';
            loader.style.display = 'none';
            submitButton.disabled = false;

            // Clear message after 5 seconds
            setTimeout(() => {
                resultDiv.textContent = '';
                resultDiv.className = '';
            }, 5000);
        }
    });

    // --- WorldTime API Logic ---
    async function updateLocalTime() {
        const timeDisplay = document.getElementById('local-time');
        try {
            // Using a public API for New York/Raleigh time (EST/EDT)
            const response = await fetch('https://worldtimeapi.org/api/timezone/America/New_York');
            if (!response.ok) throw new Error('Time API failed');
            const data = await response.json();

            // Parse the datetime string
            const date = new Date(data.datetime);

            // Format to hh:mm AM/PM enforcing the targeted timezone
            const formattedTime = date.toLocaleTimeString('en-US', {
                timeZone: 'America/New_York',
                hour: 'numeric',
                minute: '2-digit',
                hour12: true
            });

            timeDisplay.textContent = formattedTime;
        } catch (error) {
            console.error('Error fetching time:', error);
            timeDisplay.textContent = 'Active Now';
        }
    }

    // Initial time load and update every minute
    updateLocalTime();
    setInterval(updateLocalTime, 60000);

// --- Typewriter Effect for Hero Section ---
const typewriterText = "sys.init();"; // The text to type
const typeSpeed = 100; // ms per char
const typeTarget = document.getElementById('typewriter');
let typeIndex = 0;

function typeWriter() {
    if (typeIndex < typewriterText.length) {
        typeTarget.textContent += typewriterText.charAt(typeIndex);
        typeIndex++;
        setTimeout(typeWriter, typeSpeed);
    }
}

// Start typing effect on load
window.addEventListener('load', () => {
    setTimeout(typeWriter, 500); // Wait 0.5s before starting
});

// --- Scroll to Top Button ---
const scrollToTopBtn = document.getElementById('scroll-to-top');
window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
        scrollToTopBtn.classList.add('visible');
    } else {
        scrollToTopBtn.classList.remove('visible');
    }
});

scrollToTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

// --- Scroll Spy & Boot-up Animations ---
const sections = document.querySelectorAll('section');
const navLinks = document.querySelectorAll('nav ul li a');

const observerOptions = {
    root: null,
    rootMargin: '0px 0px -50px 0px',
    threshold: 0.15
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            // Highlight nav link
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href').substring(1) === entry.target.id) {
                    link.classList.add('active');
                }
            });

            // Trigger Boot-up animation on panels
            if (entry.target.classList.contains('panel') && !entry.target.classList.contains('booted')) {
                // Add a small random delay for a more organic "system loading" feel
                setTimeout(() => {
                    entry.target.classList.add('booted');
                }, Math.random() * 200);
            }
        }
    });
}, observerOptions);

sections.forEach(section => {
    observer.observe(section);
});

// --- Hamburger Menu ---
const menuToggle = document.querySelector('.menu-toggle');
const primaryNavigation = document.getElementById('primary-navigation');

menuToggle.addEventListener('click', () => {
    const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
    menuToggle.setAttribute('aria-expanded', !isExpanded);
    primaryNavigation.classList.toggle('expanded');
});

// Close menu when clicking a link (mobile)
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        if (window.innerWidth <= 480) {
            menuToggle.setAttribute('aria-expanded', 'false');
            primaryNavigation.classList.remove('expanded');
        }
    });
});

// --- Projects Section (GitHub API with caching, skeleton, filter, search) ---
const projectSection = document.getElementById('projects');
const projectList = document.getElementById('project-list');
const searchInput = document.getElementById('project-search');
const filterSelect = document.getElementById('project-filter');
const statusDiv = document.getElementById('projects-status');

let allProjects = [];

// Show skeleton loader
function showSkeleton() {
    projectList.innerHTML = '';
    for (let i = 0; i < 6; i++) {
        const li = document.createElement('li');
        li.innerHTML = `
            <div class="skeleton skeleton-text" style="width: 80%; height: 1.5rem;"></div>
            <div class="skeleton skeleton-text" style="width: 100%;"></div>
            <div class="skeleton skeleton-text" style="width: 90%;"></div>
            <div class="skeleton skeleton-text" style="width: 40%; margin-top: auto;"></div>
        `;
        projectList.appendChild(li);
    }
}

// Render projects based on search and filter
function renderProjects(projects) {
    projectList.innerHTML = ''; // Clear list

    if (projects.length === 0) {
        projectList.innerHTML = '<li>No projects found matching your criteria.</li>';
        statusDiv.textContent = 'No projects found.';
        return;
    }

    projects.forEach(repo => {
        const project = document.createElement('li');

        // Link to repo
        const link = document.createElement('a');
        link.href = repo.html_url;
        link.target = "_blank";
        link.rel = "noopener noreferrer";
        link.textContent = repo.name.replace(/-/g, ' '); // Beautify name

        // Description
        const desc = document.createElement('p');
        desc.className = 'project-desc';
        desc.textContent = repo.description || 'No description available.';

        // Language
        const lang = document.createElement('span');
        lang.className = 'project-lang';
        lang.textContent = repo.language || 'Multiple/Other';

        project.appendChild(link);
        project.appendChild(desc);
        project.appendChild(lang);

        projectList.appendChild(project);
    });

    statusDiv.textContent = `Showing ${projects.length} projects.`;
}

// Extract unique languages and populate filter
function populateFilters(projects) {
    const languages = new Set();
    projects.forEach(p => {
        if (p.language) languages.add(p.language);
    });

    languages.forEach(lang => {
        const option = document.createElement('option');
        option.value = lang;
        option.textContent = lang;
        filterSelect.appendChild(option);
    });
}

// Handle search and filter changes
function handleFilters() {
    const searchTerm = searchInput.value.toLowerCase();
    const selectedLang = filterSelect.value;

    const filteredProjects = allProjects.filter(project => {
        const matchesSearch = project.name.toLowerCase().includes(searchTerm) ||
                              (project.description && project.description.toLowerCase().includes(searchTerm));
        const matchesLang = selectedLang === 'all' || project.language === selectedLang;

        return matchesSearch && matchesLang;
    });

    renderProjects(filteredProjects);
}

searchInput.addEventListener('input', handleFilters);
filterSelect.addEventListener('change', handleFilters);

// Fetch data
async function loadProjects() {
    showSkeleton();

    const cacheKey = 'github_projects_cache';
    const cacheTimeKey = 'github_projects_cache_time';
    const cacheDuration = 60 * 60 * 1000; // 1 hour

    const cachedData = localStorage.getItem(cacheKey);
    const cachedTime = localStorage.getItem(cacheTimeKey);

    if (cachedData && cachedTime && (Date.now() - parseInt(cachedTime)) < cacheDuration) {
        // Use cached data
        allProjects = JSON.parse(cachedData);
        populateFilters(allProjects);
        renderProjects(allProjects);
        return;
    }

    try {
        const response = await fetch('https://api.github.com/users/jeloercc/repos?sort=updated');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        allProjects = await response.json();

        // Exclude forks if desired (optional, left out to match original behavior of all repos)
        // allProjects = allProjects.filter(repo => !repo.fork);

        // Cache data
        localStorage.setItem(cacheKey, JSON.stringify(allProjects));
        localStorage.setItem(cacheTimeKey, Date.now().toString());

        populateFilters(allProjects);
        renderProjects(allProjects);
    } catch (error) {
        console.error('Error fetching data:', error);
        projectList.innerHTML = '<li>Error loading projects. Please try again later.</li>';
        statusDiv.textContent = 'Error loading projects.';
    }
}

// Init projects fetch
loadProjects();

// --- GitHub Activity Feed ---
async function loadGitHubActivity() {
    const activityList = document.getElementById('activity-list');
    const statusDiv = document.getElementById('activity-status');
    const cacheKey = 'github_activity_cache';
    const cacheTimeKey = 'github_activity_time';

    // Skeleton for activity
    activityList.innerHTML = '';
    for(let i=0; i<3; i++) {
        activityList.innerHTML += `
            <li class="activity-item">
                <div class="skeleton skeleton-text" style="width: 30%;"></div>
                <div class="skeleton skeleton-text" style="width: 70%;"></div>
                <div class="skeleton skeleton-text" style="width: 40%;"></div>
            </li>
        `;
    }

    const cachedData = localStorage.getItem(cacheKey);
    const cachedTime = localStorage.getItem(cacheTimeKey);

    if (cachedData && cachedTime && (Date.now() - parseInt(cachedTime)) < 300000) { // 5 min cache
        renderActivity(JSON.parse(cachedData), activityList, statusDiv);
        return;
    }

    try {
        const response = await fetch('https://api.github.com/users/jeloercc/events/public?per_page=5');
        if (!response.ok) throw new Error('Network response was not ok');
        const events = await response.json();

        localStorage.setItem(cacheKey, JSON.stringify(events));
        localStorage.setItem(cacheTimeKey, Date.now().toString());

        renderActivity(events, activityList, statusDiv);
    } catch (error) {
        console.error('Error fetching GitHub activity:', error);
        activityList.innerHTML = '<li class="activity-item">Unable to load recent activity.</li>';
    }
}

function renderActivity(events, container, status) {
    container.innerHTML = '';
    if (!events || events.length === 0) {
        container.innerHTML = '<li class="activity-item">No recent public activity found.</li>';
        return;
    }

    // Map GitHub event types to user-friendly strings
    const eventTypeMap = {
        'PushEvent': 'Pushed code to',
        'CreateEvent': 'Created repository',
        'WatchEvent': 'Starred repository',
        'ForkEvent': 'Forked repository',
        'IssuesEvent': 'Opened an issue in',
        'PullRequestEvent': 'Opened a PR in'
    };

    events.slice(0, 3).forEach(event => {
        const li = document.createElement('li');
        li.className = 'activity-item';

        const action = eventTypeMap[event.type] || 'Interacted with';
        const date = new Date(event.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });

        li.innerHTML = `
            <span class="activity-type">${action}</span>
            <a href="https://github.com/${event.repo.name}" target="_blank" rel="noopener noreferrer" class="activity-repo">
                ${event.repo.name}
            </a>
            <span class="activity-date">${date}</span>
        `;
        container.appendChild(li);
    });
    status.textContent = 'GitHub activity loaded.';
}

// --- Dev.to Articles Integration ---
async function loadArticles() {
    const articlesContainer = document.getElementById('articles-container');
    const statusDiv = document.getElementById('articles-status');
    const username = 'jeloercc'; // Can be changed if username is different on Dev.to

    // Skeleton
    articlesContainer.innerHTML = `
        <div class="article-card">
            <div class="skeleton skeleton-text" style="width: 100%; height: 1.5rem;"></div>
            <div class="skeleton skeleton-text" style="width: 50%;"></div>
        </div>
        <div class="article-card">
            <div class="skeleton skeleton-text" style="width: 100%; height: 1.5rem;"></div>
            <div class="skeleton skeleton-text" style="width: 50%;"></div>
        </div>
    `;

    try {
        const response = await fetch(`https://dev.to/api/articles?username=${username}&per_page=2`);
        if (!response.ok) throw new Error('Dev.to API fetch failed');
        const articles = await response.json();

        articlesContainer.innerHTML = '';

        if (articles.length === 0) {
            articlesContainer.innerHTML = `
                <div class="placeholder-text">
                    <p>No articles published yet. Stay tuned for future tech and metrology insights!</p>
                </div>
            `;
            statusDiv.textContent = 'No articles found.';
            return;
        }

        articles.forEach(article => {
            const card = document.createElement('a');
            card.href = article.url;
            card.className = 'article-card';
            card.target = '_blank';
            card.rel = 'noopener noreferrer';

            card.innerHTML = `
                <h3 class="article-title">${article.title}</h3>
                <div class="article-meta">
                    <span><i class="fa-solid fa-heart"></i> ${article.public_reactions_count}</span>
                    <span>${article.reading_time_minutes} min read</span>
                </div>
            `;
            articlesContainer.appendChild(card);
        });
        statusDiv.textContent = 'Articles loaded.';

    } catch (error) {
        console.error('Error fetching articles:', error);
        articlesContainer.innerHTML = `
            <div class="placeholder-text">
                <p>No articles published yet. Stay tuned for future insights!</p>
            </div>
        `;
    }
}

// Initialize new integrations
loadGitHubActivity();
loadArticles();