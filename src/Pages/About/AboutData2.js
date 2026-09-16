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
      text: 'By 14, I was running my own load-balanced game servers with 100+ players simultaneously. It was a baptism by fire in system administration.',
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
    background: 'https://images.pexels.com/photos/35849577/pexels-photo-35849577.jpeg?_gl=1*5erecc*_ga*NjkxODg5MDU3LjE3NzU3OTI0MDM.*_ga_8JE65Q40S6*czE3NzU3OTI0MDMkbzEkZzEkdDE3NzU3OTI0MTckajQ2JGwwJGgw',
  },
  {
    text: "It extends to the garage.",
    component: {
      name: 'Image',
      props: {
        src: '/assets/4runner_crop.webp',
        alt: 'A gold Toyota 4Runner modified for overlanding.',
        animationType: 'drive-and-grow',
      }
    },
    background: 'https://images.pexels.com/photos/34337558/pexels-photo-34337558.jpeg?_gl=1*15zhevs*_ga*NjkxODg5MDU3LjE3NzU3OTI0MDM.*_ga_8JE65Q40S6*czE3NzU3OTI0MDMkbzEkZzEkdDE3NzU3OTI4MjEkajUyJGwwJGgw'
  },
  {
    layout: 'side-by-side',
    textBlock: {
      text: "My 2003 4Runner is an overengineered home on wheels, with solar, dual battery, water storage, a kitchen, and a place to sleep.",
      align: 'right'
    },
    component: {
      name: 'Image',
      props: {
        src: '/assets/gld4rnr_side.webp',
        alt: 'A side view of the customized Toyota 4Runner, showing its overlanding gear.',
        animationType: 'slide-in-left',
        align: 'left'
      }
    },
    background: 'https://images.pexels.com/photos/35843152/pexels-photo-35843152.jpeg?_gl=1*t7nrkt*_ga*NzA5NDg2ODE0LjE3NzU3OTg4MzY.*_ga_8JE65Q40S6*czE3NzU3OTg4MzYkbzEkZzEkdDE3NzU3OTg4NTkkajM3JGwwJGgw',
  },
  {
    text: "And then... owning a turbocharged Subaru is a special kind of passion—equal parts exhilaration and (un)expected repair bills.",
    component: {
      name: 'Image',
      props: {
        src: '/assets/cofxt_crop.webp',
        alt: 'A Subaru Forester XT driving.',
        animationType: 'drive-and-grow-rtl',
      }
    },
    background: 'https://images.pexels.com/photos/34337558/pexels-photo-34337558.jpeg?_gl=1*15zhevs*_ga*NjkxODg5MDU3LjE3NzU3OTI0MDM.*_ga_8JE65Q40S6*czE3NzU3OTI0MDMkbzEkZzEkdDE3NzU3OTI4MjEkajUyJGwwJGgw',
  },
  {
    layout: 'side-by-side',
    textBlock: {
      text: "My 2004 Forester XT is proof that the right STI go-fast parts, E85, and a short-geared 5-speed make for one of the most fun cars you can drive. But damn, these things love oil.",
      align: 'left'
    },
    component: {
      name: 'Image',
      props: {
        src: '/assets/cofxt_side.webp',
        alt: 'A side view of the Subaru Forester XT.',
        animationType: 'slide-in-right',
        align: 'right'
      }
    },
  },
  {
    layout: 'cars-converge',
    textBlock: {
      text: "Beyond wrenching—understanding how things work from the ground up is the same obsession that drives me from the garage straight into the server room.",
      style: 'default',
      align: 'center'
    },
    components: [
      {
        name: 'Image',
        props: {
          src: '/assets/4runner_crop.webp',
          alt: 'Gold Toyota 4Runner parked at top right.',
          animationType: 'park-top-right',
        }
      },
      {
        name: 'Image',
        props: {
          src: '/assets/cofxt_crop.webp',
          alt: 'Silver Subaru Forester XT parked at top left.',
          animationType: 'park-top-left',
        }
      }
    ],
    background: 'https://images.pexels.com/photos/34337558/pexels-photo-34337558.jpeg?_gl=1*15zhevs*_ga*NjkxODg5MDU3LjE3NzU3OTI0MDM.*_ga_8JE65Q40S6*czE3NzU3OTI0MDMkbzEkZzEkdDE3NzU3OTI4MjEkajUyJGwwJGgw',
  },

  {
    text: "...and to the heart of how my code works, anything personal I've ever deployed on the internet went through my homelab. Ubuntu Server is peak",
    component: {
      name: 'ServerRack'
    },
    background: 'https://images.pexels.com/photos/5050305/pexels-photo-5050305.jpeg?_gl=1*oy9rjt*_ga*NjkxODg5MDU3LjE3NzU3OTI0MDM.*_ga_8JE65Q40S6*czE3NzU3OTI0MDMkbzEkZzEkdDE3NzU3OTI3NjMkajQ3JGwwJGgw',
  },
  {
    layout: 'center',
    textBlock: {
      text: '"Whether it\'s code or a car, I love taking things apart and putting them back together. Creativity is driven by understanding things from the ground up."',
      style: 'quote'
    },
    background: 'https://upload.wikimedia.org/wikipedia/commons/8/89/HD_transparent_picture.png',
  },
];

