// All copy lives here. Ported from the compiled handoff export.

export const brand = {
  "name": "Mahima",
  "email": "mahimashastryux@gmail.com",
  "city": "Bengaluru · open to remote",
  "socials": [
    {
      "label": "LinkedIn",
      "href": "https://www.linkedin.com/in/mahima-shastry-422b471a9"
    },
    {
      "label": "Resume",
      "href": "#"
    }
  ]
};

export const nav = [
  {
    "label": "Work",
    "href": "#process"
  },
  {
    "label": "About",
    "href": "#receipts"
  },
  {
    "label": "Playground",
    "href": "#work"
  }
];

export const gateStatus = [
  "Gulping my coffee ...",
  "Procrastinating a little bit ...",
  "On my way ...",
  "Here I am ..."
];

export const heroTyped = [
  "I am Mahima"
];

export const tapeWords = ["UX for AI", "Agent experience", "Content design", "Accessibility"];

export const budgets = [
  "some",
  "all",
  "... for you to figure out"
];

export const googleServices = [
  {
    "name": "UX writing",
    "blurb": "Interface and instructional copy: onboarding, procedures, labels, empty states, error messages."
  },
  {
    "name": "Information architecture",
    "blurb": "Audits, taxonomy, navigation models and task-based structures for dense product suites."
  },
  {
    "name": "Content strategy",
    "blurb": "End-to-end ownership from audit to rollout, with principles stakeholders can apply without me."
  },
  {
    "name": "Accessibility",
    "blurb": "Alt text, ARIA labelling conventions, colour and icon standards, plain language, WCAG 2.1 AA."
  },
  {
    "name": "Inclusive language",
    "blurb": "Terminology audits and replacements at scale, baked into templates and style guidance."
  },
  {
    "name": "Content systems & governance",
    "blurb": "Guidelines, terminology standards and contribution models that hold after the project ends."
  },
  {
    "name": "Visual storytelling",
    "blurb": "Comics, diagrams and figures used as explanation, with comprehension as the success measure."
  },
  {
    "name": "AI-assisted workflows",
    "blurb": "Audits, sweeps and variant generation at volume, with human judgement on every call."
  },
  {
    "name": "Developer experience",
    "blurb": "API Gateway and Control Plane content for engineers, architects and admins who distrust a fourth tool."
  }
];

export const cdStats = [
  {
    "value": "400+",
    "unit": "pages",
    "text": "Documentation restructured and remediated across two merged webMethods libraries.",
    "bg": "var(--lime)",
    "fg": "var(--forest)"
  },
  {
    "value": "45+",
    "unit": "terms",
    "text": "Entries in the terminology and inclusive-language standard I wrote and own.",
    "bg": "var(--pink)",
    "fg": "var(--ink)"
  },
  {
    "value": "28",
    "unit": "person team",
    "text": "Writers and designers working to that standard, enforced by templates rather than reminders.",
    "bg": "var(--sun)",
    "fg": "var(--ink)"
  },
  {
    "value": "10+",
    "unit": "teams",
    "text": "Product writing teams across the webMethods suite that adopted the task-based IA model I built.",
    "bg": "var(--blue)",
    "fg": "var(--paper)"
  }
];

export const cdDecisions = [
  {
    "tab": "Terminology",
    "where": "replication settings",
    "before": "Configure the master node to push changes to all slave nodes.",
    "after": "Configure the primary node to push changes to all replica nodes.",
    "why": "Industry-standard replacements, chosen because they are also more accurate. This became one of 45+ entries in the terminology table, so writers stopped deciding case by case."
  },
  {
    "tab": "Pronouns",
    "where": "procedure steps",
    "before": "The administrator must ensure that he has configured his gateway before he deploys an API.",
    "after": "Configure your gateway before you deploy an API.",
    "why": "The inclusive fix and the clarity fix were the same edit. Second person removed the gendered pronoun and turned a description of a person into an instruction to the reader."
  },
  {
    "tab": "Alt text",
    "where": "architecture diagram",
    "before": "alt=“Diagram”",
    "after": "alt=“API requests pass from the gateway to three backend services; the control plane monitors all three and reports failures back to the gateway.”",
    "why": "“Diagram” passes an automated check and tells a screen-reader user nothing. The rule in the standard: describe what the diagram argues, not what it contains."
  }
];

