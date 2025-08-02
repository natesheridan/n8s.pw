/*
 * About Page Data Structure
 *
 * This file defines the content and layout for the About page. It's an array of "section" objects,
 * each corresponding to a distinct block on the page. The `StorySection` component dynamically
 * renders each section based on its `layout` property.
 *
 * ===== Section Properties =====
 *
 * id: (String) - A unique identifier for the section.
 *
 * layout: (String) - Determines the component and styling for the section.
 *   - 'fullscreen': Used for the StoryScroller component. Requires a `story` property.
 *   - 'center': A simple, centered block for text and an optional image/component.
 *   - 'center-fullscreen': A full-viewport centered block, often for more impact.
 *   - 'right' / 'left': Content aligned to one side, often with a background image on the other.
 *   - 'split': A two-column layout.
 *
 * header: (String) - The main title for a section.
 *
 * subheader / content: (String) - The body text for a section.
 *
 * component: (Object) - A dynamic component to render within the section (e.g., Terminal, SkillsChart).
 *
 * story: (Array) - An array of slide objects used ONLY when layout is 'fullscreen'. See StoryScroller docs.
 *
 * background: (Object) - Defines a background image for the section.
 *
 * link: (Object) - A call-to-action link.
 *
 */

// --- The Story for the "Origin" StoryScroller Section ---
const originStory = [
  {
    text: "My story starts with a simple, driving question: How does it work?",
    background: 'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  },
  {
    text: "It began in the digital trenches of online games like Minecraft and prior to that Club Penguin for the OG iceberg tippers.",
  },
  {
    layout: 'side-by-side',
    textBlock: {
      text: "I wasn't just playing. I was fascinated by the real nerds reverse-engineering the game. I dove in, learning to read the code and bend the rules.",
      align: 'right'
    },
    component: {
        name: 'Terminal',
        props: {
          text: 'grep -r "PlayerInventory" .',
          animationType: 'slide-in-left',
        }
      },
    background: 'https://images.unsplash.com/photo-1550745165-9bc0b252726a?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
  },
  {
    layout: 'center',
    textBlock: {
      text: 'By 14, I was running my own load-balanced game servers to avoid subscription fees. It was a baptism by fire in system administration.',
      style: 'default'
    },
    component: {
      name: 'ServerStack',
    },
  },
];

// --- The Story for the "Beyond the Screen" StoryScroller Section ---
const beyondTheScreenStory = [
  {
    text: "The obsession with 'how things work' doesn't stop at the keyboard.",
    background: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  },
  {
    text: "It extends to the garage.",
    component: {
      name: 'Image',
      props: {
        src: 'assets/4runner_crop.png',
        alt: 'A silver Toyota 4Runner modified for overlanding.',
        animationType: 'drive-and-grow',
      }
    },
  },
  {
    layout: 'side-by-side',
    textBlock: {
      text: "My 2003 4Runner is my ongoing project in mechanical and electrical engineering—a self-sufficient home on wheels with a solar and dual-battery system I designed and installed.",
      align: 'right'
    },
    component: {
      name: 'Image',
      props: {
        src: 'assets/gld4rnr_side.jpg',
        alt: 'A side view of the customized Toyota 4Runner, showing its overlanding gear.',
        animationType: 'slide-in-left',
        align: 'left'
      }
    },
  },
  {
    text: "...and to the basement, where my homelab gives me a sandbox for scaling, testing, and self-hosting my own data.",
    component: {
      name: 'ServerRack'
    },
    
  },
  {
    layout: 'center',
    textBlock: {
      text: '"Whether it\'s code or a car, I love taking things apart and putting them back together. Creativity is driven by understanding things from the ground up."',
      style: 'quote'
    },
  },
];

// --- Story for the Autofoc.us Section ---
const autofocusStory = [
    {
        text: "and ultimately, solving my own equally shared problems for an audience of one wasn't enough. I wanted to take what I'd learned and build something for others.",
        background: 'https://images.unsplash.com/photo-1521898294357-1867b9a76541?q=80&w=2574&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    },
    {
        layout: 'side-by-side',
        textBlock: {
          text: "That led to Autofoc.us—a side project built to solve my own frustrations with the scattered nature of social media.",
          align: 'left'
        },
        component: {
          name: 'Image',
          props: {
            src: 'https://picsum.photos/seed/autofocus-ui/1200/800',
            alt: 'A screenshot of the Autofoc.us user interface.',
            animationType: 'slide-in-right',
            align: 'right',
            imgStyle: 'screenshot-image'
          }
        },
    },
    {
        layout: 'center',
        textBlock: {
            text: "autofoc.us is a passion project driven to stay alive, not a startup whose goal is profit at this time.",
            style: 'quote'
        },
        link: {
            url: 'https://www.autofoc.us',
            title: 'Check out the project',
        },
    },
    {
        layout: 'center',
        textBlock: {
            text: "it doesn't make money and it probably wont but it does show off some skills, and when those skills are applied to a team, the results are even better.",
            style: 'quote'
        },
        link: {
            url: 'https://www.autofoc.us',
            title: 'Check out the project',
        },
    }
];


// --- The Main Data Structure for the About Page ---
const AboutData2 = [
  {
    id: 'intro-summary',
    layout: 'center',
    component: {
      name: 'BuildBreakAnimation',
    },
    image: {
      url: 'http://github.com/natesheridan.png',
      imgStyle: 'profile-image',
    },
  },
  {
    id: 'origin-story-scroller',
    layout: 'fullscreen',
    story: originStory,
  },
  {
    id: 'turing-school',
    layout: 'center-fullscreen',
    header: 'Forged in the Fires of an 80-Hour Week',
    subheader: "Turing School of Software & Design was the crucible where my scattered, self-taught knowledge was forged into a professional toolkit. It connected the dots, gave my curiosity a purpose, and taught me how to transform ideas into elegant, user-centric applications.",
    component: {
      name: 'SkillsChart',
      props: {
        skills: [
          { name: 'React', level: 90 },
          { name: 'JavaScript', level: 85 },
          { name: 'CSS', level: 95 },
          { name: 'Node.js', level: 75 },
          { name: 'Problem-Solving', level: 100 },
        ],
      },
    },
  },
  {
    id: 'servicelogix-experience',
    layout: 'right',
    header: 'From Theory to Practice: Enterprise Engineering',
    content: "My time at ServiceLogix was a crash course in the world of enterprise software. I quickly went from intern to full-time engineer, tasked with modernizing and supporting mission-critical systems. It was an invaluable experience in maintaining legacy codebases and understanding the unique challenges of large-scale, established technology.",
    component: {
      name: 'Terminal',
      props: {
        text: 'sudo apt-get update && sudo apt-get upgrade -y',
      }
    },
    background: {
      url: 'https://images.unsplash.com/photo-1607743386760-88ac62b89b8a?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    },
  },
  {
    id: 'beyond-the-screen-scroller',
    layout: 'fullscreen',
    story: beyondTheScreenStory,
  },
  {
    id: 'autofocus-story-scroller',
    layout: 'fullscreen',
    story: autofocusStory,
  },
  {
    id: 'hire-me',
    layout: 'center',
    header: "I'm Looking for My Next Challenge.",
    subheader: "If you made it this far—wow, you must really like scrolling. Let's work together!",
    link: {
      url: 'https://www.n8s.pw/assets/ResumeNoPhone.pdf',
      title: 'View My Resume',
    },
    background: {
      url: 'https://images.unsplash.com/photo-1523821741446-edb2b68bb7a0?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
    }
  },
];

export default AboutData2;
