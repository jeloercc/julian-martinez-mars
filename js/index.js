/* ============================================================
   Julian Martinez, portfolio
   ============================================================ */

const GITHUB_USER = 'jeloercc';

/* Escape anything that comes from a network response or a form field
   before it reaches innerHTML. */
function escapeHTML(value) {
    return String(value)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

/* ------------------------------------------------------------
   Footer
   ------------------------------------------------------------ */
const body = document.querySelector('body');
body.appendChild(document.createElement('footer'));

const today = new Date();
const thisYear = today.getFullYear();

const footer = document.querySelector('footer');
footer.innerHTML = `
    <div class="footer-inner">
        <p>&copy; ${thisYear} Julian Martinez, class mars</p>
        <a class="footer-top" href="#top">Back to top</a>
    </div>
`;

/* ------------------------------------------------------------
   Skills, grouped so the two disciplines read separately
   ------------------------------------------------------------ */
const skillGroups = [
    {
        title: 'Engineering & cloud',
        items: ['HTML', 'CSS', 'JavaScript', 'React', 'MCP', 'AWS', 'Google Cloud', 'Docker']
    },
    {
        title: 'Measurement & quality',
        items: ['Metrology', 'ISO/IEC 17025', 'Calibration', 'Quality management', 'Data analysis']
    },
    {
        title: 'How I work',
        items: ['Problem solving', 'Technical support', 'Team collaboration']
    }
];

const skillsContainer = document.querySelector('.skills-groups');

for (let i = 0; i < skillGroups.length; i++) {
    const group = document.createElement('div');
    group.className = 'skill-group';

    const heading = document.createElement('h3');
    heading.textContent = skillGroups[i].title;
    group.appendChild(heading);

    const list = document.createElement('ul');
    for (let j = 0; j < skillGroups[i].items.length; j++) {
        const skill = document.createElement('li');
        skill.textContent = skillGroups[i].items[j];
        list.appendChild(skill);
    }

    group.appendChild(list);
    skillsContainer.appendChild(group);
}

/* GitHub content is coordinated by the deep portfolio module. */
createPortfolio({
    github: createGitHubAdapter(GITHUB_USER),
    document
}).load();

/* ------------------------------------------------------------
   Connect
   ------------------------------------------------------------ */
/* Icon paths taken verbatim from Tabler Icons (outline set, MIT).
   One family, one stroke weight, no hand-drawn paths.
   Source: https://tabler.io/icons  */
const TABLER_ATTRS =
    'viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" ' +
    'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"';

const ICONS = {
    github: `<svg ${TABLER_ATTRS}><path d="M9 19c-4.3 1.4 -4.3 -2.5 -6 -3m12 5v-3.5c0 -1 .1 -1.4 -.5 -2c2.8 -.3 5.5 -1.4 5.5 -6a4.6 4.6 0 0 0 -1.3 -3.2a4.2 4.2 0 0 0 -.1 -3.2s-1.1 -.3 -3.5 1.3a12.3 12.3 0 0 0 -6.2 0c-2.4 -1.6 -3.5 -1.3 -3.5 -1.3a4.2 4.2 0 0 0 -.1 3.2a4.6 4.6 0 0 0 -1.3 3.2c0 4.6 2.7 5.7 5.5 6c-.6 .6 -.6 1.2 -.5 2v3.5"/></svg>`,
    linkedin: `<svg ${TABLER_ATTRS}><path d="M8 11v5"/><path d="M8 8v.01"/><path d="M12 16v-5"/><path d="M16 16v-3a2 2 0 1 0 -4 0"/><path d="M3 7a4 4 0 0 1 4 -4h10a4 4 0 0 1 4 4v10a4 4 0 0 1 -4 4h-10a4 4 0 0 1 -4 -4l0 -10"/></svg>`
};

const connectLinks = [
    {
        name: 'GitHub',
        handle: `@${GITHUB_USER}`,
        url: `https://github.com/${GITHUB_USER}`,
        icon: ICONS.github
    },
    {
        name: 'LinkedIn',
        handle: 'Julian Martinez',
        url: 'https://www.linkedin.com/in/julian-martinez-559492201/',
        icon: ICONS.linkedin
    }
];

const connectList = document.querySelector('.connect-list');

for (let i = 0; i < connectLinks.length; i++) {
    const item = document.createElement('li');
    item.innerHTML = `
        <a href="${connectLinks[i].url}" target="_blank" rel="noopener">
            ${connectLinks[i].icon}
            <span>${connectLinks[i].name}</span>
            <span class="connect-handle">${escapeHTML(connectLinks[i].handle)}</span>
        </a>
    `;
    connectList.appendChild(item);
}

/* ------------------------------------------------------------
   Message form
   ------------------------------------------------------------ */
const messageForm = document.forms.leave_message;
const messageSection = document.getElementById('messages');
const messageList = messageSection.querySelector('ul');
const formStatus = document.getElementById('form-status');

messageSection.hidden = true;

const VALIDATORS = {
    usersName: value => (value.trim().length < 2
        ? 'Please enter your name.'
        : ''),
    usersEmail: value => {
        if (!value.trim()) return 'Please enter your email address.';
        return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value.trim())
            ? ''
            : 'That email address does not look right.';
    },
    usersMessage: value => (value.trim().length < 4
        ? 'Please write a short message.'
        : '')
};

