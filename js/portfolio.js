/* GitHub data seam: one small interface for the page, with rendering hidden inside. */
function createGitHubAdapter(user, request = window.fetch.bind(window)) {
    return {
        profileUrl: `https://github.com/${user}`,
        async contributions() {
            const response = await request(
                `https://github-contributions-api.jogruber.de/v4/${user}`
            );
            if (!response.ok) throw new Error(`Contributions request failed (${response.status})`);
            return response.json();
        },
        async repositories() {
            const response = await request(
                `https://api.github.com/users/${user}/repos?per_page=100&sort=pushed`
            );
            if (!response.ok) throw new Error(`GitHub request failed (${response.status})`);
            return response.json();
        }
    };
}

function createPortfolio({ github, document }) {
    const user = github;
    const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
        'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const LANGUAGE_COLORS = {
        JavaScript: '#b58b2f', TypeScript: '#3d6ea8', HTML: '#b5562f',
        CSS: '#5a53a3', Python: '#3f7ca8', Shell: '#5f8a4f'
    };
    const escape = value => String(value)
        .replace(/&/g, '&amp;').replace(/</g, '&lt;')
        .replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
    const parseDay = value => {
        const parts = value.split('-');
        return new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
    };
    const formatDay = day => {
        const date = parseDay(day.date).toLocaleDateString('en-US',
            { month: 'short', day: 'numeric', year: 'numeric' });
        return `${day.count === 1 ? '1 contribution' : `${day.count} contributions`} · ${date}`;
    };
    const weeksFor = days => {
        const weeks = [[]];
        for (let i = 0; i < parseDay(days[0].date).getDay(); i++) weeks[0].push(null);
        days.forEach(day => {
            if (weeks[weeks.length - 1].length === 7) weeks.push([]);
            weeks[weeks.length - 1].push(day);
        });
        while (weeks[weeks.length - 1].length < 7) weeks[weeks.length - 1].push(null);
        return weeks;
    };
    const calendar = (year, days) => {
        const weeks = weeksFor(days);
        const labels = [];
        weeks.forEach(week => {
            const day = week.find(Boolean);
            if (!day) return;
            const month = parseDay(day.date).getMonth();
            const previous = labels[labels.length - 1];
            if (previous && previous.month === month) previous.span++;
            else labels.push({ month, span: 1 });
        });
        const months = labels.map(label =>
            `<span style="grid-column: span ${label.span}">${label.span > 1 ? MONTH_NAMES[label.month] : ''}</span>`
        ).join('');
        const dayLabels = ['', 'Mon', '', 'Wed', '', 'Fri', ''].map(name => `<span>${name}</span>`).join('');
        const cells = weeks.flat().map(day => day
            ? `<span class="calendar-day" data-level="${day.level}" data-date="${day.date}" data-label="${escape(formatDay(day))}"></span>`
            : '<span class="calendar-day is-empty" aria-hidden="true"></span>').join('');
        return `<div class="calendar-year" style="--weeks: ${weeks.length}"><p class="calendar-year-label">${year}</p><div class="calendar-frame"><div class="calendar-months" aria-hidden="true">${months}</div><div class="day-labels" aria-hidden="true">${dayLabels}</div><div class="calendar-days" role="img" aria-label="Contribution activity for ${year}">${cells}</div></div></div>`;
    };
    const renderActivity = data => {
        const target = document.getElementById('contributions-calendar');
        const days = data && data.contributions;
        if (!Array.isArray(days) || !days.length) throw new Error('Contribution data was empty');
        const sorted = days.slice().sort((a, b) => a.date.localeCompare(b.date));
        const total = sorted.reduce((sum, day) => sum + day.count, 0);
        const today = new Date(); today.setHours(0, 0, 0, 0);
        let streak = 0; let skipToday = true;
        for (let i = sorted.length - 1; i >= 0; i--) {
            if (parseDay(sorted[i].date) > today) continue;
            if (sorted[i].count > 0) { streak++; skipToday = false; }
            else if (skipToday) skipToday = false;
            else break;
        }
        const best = sorted.reduce((max, day) => day.count > max.count ? day : max, sorted[0]);
        const byYear = {};
        sorted.forEach(day => (byYear[day.date.slice(0, 4)] ||= []).push(day));
        const years = Object.keys(byYear);
        const span = years.length > 1 ? `across ${years[0]} to ${years[years.length - 1]}` : `in ${years[0]}`;
        document.getElementById('contrib-total').innerHTML = `${total.toLocaleString()}<small>${span}</small>`;
        document.getElementById('contrib-streak').innerHTML = `${streak}<small>${streak === 1 ? 'day' : 'days'} running</small>`;
        document.getElementById('contrib-best').innerHTML = best.count
            ? `${best.count}<small>on ${parseDay(best.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</small>` : 'n/a';
        target.innerHTML = years.slice().reverse().map(year => calendar(year, byYear[year])).join('');
    };
    const renderActivityError = () => {
        document.getElementById('contributions-calendar').innerHTML =
            `<div class="state-block"><h3>Activity data is unavailable</h3><p>The GitHub contributions service did not respond. The repositories below are unaffected.</p><a class="btn btn-quiet" href="${user.profileUrl}" target="_blank" rel="noopener">Open GitHub profile</a></div>`;
        ['contrib-total', 'contrib-streak', 'contrib-best'].forEach(id => {
            document.getElementById(id).textContent = 'n/a';
        });
    };
    const renderRepositories = repositories => {
        const target = document.querySelector('.projects-list');
        if (!Array.isArray(repositories)) {
            renderRepositoryError();
            return;
        }
        const repos = repositories.slice().sort((a, b) => new Date(b.pushed_at) - new Date(a.pushed_at));
        if (!repos.length) {
            target.innerHTML = '<li class="state-block"><h3>No public repositories yet</h3><p>Work in progress. The first projects will show up here as soon as they are pushed.</p></li>';
            return;
        }
        target.innerHTML = repos.map((repo, index) => {
            const language = repo.language ? `<span class="project-lang"><span class="lang-dot" style="background: ${LANGUAGE_COLORS[repo.language] || 'var(--ink-4)'}"></span>${escape(repo.language)}</span>` : '';
            const description = repo.description ? escape(repo.description) : 'No description yet';
            return `<li class="project-card${index === 0 ? ' is-featured' : ''}"><h3><a href="${escape(repo.html_url)}" target="_blank" rel="noopener">${escape(repo.name)}</a></h3><p class="project-desc${repo.description ? '' : ' is-muted'}">${description}</p><p class="project-meta">${language}${repo.stargazers_count ? `<span>${repo.stargazers_count} ★</span>` : ''}<span>Updated ${new Date(repo.pushed_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}</span>${repo.fork ? '<span class="project-fork">fork</span>' : ''}</p></li>`;
        }).join('');
        if (typeof revealChildren === 'function') revealChildren(target);
    };
    const renderRepositoryError = () => {
        document.querySelector('.projects-list').innerHTML =
            `<li class="state-block"><h3>Could not load repositories</h3><p>GitHub did not return the project list. This usually clears up on its own within a few minutes.</p><a class="btn btn-quiet" href="${user.profileUrl}" target="_blank" rel="noopener">Browse them on GitHub</a></li>`;
    };
    return {
        async load() {
            const results = await Promise.allSettled([github.contributions(), github.repositories()]);
            if (results[0].status === 'fulfilled') renderActivity(results[0].value);
            else { console.error('Error fetching contributions:', results[0].reason); renderActivityError(); }
            if (results[1].status === 'fulfilled') renderRepositories(results[1].value);
            else { console.error('Error fetching repositories:', results[1].reason); renderRepositoryError(); }
        }
    };
}