export const cdCases = [
  {
    "href": "cases/cd-accessibility-system.html",
    "kicker": "Software AG → IBM · Accessibility",
    "title": "Building an accessibility and inclusive content system for webMethods documentation",
    "desc": "Fix the language in existing text first, then build alt text, colour, icon and ARIA conventions into how new visuals get made, so accessibility stopped being a page-by-page judgement call and became the default.",
    "pdf": "Guideline PDF inside",
    "bg": "var(--lime)",
    "fg": "var(--forest)"
  },
  {
    "href": "cases/cd-docs-restructure.html",
    "kicker": "Software AG → IBM · Information architecture",
    "title": "Documentation restructure post-merger: rebuilding information architecture for scannability",
    "desc": "A full content audit across 400+ pages, a short set of IA principles the team could apply without me, then a rebuild organised around user tasks instead of legacy product boundaries, shipped without pausing active documentation work.",
    "pdf": "",
    "bg": "var(--blue)",
    "fg": "var(--paper)"
  },
  {
    "href": "cases/cd-onboarding-comic.html",
    "kicker": "IBM API Control Plane · Onboarding",
    "title": "Explaining an invisible product with a 15-panel comic",
    "desc": "The old intro was an architecture diagram. I replaced it with a 15-panel comic: three personas, engineer, PM and architect, each getting a named payoff in the final panel, in fewer words than the onboarding page it fronts.",
    "pdf": "Full comic PDF inside",
    "bg": "var(--sun)",
    "fg": "var(--ink)"
  }
];

export const metaServices = [
  {
    "name": "Ink and pencil",
    "blurb": "Illustration, mostly. Hours of looking at one thing."
  },
  {
    "name": "Posters",
    "blurb": "Type first, loud colour, printed rather than posted."
  },
  {
    "name": "A camera",
    "blurb": "Framing practice. Most of it is what you leave out."
  },
  {
    "name": "Eight counts",
    "blurb": "Bharatanatyam. Timing, and practising when nobody watches."
  },
  {
    "name": "Small builds",
    "blurb": "Interfaces I take apart to see how they actually work."
  }
];

export const searchDemos = [
  {
    "query": "api gateway 403 but my key is valid",
    "domain": "docs.example.com",
    "title": "403 from the gateway | What to check, in order",
    "desc": "Nine times out of ten it's a policy, not your key. Here's the order to check things in, and the exact screen to open.",
    "links": [
      "Check the policy",
      "Rotate a key",
      "Still stuck?"
    ]
  },
  {
    "query": "integration failed no error message",
    "domain": "docs.example.com",
    "title": "Your run failed and the log is empty",
    "desc": "An empty log means the step never started. Three causes, each with a fix you can try in under a minute.",
    "links": [
      "Read the log",
      "Retry the step",
      "Known issues"
    ]
  },
  {
    "query": "what does this app actually share",
    "domain": "halo.app",
    "title": "What HalO shares, and who with",
    "desc": "Plain language, no legal padding. Exactly what leaves your phone during an SOS, and what never does.",
    "links": [
      "During an SOS",
      "Your contacts",
      "Turn it off"
    ]
  }
];

export type Stat = { label: string; value: number; prefix?: string; suffix?: string; decimals?: number };
export const stats: Stat[] = [
  {
    "label": "Engineering degrees, still useful",
    "value": 1
  },
  {
    "label": "Years making software speak human",
    "value": 4
  },
  {
    "label": "Years as a classical dancer",
    "value": 17,
    "suffix": "+"
  },
  {
    "label": "College photography teams led",
    "value": 1
  }
];

