const AboutData = [
  {
    id: 'intro',
    layout: 'center',
    header: 'I build cool things.',
    subheader: "Sometimes on the web, sometimes in my garage, and sometimes on a server rack in my basement. I'm Nate, a developer who just really, really likes to make things work.",
    image: {
      url: 'http://github.com/natesheridan.png',
      imgStyle: 'profile-image',
    },
  },
  {
    id: 'origin-story',
    layout: 'center-fullscreen',
    header: 'It Started with a Hacked Minecraft Client',
    subheader: "My journey into tech wasn't exactly... orthodox. It involved late nights, a lot of questionable code, and my parents wondering why I wasn't doing my homework. Turns out, trying to get a hacked Minecraft client to run on the family PC was a masterclass in debugging, networking, and creative problem-solving.",
    component: {
      name: 'Terminal',
      props: {
        text: 'system.log("This is where I learned the magic of turning broken hardware into a working machine. It was a puzzle, a challenge, and a thrill.");',
      },
    },
  },
  {
    id: 'homelab',
    layout: 'right',
    header: 'The Accidental DevOps Engineer',
    content: "That 'nerding out' never stopped. It evolved into a full-blown homelab with containerized services, load-balanced servers, and a custom DNS setup. I didn't know it at the time, but I was teaching myself the fundamentals of DevOps, all because I wanted to host my own game servers and Plex library.",
    background: {
      url: 'https://images.unsplash.com/photo-1580894908361-967195033215?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80',
    }
  },
  {
    id: 'turing-school',
    layout: 'center-fullscreen',
    header: 'From Hobbyist to Professional',
    subheader: 'Turing School took my chaotic, self-taught skills and forged them into a professional toolkit. It was there I learned that building for the web was my true passion.',
    component: {
      name: 'SkillsChart',
      props: {
        skills: [
          { name: 'React', level: 90 },
          { name: 'JavaScript', level: 85 },
          { name: 'CSS', level: 95 },
          { name: 'HTML', level: 95 },
          { name: 'Node.js', level: 75 },
        ],
      },
    },
  },
  {
    id: 'cars-and-photos',
    layout: 'split',
    left: {
      header: 'Wrenching & Shooting',
      content: 'When I\'m not coding, I\'m either in the garage turning wrenches or behind a camera, trying to capture the perfect shot. Both are just different ways to build something beautiful and functional. It\'s all about the details, whether it\'s a perfectly tuned engine or a perfectly edited photo.',
      component: {
        name: 'CarSvg',
      },
    },
    right: {
        header: 'A Different Kind of Debugging',
        content: 'Photography is another form of problem-solving for me. Finding the right angle, the perfect lighting, the moment that tells a story—it\'s not that different from debugging code or tuning an engine.',
    }
  },
  {
    id: 'hire-me',
    layout: 'center',
    header: 'I\'m Looking for My Next Challenge.',
    subheader: 'I\'m actively seeking a role where I can bring my unique blend of creativity, technical skill, and obsessive problem-solving to a team that\'s passionate about building great things.',
    link: {
      url: 'https://www.n8s.pw/assets/ResumeNoPhone.pdf',
      title: 'View My Resume',
    },
  },
];

export default AboutData;