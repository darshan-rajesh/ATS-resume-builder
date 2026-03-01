/**
 * Tech Keywords Database
 * Categorized lists of tech-related skills, tools, and concepts
 */

export const TECH_SKILLS = {
    languages: [
        "javascript", "typescript", "python", "java", "c++", "c#", "go", "golang",
        "rust", "ruby", "php", "swift", "kotlin", "scala", "r", "matlab",
        "perl", "haskell", "elixir", "dart", "lua", "sql", "html", "css",
        "sass", "less", "objective-c", "assembly", "shell", "bash", "powershell",
        "groovy", "clojure", "fortran", "cobol", "vba", "solidity",
    ],
    frameworks: [
        "react", "reactjs", "react.js", "angular", "angularjs", "vue", "vuejs",
        "vue.js", "next.js", "nextjs", "nuxt", "svelte", "gatsby", "remix",
        "express", "expressjs", "nest.js", "nestjs", "fastify", "django", "flask",
        "fastapi", "spring", "spring boot", "springboot", ".net", "dotnet",
        "asp.net", "rails", "ruby on rails", "laravel", "symfony", "gin",
        "fiber", "echo", "actix", "rocket", "phoenix", "flutter", "react native",
        "ionic", "electron", "tauri", "qt", "wpf", "blazor",
        "jquery", "bootstrap", "tailwind", "tailwindcss", "material ui",
        "chakra ui", "ant design", "styled-components",
    ],
    databases: [
        "mysql", "postgresql", "postgres", "mongodb", "redis", "elasticsearch",
        "sqlite", "oracle", "sql server", "mssql", "mariadb", "cassandra",
        "dynamodb", "couchdb", "neo4j", "influxdb", "cockroachdb", "supabase",
        "firebase", "firestore", "fauna", "planetscale", "neon",
    ],
    cloud: [
        "aws", "amazon web services", "azure", "microsoft azure", "gcp",
        "google cloud", "google cloud platform", "heroku", "digitalocean",
        "vercel", "netlify", "cloudflare", "linode", "vultr",
        "ec2", "s3", "lambda", "ecs", "eks", "fargate", "rds", "cloudfront",
        "route 53", "sqs", "sns", "kinesis", "api gateway",
    ],
    devops: [
        "docker", "kubernetes", "k8s", "terraform", "ansible", "puppet", "chef",
        "jenkins", "github actions", "gitlab ci", "circleci", "travis ci",
        "argo cd", "helm", "prometheus", "grafana", "datadog", "new relic",
        "splunk", "elk stack", "logstash", "kibana", "nagios", "pagerduty",
        "ci/cd", "ci cd", "continuous integration", "continuous delivery",
        "continuous deployment", "infrastructure as code", "iac",
    ],
    tools: [
        "git", "github", "gitlab", "bitbucket", "jira", "confluence", "slack",
        "trello", "asana", "notion", "figma", "sketch", "adobe xd",
        "postman", "swagger", "graphql", "rest", "restful", "grpc", "websocket",
        "webpack", "vite", "rollup", "parcel", "babel", "eslint", "prettier",
        "npm", "yarn", "pnpm", "pip", "maven", "gradle", "cargo",
        "vs code", "visual studio", "intellij", "vim", "neovim",
    ],
    concepts: [
        "microservices", "monolith", "serverless", "event-driven", "event driven",
        "message queue", "pub/sub", "cqrs", "ddd", "domain-driven design",
        "clean architecture", "hexagonal architecture", "mvc", "mvvm",
        "design patterns", "solid principles", "dry", "kiss",
        "tdd", "bdd", "unit testing", "integration testing", "e2e testing",
        "end-to-end testing", "test automation", "selenium", "cypress",
        "playwright", "jest", "mocha", "pytest", "junit",
        "agile", "scrum", "kanban", "sprint", "retrospective", "stand-up",
        "code review", "pair programming", "mob programming",
        "api design", "system design", "distributed systems", "scalability",
        "high availability", "load balancing", "caching", "cdn",
        "oauth", "jwt", "authentication", "authorization", "rbac",
        "encryption", "ssl", "tls", "https", "cors", "csrf", "xss",
        "sql injection", "security", "penetration testing",
        "machine learning", "deep learning", "neural network", "nlp",
        "natural language processing", "computer vision", "tensorflow",
        "pytorch", "scikit-learn", "pandas", "numpy", "opencv",
        "data structures", "algorithms", "big o", "complexity",
        "linked list", "binary tree", "graph", "dynamic programming",
        "sorting", "searching", "recursion", "hash table",
        "object-oriented programming", "oop", "functional programming",
        "reactive programming", "async", "concurrency", "multithreading",
        "parallel programming",
    ],
    data: [
        "etl", "data pipeline", "data warehouse", "data lake", "data mesh",
        "apache spark", "hadoop", "kafka", "airflow", "dbt",
        "snowflake", "redshift", "bigquery", "databricks", "tableau",
        "power bi", "looker", "metabase", "data modeling", "star schema",
    ],
};

export const ALL_TECH_KEYWORDS = Object.values(TECH_SKILLS).flat();

export const ACTION_VERBS = [
    "achieved", "administered", "architected", "automated", "built",
    "collaborated", "configured", "coordinated", "created", "debugged",
    "decreased", "delivered", "deployed", "designed", "developed",
    "documented", "drove", "eliminated", "enabled", "engineered",
    "enhanced", "established", "executed", "expanded", "facilitated",
    "fixed", "formulated", "generated", "grew", "identified",
    "implemented", "improved", "increased", "initiated", "integrated",
    "introduced", "launched", "led", "maintained", "managed",
    "mentored", "migrated", "modernized", "monitored", "negotiated",
    "optimized", "orchestrated", "overhauled", "performed", "pioneered",
    "planned", "presented", "processed", "produced", "programmed",
    "proposed", "provided", "published", "rebuilt", "reduced",
    "refactored", "reengineered", "resolved", "restructured", "revamped",
    "reviewed", "scaled", "simplified", "solved", "spearheaded",
    "standardized", "streamlined", "strengthened", "supervised", "supported",
    "tested", "trained", "transformed", "troubleshot", "upgraded",
    "utilized", "validated", "visualized",
];

export const REQUIRED_SECTIONS = [
    { name: "Contact Information", patterns: ["email", "phone", "linkedin", "github", "address", "location", "@"] },
    { name: "Summary / Objective", patterns: ["summary", "objective", "profile", "about me", "professional summary", "career objective"] },
    { name: "Work Experience", patterns: ["experience", "work history", "employment", "professional experience", "work experience"] },
    { name: "Education", patterns: ["education", "academic", "university", "college", "degree", "bachelor", "master", "phd", "b.tech", "b.e.", "m.tech", "m.s.", "b.s.", "b.sc", "m.sc"] },
    { name: "Skills", patterns: ["skills", "technical skills", "technologies", "competencies", "proficiencies", "tech stack"] },
    { name: "Projects", patterns: ["projects", "personal projects", "side projects", "portfolio"] },
];

export const FORMAT_WARNINGS = {
    tooShort: { message: "Resume appears too short. Aim for at least 300 words.", threshold: 300 },
    tooLong: { message: "Resume may be too long. Keep it concise — ideally under 1000 words for most roles.", threshold: 1000 },
    noNumbers: { message: "Add quantified achievements (e.g., 'Improved load time by 40%')." },
    weakVerbs: { message: "Replace weak verbs (e.g., 'Responsible for') with strong action verbs (e.g., 'Led', 'Developed', 'Optimized')." },
};