export const aboutReceipt = {
  "title": "About me, itemised",
  "items": [["Circuits traded for sentences", "ALL"], ["Years of classical dance", "17+"], ["Sketchbooks, analog and digital", "MANY"], ["Photography teams led", "1"], ["AI rabbit holes", "ONGOING"], ["User psychology tangents", "DAILY"], ["Cafes hopped", "STILL COUNTING"], ["New beverages tried", "TOO MANY"], ["Same order twice", "0.00"], ["Jargon", "0.00"], ["Regrets about the switch", "0.00"]],
  "total": ["Total", "One engineer, artist and writer"],
  "note": "that’s me, let’s talk over something I haven’t tried yet"
};

export const toolkit = [
  {
    "name": "Product design",
    "color": "#c8f53c",
    "fg": "#0e3a22",
    "areas": [
      {
        "label": "Interaction design",
        "tags": [
          "End-to-end product design",
          "User-centered design",
          "Information architecture",
          "Task flows",
          "User journeys",
          "Interaction patterns",
          "Responsive web design",
          "Native iOS and Android design"
        ]
      },
      {
        "label": "Visual and motion design",
        "tags": [
          "Visual hierarchy",
          "Typography",
          "Layout",
          "High-fidelity UI",
          "Microinteractions",
          "Motion design",
          "Interaction states",
          "Data visualization"
        ]
      },
      {
        "label": "Design systems",
        "tags": [
          "Systems thinking",
          "Component libraries",
          "Design tokens",
          "Figma variables and variants",
          "Pattern documentation",
          "Design system contribution",
          "Governance",
          "Adoption"
        ]
      }
    ],
    "tools": [
      "Figma (Auto Layout, components, variables, prototyping, Dev Mode)",
      "FigJam",
      "Storybook",
      "Material Design 3"
    ]
  },
  {
    "name": "Prototyping",
    "color": "#ff4f1f",
    "fg": "#121110",
    "areas": [
      {
        "label": "Prototyping and delivery",
        "tags": [
          "Rapid prototyping",
          "Interactive prototyping",
          "Code-based prototyping",
          "Concept validation",
          "Engineering handoff",
          "Interaction specifications",
          "Design QA"
        ]
      }
    ],
    "tools": [
      "ProtoPie",
      "Framer",
      "Rive",
      "Principle",
      "After Effects",
      "HTML/CSS/JavaScript",
      "React",
      "Google Stitch",
      "Figma Make",
      "Claude Design",
      "Claude Code",
      "Codex",
      "Cursor"
    ]
  },
  {
    "name": "Research & strategy",
    "color": "#ffc22e",
    "fg": "#121110",
    "areas": [
      {
        "label": "Research and validation",
        "tags": [
          "User interviews",
          "Contextual inquiry",
          "Usability testing",
          "Research synthesis",
          "Journey mapping",
          "Concept testing",
          "Qualitative and quantitative research",
          "Iterative design"
        ]
      },
      {
        "label": "Product strategy and measurement",
        "tags": [
          "Problem framing",
          "Opportunity sizing",
          "Prioritization",
          "Product strategy",
          "Success metrics",
          "Experimentation",
          "A/B testing",
          "Funnel analysis",
          "Post-launch iteration"
        ]
      },
      {
        "label": "Senior design leadership",
        "tags": [
          "Design ownership",
          "Cross-functional leadership",
          "Stakeholder influence",
          "Roadmap influence",
          "Decision-making under ambiguity",
          "Design critique",
          "Facilitation",
          "Mentoring",
          "Communicating trade-offs"
        ]
      }
    ],
    "tools": [
      "Maze",
      "UserTesting",
      "Dovetail",
      "Optimal Workshop",
      "Lookback",
      "Miro",
      "GA4",
      "Amplitude",
      "Mixpanel",
      "Hotjar"
    ]
  },
  {
    "name": "Accessibility",
    "color": "#0e3a22",
    "fg": "#c8f53c",
    "areas": [
      {
        "label": "Accessibility and inclusion",
        "tags": [
          "Inclusive design",
          "Accessibility testing",
          "WCAG 2.2 AA",
          "Keyboard navigation",
          "Screen-reader testing",
          "Focus management",
          "Reduced motion",
          "Localization"
        ]
      }
    ],
    "tools": [
      "Stark",
      "axe DevTools",
      "WAVE",
      "VoiceOver",
      "TalkBack",
      "NVDA"
    ]
  },
  {
    "name": "AI experience",
    "color": "#ff8fcf",
    "fg": "#121110",
    "areas": [
      {
        "label": "Human–AI interaction",
        "tags": [
          "Human-centered AI",
          "Generative AI UX",
          "AI onboarding",
          "Mental models",
          "Expectation setting",
          "Explainability",
          "Trust calibration",
          "Feedback loops"
        ]
      },
      {
        "label": "Conversation and model behavior",
        "tags": [
          "Conversational UX",
          "Conversation design",
          "UX writing for AI",
          "Intent handling",
          "Multi-turn interactions",
          "Clarification flows",
          "Tone and response design",
          "System prompting",
          "Prompt iteration"
        ]
      },
      {
        "label": "Agentic and multimodal UX",
        "tags": [
          "Agentic workflow design",
          "AI copilots",
          "Task delegation",
          "Human-in-the-loop review",
          "Approval flows",
          "Override and undo",
          "Multimodal interaction",
          "Voice and image inputs"
        ]
      },
      {
        "label": "Responsible AI and failure recovery",
        "tags": [
          "Uncertainty communication",
          "Hallucination handling",
          "Source attribution",
          "Privacy and consent",
          "Bias evaluation",
          "Safety guardrails",
          "Graceful failure",
          "Fallback design"
        ]
      }
    ],
    "tools": [
      "Google AI Studio",
      "Gemini API",
      "OpenAI Playground and API",
      "Claude Console and Anthropic API"
    ]
  },
  {
    "name": "AI evaluation",
    "color": "#2e3bff",
    "fg": "#f2eee3",
    "areas": [
      {
        "label": "AI evaluation",
        "tags": [
          "Model output evaluation",
          "Evaluation rubrics",
          "Test datasets",
          "Human evaluation",
          "Comparative prompt testing",
          "Edge-case testing",
          "Regression testing",
          "Task success",
          "Accuracy",
          "Relevance"
        ]
      },
      {
        "label": "Technical fluency",
        "tags": [
          "Large language models (LLMs)",
          "Model capabilities and limitations",
          "Context windows",
          "Retrieval-augmented generation (RAG)",
          "Grounding",
          "Tool/function calling",
          "Structured outputs",
          "Latency and streaming"
        ]
      }
    ],
    "tools": [
      "Google Cloud Vertex AI Gen AI evaluation",
      "OpenAI Evals",
      "LangSmith",
      "Promptfoo"
    ]
  }
];