// --- Story for the Autofoc.us Section ---
const autofocusStory = [
    {
        text: "Solving my own problems for an audience of one was never going to be enough. I wanted to build something for everyone.",
        background: 'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.1.0',
    },
    {
        layout: 'side-by-side',
        textBlock: {
          text: "Autofoc.us is a de-social-media profile and content platform—a single link that bridges your presence across every platform without the noise.",
          align: 'left'
        },
        component: {
          name: 'Image',
          props: {
            src: '/assets/autofocus_mobile.jpg',
            alt: 'A mobile screenshot of the Autofoc.us profile page interface.',
            animationType: 'slide-in-right',
            align: 'right',
            imgStyle: 'screenshot-image'
          }
        },
        background: 'https://upload.wikimedia.org/wikipedia/commons/8/89/HD_transparent_picture.png',
    },
    {
        layout: 'center',
        textBlock: {
            text: '"A passion project driven to stay alive—not a startup chasing profit, but crafted to be something worth using."',
            style: 'quote'
        },
        link: {
            url: 'https://www.autofoc.us',
            title: 'Check out Autofoc.us',
        },
        background: 'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.1.0',
    },
];

// --- Story for the Second Summit Section ---
const secondsummitStory = [
    {
        text: "Some of the best projects start with a phone call from someone you care about.",
        background: 'https://images.unsplash.com/photo-1551632811-561732d1e306?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.1.0',
    },
    {
        layout: 'side-by-side',
        textBlock: {
            text: "Second Summit is a role-based membership app built for the senior community—designed to get people outside, connecting face to face. Someone close reached out for wireframes. I went a step further and delivered a full functional frontend. Their site at 2ndsummit.org, while it took its own direction, helped prove the concept and get the idea off the ground.",
            align: 'right'
        },
        component: {
            name: 'Image',
            props: {
                src: '/assets/secondsummitdemo.mp4',
                alt: 'A walkthrough demo of the Second Summit app interface.',
                animationType: 'slide-in-left',
                align: 'left',
                imgStyle: 'screenshot-image'
            }
        },
        background: 'https://upload.wikimedia.org/wikipedia/commons/8/89/HD_transparent_picture.png',
    },
    {
        layout: 'center',
        textBlock: {
            text: '"Sometimes the best contribution you can make is the one that helps someone else believe their idea is real."',
            style: 'quote'
        },
        link: {
            url: 'https://2ndsummit.org',
            title: 'Visit 2ndsummit.org',
        },
        background: 'https://images.unsplash.com/photo-1551632811-561732d1e306?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.1.0',
    },
];

