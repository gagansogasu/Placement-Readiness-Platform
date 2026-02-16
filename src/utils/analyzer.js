export const KEYWORD_CATEGORIES = {
    "Core CS": ["DSA", "OOP", "DBMS", "OS", "Networks"],
    "Languages": ["Java", "Python", "JavaScript", "TypeScript", "C", "C++", "C#", "Go"],
    "Web": ["React", "Next.js", "Node.js", "Express", "REST", "GraphQL"],
    "Data": ["SQL", "MongoDB", "PostgreSQL", "MySQL", "Redis"],
    "Cloud/DevOps": ["AWS", "Azure", "GCP", "Docker", "Kubernetes", "CI/CD", "Linux"],
    "Testing": ["Selenium", "Cypress", "Playwright", "JUnit", "PyTest"]
};

export const analyzeJD = (company, role, jdText) => {
    const text = jdText.toLowerCase();
    const extractedSkills = {};
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

    if (Object.keys(extractedSkills).length === 0) {
        extractedSkills["General"] = ["General fresher stack"];
    }

    // Score Calculation
    let score = 35;
    score += Math.min(categoryCount * 5, 30);
    if (company.trim()) score += 10;
    if (role.trim()) score += 10;
    if (jdText.length > 800) score += 10;
    score = Math.min(score, 100);

    // Generate Questions
    const questions = [];
    const allDetected = Object.values(extractedSkills).flat();

    if (allDetected.includes("SQL")) questions.push("Explain indexing and when it helps.");
    if (allDetected.includes("React")) questions.push("Explain state management options in React (Context vs Redux).");
    if (allDetected.includes("DSA")) questions.push("How would you optimize search in sorted data?");
    if (allDetected.includes("JavaScript")) questions.push("What are closures and how are they used?");
    if (allDetected.includes("Java")) questions.push("Explain the difference between an interface and an abstract class.");
    if (allDetected.includes("Docker")) questions.push("What is a container and how does it differ from a VM?");
    if (allDetected.includes("Node.js")) questions.push("Describe the event loop in Node.js.");

    // Fill up to 10
    const genericQuestions = [
        "Tell me about a challenging project you've worked on.",
        "How do you stay updated with the latest technologies?",
        "Explain your experience with version control systems like Git.",
        "How do you handle debugging complex issues in a production environment?",
        "Describe a time you had to work with a team to solve a technical problem."
    ];

    while (questions.length < 10 && genericQuestions.length > 0) {
        const q = genericQuestions.shift();
        if (!questions.includes(q)) questions.push(q);
    }

    // Generate Plan
    const plan = [
        { days: "Day 1–2", task: "Basics + core CS revision (OS, DBMS, OOP)." },
        { days: "Day 3–4", task: `Deep dive into detected skills: ${allDetected.join(", ")}.` },
        { days: "Day 5", task: "Project alignment with JD and resume walkthrough." },
        { days: "Day 6", task: "Mock interview practice using the generated question bank." },
        { days: "Day 7", task: "Revision of weak areas and final preparation." }
    ];

    if (allDetected.includes("React") || allDetected.includes("Next.js")) {
        plan[0].task += " Focus on Frontend fundamentals.";
    }

    // Checklist
    const checklist = [
        { round: "Round 1: Aptitude / Basics", items: ["Quantitative Aptitude", "Logical Reasoning", "Verbal Ability", "Basic Coding", "CS Fundamentals"] },
        { round: "Round 2: DSA + Core CS", items: ["Array/String problems", "Trees/Graphs basics", "Hashing", "OS concepts", "DBMS queries"] },
        { round: "Round 3: Tech Interview", items: ["Project deep-dive", "Framework specific questions", "System Design (Basic)", "Coding live", "Resume verification"] },
        { round: "Round 4: Managerial / HR", items: ["Behavioral questions", "Company specific research", "Salary discussion", "Cultural fit", "Future goals"] }
    ];

    return {
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        company,
        role,
        jdText,
        extractedSkills,
        plan,
        checklist,
        questions: questions.slice(0, 10),
        readinessScore: score
    };
};

export const saveAnalysis = (analysis) => {
    const history = JSON.parse(localStorage.getItem('prep_history') || '[]');
    history.unshift(analysis);
    localStorage.setItem('prep_history', JSON.stringify(history));
};

export const getHistory = () => {
    return JSON.parse(localStorage.getItem('prep_history') || '[]');
};

export const getAnalysisById = (id) => {
    const history = getHistory();
    return history.find(a => a.id === id);
};