export const process = [
  {
    "n": "01",
    "title": "HalO",
    "sub": "An SOS you can start with your phone in your bag.",
    "body": "HalO is a discreet safety ring and companion app concept for women commuting alone in urban and rural India.",
    "tags": [
      "Personal safety",
      "Wearable + app",
      "Concept project"
    ],
    "color": "#ff4f1f",
    "href": "cases/halo.dc.html",
    "thumb": "work/halo.webp",
    "thumbAlt": "The HalO ring and companion app on a phone",
    "readTime": "13 min read"
  },
  {
    "n": "02",
    "title": "Reframe",
    "sub": "Make the page easier to read. Keep the reader in charge.",
    "body": "I designed and built Reframe, a reading layer for existing websites. It lets people adjust how a page looks and reads, review suggested changes to the wording, and get back to the published version.",
    "tags": [
      "Accessibility",
      "AI explainability",
      "Chrome extension"
    ],
    "color": "#ff8fcf",
    "href": "cases/reframe.dc.html",
    "thumb": "work/reframe.webp",
    "thumbAlt": "Reframe running on a tablet",
    "readTime": "7 min read"
  },
  {
    "n": "03",
    "title": "Steer",
    "sub": "Taking a driving school off the group chat.",
    "body": "Steer gives supervisors one live view of the school and gives instructors a clear view of the next lesson.",
    "tags": [
      "Field research",
      "Web + mobile",
      "Concept project"
    ],
    "color": "#ffc22e",
    "href": "cases/steer.dc.html",
    "thumb": "work/steer.webp",
    "thumbAlt": "The Steer logo on a laptop",
    "readTime": "13 min read"
  },
  {
    "n": "04",
    "title": "ATLAS",
    "sub": "Delegate the work. Keep the judgment.",
    "body": "ATLAS is a control center for supervising AI agent work to inspect the plan, review consequential actions, and recover useful work when execution stops.",
    "tags": [
      "Agent experience",
      "Human-in-the-loop",
      "Prototype"
    ],
    "color": "#c8f53c",
    "href": "cases/atlas.dc.html",
    "thumb": "work/atlas.webp",
    "thumbAlt": "ATLAS Mission Control on a tablet",
    "readTime": "15 min read"
  },
  {
    "n": "05",
    "title": "Lineage",
    "sub": "Recover the shadow. Keep the progress.",
    "body": "Creative Lineage Canvas helps a designer bring back an earlier approved element while keeping the rest of the poster as it is today.",
    "tags": [
      "Provenance",
      "Design tooling",
      "Approvals"
    ],
    "color": "#2e3bff",
    "href": "cases/lineage.dc.html",
    "thumb": "work/lineage.webp",
    "thumbAlt": "Creative Lineage Canvas on a laptop",
    "readTime": "15 min read"
  }
];

