import { LightningElement } from 'lwc';

export default class BasicConditionalRendering extends LightningElement {

    // ── Which level is selected ──────────────────────────────────
    // Starts at 'beginner' — changes when user clicks a button
    selectedLevel = 'beginner';

    // ── Show/hide interview tips ─────────────────────────────────
    showTips = false;

    // ── All career data in one object ────────────────────────────
    // We use selectedLevel as a key to get the right level's data
    journeyData = {
        beginner: {
            label      : '🌱 Beginner',
            experience : '0 – 1 year',
            salary     : '₹3 – 6 LPA',
            description: 'You are starting your Salesforce journey. Focus on platform basics before diving into code.',
            skills: [
                'Salesforce navigation and setup',
                'Objects, fields and relationships',
                'Basic Flows and automation',
                'Reports and dashboards',
                'Basic SOQL queries'
            ],
            certs: [
                { name: 'Salesforce Administrator',  note: 'Foundation — do this first' },
                { name: 'Platform App Builder',      note: 'Builds on Admin knowledge'  },
                { name: 'Associate',                 note: 'Quick win — entry level'    }
            ],
            tips: [
                'Trailhead is your best friend — complete Ranger rank first',
                'Join Salesforce user groups in your city',
                'Build a free Developer Edition org and experiment daily'
            ]
        },
        developer: {
            label      : '💻 Developer',
            experience : '1 – 3 years',
            salary     : '₹6 – 14 LPA',
            description: 'You write code and build custom solutions. Master Apex and LWC to become highly employable.',
            skills: [
                'Apex classes, triggers and test classes',
                'Lightning Web Components (LWC)',
                'REST and SOAP API integration',
                'SOQL and SOSL queries',
                'Git and version control'
            ],
            certs: [
                { name: 'Platform Developer I',    note: 'Core developer cert — must have' },
                { name: 'JavaScript Developer I',  note: 'Proves LWC and JS skills'        },
                { name: 'Platform Developer II',   note: 'Advanced — sets you apart'        }
            ],
            tips: [
                'Build a GitHub portfolio with real LWC components — like this one!',
                'Contribute to open source Salesforce projects',
                'Practice coding challenges on Salesforce Ben and Focus on Force'
            ]
        },
        senior: {
            label      : '🚀 Senior Developer',
            experience : '3 – 6 years',
            salary     : '₹14 – 25 LPA',
            description: 'You lead technical design and mentor juniors. Architecture patterns and performance matter here.',
            skills: [
                'Integration architecture patterns',
                'Performance optimization and governor limits',
                'DevOps, CI/CD and scratch orgs',
                'Security model and sharing architecture',
                'Code review and technical mentorship'
            ],
            certs: [
                { name: 'Platform Developer II',              note: 'If not already done — do now' },
                { name: 'Integration Architecture Designer',  note: 'High value in the market'      },
                { name: 'Application Architect',              note: 'Proves senior-level thinking'   }
            ],
            tips: [
                'Write technical blogs — it proves thought leadership to hiring managers',
                'Speak at Dreamforce or local Salesforce events',
                'Mentor juniors — it sharpens your own knowledge'
            ]
        },
        architect: {
            label      : '🏗️ Architect',
            experience : '6+ years',
            salary     : '₹25 – 50+ LPA',
            description: 'You design enterprise-grade solutions and make strategic technology decisions. The pinnacle of Salesforce careers.',
            skills: [
                'Enterprise solution design and documentation',
                'Multi-cloud Salesforce architecture',
                'Governance frameworks and best practices',
                'Stakeholder and executive communication',
                'Technical vision and roadmap planning'
            ],
            certs: [
                { name: 'System Architect',              note: 'Mandatory prerequisite'          },
                { name: 'Application Architect',         note: 'Mandatory prerequisite'          },
                { name: 'Certified Technical Architect', note: 'CTA — the ultimate Salesforce cert' }
            ],
            tips: [
                'CTA board review requires presenting a solution live — practise constantly',
                'Build relationships with Salesforce MVPs and Product Managers',
                'Read the Salesforce Well-Architected Framework thoroughly'
            ]
        }
    };

    // ── Getters for lwc:if conditions ────────────────────────────
    // Used in HTML to show the right coloured banner
    get isBeginnerSelected()  { return this.selectedLevel === 'beginner';  }
    get isDeveloperSelected() { return this.selectedLevel === 'developer'; }
    get isSeniorSelected()    { return this.selectedLevel === 'senior';    }
    get isArchitectSelected() { return this.selectedLevel === 'architect'; }

    // ── Current level data ───────────────────────────────────────
    // Returns the full object for whichever level is selected
    // HTML uses this to show description, skills, certs, tips
    get currentLevel() {
        return this.journeyData[this.selectedLevel];
    }

    // ── Button variants ──────────────────────────────────────────
    // Selected button = "brand" (blue/highlighted)
    // Others = "neutral" (grey/outline)
    get beginnerVariant()  { return this.selectedLevel === 'beginner'  ? 'brand' : 'neutral'; }
    get developerVariant() { return this.selectedLevel === 'developer' ? 'brand' : 'neutral'; }
    get seniorVariant()    { return this.selectedLevel === 'senior'    ? 'brand' : 'neutral'; }
    get architectVariant() { return this.selectedLevel === 'architect' ? 'brand' : 'neutral'; }

    // ── Tips button label ────────────────────────────────────────
    get tipsLabel() {
        return this.showTips ? 'Hide Interview Tips' : 'Show Interview Tips';
    }

    // ── Event handlers ───────────────────────────────────────────
    // data-level on each button tells us which level was clicked
    selectLevel(event) {
        this.selectedLevel = event.target.dataset.level;
        this.showTips      = false; // reset tips on level change

        console.log('SelectedLevel : ' + this.selectedLevel);
    }

    toggleTips() {
        this.showTips = !this.showTips;
    }
}