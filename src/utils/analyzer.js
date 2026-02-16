export const KEYWORD_CATEGORIES = {
    coreCS: ["DSA", "OOP", "DBMS", "OS", "Networks"],
    languages: ["Java", "Python", "JavaScript", "TypeScript", "C", "C++", "C#", "Go"],
    web: ["React", "Next.js", "Node.js", "Express", "REST", "GraphQL"],
    data: ["SQL", "MongoDB", "PostgreSQL", "MySQL", "Redis"],
    cloud: ["AWS", "Azure", "GCP", "Docker", "Kubernetes", "CI/CD", "Linux"],
    testing: ["Selenium", "Cypress", "Playwright", "JUnit", "PyTest"]
};

// Helper for display labels
export const CATEGORY_LABELS = {
    coreCS: "Core CS",
    languages: "Languages",
    web: "Web",
    data: "Data",
    cloud: "Cloud/DevOps",
    testing: "Testing",
    other: "General"
};

const ENTERPRISE_COMPANIES = [
    "Google", "Amazon", "Microsoft", "Meta", "Apple", "TCS", "Infosys", "Wipro",
    "Accenture", "Cognizant", "IBM", "Intel", "Cisco", "Oracle", "SAP", "Salesforce"
];

const getCompanyIntel = (companyName) => {
    if (!companyName.trim()) return null;
    const isEnterprise = ENTERPRISE_COMPANIES.some(c =>
        companyName.toLowerCase().includes(c.toLowerCase())
    );
    return {
        name: companyName,
        industry: "Technology Services",
        size: isEnterprise ? "Enterprise (2000+)" : "Startup (<200)",
        focus: isEnterprise
            ? "Structured DSA + core fundamentals. High emphasis on scalability and CS basics."
            : "Practical problem solving + tech stack depth. Fast-paced delivery focus.",
        type: isEnterprise ? "enterprise" : "startup"
    };
};

const getRoundMapping = (companyType, skills) => {
    if (companyType === "enterprise") {
        return [
            { roundTitle: "Round 1: Online Test", focusAreas: ["DSA", "Aptitude"], whyItMatters: "Filters candidates based on core logic and speed." },
            { roundTitle: "Round 2: Technical Interview", focusAreas: ["DSA", "Core CS"], whyItMatters: "In-depth verification of algorithmic thinking." },
            { roundTitle: "Round 3: Tech + Projects", focusAreas: ["System Design", "Projects"], whyItMatters: "Checks ability to build end-to-end systems." },
            { roundTitle: "Round 4: HR / Cultural Fit", focusAreas: ["Behavioral", "HR"], whyItMatters: "Ensures alignment with company values." }
        ];
    } else {
        return [
            { roundTitle: "Round 1: Practical Coding", focusAreas: ["Development Task"], whyItMatters: "Tests immediate ability to contribute to the codebase." },
            { roundTitle: "Round 2: System Discussion", focusAreas: ["Architecture", "Stack"], whyItMatters: "Ensures you understand the tools you use." },
            { roundTitle: "Round 3: Founder/Culture Fit", focusAreas: ["Soft Skills"], whyItMatters: "Critical for small teams to ensure the new hire fits." }
        ];
    }
};