// --- Story for the LocaLedger Section ---
const localedgerStory = [
    {
        text: "Not every great tool needs a cloud account, a subscription, or an internet connection.",
        background: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.1.0',
    },
    {
        layout: 'side-by-side',
        textBlock: {
            text: "LocaLedger is a suite of offline-first PWA finance tools—income tracking, expense logging, and more—all stored locally on your device. No cloud. No account. Your data stays yours.",
            align: 'left'
        },
        component: {
            name: 'Image',
            props: {
                src: '/assets/localedger_mobile.jpg',
                alt: 'A mobile screenshot of the LocaLabor income tracking dashboard.',
                animationType: 'slide-in-right',
                align: 'right',
                imgStyle: 'screenshot-image'
            }
        },
        background: 'https://upload.wikimedia.org/wikipedia/commons/8/89/HD_transparent_picture.png',
    },
    {
        layout: 'center',
        textBlock: {
            text: '"Privacy-first finance. No server required."',
            style: 'quote'
        },
        link: {
            url: 'https://github.com/natesheridan',
            title: 'See the project',
        },
    },
];

// --- Story for the Valetra Section ---
const valetraStory = [
    {
        text: "Running a valet operation is controlled chaos. I built the software to tame it.",
        background: '/assets/valetra_bg.webp',
    },
    {
        layout: 'side-by-side',
        textBlock: {
            text: "Valetra is a full-stack valet CRM—real-time dashboards, full customer history, live staff presence via Socket.io, and a keyboard-driven check-in interface built for high-throughput shifts.",
            align: 'right'
        },
        component: {
            name: 'Image',
            props: {
                src: '/assets/valetra_mobile.jpg',
                alt: 'A mobile screenshot of the Valetra valet management dashboard.',
                animationType: 'slide-in-left',
                align: 'left',
                imgStyle: 'screenshot-image'
            }
        },
        background: 'https://upload.wikimedia.org/wikipedia/commons/8/89/HD_transparent_picture.png',
    },
    {
        layout: 'center',
        textBlock: {
            text: '"From ticket to car key—every touchpoint tracked in real time."',
            style: 'quote'
        },
        background: '/assets/valetra_bg.webp',
    },
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
  // Parked for later — plan is to reuse this ImageSwiper carousel format for the
  // Projects page (one shared full-screen swipeable format instead of each project
  // having its own vertical StoryScroller), reworked from this boxed "card" look
  // into a full-screen, more cinematic presentation. Left here, just not rendered.
  // {
  //   id: 'garage-gallery',
  //   layout: 'center',
  //   header: 'A Few More From the Garage',
  //   subheader: 'Swipe through — no scroll-jacking required.',
  //   component: {
  //     name: 'ImageSwiper',
  //     props: {
  //       images: [
  //         { src: '/assets/gld4rnr_side.webp', alt: 'The gold Toyota 4Runner from the side, overlanding gear visible.', caption: '2003 4Runner — solar, dual battery, and a full kitchen out back.' },
  //         { src: '/assets/4runner_crop.webp', alt: 'The gold Toyota 4Runner.', caption: 'Still my daily off-road-capable driver.' },
  //         { src: '/assets/cofxt_side.webp', alt: 'The Subaru Forester XT from the side.', caption: '2004 Forester XT — short-geared, E85, and loud.' },
  //         { src: '/assets/cofxt_crop.webp', alt: 'The Subaru Forester XT.', caption: 'Fast, fun, and perpetually thirsty for oil.' },
  //       ],
  //     },
  //   },
  // },
  {
    id: 'autofocus-story-scroller',
    layout: 'fullscreen',
    story: autofocusStory,
  },
  {
    id: 'secondsummit-story-scroller',
    layout: 'fullscreen',
    story: secondsummitStory,
  },
  {
    id: 'localedger-story-scroller',
    layout: 'fullscreen',
    story: localedgerStory,
  },
  {
    id: 'valetra-story-scroller',
    layout: 'fullscreen',
    story: valetraStory,
  },
  {
    id: 'hire-me',
    layout: 'center',
    header: "I'm Looking for My Next Challenge.",
    subheader: "If you made it this far.. wow, you must really like scrolling. Let's work together!",
    link: {
      url: 'https://www.n8s.pw/assets/ResumeNoPhone.pdf',
      title: 'View My Resume',
    },
    links: [
      {
        url: '/projects',
        title: 'Browse Projects',
        tagline: "I've got some more random projects over here",
      },
    ],
    background: {
      url: 'https://images.unsplash.com/photo-1523821741446-edb2b68bb7a0?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
    }
  },
];

export default AboutData2;
