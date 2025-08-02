/*
* Story Scroller Data Structure Documentation
*
* The `story` array is used by the StoryScroller component to generate a rich, animated narrative experience.
* Each object in the array represents a "scene" or "slide" in the story.
*
*
* ===== Object Properties =====
*
* text: (String)
*   - The main text to display for the scene.
*   - For simple, centered text scenes, this is all you need.
*   - Example: `text: "This is a simple story slide."`
*
* background: (String)
*   - URL for the background image of the scene.
*   - Can be a remote URL or a local path.
*
* component: (Object)
*   - Defines a dynamic component to be rendered in the scene (e.g., CarSvg, ServerRack, or a generic Image).
*   - `name`: (String) The name of the component to render. Must match a key in the `componentMap` in StoryScroller.jsx or be 'Image'.
*   - `props`: (Object) Props to pass to the component.
*     - `animationType`: (String, Optional) Defines the animation for the component.
*       - 'drive-by' (default for CarSvg/ServerRack): The component moves across the screen.
*       - 'slide-in-left': The component slides in from the left.
*       - 'slide-in-right': The component slides in from the right.
*       - 'zoom-in': The component scales up from the center.
*       - 'fade-in': The component simply fades in.
*     - `align`: (String, Optional) Used with side-by-side layouts. Determines which side the component is on. 'left' or 'right'.
*
* textBlock: (Object)
*   - An alternative to the simple `text` property, offering more control over text styling and positioning.
*   - `text`: (String) The text content.
*   - `align`: (String, Optional) Horizontal alignment for the text. 'left', 'right', or 'center'. Default is 'center'.
*   - `style`: (String, Optional) A predefined style for the text block.
*     - 'default': Standard paragraph text.
*     - 'quote': Larger, italicized text with a border, suitable for pull quotes.
*
* layout: (String, Optional)
*   - Defines the overall layout of the scene.
*   - 'center' (default): A simple, centered layout for text or a component.
*   - 'side-by-side': A split layout with a component on one side and text on the other.
*     - Requires `component` and `textBlock` to be defined with `align` properties.
*     - On mobile, this layout stacks vertically.
*
*
* ===== EXAMPLES =====
*
* 1. Simple Centered Text:
*   {
*     text: "Hello, world!",
*     background: 'url-to-image.jpg'
*   }
*
* 2. Component-only Scene (Drive-by animation):
*   {
*     text: "A car drives by.",
*     component: { name: 'CarSvg', props: { direction: 'left-to-right' } },
*     background: 'url-to-road.jpg'
*   }
*
* 3. Side-by-Side Layout (Image on left, Text on right):
*   {
*     layout: 'side-by-side',
*     textBlock: {
*       text: "Here is some descriptive text.",
*       align: 'right'
*     },
*     component: {
*       name: 'Image',
*       props: {
*         src: 'https://picsum.photos/400/600',
*         animationType: 'slide-in-left',
*         align: 'left'
*       }
*     },
*     background: 'url-to-bg.jpg'
*   }
*
* 4. Focused Quote Text Style:
*   {
*     layout: 'center',
*     textBlock: {
*       text: '"Creativity is intelligence having fun."',
*       style: 'quote'
*     },
*     background: 'url-to-abstract-bg.jpg'
*   }
*/

const story = [
  {
    text: "I build cool things.",
    background: 'https://images.unsplash.com/photo-1523821741446-edb2b68bb7a0?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  },
  {
    text: "Sometimes on the web...",
  },
  {
    text: "...sometimes in my garage...",
    component: {
      name: 'Image',
      props: {
        src: 'assets/4runner_crop.png',
        alt: 'A silver Toyota 4Runner with off-road modifications.',
        animationType: 'drive-and-grow',
      }
    },
    background: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  },
  {
    text: "...and sometimes on a server rack in my basement.",
    component: {
      name: 'ServerRack',
      props: {
        animate: true,
      }
    },
    background: 'assets/server-rack.jpg',
  },
  // --- New Animation Examples ---
  {
    layout: 'side-by-side',
    textBlock: {
      text: "I enjoy creating interactive and responsive layouts, like this one, where content can be presented engagingly next to visuals.",
      align: 'right'
    },
    component: {
      name: 'Image',
      props: {
        src: 'https://picsum.photos/seed/picsum/800/1200',
        alt: 'A random high-resolution placeholder image',
        animationType: 'slide-in-left',
        align: 'left'
      }
    },
    background: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
  },
  {
    layout: 'side-by-side',
    textBlock: {
      text: "On mobile, this layout automatically stacks to ensure readability and a great user experience.",
      align: 'left'
    },
    component: {
      name: 'Image',
      props: {
        src: 'https://picsum.photos/seed/random/800/1200',
        alt: 'A random high-resolution placeholder image',
        animationType: 'slide-in-right',
        align: 'right'
      }
    },
    background: 'https://images.unsplash.com/photo-1550745165-9bc0b252726a?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
  },
  {
    layout: 'center',
    textBlock: {
      text: '"The best way to predict the future is to build it."',
      style: 'quote'
    },
    background: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2672&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  },
  {
    text: "Animation Example: Right to Left",
    component: {
      name: 'ServerRack',
      props: {
        animate: true,
        speed: 2,
        direction: 'right-to-left'
      }
    },
    background: 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  },
];

const AboutData = [
  {
    id: 'story-scroller',
    layout: 'fullscreen',
    story: story,
  },
  {
    id: 'intro-summary',
    layout: 'center',
    header: "I'm Nate, a developer who just really, really likes to make things work.",
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
