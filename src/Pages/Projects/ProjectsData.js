export const projects = [
    {
        id: 1,
        title: "Project One",
        subtitle: "Innovative Solution",
        description: "A groundbreaking project that showcases the future of web development",
        category: "Web Development",
        tags: ["React", "Three.js", "Innovation"],
        thumbnail: "/pkg-assets/paper.jpg", // placeholder image
        images: [
            "/pkg-assets/paper.jpg",
            "/pkg-assets/paper.jpg",
            "/pkg-assets/paper.jpg"
        ],
        links: {
            live: "https://example.com",
            github: "https://github.com/example",
            demo: "https://demo.example.com"
        },
        featured: true,
        completionDate: "2024-03",
        techStack: ["React", "Node.js", "MongoDB"],
        highlights: [
            "Innovative user interface",
            "Real-time collaboration",
            "AI-powered features"
        ],
        metrics: {
            users: "10K+",
            performance: "99%",
            satisfaction: "4.8/5"
        }
    },
    {
        id: 2,
        title: "Project Two",
        subtitle: "Creative Design",
        description: "An artistic approach to digital experiences",
        category: "Design",
        tags: ["UI/UX", "Animation", "Creative"],
        thumbnail: "/pkg-assets/paper.jpg",
        images: [
            "/pkg-assets/paper.jpg",
            "/pkg-assets/paper.jpg",
            "/pkg-assets/paper.jpg"
        ],
        links: {
            live: "https://example.com",
            github: "https://github.com/example",
            demo: "https://demo.example.com"
        },
        featured: false,
        completionDate: "2024-02",
        techStack: ["Figma", "Adobe XD", "After Effects"],
        highlights: [
            "Award-winning design",
            "Innovative interactions",
            "Accessibility focus"
        ],
        metrics: {
            views: "50K+",
            engagement: "85%",
            awards: 2
        }
    }
];

export const categories = [
    "Web Development",
    "Design",
    "Mobile",
    "AI/ML",
    "Blockchain"
];

export const filters = {
    sort: ["Latest", "Most Popular", "Featured"],
    timeframe: ["All Time", "This Year", "This Month"],
    category: categories
}; 