export const faqs = [
  {
    "q": "Art and illustration",
    "a": "i can stare at one thing for hours. turns out that helps in design reviews too."
  },
  {
    "q": "Posters and side design",
    "a": "one client, no deadline, no tickets. still somehow the hardest brief i get."
  },
  {
    "q": "Photography",
    "a": "most of it is deciding what to leave out of the frame. so is a settings page."
  },
  {
    "q": "Bharatanatyam",
    "a": "years of counting beats and turning up to practice when nobody is watching."
  },
  {
    "q": "Event management",
    "a": "lots of people, one fixed date, no second take. a product launch with better snacks."
  },
  {
    "q": "UI experiments",
    "a": "small things i rebuild to see how they actually work. this site is one of them."
  },
  {
    "q": "Sketchbook pages",
    "a": "everything starts here. usually badly, usually in pencil."
  }
];

export const logos = ["ATLAS", "Reframe", "Lineage", "HalO", "Steer"];

export type CaseTemplate = "feed" | "search" | "reel" | "poster" | "carousel" | "shopping" | "video";
export type Case = {
  brand: string; sector: string; platform: string; result: string; metric: string; template: CaseTemplate;
  bg: string; fg: string; accent: string; headline: string; challenge: string; move: string; wins: string[];
};

export const cases: Case[] = [
  {
    "brand": "Illustration",
    "sector": "Pencil, ink, repeat",
    "platform": "Paper",
    "result": "hrs",
    "metric": "of looking closely",
    "template": "poster",
    "bg": "#0e3a22",
    "fg": "#c8f53c",
    "accent": "#ff8fcf",
    "headline": "LOOK.\nTHEN\nLOOK AGAIN.",
    "challenge": "I can stare at one thing for hours.",
    "move": "Turns out that is most of a design review.",
    "wins": [
      "Ink and pencil",
      "Nothing ships",
      "No feedback round"
    ]
  },
  {
    "brand": "Posters",
    "sector": "Side design",
    "platform": "Print",
    "result": "1",
    "metric": "client, and it's me",
    "template": "reel",
    "bg": "#ff4f1f",
    "fg": "#f2eee3",
    "accent": "#ffc22e",
    "headline": "NO\nBRIEF.\nNO\nMERCY.",
    "challenge": "One client, no deadline, no tickets.",
    "move": "Still somehow the hardest brief I get.",
    "wins": [
      "Type first",
      "Loud colour",
      "Printed, not posted"
    ]
  },
  {
    "brand": "Photography",
    "sector": "Framing practice",
    "platform": "Camera",
    "result": "90%",
    "metric": "of it is what you cut",
    "template": "search",
    "bg": "#ffc22e",
    "fg": "#121110",
    "accent": "#2e3bff",
    "headline": "LEAVE\nIT OUT.",
    "challenge": "Most of photography is deciding what stays out of frame.",
    "move": "So is a settings page.",
    "wins": [
      "Waiting for light",
      "One frame",
      "No crop later"
    ]
  },
  {
    "brand": "Bharatanatyam",
    "sector": "Classical dance",
    "platform": "Stage",
    "result": "8",
    "metric": "beats, every time",
    "template": "poster",
    "bg": "#ff8fcf",
    "fg": "#121110",
    "accent": "#0e3a22",
    "headline": "COUNT.\nTHEN\nCOMMIT.",
    "challenge": "Years of counting beats and turning up to practice.",
    "move": "Good for timing, on stage and in a stand-up.",
    "wins": [
      "Muscle memory",
      "Nobody watching",
      "Still counting"
    ]
  },
  {
    "brand": "Events",
    "sector": "Running the show",
    "platform": "Live",
    "result": "0",
    "metric": "second takes",
    "template": "reel",
    "bg": "#2e3bff",
    "fg": "#f2eee3",
    "accent": "#c8f53c",
    "headline": "ONE\nDATE.\nNO\nUNDO.",
    "challenge": "Lots of people, one fixed date, no rehearsal.",
    "move": "A product launch with better snacks.",
    "wins": [
      "Run sheets",
      "Backup plans",
      "Nobody noticed"
    ]
  },
  {
    "brand": "Experiments",
    "sector": "UI rebuilds",
    "platform": "Browser",
    "result": "this",
    "metric": "site, for one",
    "template": "search",
    "bg": "#0e3a22",
    "fg": "#c8f53c",
    "accent": "#ff4f1f",
    "headline": "TAKE IT\nAPART.",
    "challenge": "Small interfaces I rebuild to see how they actually work.",
    "move": "This site is one of them.",
    "wins": [
      "Built, not read",
      "Broken twice",
      "Fixed once"
    ]
  },
  {
    "brand": "Sketchbook",
    "sector": "Where it starts",
    "platform": "Pencil",
    "result": "all",
    "metric": "of it, badly at first",
    "template": "poster",
    "bg": "#f2eee3",
    "fg": "#121110",
    "accent": "#ff4f1f",
    "headline": "START\nBADLY.",
    "challenge": "Everything starts here.",
    "move": "Usually badly, usually in pencil.",
    "wins": [
      "Cheap to bin",
      "Fast to test",
      "No undo button"
    ]
  }
];