export const analyzeJD = (company, role, jdText) => {
    const text = jdText.toLowerCase();
    const extractedSkills = {
        coreCS: [], languages: [], web: [], data: [], cloud: [], testing: [], other: []
    };
    let categoryCount = 0;

    Object.entries(KEYWORD_CATEGORIES).forEach(([category, skills]) => {
        const found = skills.filter(skill =>
            new RegExp(`\\b${skill.replace(/\+/g, '\\+')}\\b`, 'i').test(text)
        );
        if (found.length > 0) {
            extractedSkills[category] = found;
            categoryCount++;
        }
    });

    // Default if empty
    if (categoryCount === 0) {
        extractedSkills.other = ["Communication", "Problem solving", "Basic coding", "Projects"];
    }

    const allDetected = Object.values(extractedSkills).flat();

    // Score Calculation
    let baseScore = 35;
    baseScore += Math.min(categoryCount * 5, 30);
    if (company.trim()) baseScore += 10;
    if (role.trim()) baseScore += 10;
    if (jdText.length > 800) baseScore += 10;
    baseScore = Math.min(baseScore, 100);

    // Questions
    const questions = [];
    if (allDetected.includes("SQL")) questions.push("Explain indexing and when it helps.");
    if (allDetected.includes("React")) questions.push("Explain state management options in React (Context vs Redux).");
    if (allDetected.includes("DSA")) questions.push("How would you optimize search in sorted data?");
    const extra = ["Tell me about a challenging project.", "How do you stay updated?", "Explain your version control workflow."];
    while (questions.length < 10 && extra.length > 0) questions.push(extra.shift());

    // Plan
    const plan7Days = [
        { day: "Day 1-2", focus: "Fundamentals", tasks: ["Revise Core CS basics", "Brush up on detected languages"] },
        { day: "Day 3-4", focus: "Problem Solving", tasks: ["Practice DSA common patterns", "Technical stack deep-dive"] },
        { day: "Day 5-7", focus: "Final Review", tasks: ["Project walkthrough", "Mock interview", "System design basics"] }
    ];

    const companyIntel = getCompanyIntel(company);
    const roundMapping = getRoundMapping(companyIntel?.type || "startup", allDetected);

    const checklist = roundMapping.map(r => ({
        roundTitle: r.roundTitle,
        items: [...r.focusAreas, "Resume verification"]
    }));

    const now = new Date().toISOString();

    return {
        id: Date.now().toString(),
        createdAt: now,
        updatedAt: now,
        company: company || "",
        role: role || "",
        jdText,
        extractedSkills,
        roundMapping,
        checklist,
        plan7Days,
        questions,
        baseScore,
        skillConfidenceMap: {},
        finalScore: baseScore,
        companyIntel
    };
};

export const getHistory = () => {
    try {
        const history = JSON.parse(localStorage.getItem('prep_history') || '[]');
        // Minimal validation to filter corrupted entries
        return history.filter(entry => entry && entry.id && entry.jdText);
    } catch (e) {
        console.error("Corrupted history found");
        return [];
    }
};

export const saveAnalysis = (analysis) => {
    const history = getHistory();
    history.unshift(analysis);
    localStorage.setItem('prep_history', JSON.stringify(history));
};

export const getAnalysisById = (id) => {
    return getHistory().find(a => a.id === id);
};

export const updateAnalysisById = (id, updates) => {
    const history = getHistory();
    const index = history.findIndex(a => a.id === id);
    if (index !== -1) {
        const entry = history[index];
        const updatedEntry = { ...entry, ...updates, updatedAt: new Date().toISOString() };

        // Recalculate final score if confidence map changed
        if (updates.skillConfidenceMap) {
            const allSkills = Object.values(entry.extractedSkills).flat();
            let scoreChange = 0;
            allSkills.forEach(s => {
                if (updates.skillConfidenceMap[s] === "know") scoreChange += 2;
                else if (updates.skillConfidenceMap[s] === "practice") scoreChange -= 0; // Default practice is 0 impact vs base
            });
            // Correct logic: Know is +2, Practice is -2 from base? No, request said +2 for "know", -2 for "practice".
            // Let's refine: Score = baseScore + (know_count * 2) - (practice_count * 2)
            // Actually user said: Start from base. Then +2 per know, -2 per practice.
            let finalScore = entry.baseScore;
            allSkills.forEach(s => {
                const status = updates.skillConfidenceMap[s] || "practice";
                if (status === "know") finalScore += 2;
                else finalScore -= 2;
            });
            updatedEntry.finalScore = Math.min(Math.max(finalScore, 0), 100);
        }

        history[index] = updatedEntry;
        localStorage.setItem('prep_history', JSON.stringify(history));
        return updatedEntry;
    }
    return null;
};
