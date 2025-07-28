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
    header: 'It All Started with a Little "Creative Problem-Solving"',
    subheader: "My journey into tech began not in a classroom, but in the digital trenches of online games. I was the kid figuring out how to get unlimited coins in Club Penguin and building undetectable hacked clients for Minecraft. It wasn't about cheating; it was about the thrill of understanding a system so well you could bend its rules. That curiosity eventually led me to hosting my own load-balanced game servers, a venture I was proud to break even on—a true baptism by fire in the world of networking and system administration.",
    component: {
      name: 'Terminal',
      props: {
        text: 'system.log("Reverse-engineering game protocols taught me more about networking than any textbook ever could.");',
      },
    },
  },
  {
    id: 'turing-school',
    layout: 'center-fullscreen',
    header: 'Forged in the Fires of an 80-Hour Week',
    subheader: "Turing School of Software & Design wasn't just a bootcamp; it was a crucible. As part of the first nationally accredited program of its kind, I dove headfirst into an intense, 80-hour-a-week curriculum that transformed my self-taught hacking skills into a professional engineering toolkit. It was there that I truly discovered my passion for building elegant, user-centric web applications.",
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
    id: 'servicelogix-experience',
    layout: 'right',
    header: 'From Theory to Practice: A Different Kind of Challenge',
    content: "My time at ServiceLogix was a crash course in the world of enterprise software. I quickly went from intern to full-time engineer, tasked with modernizing and supporting systems built on established, powerful technologies. While I value the deep understanding I gained working with legacy codebases and contributing to mission-critical government applications, I also discovered that my true passion lies in the fast-paced, ever-evolving world of modern web development. I thrive on building for the user, and I'm eager to bring my skills to a team that shares that same focus.",
    background: {
      url: 'https://images.unsplash.com/photo-1607743386760-88ac62b89b8a?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    }
  },
  {
    id: 'ai-experience',
    layout: 'center-fullscreen',
    header: 'AI as a Tool, Not a Crutch',
    subheader: "I've been working with AI for over five years, long before it became the phenomenon it is today. I have experience deploying local models, training my own, and integrating them into development workflows to boost efficiency. I see AI not as a replacement for developers, but as a powerful tool that, when wielded correctly, can amplify our abilities. I understand the nuances of the technology and know that while AI is a powerful ally, it's not a silver bullet. My deep understanding of core programming principles allows me to discern when a modern framework like React is the right choice, and when a lighter-weight option like Preact—which this very site is built on—is the more prudent path. My goal is always to leverage tools like AI to build better, more efficient applications without sacrificing the quality or integrity of the code.",
  },
  {
    id: 'autofocus-project',
    layout: 'center-fullscreen',
    header: 'Autofoc.us: My Answer to Social Media',
    subheader: "I built Autofoc.us because I needed one unified space to share details about all my focuses—from camera gear to 4Runner mods. Frustrated with the shallow, scattered nature of social media, I decided to rebuild Linktree™... but with adderall cooked in. The result is a platform designed for authentic, in-depth sharing. It's built on an infinitely scalable block system that allows creators to break free from character limits and tell their full story, all shared through a single, simple link. It's my personal vision for what content sharing should be: simple, powerful, and authentic.",
    link: {
      url: 'https://www.autofoc.us',
      title: 'View the Project',
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
    id: 'photo-gallery',
    layout: 'center-fullscreen',
    header: 'Photography',
    component: {
      name: 'ImageSwiper'
    }
  },
  {
    id: 'hire-me',
    layout: 'center',
    header: 'I\'m Looking for My Next Challenge.',
    subheader: 'I\'m actively seeking a role where I can bring my unique blend of creativity, technical skill, and obsessive problem-solving to a team that\'s passionate about building great things. Ambitious projects like Autofoc.us are just a glimpse of what I love to create from the ground up.',
    link: {
      url: 'https://www.n8s.pw/assets/ResumeNoPhone.pdf',
      title: 'View My Resume',
    },
    background: {
      url: 'https://images.unsplash.com/photo-1523821741446-edb2b68bb7a0?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
    }
  },
];

export default AboutData;