function setFieldError(field, message) {
    const wrapper = field.closest('.field');
    const errorEl = document.getElementById(`${field.name}-error`);

    wrapper.classList.toggle('has-error', Boolean(message));
    field.setAttribute('aria-invalid', message ? 'true' : 'false');
    if (message) {
        field.setAttribute('aria-describedby', `${field.name}-error`);
    } else {
        field.removeAttribute('aria-describedby');
    }
    errorEl.textContent = message;
}

function validateField(field) {
    const validate = VALIDATORS[field.name];
    if (!validate) return true;

    const message = validate(field.value);
    setFieldError(field, message);
    return message === '';
}

Object.keys(VALIDATORS).forEach(name => {
    const field = messageForm.elements[name];

    // Only nag after the field has been touched once.
    field.addEventListener('blur', () => validateField(field));
    field.addEventListener('input', () => {
        if (field.closest('.field').classList.contains('has-error')) {
            validateField(field);
        }
    });
});

messageForm.addEventListener('submit', function (event) {
    event.preventDefault();

    const fields = Object.keys(VALIDATORS).map(name => messageForm.elements[name]);
    const firstInvalid = fields.filter(field => !validateField(field))[0];

    if (firstInvalid) {
        formStatus.classList.remove('is-visible');
        firstInvalid.focus();
        return;
    }

    const usersName = event.target.usersName.value.trim();
    const usersEmail = event.target.usersEmail.value.trim();
    const usersMessage = event.target.usersMessage.value.trim();

    messageSection.hidden = false;

    const newMessage = document.createElement('li');

    // innerHTML per the assignment instructions, with values escaped first.
    newMessage.innerHTML =
        `<span><a href="mailto:${escapeHTML(usersEmail)}">${escapeHTML(usersName)}</a>` +
        `<span>: ${escapeHTML(usersMessage)}</span></span>`;

    const removeButton = document.createElement('button');
    removeButton.innerText = 'remove';
    removeButton.type = 'button';
    removeButton.setAttribute('aria-label', `Remove the message from ${usersName}`);

    removeButton.addEventListener('click', function () {
        removeButton.parentNode.remove();
        if (messageList.children.length === 0) {
            messageSection.hidden = true;
        }
    });

    newMessage.appendChild(removeButton);
    messageList.appendChild(newMessage);

    messageForm.reset();
    fields.forEach(field => setFieldError(field, ''));

    formStatus.textContent = 'Message added below.';
    formStatus.classList.add('is-visible');
});

/* ------------------------------------------------------------
   Navigation state and scroll reveals
   ------------------------------------------------------------ */
const nav = document.getElementById('site-nav');
// the brand link also points at an anchor, but it is not a section indicator
const navLinks = Array.from(nav.querySelectorAll('ul a[href^="#"]'));

/* A sentinel at the top of the document reports when the page has scrolled,
   so the nav never runs work on the scroll thread. */
const navSentinel = document.getElementById('nav-sentinel');
new IntersectionObserver(
    entries => nav.classList.toggle('is-stuck', !entries[0].isIntersecting)
).observe(navSentinel);

const sectionsById = {};
navLinks.forEach(link => {
    const section = document.querySelector(link.getAttribute('href'));
    if (section) sectionsById[section.id] = link;
});

const spy = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        navLinks.forEach(link => link.classList.remove('is-active'));
        const link = sectionsById[entry.target.id];
        if (link) link.classList.add('is-active');
    });
}, { rootMargin: '-45% 0px -50% 0px' });

Object.keys(sectionsById).forEach(id => {
    const section = document.getElementById(id);
    if (section) spy.observe(section);
});

/* Staggered entry, so a section never mounts all at once. */
const prefersReducedMotion =
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
    });
}, { rootMargin: '0px 0px -8% 0px', threshold: 0.05 });

function revealChildren(container) {
    if (prefersReducedMotion) return;
    Array.from(container.children).forEach((child, index) => {
        child.classList.add('reveal');
        child.style.setProperty('--reveal-delay', `${Math.min(index, 6) * 60}ms`);
        revealObserver.observe(child);
    });
}

if (!prefersReducedMotion) {
    document.querySelectorAll('.section-head, .section-body').forEach(el => {
        el.classList.add('reveal');
        revealObserver.observe(el);
    });
}