export const copy = {
  "gate": {
    "corner": "Mahima Shastry / UX Designer",
    "lead": "I design experiences people",
    "leadEm": "can't scroll past.",
    "enterSound": "enter with sound",
    "enterQuiet": "enter quietly",
    "headphones": [
      "headphones on?",
      "nice."
    ]
  },
  "hero": {
    "kicker": "Open to new opportunities",
    "kickerRight": "BASED IN BANGALORE",
    "line1": [
      "Less",
      "“wait, what?”"
    ],
    "line2": [
      "More",
      "“oh, nice?”"
    ],
    "srTitle": "Less wait, what? More oh, nice?",
    "bodyPre": "I spent around 4 years at IBM and Software AG designing and writing content for webMethods, the software engineers use to run their APIs and integrations. I also contributed to the IBM Carbon design system. These days I design agent experiences: the screens where a person decides how much to trust a machine.",
    "bodyPost": "",
    "ctaPrimary": "See UX Work",
    "ctaGhost": "See Content Design work",
    "circle": "SCROLL · MAHIMA SHASTRY · ",
    "note": [
      "psst. these stick.",
      " go on, drag 'em."
    ]
  },
  "manifesto": {
    "tag": "AX · agent experience",
    "pre": "Agent products are good at showing you what already happened. They are bad at showing you",
    "hl": "what is about to happen.",
    "mid": "That gap is the whole job, and it is where I",
    "end": "design.",
    "body": "The hard part of agent UX is not the conversation. It is the handover: the moment a person stops doing the work and starts supervising it. I design the gates in between, where someone sees the plan before it runs, reads the exact payload before approving it, sets what a task is allowed to touch, and gets their work back when a run fails.",
    "trackTag": "Three checks I design for",
    "words": [
      "Show.",
      "Scope.",
      "Recover."
    ],
    "searchPill": "ux designer for ai agents and human-in-the-loop",
    "hNote": [
      "every good agent flow",
      "starts with a human gate."
    ],
    "aside": [
      "(and then",
      "the happy path.)"
    ]
  },
  "logosLabel": "Five projects, start to finish",
  "google": {
    "tag": "(04) Content design · IBM & Software AG",
    "h1": "I make complex products",
    "h2": "make sense.",
    "body": "I started as a technical writer at Software AG, documenting API products for engineers with no patience for filler, then moved into the product as a UX writer and content designer. After the merger with IBM, I worked on webMethods API Gateway and the IBM integration platform. That is around four years of UX writing, technical documentation and content strategy, a contribution to the Carbon Design System, and the systems (guidelines, audits, IA models, terminology standards) that make quality the norm.",
    "frame": "language decisions, up close",
    "label": "Skills I gained there"
  },
  "meta": {
    "tag": "(08) Off the clock",
    "h1": "Figma shuts.",
    "h2": "The making doesn't.",
    "body": "Most of what I do outside work is still noticing things: what to leave in, what to cut, how long to hold a beat. It sharpens the day job more than any framework has.",
    "label": "Things I make",
    "bubbles": [
      [
        "coming to the studio? ",
        "x"
      ],
      [
        "bring the good pencils"
      ],
      [
        "i'm in. give me an hour."
      ]
    ],
    "stamp": [
      "Pencil.",
      "Down."
    ]
  },
  "work": {
    "dive": "Dive in.",
    "diveSub": "the fun stuff lives down here",
    "tag": "(07) Playground",
    "h1": "What I make",
    "h2": "when nobody's briefing me.",
    "circle": "CLICK A FRAME · HAVE A LOOK · "
  },
  "receipts": {
    "tag": "(08) About me",
    "h1": "Plot twist",
    "h2": "I started as an engineer.",
    "body": "I trained in electronics and communication, then worked out that I cared more about the people using the technology than the circuits inside it. Software AG (now IBM) hired me as a content designer, and I spent four years making API gateways and integration runtimes make sense to humans. Then AI showed up and I fell hard. Now I design AI that explains itself, so it works for everyone and not only the people who already speak tech."
  },
  "toolkit": {
    "title": "The actual",
    "titleEm": "toolkit",
    "tag": "(06) Skills",
    "body": "What I use, and what I can do with it. No skill bars, because nobody has ever been 87% good at Figma."
  },
  "processCopy": {
    "tag": "(03) Selected UX work",
    "h1": "Five projects,",
    "h2": "start to finish.",
    "body": "Three on AI and agent oversight, two on high-stakes products. Each one has a decision in it I would defend in a review. Open any card for the full story."
  },
  "quote": {
    "tag": "(05) Content design · Case studies",
    "h1": "Three case studies,",
    "h2": "told in full.",
    "body": "Each one opens on its own page with the complete write-up and the original screenshots. Two of them also link to the full PDF.",
    "cta": "Read the case study"
  },
  "faq": {
    "tag": "",
    "title": "",
    "top": "back to top"
  },
  "contact": {
    "tag": "(09) Say hi",
    "h1": "Got something",
    "h2": "hard to design?",
    "body": "Agent oversight, AI explainability, accessibility or a complex enterprise product. Those are my favourite kind of problem. Tell me what you are building and I will tell you how I would approach it. I usually reply within two working days.",
    "poke": "poke me. i squeak.",
    "replies": "replies in about two working days"
  },
  "footer": {
    "about": "A User experience designer working on agentic experience, AI explainability, and accessibility.",
    "legal": "© 2026 Mahima Shastry. Still sketching."
  }
};
