const ContactData = [
  {
    id: 'contact-intro',
    layout: 'center',
    header: "Let's Build Something Together",
    subheader:
      "I'm always excited to connect with new people. Whether you have a project in mind, a question about my work, or just want to discuss the latest in tech, I'm all ears.",
  },
  {
    id: 'contact-options',
    layout: 'split-contact',
    left: {
      header: 'Start a Conversation',
      content:
        'The best way to reach me is through email or LinkedIn. I make it a point to respond to every message as quickly as possible.',
      buttons: [
        {
          label: 'Email Me',
          icon: 'FaEnvelope',
          link: 'mailto:nate@n8s.pw',
        },
        {
          label: 'LinkedIn',
          icon: 'FaLinkedin',
          link: 'https://linkedin.com/in/n8s',
        },
      ],
    },
    right: {
      header: 'View My Resume',
      content:
        "Want to see the full picture? My resume has all the details about my skills, experience, and the projects I'm most proud of.",
      buttons: [
        {
          label: 'View Resume',
          icon: 'FaFilePdf',
          action: 'showResume',
        },
      ],
    },
  },
  {
    id: 'contact-closing',
    layout: 'center',
    header: "I'm Looking Forward to Hearing from You",
    subheader:
      "I'm passionate about creating innovative solutions and collaborating with like-minded people. If you think we'd be a good fit, don't hesitate to get in touch.",
  },
];

export default ContactData; 