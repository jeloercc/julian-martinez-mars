// footer element 

const body = document.querySelector('body');
body.appendChild(document.createElement('footer'));
// copyright with current year
const today = new Date();
const thisYear = today.getFullYear();

const footer = document.querySelector('footer');
const copyright= document.createElement('p');
copyright.innerHTML = `&copy; Julian Martinez - class mars ${thisYear}`;
footer.appendChild(copyright);

// skills 
const skills = ['HTML', 'CSS', 'JavaScript', 'React', 'MCP', 'AWS', "Google Cloud", "Docker", "Metrology", "data analysis", "problem-solving", "ISO/IEC 17025", "quality management", "calibration", "technical support", "team collaboration"];
const skillsSection = document.querySelector('#Skills');
const skillsList = skillsSection.querySelector('ul');

for (let i = 0; i < skills.length; i++) {
    const skill = document.createElement('li');
    skill.innerHTML = skills[i];
    skillsList.appendChild(skill);
    }
// social media links
const connectLinks = [
  { name: 'GitHub', url: 'https://github.com/jeloercc', icon: 'fa-brands fa-github-alt',color: '#333' },
  { name: 'LinkedIn', url: 'https://www.linkedin.com/in/julian-martinez-559492201/', icon: 'fa-brands fa-linkedin' }
];
const connectSection = document.querySelector('#Connect');
const connectList = connectSection.querySelector('ul');

for (let i = 0; i < connectLinks.length; i++) {
    const linkItem = document.createElement('li');
    const link = document.createElement('a');
    
    link.href = connectLinks[i].url;
    link.target = "_blank";
    link.innerText = connectLinks[i].name;

    const icon = document.createElement('i');
    icon.className = connectLinks[i].icon;
    
    link.prepend(icon);
    linkItem.appendChild(link);
    connectList.appendChild(linkItem);
    }