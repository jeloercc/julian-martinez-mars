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

    //Handle Message Form Submit & Display Messages
    const messageForm = document.forms.leave_message;

  messageForm.addEventListener('submit', function(event) {
    event.preventDefault();
    const usersName = event.target.usersName.value;
    const usersEmail = event.target.usersEmail.value;
    const usersMessage = event.target.usersMessage.value;
    
    console.log(usersName, usersEmail, usersMessage);
    
    //Display messages in list 
    const messageSection = document.getElementById('messages');
    const messageList = messageSection.querySelector('ul');
    const newMessage = document.createElement('li');
    
    // I used innerHTML because the  Coding Assignment instruccions
    newMessage.innerHTML = `<a href="mailto:${usersEmail}">${usersName}</a><span>: ${usersMessage}</span>`;

    const removeButton = document.createElement('button');
    removeButton.innerText = 'remove';
    removeButton.type = 'button';


    removeButton.addEventListener('click', function() {
        const entry = removeButton.parentNode;
        entry.remove();
    });

    newMessage.appendChild(removeButton);
    messageList.appendChild(newMessage);
    messageForm.reset();
});