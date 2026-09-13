export type Language = 'en' | 'hi' | 'kn';

export interface Translations {
  // App
  appName: string;
  tagline: string;
  govAi: string;
  citizenView: string;
  adminMode: string;
  dashboard: string;
  switchToCitizen: string;
  switchToAdmin: string;

  // Nav
  navHome: string;
  navPolicies: string;
  navForYou: string;
  navAskJanVaani: string;
  navMap: string;
  navCompare: string;
  navSentiment: string;
  navVoting: string;
  navAlerts: string;

  // Banner
  topBannerText: string;
  topBannerGazette: string;
  topBannerRti: string;

  // Hero
  heroHeadline: string;
  heroSubheadline: string;
  searchPlaceholder: string;
  searchPolicies: string;

  // Stats
  municipalPolicies: string;
  groundedCitations: string;
  gisMappedZones: string;
  quadraticVotingArena: string;

  // Home
  showingImpactFor: string;
  personalizedView: string;
  viewDeadlines: string;
  deadline: string;
  draftPublicComment: string;
  readPolicy: string;
  browseAll: string;
  officialMunicipalBylaws: string;
  civicAiEcosystem: string;
  civicAiEcosystemDesc: string;

  // Feature cards
  groundedRagAssistant: string;
  groundedRagDesc: string;
  interactiveWardGIS: string;
  interactiveWardGISDesc: string;
  oldVsNewPolicy: string;
  oldVsNewPolicyDesc: string;
  quadraticCivicVoting: string;
  quadraticCivicVotingDesc: string;
  citizenResponseAssistant2: string;
  citizenResponseAssistant2Desc: string;
  publicSentimentTracker: string;
  publicSentimentTrackerDesc: string;

  // Shared
  askJanVaani: string;
  policiesAffectingArea: string;
  recentChanges: string;
  activeConsultations: string;
  explainLikeCitizen: string;
  originalGovtText: string;
  simpleExplanation: string;
  whatChanged: string;
  whoIsAffected: string;
  whereItApplies: string;
  whenTakesEffect: string;
  requirements: string;
  positiveImpacts: string;
  negativeImpacts: string;
  deadlines: string;
  glossary: string;
  officialCitation: string;
  confidenceScore: string;
  publicSentiment: string;
  quadraticVoting: string;
  comparePolicies: string;
  citizenImpactReport: string;
  citizenResponseAssistant: string;
  alertsNotifications: string;
  forYou: string;
  exploreMap: string;
  adminPortal: string;
  votingCredits: string;
  creditsRemaining: string;
  votesAllocated: string;
  support: string;
  oppose: string;
  neutral: string;
  generateDraft: string;
  officialSourceDisclaimer: string;
  insufficientEvidenceMessage: string;

  // Policies page
  municipalTransparencyPortal: string;
  browsePolicies: string;
  browsePoliciesDesc: string;
  searchKeywordOrCode: string;
  allCategories: string;
  allStatuses: string;
  allWards: string;
  foundPolicies: string;
  resetFilters: string;
  noPoliciesFound: string;
  noPoliciesFoundDesc: string;
  resetAllFilters: string;

  // For You page
  personalizedCivicEngine: string;
  yourPolicyFeed: string;
  yourPolicyFeedDesc: string;
  citizenPreferences: string;
  yourSelectedWard: string;
  matchedLocality: string;
  yourCivicInterests: string;
  housingZoning: string;
  trafficRoads: string;
  wasteSegregation: string;
  rooftopSolar: string;
  propertyTax: string;
  newPoliciesAffect: string;
  filteredFor: string;
  viewOnMap: string;
  tailoredPolicyStream: string;
  showingPolicies: string;
  noMatchingPolicies: string;
  resetInterestFilters: string;

  // Map page
  gisMunicipalEngine: string;
  interactiveCivicMap: string;
  interactiveCivicMapDesc: string;
  allLayers: string;
  zoningZones: string;
  transitCorridors: string;
  clickWardToInspect: string;
  bbmpWard: string;
  policiesAffectingWard: string;
  spatialMatch: string;
  loadingWardMappings: string;
  noActivePolicies: string;
  draftResponse: string;
  viewDetails: string;
  personalizeWardFeed: string;
  inspectImpactedPolicies: string;

  // Ask JanVaani
  groundedEvidenceRag: string;
  askJanVaaniTitle: string;
  askJanVaaniDesc: string;
  filterByScope: string;
  allPoliciesBroad: string;
  groundedEvidenceCitations: string;
  zeroHallucinationPolicy: string;
  suggestions: string;
  searchingDatabase: string;
  askMunicipalQuestion: string;
  welcomeMessage: string;

  // Compare
  policyEvolutionEngine: string;
  comparePoliciesTitle: string;
  comparePoliciesDesc: string;
  selectPolicyToCompare: string;
  previousVersion: string;
  newVersion: string;
  currentVersion: string;
  supersedes: string;
  clauseChanges: string;
  keyDelta: string;
  added: string;
  removed: string;
  modified: string;
  viewFullPolicy: string;
  viewImpactReport: string;
  askAboutChanges: string;

  // Sentiment
  publicOpinionEngine: string;
  publicSentimentTitle: string;
  publicSentimentDesc: string;
  selectPolicyForSentiment: string;
  totalParticipants: string;
  sentimentBreakdown: string;
  recentPublicComments: string;
  submitYourStance: string;
  yourAnonymousStance: string;
  optionalComment: string;
  submitStance: string;
  anonymousStanceSubmitted: string;

  // Quadratic Voting
  democraticPriorityEngine: string;
  quadraticVotingTitle: string;
  quadraticVotingDesc: string;
  civicVotingCredits: string;
  creditsUsed: string;
  formula: string;
  distributeCredits: string;
  confirmCast: string;
  castingVotes: string;
  votesCast: string;
  allocate: string;
  deallocate: string;
  currentAllocation: string;
  creditsSpent: string;
  votesAwarded: string;

  // Citizen Response
  citizenResponseTitle: string;
  citizenResponseDesc: string;
  selectPolicy: string;
  responseType: string;
  yourPosition: string;
  specificConcerns: string;
  additionalPoints: string;
  generating: string;
  copyDraft: string;
  copied: string;
  publicCommentFeedback: string;
  formalObjection: string;
  rtiRequest: string;

  // Alerts
  alertsTitle: string;
  alertsDesc: string;
  newPolicy: string;
  deadlineAlert: string;
  councilMeeting: string;
  modification: string;
  viewRelatedPolicy: string;
  noAlertsFound: string;

  // Impact Report
  citizenImpactReportTitle: string;
  impactReportDesc: string;
  generatingReport: string;
  reportGeneratedFor: string;
  authorativeSourceNote: string;
  downloadReport: string;

  // Admin
  adminDashboardTitle: string;
  adminDashboardDesc: string;
  totalDocuments: string;
  totalChunks: string;
  totalPolicies: string;
  uploadDocument: string;
  uploadDesc: string;
  chooseFile: string;
  uploading: string;
  uploadSuccess: string;
  documentTitle: string;
  processingStatus: string;
  viewChunks: string;
  chunksLoaded: string;

  // Footer
  madeFor: string;
  hackathon: string;
  poweredBy: string;
  openSource: string;
}

export const translations: Record<Language, Translations> = {
  en: {
    appName: "JANVAANI",
    tagline: "Voice of the People",
    govAi: "Gov AI",
    citizenView: "Citizen View",
    adminMode: "Admin Mode",
    dashboard: "Dashboard",
    switchToCitizen: "Switch to Citizen",
    switchToAdmin: "Switch to Admin",

    navHome: "Home",
    navPolicies: "Policies",
    navForYou: "For You",
    navAskJanVaani: "Ask JanVaani",
    navMap: "Map",
    navCompare: "Compare",
    navSentiment: "Public Sentiment",
    navVoting: "Quadratic Voting",
    navAlerts: "Alerts",

    topBannerText: "MUNICIPAL CIVIC TRANSPARENCY PLATFORM • BENGALURU MUNICIPAL PILOT",
    topBannerGazette: "Official Gazette Records Grounded",
    topBannerRti: "RTI & Ward Committee Integration",

    heroHeadline: "Government policies shouldn't be difficult to understand.",
    heroSubheadline: "Understand municipal notifications, analyze impacts on your neighborhood, ask grounded AI questions, and make your voice heard through quadratic civic voting.",
    searchPlaceholder: "Search policies by keyword, ward, or topic (e.g., 'zoning', 'waste segregation', '560038')...",
    searchPolicies: "Search Policies",

    municipalPolicies: "Municipal Policies",
    groundedCitations: "Grounded Citations",
    gisMappedZones: "GIS Mapped Zones",
    quadraticVotingArena: "Quadratic Voting Arena",

    showingImpactFor: "Showing policy impact analysis for",
    personalizedView: "Personalized View",
    viewDeadlines: "View Deadlines",
    deadline: "Deadline",
    draftPublicComment: "Draft Public Comment",
    readPolicy: "Read Policy",
    browseAll: "Browse All Policies",
    officialMunicipalBylaws: "Official municipal bylaws and planning notifications translated into citizen language.",
    civicAiEcosystem: "A Complete Civic AI Ecosystem",
    civicAiEcosystemDesc: "Combining grounded RAG retrieval, GIS ward analytics, multi-agent AI verification, and democratic voting mechanisms.",

    groundedRagAssistant: "Grounded RAG Assistant",
    groundedRagDesc: "Ask questions and receive answers cited from exact gazette pages with verified confidence scores. Zero hallucinations.",
    interactiveWardGIS: "Interactive Ward GIS Map",
    interactiveWardGISDesc: "Explore municipal ward boundaries, transit corridors, and zoning overlays to see localized policy impact.",
    oldVsNewPolicy: "Old vs New Policy Comparison",
    oldVsNewPolicyDesc: "Compare previous vs amended clauses side-by-side with numerical delta tracking (e.g. 15m → 24m).",
    quadraticCivicVoting: "Quadratic Civic Voting",
    quadraticCivicVotingDesc: "Distribute 100 civic voting credits (Votes = floor(√credits)) across key municipal priorities.",
    citizenResponseAssistant2: "Citizen Response Assistant",
    citizenResponseAssistant2Desc: "Generate formal, respectful public consultation feedback drafts, objections, and RTI filings.",
    publicSentimentTracker: "Public Sentiment Tracker",
    publicSentimentTrackerDesc: "Cast anonymous stances (Support / Oppose / Neutral) and monitor community feedback trends safely.",

    askJanVaani: "Ask JanVaani",
    policiesAffectingArea: "Policies Affecting Your Area",
    recentChanges: "Recent Policy Changes",
    activeConsultations: "Active Public Consultations",
    explainLikeCitizen: "Explain Like I'm a Citizen",
    originalGovtText: "Original Government Text",
    simpleExplanation: "Simple Explanation",
    whatChanged: "What changed?",
    whoIsAffected: "Who is affected?",
    whereItApplies: "Where does it apply?",
    whenTakesEffect: "When does it take effect?",
    requirements: "Important Requirements",
    positiveImpacts: "Possible Benefits",
    negativeImpacts: "Possible Concerns",
    deadlines: "Important Deadlines",
    glossary: "Definitions of Key Terms",
    officialCitation: "Official Gazette Citation",
    confidenceScore: "Evidence Grounding Confidence",
    publicSentiment: "Public Sentiment",
    quadraticVoting: "Quadratic Voting",
    comparePolicies: "Compare Policies",
    citizenImpactReport: "Citizen Impact Report",
    citizenResponseAssistant: "Citizen Response Assistant",
    alertsNotifications: "Civic Alerts & Notices",
    forYou: "For You",
    exploreMap: "Interactive Civic Map",
    adminPortal: "Admin Portal",
    votingCredits: "Civic Voting Credits",
    creditsRemaining: "Credits Remaining",
    votesAllocated: "Votes Allocated",
    support: "Support",
    oppose: "Oppose",
    neutral: "Neutral",
    generateDraft: "Generate Formal Civic Draft",
    officialSourceDisclaimer: "Official government gazette records remain the authoritative source. AI translations and summaries are for accessible civic understanding.",
    insufficientEvidenceMessage: "I couldn't find enough evidence in the available official documents to answer this confidently.",

    municipalTransparencyPortal: "Municipal Transparency Portal",
    browsePolicies: "Browse Municipal Policies & Gazettes",
    browsePoliciesDesc: "Search and filter verified city council policies, zoning amendments, and transit corridors. Every policy includes plain language summaries and grounded citations.",
    searchKeywordOrCode: "Search keyword or code...",
    allCategories: "All Categories",
    allStatuses: "All Statuses",
    allWards: "All Wards",
    foundPolicies: "matching municipal policies",
    resetFilters: "Reset Filters",
    noPoliciesFound: "No policies found",
    noPoliciesFoundDesc: "Try adjusting your search criteria or resetting filters to view all available municipal records.",
    resetAllFilters: "Reset All Filters",

    personalizedCivicEngine: "Personalized Civic Engine",
    yourPolicyFeed: "Your Personalized Policy Feed",
    yourPolicyFeedDesc: "Instead of wading through hundreds of pages of municipal gazettes, JanVaani matches policies directly to your neighborhood and citizen interests.",
    citizenPreferences: "Citizen Preferences & Location Profile",
    yourSelectedWard: "1. Your Selected Ward / Locality",
    matchedLocality: "Matched locality",
    yourCivicInterests: "2. Your Civic Interest Areas",
    housingZoning: "Housing & Zoning Regulations",
    trafficRoads: "Traffic, Roads & Public Transit",
    wasteSegregation: "Waste Segregation & Sanitation",
    rooftopSolar: "Rooftop Solar & Clean Energy",
    propertyTax: "Property Tax & Betterment Levies",
    newPoliciesAffect: "new municipal policies directly affect your selected area and interests.",
    filteredFor: "Filtered for",
    viewOnMap: "View on GIS Map",
    tailoredPolicyStream: "Your Tailored Policy Impact Stream",
    showingPolicies: "Showing prioritized policies",
    noMatchingPolicies: "No policies match your selected interest filters.",
    resetInterestFilters: "Reset Interest Filters",

    gisMunicipalEngine: "GIS Municipal Spatial Engine",
    interactiveCivicMap: "Interactive Civic Map",
    interactiveCivicMapDesc: "Click on any municipal ward boundary or select from the list to see verified policy impacts, zoning allowances, and infrastructure corridors.",
    allLayers: "All Layers",
    zoningZones: "Zoning 24m Zones",
    transitCorridors: "Transit Corridors",
    clickWardToInspect: "Click any ward on the map to inspect its municipal impact details.",
    bbmpWard: "BBMP Ward",
    policiesAffectingWard: "Policies Affecting This Ward",
    spatialMatch: "Spatial Match",
    loadingWardMappings: "Loading ward policy mappings...",
    noActivePolicies: "No active municipal policy impacts recorded for this ward.",
    draftResponse: "Draft Response",
    viewDetails: "View Details",
    personalizeWardFeed: "Personalize My Ward Feed",
    inspectImpactedPolicies: "Inspect Impacted Policies",

    groundedEvidenceRag: "Grounded Evidence RAG Engine",
    askJanVaaniTitle: "Ask JanVaani",
    askJanVaaniDesc: "Direct questions answered exclusively from official city council records with exact citations.",
    filterByScope: "Filter By Policy Scope:",
    allPoliciesBroad: "All Municipal Policies (Broad Retrieval)",
    groundedEvidenceCitations: "Grounded Evidence Citations:",
    zeroHallucinationPolicy: "Zero-hallucination policy: No unverified claims presented as facts.",
    suggestions: "Suggestions:",
    searchingDatabase: "Searching vector database & synthesizing grounded evidence...",
    askMunicipalQuestion: "Ask a question about municipal policies, zoning rules, or deadlines...",
    welcomeMessage: "Namaskara! I am JanVaani, your grounded municipal AI assistant. Ask me anything about BBMP zoning regulations, road expansions, waste management rules, or rooftop solar mandates. Every answer is strictly verified against official gazette chunks with page citations.",

    policyEvolutionEngine: "Policy Evolution Engine",
    comparePoliciesTitle: "Policy Comparison",
    comparePoliciesDesc: "See exactly what changed between old and new versions of municipal bylaws.",
    selectPolicyToCompare: "Select Policy to Compare",
    previousVersion: "Previous Version",
    newVersion: "New Version",
    currentVersion: "Current Version",
    supersedes: "Supersedes",
    clauseChanges: "Clause Changes",
    keyDelta: "Key Delta",
    added: "Added",
    removed: "Removed",
    modified: "Modified",
    viewFullPolicy: "View Full Policy",
    viewImpactReport: "View Impact Report",
    askAboutChanges: "Ask About Changes",

    publicOpinionEngine: "Public Opinion Engine",
    publicSentimentTitle: "Public Sentiment Dashboard",
    publicSentimentDesc: "Anonymous community stances on active municipal policies, verified and aggregated in real time.",
    selectPolicyForSentiment: "Select Policy",
    totalParticipants: "Total Participants",
    sentimentBreakdown: "Sentiment Breakdown",
    recentPublicComments: "Recent Public Comments",
    submitYourStance: "Submit Your Anonymous Stance",
    yourAnonymousStance: "Your Anonymous Stance",
    optionalComment: "Optional: Add a comment (anonymous)",
    submitStance: "Submit Stance Anonymously",
    anonymousStanceSubmitted: "Your anonymous civic stance was securely recorded.",

    democraticPriorityEngine: "Democratic Priority Engine",
    quadraticVotingTitle: "Quadratic Civic Voting",
    quadraticVotingDesc: "Use your 100 civic credits to express the intensity of your preferences across key municipal priorities. The more credits on one topic, the fewer votes per credit — ensuring balanced representation.",
    civicVotingCredits: "Your Civic Voting Credits",
    creditsUsed: "Credits Used",
    formula: "Formula",
    distributeCredits: "Distribute Your Credits",
    confirmCast: "Confirm & Cast All Votes",
    castingVotes: "Casting Votes...",
    votesCast: "Votes Cast Successfully!",
    allocate: "Allocate",
    deallocate: "Deallocate",
    currentAllocation: "Current Allocation",
    creditsSpent: "credits spent",
    votesAwarded: "votes awarded",

    citizenResponseTitle: "Citizen Response Assistant",
    citizenResponseDesc: "Generate formal public consultation feedback, objections, or RTI requests using AI — grounded in the official policy text.",
    selectPolicy: "Select Policy",
    responseType: "Response Type",
    yourPosition: "Your Position / Stance",
    specificConcerns: "Your Specific Concerns",
    additionalPoints: "Additional Points (optional)",
    generating: "Generating...",
    copyDraft: "Copy Draft",
    copied: "Copied!",
    publicCommentFeedback: "Public Comment / Feedback",
    formalObjection: "Formal Objection",
    rtiRequest: "RTI Request",

    alertsTitle: "Civic Alerts & Notices",
    alertsDesc: "Real-time municipal notifications — policy deadlines, council meetings, and new gazette publications.",
    newPolicy: "New Policy",
    deadlineAlert: "Deadline Alert",
    councilMeeting: "Council Meeting",
    modification: "Modification",
    viewRelatedPolicy: "View Related Policy",
    noAlertsFound: "No alerts found for the selected filters.",

    citizenImpactReportTitle: "Citizen Impact Report",
    impactReportDesc: "Comprehensive AI-generated breakdown of how this policy affects citizens, businesses, and neighborhoods — grounded in official text.",
    generatingReport: "Generating your citizen impact report...",
    reportGeneratedFor: "Report generated for",
    authorativeSourceNote: "This report is generated from official gazette records.",
    downloadReport: "Download Report",

    adminDashboardTitle: "Admin Dashboard",
    adminDashboardDesc: "Upload and manage municipal policy documents, monitor the vector index, and track ingestion pipeline status.",
    totalDocuments: "Total Documents",
    totalChunks: "Total Chunks",
    totalPolicies: "Total Policies",
    uploadDocument: "Upload Municipal Document",
    uploadDesc: "Upload PDF or text files of municipal gazettes, bylaws, or council meeting minutes to index them into the RAG engine.",
    chooseFile: "Choose file...",
    uploading: "Uploading & Indexing...",
    uploadSuccess: "Document uploaded and indexed successfully!",
    documentTitle: "Document Title",
    processingStatus: "Status",
    viewChunks: "View Chunks",
    chunksLoaded: "chunks loaded",

    madeFor: "Made for",
    hackathon: "Civic AI Hackathon",
    poweredBy: "Powered by Python RAG + React + GIS",
    openSource: "Open Source",
  },

  hi: {
    appName: "जनवाणी",
    tagline: "जनता की आवाज़",
    govAi: "सरकारी AI",
    citizenView: "नागरिक दृश्य",
    adminMode: "प्रशासक मोड",
    dashboard: "डैशबोर्ड",
    switchToCitizen: "नागरिक मोड पर जाएं",
    switchToAdmin: "प्रशासक मोड पर जाएं",

    navHome: "मुख्य पृष्ठ",
    navPolicies: "नीतियां",
    navForYou: "आपके लिए",
    navAskJanVaani: "जनवाणी से पूछें",
    navMap: "मानचित्र",
    navCompare: "तुलना करें",
    navSentiment: "जनमत",
    navVoting: "द्विघात मतदान",
    navAlerts: "अलर्ट",

    topBannerText: "नगरपालिका नागरिक पारदर्शिता मंच • बेंगलुरु नगर निगम पायलट",
    topBannerGazette: "आधिकारिक राजपत्र अभिलेखों पर आधारित",
    topBannerRti: "RTI एवं वार्ड समिति एकीकरण",

    heroHeadline: "सरकारी नीतियों को समझना कठिन नहीं होना चाहिए।",
    heroSubheadline: "नगर निगम की अधिसूचनाओं को समझें, अपने क्षेत्र पर प्रभाव जानें, प्रामाणिक AI से सवाल पूछें और द्विघात मतदान के माध्यम से अपनी राय दर्ज करें।",
    searchPlaceholder: "कीवर्ड, वार्ड या विषय से नीतियां खोजें (उदा. 'ज़ोनिंग', 'कचरा पृथक्करण', '560038')...",
    searchPolicies: "नीतियां खोजें",

    municipalPolicies: "नगर निगम नीतियां",
    groundedCitations: "प्रमाणित उद्धरण",
    gisMappedZones: "GIS मैप्ड ज़ोन",
    quadraticVotingArena: "द्विघात मतदान अखाड़ा",

    showingImpactFor: "के लिए नीति प्रभाव विश्लेषण दिखाया जा रहा है",
    personalizedView: "व्यक्तिगत दृश्य",
    viewDeadlines: "समय सीमाएं देखें",
    deadline: "समय सीमा",
    draftPublicComment: "सार्वजनिक टिप्पणी का मसौदा",
    readPolicy: "नीति पढ़ें",
    browseAll: "सभी नीतियां देखें",
    officialMunicipalBylaws: "आधिकारिक नगरपालिका उपनियम नागरिक भाषा में अनुवादित।",
    civicAiEcosystem: "एक संपूर्ण नागरिक AI प्रणाली",
    civicAiEcosystemDesc: "RAG पुनर्प्राप्ति, GIS वार्ड विश्लेषण, बहु-एजेंट AI सत्यापन और लोकतांत्रिक मतदान का संयोजन।",

    groundedRagAssistant: "प्रमाणित RAG सहायक",
    groundedRagDesc: "सरकारी गजट के सटीक पृष्ठों से उद्धृत उत्तर पाएं। शून्य मनगढ़ंत जानकारी।",
    interactiveWardGIS: "इंटरैक्टिव वार्ड GIS नक्शा",
    interactiveWardGISDesc: "नगरपालिका वार्ड सीमाओं, परिवहन गलियारों और ज़ोनिंग को देखें।",
    oldVsNewPolicy: "पुरानी बनाम नई नीति तुलना",
    oldVsNewPolicyDesc: "पिछले बनाम संशोधित खंडों की तुलना करें।",
    quadraticCivicVoting: "द्विघात नागरिक मतदान",
    quadraticCivicVotingDesc: "100 नागरिक मतदान क्रेडिट वितरित करें (मत = floor(√क्रेडिट))।",
    citizenResponseAssistant2: "नागरिक प्रतिक्रिया सहायक",
    citizenResponseAssistant2Desc: "औपचारिक सार्वजनिक परामर्श मसौदे, आपत्तियां और RTI दाखिलें तैयार करें।",
    publicSentimentTracker: "जनमत ट्रैकर",
    publicSentimentTrackerDesc: "गुमनाम रुख (समर्थन/विरोध/तटस्थ) दर्ज करें और सामुदायिक प्रतिक्रिया देखें।",

    askJanVaani: "जनवाणी से पूछें",
    policiesAffectingArea: "आपके क्षेत्र को प्रभावित करने वाली नीतियां",
    recentChanges: "हाल के नीतिगत बदलाव",
    activeConsultations: "सक्रिय सार्वजनिक परामर्श",
    explainLikeCitizen: "नागरिक के लिए सरल भाषा में समझें",
    originalGovtText: "मूल सरकारी दस्तावेज़",
    simpleExplanation: "सरल स्पष्टीकरण",
    whatChanged: "क्या बदलाव हुआ?",
    whoIsAffected: "कौन प्रभावित होगा?",
    whereItApplies: "यह कहाँ लागू होता है?",
    whenTakesEffect: "यह कब लागू होगा?",
    requirements: "महत्वपूर्ण आवश्यकताएँ",
    positiveImpacts: "संभावित लाभ",
    negativeImpacts: "संभावित चिंताएं",
    deadlines: "महत्वपूर्ण समय सीमा",
    glossary: "प्रमुख तकनीकी शब्दों के अर्थ",
    officialCitation: "आधिकारिक राजपत्र संदर्भ",
    confidenceScore: "साक्ष्य प्रामाणिकता स्कोर",
    publicSentiment: "जनमत और भावना",
    quadraticVoting: "द्विघात मतदान",
    comparePolicies: "नीतियों की तुलना करें",
    citizenImpactReport: "नागरिक प्रभाव रिपोर्ट",
    citizenResponseAssistant: "नागरिक प्रतिक्रिया सहायक",
    alertsNotifications: "नागरिक अलर्ट व सूचनाएं",
    forYou: "आपके लिए",
    exploreMap: "इंटरैक्टिव नागरिक मानचित्र",
    adminPortal: "प्रशासक पोर्टल",
    votingCredits: "नागरिक मतदान क्रेडिट",
    creditsRemaining: "शेष क्रेडिट",
    votesAllocated: "आवंटित वोट",
    support: "समर्थन",
    oppose: "विरोध",
    neutral: "तटस्थ",
    generateDraft: "नागरिक प्रारूप तैयार करें",
    officialSourceDisclaimer: "मूल सरकारी दस्तावेज़ ही प्रामाणिक स्रोत हैं। यह AI अनुवाद नागरिक समझ के लिए है।",
    insufficientEvidenceMessage: "उपलब्ध आधिकारिक दस्तावेजों में विश्वासपूर्वक उत्तर देने के लिए पर्याप्त साक्ष्य नहीं मिले।",

    municipalTransparencyPortal: "नगरपालिका पारदर्शिता पोर्टल",
    browsePolicies: "नगरपालिका नीतियां और राजपत्र",
    browsePoliciesDesc: "सत्यापित नगर परिषद नीतियां, ज़ोनिंग संशोधन और परिवहन गलियारे खोजें।",
    searchKeywordOrCode: "कीवर्ड या कोड से खोजें...",
    allCategories: "सभी श्रेणियां",
    allStatuses: "सभी स्थितियां",
    allWards: "सभी वार्ड",
    foundPolicies: "नगरपालिका नीतियां मिलीं",
    resetFilters: "फ़िल्टर रीसेट करें",
    noPoliciesFound: "कोई नीति नहीं मिली",
    noPoliciesFoundDesc: "खोज मानदंड समायोजित करें या सभी नगरपालिका रिकॉर्ड देखने के लिए फ़िल्टर रीसेट करें।",
    resetAllFilters: "सभी फ़िल्टर रीसेट करें",

    personalizedCivicEngine: "व्यक्तिगत नागरिक इंजन",
    yourPolicyFeed: "आपका व्यक्तिगत नीति फ़ीड",
    yourPolicyFeedDesc: "सैकड़ों पृष्ठों के बजाय, जनवाणी सीधे आपके पड़ोस और रुचियों के अनुसार नीतियां दिखाती है।",
    citizenPreferences: "नागरिक प्राथमिकताएं और स्थान प्रोफ़ाइल",
    yourSelectedWard: "1. आपका चुना हुआ वार्ड / इलाका",
    matchedLocality: "मिलान किया इलाका",
    yourCivicInterests: "2. आपके नागरिक रुचि क्षेत्र",
    housingZoning: "आवास और ज़ोनिंग नियम",
    trafficRoads: "यातायात, सड़कें और सार्वजनिक परिवहन",
    wasteSegregation: "कचरा पृथक्करण और स्वच्छता",
    rooftopSolar: "छत पर सौर और स्वच्छ ऊर्जा",
    propertyTax: "संपत्ति कर और बेहतरी लेवी",
    newPoliciesAffect: "नई नगरपालिका नीतियां आपके चुने क्षेत्र और रुचियों को सीधे प्रभावित करती हैं।",
    filteredFor: "फ़िल्टर किया गया",
    viewOnMap: "GIS नक्शे पर देखें",
    tailoredPolicyStream: "आपकी अनुकूलित नीति प्रभाव धारा",
    showingPolicies: "प्राथमिक नीतियां दिखाई जा रही हैं",
    noMatchingPolicies: "चुने हुए फ़िल्टर से कोई नीति मेल नहीं खाती।",
    resetInterestFilters: "रुचि फ़िल्टर रीसेट करें",

    gisMunicipalEngine: "GIS नगरपालिका स्थानिक इंजन",
    interactiveCivicMap: "इंटरैक्टिव नागरिक नक्शा",
    interactiveCivicMapDesc: "किसी भी वार्ड सीमा पर क्लिक करें और नीति प्रभाव, ज़ोनिंग और बुनियादी ढांचे की जानकारी देखें।",
    allLayers: "सभी परतें",
    zoningZones: "ज़ोनिंग 24m क्षेत्र",
    transitCorridors: "परिवहन गलियारे",
    clickWardToInspect: "नगरपालिका प्रभाव विवरण देखने के लिए नक्शे पर कोई वार्ड क्लिक करें।",
    bbmpWard: "BBMP वार्ड",
    policiesAffectingWard: "इस वार्ड को प्रभावित करने वाली नीतियां",
    spatialMatch: "स्थानिक मिलान",
    loadingWardMappings: "वार्ड नीति मैपिंग लोड हो रही है...",
    noActivePolicies: "इस वार्ड के लिए कोई सक्रिय नीति प्रभाव दर्ज नहीं है।",
    draftResponse: "मसौदा प्रतिक्रिया",
    viewDetails: "विवरण देखें",
    personalizeWardFeed: "मेरा वार्ड फ़ीड व्यक्तिगत बनाएं",
    inspectImpactedPolicies: "प्रभावित नीतियां जांचें",

    groundedEvidenceRag: "प्रमाणित साक्ष्य RAG इंजन",
    askJanVaaniTitle: "जनवाणी से पूछें",
    askJanVaaniDesc: "आधिकारिक नगर परिषद रिकॉर्ड से सटीक उद्धरण सहित उत्तर।",
    filterByScope: "नीति दायरे से फ़िल्टर करें:",
    allPoliciesBroad: "सभी नगरपालिका नीतियां (व्यापक खोज)",
    groundedEvidenceCitations: "प्रमाणित साक्ष्य उद्धरण:",
    zeroHallucinationPolicy: "शून्य मनगढ़ंत नीति: कोई असत्यापित दावा तथ्य के रूप में प्रस्तुत नहीं।",
    suggestions: "सुझाव:",
    searchingDatabase: "वेक्टर डेटाबेस खोजा जा रहा है और साक्ष्य संश्लेषित किया जा रहा है...",
    askMunicipalQuestion: "नगरपालिका नीतियों, ज़ोनिंग नियमों या समय सीमाओं के बारे में प्रश्न पूछें...",
    welcomeMessage: "नमस्कार! मैं जनवाणी हूं, आपका प्रमाणित नगरपालिका AI सहायक। BBMP ज़ोनिंग नियमों, सड़क विस्तार, कचरा प्रबंधन या सौर अनिवार्यता के बारे में कुछ भी पूछें।",

    policyEvolutionEngine: "नीति विकास इंजन",
    comparePoliciesTitle: "नीति तुलना",
    comparePoliciesDesc: "नगरपालिका उपनियमों के पुराने और नए संस्करणों के बीच सटीक बदलाव देखें।",
    selectPolicyToCompare: "तुलना के लिए नीति चुनें",
    previousVersion: "पिछला संस्करण",
    newVersion: "नया संस्करण",
    currentVersion: "वर्तमान संस्करण",
    supersedes: "प्रतिस्थापित करता है",
    clauseChanges: "खंड परिवर्तन",
    keyDelta: "प्रमुख अंतर",
    added: "जोड़ा गया",
    removed: "हटाया गया",
    modified: "संशोधित",
    viewFullPolicy: "पूरी नीति देखें",
    viewImpactReport: "प्रभाव रिपोर्ट देखें",
    askAboutChanges: "बदलावों के बारे में पूछें",

    publicOpinionEngine: "जनमत इंजन",
    publicSentimentTitle: "जनमत डैशबोर्ड",
    publicSentimentDesc: "सक्रिय नगरपालिका नीतियों पर गुमनाम सामुदायिक रुख, वास्तविक समय में सत्यापित।",
    selectPolicyForSentiment: "नीति चुनें",
    totalParticipants: "कुल प्रतिभागी",
    sentimentBreakdown: "भावना विश्लेषण",
    recentPublicComments: "हालिया सार्वजनिक टिप्पणियां",
    submitYourStance: "अपना गुमनाम रुख दर्ज करें",
    yourAnonymousStance: "आपका गुमनाम रुख",
    optionalComment: "वैकल्पिक: एक टिप्पणी जोड़ें (गुमनाम)",
    submitStance: "गुमनाम रूप से रुख दर्ज करें",
    anonymousStanceSubmitted: "आपका गुमनाम नागरिक रुख सुरक्षित रूप से दर्ज कर लिया गया।",

    democraticPriorityEngine: "लोकतांत्रिक प्राथमिकता इंजन",
    quadraticVotingTitle: "द्विघात नागरिक मतदान",
    quadraticVotingDesc: "अपने 100 नागरिक क्रेडिट का उपयोग प्रमुख नगरपालिका प्राथमिकताओं में अपनी प्राथमिकता की तीव्रता व्यक्त करने के लिए करें।",
    civicVotingCredits: "आपके नागरिक मतदान क्रेडिट",
    creditsUsed: "उपयोग किए गए क्रेडिट",
    formula: "सूत्र",
    distributeCredits: "अपने क्रेडिट वितरित करें",
    confirmCast: "सभी वोट पुष्टि करें और डालें",
    castingVotes: "वोट डाले जा रहे हैं...",
    votesCast: "वोट सफलतापूर्वक डाले गए!",
    allocate: "आवंटित करें",
    deallocate: "हटाएं",
    currentAllocation: "वर्तमान आवंटन",
    creditsSpent: "क्रेडिट खर्च किए",
    votesAwarded: "वोट मिले",

    citizenResponseTitle: "नागरिक प्रतिक्रिया सहायक",
    citizenResponseDesc: "AI का उपयोग करके औपचारिक सार्वजनिक परामर्श प्रतिक्रिया, आपत्तियां या RTI अनुरोध तैयार करें।",
    selectPolicy: "नीति चुनें",
    responseType: "प्रतिक्रिया प्रकार",
    yourPosition: "आपका रुख / स्थिति",
    specificConcerns: "आपकी विशिष्ट चिंताएं",
    additionalPoints: "अतिरिक्त बिंदु (वैकल्पिक)",
    generating: "तैयार किया जा रहा है...",
    copyDraft: "मसौदा कॉपी करें",
    copied: "कॉपी हो गया!",
    publicCommentFeedback: "सार्वजनिक टिप्पणी / प्रतिक्रिया",
    formalObjection: "औपचारिक आपत्ति",
    rtiRequest: "RTI अनुरोध",

    alertsTitle: "नागरिक अलर्ट और सूचनाएं",
    alertsDesc: "वास्तविक समय नगरपालिका सूचनाएं — नीति समय सीमाएं, परिषद बैठकें और नए राजपत्र प्रकाशन।",
    newPolicy: "नई नीति",
    deadlineAlert: "समय सीमा अलर्ट",
    councilMeeting: "परिषद बैठक",
    modification: "संशोधन",
    viewRelatedPolicy: "संबंधित नीति देखें",
    noAlertsFound: "चुने हुए फ़िल्टर के लिए कोई अलर्ट नहीं मिला।",

    citizenImpactReportTitle: "नागरिक प्रभाव रिपोर्ट",
    impactReportDesc: "यह नीति नागरिकों, व्यवसायों और पड़ोस को कैसे प्रभावित करती है — आधिकारिक पाठ पर आधारित।",
    generatingReport: "आपकी नागरिक प्रभाव रिपोर्ट तैयार की जा रही है...",
    reportGeneratedFor: "रिपोर्ट तैयार की गई",
    authorativeSourceNote: "यह रिपोर्ट आधिकारिक राजपत्र रिकॉर्ड से तैयार की गई है।",
    downloadReport: "रिपोर्ट डाउनलोड करें",

    adminDashboardTitle: "व्यवस्थापक डैशबोर्ड",
    adminDashboardDesc: "नगरपालिका नीति दस्तावेज़ अपलोड करें, वेक्टर इंडेक्स मॉनिटर करें और इनजेशन स्थिति ट्रैक करें।",
    totalDocuments: "कुल दस्तावेज़",
    totalChunks: "कुल खंड",
    totalPolicies: "कुल नीतियां",
    uploadDocument: "नगरपालिका दस्तावेज़ अपलोड करें",
    uploadDesc: "RAG इंजन में अनुक्रमित करने के लिए नगरपालिका राजपत्र, उपनियम या परिषद बैठक मिनट की PDF या टेक्स्ट फ़ाइलें अपलोड करें।",
    chooseFile: "फ़ाइल चुनें...",
    uploading: "अपलोड और अनुक्रमण हो रहा है...",
    uploadSuccess: "दस्तावेज़ सफलतापूर्वक अपलोड और अनुक्रमित किया गया!",
    documentTitle: "दस्तावेज़ शीर्षक",
    processingStatus: "स्थिति",
    viewChunks: "खंड देखें",
    chunksLoaded: "खंड लोड हुए",

    madeFor: "के लिए बनाया गया",
    hackathon: "नागरिक AI हैकाथॉन",
    poweredBy: "Python RAG + React + GIS द्वारा संचालित",
    openSource: "ओपन सोर्स",
  },

  kn: {
    appName: "ಜನವಾಣಿ",
    tagline: "ಜನರ ಧ್ವನಿ",
    govAi: "ಸರ್ಕಾರಿ AI",
    citizenView: "ನಾಗರಿಕ ನೋಟ",
    adminMode: "ಆಡಳಿತ ಮೋಡ್",
    dashboard: "ಡ್ಯಾಶ್‌ಬೋರ್ಡ್",
    switchToCitizen: "ನಾಗರಿಕ ಮೋಡ್‌ಗೆ ಬದಲಾಯಿಸಿ",
    switchToAdmin: "ಆಡಳಿತ ಮೋಡ್‌ಗೆ ಬದಲಾಯಿಸಿ",

    navHome: "ಮುಖಪುಟ",
    navPolicies: "ನೀತಿಗಳು",
    navForYou: "ನಿಮಗಾಗಿ",
    navAskJanVaani: "ಜನವಾಣಿ ಕೇಳಿ",
    navMap: "ನಕ್ಷೆ",
    navCompare: "ಹೋಲಿಕೆ",
    navSentiment: "ಸಾರ್ವಜನಿಕ ಅಭಿಪ್ರಾಯ",
    navVoting: "ಕ್ವಾಡ್ರಾಟಿಕ್ ಮತದಾನ",
    navAlerts: "ಎಚ್ಚರಿಕೆಗಳು",

    topBannerText: "ನಗರ ಪಾಲಿಕೆ ಪಾರದರ್ಶಕತೆ ವೇದಿಕೆ • ಬೆಂಗಳೂರು ಮಹಾನಗರ ಪಾಲಿಕೆ ಪ್ರಾಯೋಗಿಕ ಯೋಜನೆ",
    topBannerGazette: "ಅಧಿಕೃತ ಗೆಜೆಟ್ ದಾಖಲೆಗಳ ಆಧಾರಿತ",
    topBannerRti: "RTI ಮತ್ತು ವಾರ್ಡ್ ಸಮಿತಿ ಏಕೀಕರಣ",

    heroHeadline: "ಸರ್ಕಾರಿ ನೀತಿಗಳನ್ನು ಅರ್ಥಮಾಡಿಕೊಳ್ಳುವುದು ಕಷ್ಟಕರವಾಗಿರಬಾರದು.",
    heroSubheadline: "ನಗರ ಪಾಲಿಕೆಯ ನಿಯಮಗಳನ್ನು ಸುಲಭವಾಗಿ ತಿಳಿಯಿರಿ, ನಿಮ್ಮ ಬಡಾವಣೆಯ ಮೇಲಾಗುವ ಪರಿಣಾಮಗಳನ್ನು ವಿಶ್ಲೇಷಿಸಿ ಮತ್ತು ಕ್ವಾಡ್ರಾಟಿಕ್ ಮತದಾನದ ಮೂಲಕ ನಿಮ್ಮ ಅಭಿಪ್ರಾಯ ದಾಖಲಿಸಿ.",
    searchPlaceholder: "ಕೀವರ್ಡ್, ವಾರ್ಡ್ ಅಥವಾ ವಿಷಯದ ಮೂಲಕ ಹುಡುಕಿ (ಉದಾ: 'ವಲಯ ನಿಯಮಾವಳಿ', 'ತ್ಯಾಜ್ಯ ವಿಂಗಡಣೆ', '560038')...",
    searchPolicies: "ನೀತಿಗಳನ್ನು ಹುಡುಕಿ",

    municipalPolicies: "ನಗರ ನೀತಿಗಳು",
    groundedCitations: "ಪ್ರಮಾಣಿತ ಉಲ್ಲೇಖಗಳು",
    gisMappedZones: "GIS ಮ್ಯಾಪ್ ಮಾಡಿದ ವಲಯಗಳು",
    quadraticVotingArena: "ಕ್ವಾಡ್ರಾಟಿಕ್ ಮತದಾನ",

    showingImpactFor: "ನೀತಿ ಪರಿಣಾಮ ವಿಶ್ಲೇಷಣೆ ತೋರಿಸಲಾಗುತ್ತಿದೆ",
    personalizedView: "ವ್ಯಕ್ತಿಗತ ನೋಟ",
    viewDeadlines: "ಗಡುವುಗಳನ್ನು ನೋಡಿ",
    deadline: "ಗಡುವು",
    draftPublicComment: "ಸಾರ್ವಜನಿಕ ಟಿಪ್ಪಣಿ ಕರಡು",
    readPolicy: "ನೀತಿ ಓದಿ",
    browseAll: "ಎಲ್ಲಾ ನೀತಿಗಳನ್ನು ನೋಡಿ",
    officialMunicipalBylaws: "ಅಧಿಕೃತ ನಗರ ಉಪನಿಯಮಗಳನ್ನು ನಾಗರಿಕ ಭಾಷೆಗೆ ಅನುವಾದಿಸಲಾಗಿದೆ.",
    civicAiEcosystem: "ಸಂಪೂರ್ಣ ನಾಗರಿಕ AI ವ್ಯವಸ್ಥೆ",
    civicAiEcosystemDesc: "RAG ಮರುಪ್ರಾಪ್ತಿ, GIS ವಾರ್ಡ್ ವಿಶ್ಲೇಷಣೆ, ಬಹು-ಏಜೆಂಟ್ AI ಪರಿಶೀಲನೆ ಮತ್ತು ಪ್ರಜಾಸತ್ತಾತ್ಮಕ ಮತದಾನ ಸಂಯೋಜಿಸಲಾಗಿದೆ.",

    groundedRagAssistant: "ಪ್ರಮಾಣಿತ RAG ಸಹಾಯಕ",
    groundedRagDesc: "ಅಧಿಕೃತ ಗೆಜೆಟ್ ಪುಟಗಳಿಂದ ಉದ್ಧರಿಸಿದ ಉತ್ತರಗಳನ್ನು ಪಡೆಯಿರಿ. ಶೂನ್ಯ ಕಲ್ಪಿತ ಮಾಹಿತಿ.",
    interactiveWardGIS: "ಸಂವಾದಾತ್ಮಕ ವಾರ್ಡ್ GIS ನಕ್ಷೆ",
    interactiveWardGISDesc: "ನಗರ ವಾರ್ಡ್ ಗಡಿಗಳು, ಸಾರಿಗೆ ಕಾರಿಡಾರ್‌ಗಳು ಮತ್ತು ವಲಯ ಅತಿಕ್ರಮಣಗಳನ್ನು ಅನ್ವೇಷಿಸಿ.",
    oldVsNewPolicy: "ಹಳೆ ಬನಾಮ್ ಹೊಸ ನೀತಿ ಹೋಲಿಕೆ",
    oldVsNewPolicyDesc: "ಹಿಂದಿನ ಬನಾಮ್ ತಿದ್ದುಪಡಿ ಮಾಡಿದ ಷರತ್ತುಗಳನ್ನು ಅಕ್ಕಪಕ್ಕದಲ್ಲಿ ಹೋಲಿಸಿ.",
    quadraticCivicVoting: "ಕ್ವಾಡ್ರಾಟಿಕ್ ನಾಗರಿಕ ಮತದಾನ",
    quadraticCivicVotingDesc: "100 ನಾಗರಿಕ ಮತದಾನ ಕ್ರೆಡಿಟ್‌ಗಳನ್ನು ಮುಖ್ಯ ಆದ್ಯತೆಗಳಲ್ಲಿ ವಿತರಿಸಿ (ಮತ = floor(√ಕ್ರೆಡಿಟ್)).",
    citizenResponseAssistant2: "ನಾಗರಿಕ ಪ್ರತಿಕ್ರಿಯೆ ಸಹಾಯಕ",
    citizenResponseAssistant2Desc: "ಔಪಚಾರಿಕ ಸಾರ್ವಜನಿಕ ಸಮಾಲೋಚನೆ ಕರಡುಗಳು, ಆಕ್ಷೇಪಣೆಗಳು ಮತ್ತು RTI ಅರ್ಜಿಗಳನ್ನು ರಚಿಸಿ.",
    publicSentimentTracker: "ಸಾರ್ವಜನಿಕ ಅಭಿಮತ ಟ್ರ್ಯಾಕರ್",
    publicSentimentTrackerDesc: "ಅನಾಮಧೇಯ ನಿಲುವು (ಬೆಂಬಲ/ವಿರೋಧ/ತಟಸ್ಥ) ದಾಖಲಿಸಿ ಮತ್ತು ಸಮುದಾಯ ಪ್ರತಿಕ್ರಿಯೆ ಮೇಲ್ವಿಚಾರಣೆ ಮಾಡಿ.",

    askJanVaani: "ಜನವಾಣಿ ಜೊತೆ ಮಾತನಾಡಿ",
    policiesAffectingArea: "ನಿಮ್ಮ ಪ್ರದೇಶಕ್ಕೆ ಸಂಬಂಧಿಸಿದ ನೀತಿಗಳು",
    recentChanges: "ಇತ್ತೀಚಿನ ನಿಯಮಗಳ ಬದಲಾವಣೆ",
    activeConsultations: "ಸಾರ್ವಜನಿಕ ಸಮಾಲೋಚನೆಗಳು",
    explainLikeCitizen: "ಸರಳ ಕನ್ನಡದಲ್ಲಿ ವಿವರಣೆ",
    originalGovtText: "ಮೂಲ ಸರ್ಕಾರಿ ಕಡತ ಪಠ್ಯ",
    simpleExplanation: "ಸರಳ ವಿವರಣೆ",
    whatChanged: "ಏನು ಬದಲಾಗಿದೆ?",
    whoIsAffected: "ಯಾರಿಗೆ ಪರಿಣಾಮ ಬೀರುತ್ತದೆ?",
    whereItApplies: "ಇದು ಎಲ್ಲಿ ಅನ್ವಯಿಸುತ್ತದೆ?",
    whenTakesEffect: "ಇದು ಯಾವಾಗ ಜಾರಿಗೆ ಬರುತ್ತದೆ?",
    requirements: "ಪ್ರಮುಖ ನಿಯಮಗಳು",
    positiveImpacts: "ಸಂಭಾವ್ಯ ಪ್ರಯೋಜನಗಳು",
    negativeImpacts: "ಸಂಭಾವ್ಯ ಕಾಳಜಿಗಳು",
    deadlines: "ಪ್ರಮುಖ ಗಡುವುಗಳು",
    glossary: "ಪ್ರಮುಖ ಶಬ್ದಕೋಶ",
    officialCitation: "ಅಧಿಕೃತ ಗೆಜೆಟ್ ಉಲ್ಲೇಖ",
    confidenceScore: "ಸಾಕ್ಷ್ಯಾಧಾರಿತ ವಿಶ್ವಾಸಾರ್ಹತೆ",
    publicSentiment: "ಸಾರ್ವಜನಿಕ ಅಭಿಪ್ರಾಯ",
    quadraticVoting: "ಕ್ವಾಡ್ರಾಟಿಕ್ ಮತದಾನ",
    comparePolicies: "ನೀತಿಗಳ ಹೋಲಿಕೆ",
    citizenImpactReport: "ನಾಗರಿಕ ಪರಿಣಾಮ ವರದಿ",
    citizenResponseAssistant: "ನಾಗರಿಕ ಪ್ರತಿಕ್ರಿಯೆ ಸಹಾಯಕ",
    alertsNotifications: "ನಾಗರಿಕ ಎಚ್ಚರಿಕೆಗಳು",
    forYou: "ನಿಮಗಾಗಿ",
    exploreMap: "ನಾಗರಿಕ ನಕ್ಷೆ",
    adminPortal: "ಆಡಳಿತ ಪೋರ್ಟಲ್",
    votingCredits: "ಮತದಾನ ಕ್ರೆಡಿಟ್‌ಗಳು",
    creditsRemaining: "ಉಳಿದ ಕ್ರೆಡಿಟ್‌ಗಳು",
    votesAllocated: "ನೀಡಿದ ಮತಗಳು",
    support: "ಬೆಂಬಲ",
    oppose: "ವಿರೋಧ",
    neutral: "ತಟಸ್ಥ",
    generateDraft: "ನಾಗರಿಕ ಕರಡು ರಚಿಸಿ",
    officialSourceDisclaimer: "ಅಧಿಕೃತ ಸರ್ಕಾರಿ ದಾಖಲೆಗಳೇ ಪ್ರಾಮಾಣಿಕ ಮೂಲ. ಇದು AI ಅನುವಾದ ನಾಗರಿಕ ಅರ್ಥಮಾಡಿಕೊಳ್ಳಲು.",
    insufficientEvidenceMessage: "ಲಭ್ಯವಿರುವ ಅಧಿಕೃತ ದಾಖಲೆಗಳಲ್ಲಿ ಖಚಿತವಾಗಿ ಉತ್ತರಿಸಲು ಸಾಕಷ್ಟು ಸಾಕ್ಷ್ಯಗಳು ಕಂಡುಬಂದಿಲ್ಲ.",

    municipalTransparencyPortal: "ನಗರ ಪಾರದರ್ಶಕತೆ ಪೋರ್ಟಲ್",
    browsePolicies: "ನಗರ ನೀತಿಗಳು ಮತ್ತು ಗೆಜೆಟ್‌ಗಳು",
    browsePoliciesDesc: "ಪರಿಶೀಲಿಸಿದ ನಗರ ಪರಿಷತ್ ನೀತಿಗಳು, ವಲಯ ತಿದ್ದುಪಡಿಗಳು ಮತ್ತು ಸಾರಿಗೆ ಕಾರಿಡಾರ್‌ಗಳನ್ನು ಹುಡುಕಿ.",
    searchKeywordOrCode: "ಕೀವರ್ಡ್ ಅಥವಾ ಕೋಡ್‌ನಿಂದ ಹುಡುಕಿ...",
    allCategories: "ಎಲ್ಲಾ ವರ್ಗಗಳು",
    allStatuses: "ಎಲ್ಲಾ ಸ್ಥಿತಿಗಳು",
    allWards: "ಎಲ್ಲಾ ವಾರ್ಡ್‌ಗಳು",
    foundPolicies: "ನಗರ ನೀತಿಗಳು ಕಂಡುಬಂದವು",
    resetFilters: "ಫಿಲ್ಟರ್‌ಗಳನ್ನು ಮರುಹೊಂದಿಸಿ",
    noPoliciesFound: "ಯಾವ ನೀತಿಯೂ ಕಂಡುಬಂದಿಲ್ಲ",
    noPoliciesFoundDesc: "ನಿಮ್ಮ ಹುಡುಕಾಟ ಮಾನದಂಡಗಳನ್ನು ಸರಿಹೊಂದಿಸಿ ಅಥವಾ ಎಲ್ಲಾ ನಗರ ದಾಖಲೆಗಳನ್ನು ನೋಡಲು ಫಿಲ್ಟರ್‌ಗಳನ್ನು ಮರುಹೊಂದಿಸಿ.",
    resetAllFilters: "ಎಲ್ಲಾ ಫಿಲ್ಟರ್‌ಗಳನ್ನು ಮರುಹೊಂದಿಸಿ",

    personalizedCivicEngine: "ವ್ಯಕ್ತಿಗತ ನಾಗರಿಕ ಇಂಜಿನ್",
    yourPolicyFeed: "ನಿಮ್ಮ ವ್ಯಕ್ತಿಗತ ನೀತಿ ಫೀಡ್",
    yourPolicyFeedDesc: "ನೂರಾರು ಪುಟಗಳ ಗೆಜೆಟ್‌ಗಳ ಬದಲು, ಜನವಾಣಿ ನೀತಿಗಳನ್ನು ನೇರವಾಗಿ ನಿಮ್ಮ ಬಡಾವಣೆ ಮತ್ತು ಆಸಕ್ತಿಗಳಿಗೆ ಹೊಂದಿಸುತ್ತದೆ.",
    citizenPreferences: "ನಾಗರಿಕ ಆದ್ಯತೆಗಳು ಮತ್ತು ಸ್ಥಳ ಪ್ರೊಫೈಲ್",
    yourSelectedWard: "1. ನಿಮ್ಮ ಆಯ್ದ ವಾರ್ಡ್ / ಪ್ರದೇಶ",
    matchedLocality: "ಹೊಂದಿಸಿದ ಪ್ರದೇಶ",
    yourCivicInterests: "2. ನಿಮ್ಮ ನಾಗರಿಕ ಆಸಕ್ತಿ ಕ್ಷೇತ್ರಗಳು",
    housingZoning: "ಗೃಹ ಮತ್ತು ವಲಯ ನಿಯಮಗಳು",
    trafficRoads: "ಸಂಚಾರ, ರಸ್ತೆಗಳು ಮತ್ತು ಸಾರ್ವಜನಿಕ ಸಾರಿಗೆ",
    wasteSegregation: "ತ್ಯಾಜ್ಯ ವಿಂಗಡಣೆ ಮತ್ತು ನೈರ್ಮಲ್ಯ",
    rooftopSolar: "ಛಾವಣಿ ಸೌರ ಮತ್ತು ಸ್ವಚ್ಛ ಇಂಧನ",
    propertyTax: "ಆಸ್ತಿ ತೆರಿಗೆ ಮತ್ತು ಅಭಿವೃದ್ಧಿ ಲೆವಿ",
    newPoliciesAffect: "ಹೊಸ ನಗರ ನೀತಿಗಳು ನಿಮ್ಮ ಆಯ್ದ ಪ್ರದೇಶ ಮತ್ತು ಆಸಕ್ತಿಗಳ ಮೇಲೆ ನೇರ ಪರಿಣಾಮ ಬೀರುತ್ತವೆ.",
    filteredFor: "ಫಿಲ್ಟರ್ ಮಾಡಲಾಗಿದೆ",
    viewOnMap: "GIS ನಕ್ಷೆಯಲ್ಲಿ ನೋಡಿ",
    tailoredPolicyStream: "ನಿಮ್ಮ ಅನುಕೂಲಿತ ನೀತಿ ಪರಿಣಾಮ ಧಾರೆ",
    showingPolicies: "ಆದ್ಯತೆಯ ನೀತಿಗಳನ್ನು ತೋರಿಸಲಾಗುತ್ತಿದೆ",
    noMatchingPolicies: "ಆಯ್ದ ಫಿಲ್ಟರ್‌ಗಳಿಗೆ ಯಾವ ನೀತಿಯೂ ಹೊಂದುವುದಿಲ್ಲ.",
    resetInterestFilters: "ಆಸಕ್ತಿ ಫಿಲ್ಟರ್‌ಗಳನ್ನು ಮರುಹೊಂದಿಸಿ",

    gisMunicipalEngine: "GIS ನಗರ ಪ್ರಾದೇಶಿಕ ಇಂಜಿನ್",
    interactiveCivicMap: "ಸಂವಾದಾತ್ಮಕ ನಾಗರಿಕ ನಕ್ಷೆ",
    interactiveCivicMapDesc: "ಯಾವುದೇ ವಾರ್ಡ್ ಗಡಿಯ ಮೇಲೆ ಕ್ಲಿಕ್ ಮಾಡಿ ಪರಿಶೀಲಿಸಿದ ನೀತಿ ಪರಿಣಾಮಗಳು, ವಲಯ ಮಿತಿಗಳನ್ನು ನೋಡಿ.",
    allLayers: "ಎಲ್ಲಾ ಪದರಗಳು",
    zoningZones: "ವಲಯ 24m ಪ್ರದೇಶಗಳು",
    transitCorridors: "ಸಾರಿಗೆ ಕಾರಿಡಾರ್‌ಗಳು",
    clickWardToInspect: "ನಗರ ಪ್ರಭಾವ ವಿವರಗಳನ್ನು ತಪಾಸಣೆ ಮಾಡಲು ನಕ್ಷೆಯ ಮೇಲೆ ಯಾವುದೇ ವಾರ್ಡ್ ಕ್ಲಿಕ್ ಮಾಡಿ.",
    bbmpWard: "BBMP ವಾರ್ಡ್",
    policiesAffectingWard: "ಈ ವಾರ್ಡ್‌ಗೆ ಪರಿಣಾಮ ಬೀರುವ ನೀತಿಗಳು",
    spatialMatch: "ಪ್ರಾದೇಶಿಕ ಹೊಂದಾಣಿಕೆ",
    loadingWardMappings: "ವಾರ್ಡ್ ನೀತಿ ಮ್ಯಾಪಿಂಗ್ ಲೋಡ್ ಆಗುತ್ತಿದೆ...",
    noActivePolicies: "ಈ ವಾರ್ಡ್‌ಗೆ ಯಾವ ಸಕ್ರಿಯ ನೀತಿ ಪರಿಣಾಮವೂ ದಾಖಲಾಗಿಲ್ಲ.",
    draftResponse: "ಕರಡು ಪ್ರತಿಕ್ರಿಯೆ",
    viewDetails: "ವಿವರಗಳನ್ನು ನೋಡಿ",
    personalizeWardFeed: "ನನ್ನ ವಾರ್ಡ್ ಫೀಡ್ ಅನ್ನು ವ್ಯಕ್ತಿಗತಗೊಳಿಸಿ",
    inspectImpactedPolicies: "ಪರಿಣಾಮ ಬೀರಿದ ನೀತಿಗಳನ್ನು ಪರಿಶೀಲಿಸಿ",

    groundedEvidenceRag: "ಪ್ರಮಾಣಿತ ಸಾಕ್ಷ್ಯ RAG ಇಂಜಿನ್",
    askJanVaaniTitle: "ಜನವಾಣಿ ಕೇಳಿ",
    askJanVaaniDesc: "ಅಧಿಕೃತ ನಗರ ಪರಿಷತ್ ದಾಖಲೆಗಳಿಂದ ಮಾತ್ರ ನೇರ ಉತ್ತರಗಳು.",
    filterByScope: "ನೀತಿ ವ್ಯಾಪ್ತಿಯಿಂದ ಫಿಲ್ಟರ್ ಮಾಡಿ:",
    allPoliciesBroad: "ಎಲ್ಲಾ ನಗರ ನೀತಿಗಳು (ವ್ಯಾಪಕ ಹುಡುಕಾಟ)",
    groundedEvidenceCitations: "ಪ್ರಮಾಣಿತ ಸಾಕ್ಷ್ಯ ಉಲ್ಲೇಖಗಳು:",
    zeroHallucinationPolicy: "ಶೂನ್ಯ ಕಲ್ಪನೆ ನೀತಿ: ಯಾವ ಪರಿಶೀಲಿಸದ ಹೇಳಿಕೆಯೂ ಸತ್ಯವಾಗಿ ಪ್ರಸ್ತುತಪಡಿಸಲ್ಪಡುವುದಿಲ್ಲ.",
    suggestions: "ಸಲಹೆಗಳು:",
    searchingDatabase: "ವೆಕ್ಟರ್ ಡೇಟಾಬೇಸ್ ಹುಡುಕಲಾಗುತ್ತಿದೆ ಮತ್ತು ಸಾಕ್ಷ್ಯ ಸಂಶ್ಲೇಷಿಸಲಾಗುತ್ತಿದೆ...",
    askMunicipalQuestion: "ನಗರ ನೀತಿಗಳು, ವಲಯ ನಿಯಮಗಳು ಅಥವಾ ಗಡುವುಗಳ ಬಗ್ಗೆ ಪ್ರಶ್ನೆ ಕೇಳಿ...",
    welcomeMessage: "ನಮಸ್ಕಾರ! ನಾನು ಜನವಾಣಿ, ನಿಮ್ಮ ಪ್ರಮಾಣಿತ ನಗರ AI ಸಹಾಯಕ. BBMP ವಲಯ ನಿಯಮಗಳು, ರಸ್ತೆ ವಿಸ್ತರಣೆ, ತ್ಯಾಜ್ಯ ನಿರ್ವಹಣೆ ಅಥವಾ ಸೌರ ಕಡ್ಡಾಯಗಳ ಬಗ್ಗೆ ಏನು ಬೇಕಾದರೂ ಕೇಳಿ.",

    policyEvolutionEngine: "ನೀತಿ ವಿಕಸನ ಇಂಜಿನ್",
    comparePoliciesTitle: "ನೀತಿ ಹೋಲಿಕೆ",
    comparePoliciesDesc: "ನಗರ ಉಪನಿಯಮಗಳ ಹಳೆ ಮತ್ತು ಹೊಸ ಆವೃತ್ತಿಗಳ ನಡುವೆ ನಿಖರ ಬದಲಾವಣೆ ನೋಡಿ.",
    selectPolicyToCompare: "ಹೋಲಿಸಲು ನೀತಿ ಆಯ್ಕೆ ಮಾಡಿ",
    previousVersion: "ಹಿಂದಿನ ಆವೃತ್ತಿ",
    newVersion: "ಹೊಸ ಆವೃತ್ತಿ",
    currentVersion: "ಪ್ರಸ್ತುತ ಆವೃತ್ತಿ",
    supersedes: "ಬದಲಾಯಿಸುತ್ತದೆ",
    clauseChanges: "ಷರತ್ತು ಬದಲಾವಣೆಗಳು",
    keyDelta: "ಮುಖ್ಯ ವ್ಯತ್ಯಾಸ",
    added: "ಸೇರಿಸಲಾಗಿದೆ",
    removed: "ತೆಗೆದುಹಾಕಲಾಗಿದೆ",
    modified: "ಮಾರ್ಪಡಿಸಲಾಗಿದೆ",
    viewFullPolicy: "ಸಂಪೂರ್ಣ ನೀತಿ ನೋಡಿ",
    viewImpactReport: "ಪರಿಣಾಮ ವರದಿ ನೋಡಿ",
    askAboutChanges: "ಬದಲಾವಣೆಗಳ ಬಗ್ಗೆ ಕೇಳಿ",

    publicOpinionEngine: "ಸಾರ್ವಜನಿಕ ಅಭಿಮತ ಇಂಜಿನ್",
    publicSentimentTitle: "ಸಾರ್ವಜನಿಕ ಅಭಿಮತ ಡ್ಯಾಶ್‌ಬೋರ್ಡ್",
    publicSentimentDesc: "ಸಕ್ರಿಯ ನಗರ ನೀತಿಗಳ ಮೇಲೆ ಅನಾಮಧೇಯ ಸಮುದಾಯ ನಿಲುವು, ನೈಜ ಸಮಯದಲ್ಲಿ ಪರಿಶೀಲಿಸಲಾಗಿದೆ.",
    selectPolicyForSentiment: "ನೀತಿ ಆಯ್ಕೆ ಮಾಡಿ",
    totalParticipants: "ಒಟ್ಟು ಭಾಗವಹಿಸುವವರು",
    sentimentBreakdown: "ಅಭಿಮತ ವಿಭಜನೆ",
    recentPublicComments: "ಇತ್ತೀಚಿನ ಸಾರ್ವಜನಿಕ ಟಿಪ್ಪಣಿಗಳು",
    submitYourStance: "ನಿಮ್ಮ ಅನಾಮಧೇಯ ನಿಲುವು ಸಲ್ಲಿಸಿ",
    yourAnonymousStance: "ನಿಮ್ಮ ಅನಾಮಧೇಯ ನಿಲುವು",
    optionalComment: "ಐಚ್ಛಿಕ: ಒಂದು ಟಿಪ್ಪಣಿ ಸೇರಿಸಿ (ಅನಾಮಧೇಯ)",
    submitStance: "ಅನಾಮಧೇಯವಾಗಿ ನಿಲುವು ಸಲ್ಲಿಸಿ",
    anonymousStanceSubmitted: "ನಿಮ್ಮ ಅನಾಮಧೇಯ ನಾಗರಿಕ ನಿಲುವು ಸುರಕ್ಷಿತವಾಗಿ ದಾಖಲಾಗಿದೆ.",

    democraticPriorityEngine: "ಪ್ರಜಾಸತ್ತಾತ್ಮಕ ಆದ್ಯತೆ ಇಂಜಿನ್",
    quadraticVotingTitle: "ಕ್ವಾಡ್ರಾಟಿಕ್ ನಾಗರಿಕ ಮತದಾನ",
    quadraticVotingDesc: "ನಿಮ್ಮ 100 ನಾಗರಿಕ ಕ್ರೆಡಿಟ್‌ಗಳನ್ನು ಮುಖ್ಯ ನಗರ ಆದ್ಯತೆಗಳಲ್ಲಿ ನಿಮ್ಮ ಆದ್ಯತೆಯ ತೀವ್ರತೆ ವ್ಯಕ್ತಪಡಿಸಲು ಬಳಸಿ.",
    civicVotingCredits: "ನಿಮ್ಮ ನಾಗರಿಕ ಮತದಾನ ಕ್ರೆಡಿಟ್‌ಗಳು",
    creditsUsed: "ಬಳಸಿದ ಕ್ರೆಡಿಟ್‌ಗಳು",
    formula: "ಸೂತ್ರ",
    distributeCredits: "ನಿಮ್ಮ ಕ್ರೆಡಿಟ್‌ಗಳನ್ನು ವಿತರಿಸಿ",
    confirmCast: "ದೃಢೀಕರಿಸಿ ಮತ್ತು ಎಲ್ಲಾ ಮತಗಳನ್ನು ಚಲಾಯಿಸಿ",
    castingVotes: "ಮತಗಳನ್ನು ಚಲಾಯಿಸಲಾಗುತ್ತಿದೆ...",
    votesCast: "ಮತಗಳನ್ನು ಯಶಸ್ವಿಯಾಗಿ ಚಲಾಯಿಸಲಾಗಿದೆ!",
    allocate: "ಹಂಚಿಕೆ ಮಾಡಿ",
    deallocate: "ತೆಗೆದುಹಾಕಿ",
    currentAllocation: "ಪ್ರಸ್ತುತ ಹಂಚಿಕೆ",
    creditsSpent: "ಕ್ರೆಡಿಟ್‌ಗಳನ್ನು ಖರ್ಚು ಮಾಡಲಾಗಿದೆ",
    votesAwarded: "ಮತಗಳನ್ನು ನೀಡಲಾಗಿದೆ",

    citizenResponseTitle: "ನಾಗರಿಕ ಪ್ರತಿಕ್ರಿಯೆ ಸಹಾಯಕ",
    citizenResponseDesc: "AI ಬಳಸಿ ಔಪಚಾರಿಕ ಸಾರ್ವಜನಿಕ ಸಮಾಲೋಚನೆ ಪ್ರತಿಕ್ರಿಯೆ, ಆಕ್ಷೇಪಣೆ ಅಥವಾ RTI ವಿನಂತಿ ರಚಿಸಿ.",
    selectPolicy: "ನೀತಿ ಆಯ್ಕೆ ಮಾಡಿ",
    responseType: "ಪ್ರತಿಕ್ರಿಯೆ ಪ್ರಕಾರ",
    yourPosition: "ನಿಮ್ಮ ನಿಲುವು / ಸ್ಥಾನ",
    specificConcerns: "ನಿಮ್ಮ ನಿರ್ದಿಷ್ಟ ಕಾಳಜಿಗಳು",
    additionalPoints: "ಹೆಚ್ಚುವರಿ ಅಂಶಗಳು (ಐಚ್ಛಿಕ)",
    generating: "ರಚಿಸಲಾಗುತ್ತಿದೆ...",
    copyDraft: "ಕರಡು ನಕಲಿಸಿ",
    copied: "ನಕಲಿಸಲಾಗಿದೆ!",
    publicCommentFeedback: "ಸಾರ್ವಜನಿಕ ಟಿಪ್ಪಣಿ / ಪ್ರತಿಕ್ರಿಯೆ",
    formalObjection: "ಔಪಚಾರಿಕ ಆಕ್ಷೇಪಣೆ",
    rtiRequest: "RTI ವಿನಂತಿ",

    alertsTitle: "ನಾಗರಿಕ ಎಚ್ಚರಿಕೆಗಳು ಮತ್ತು ಸೂಚನೆಗಳು",
    alertsDesc: "ನೈಜ-ಸಮಯ ನಗರ ಸೂಚನೆಗಳು — ನೀತಿ ಗಡುವುಗಳು, ಪರಿಷತ್ ಸಭೆಗಳು ಮತ್ತು ಹೊಸ ಗೆಜೆಟ್ ಪ್ರಕಟಣೆಗಳು.",
    newPolicy: "ಹೊಸ ನೀತಿ",
    deadlineAlert: "ಗಡುವು ಎಚ್ಚರಿಕೆ",
    councilMeeting: "ಪರಿಷತ್ ಸಭೆ",
    modification: "ಮಾರ್ಪಾಡು",
    viewRelatedPolicy: "ಸಂಬಂಧಿತ ನೀತಿ ನೋಡಿ",
    noAlertsFound: "ಆಯ್ದ ಫಿಲ್ಟರ್‌ಗಳಿಗೆ ಯಾವ ಎಚ್ಚರಿಕೆಯೂ ಕಂಡುಬಂದಿಲ್ಲ.",

    citizenImpactReportTitle: "ನಾಗರಿಕ ಪರಿಣಾಮ ವರದಿ",
    impactReportDesc: "ಈ ನೀತಿ ನಾಗರಿಕರು, ವ್ಯವಹಾರಗಳು ಮತ್ತು ಬಡಾವಣೆಗಳ ಮೇಲೆ ಹೇಗೆ ಪರಿಣಾಮ ಬೀರುತ್ತದೆ — ಅಧಿಕೃತ ಪಠ್ಯದಲ್ಲಿ ಆಧಾರಿತ.",
    generatingReport: "ನಿಮ್ಮ ನಾಗರಿಕ ಪರಿಣಾಮ ವರದಿ ರಚಿಸಲಾಗುತ್ತಿದೆ...",
    reportGeneratedFor: "ವರದಿ ರಚಿಸಲಾಗಿದೆ",
    authorativeSourceNote: "ಈ ವರದಿ ಅಧಿಕೃತ ಗೆಜೆಟ್ ದಾಖಲೆಗಳಿಂದ ರಚಿಸಲಾಗಿದೆ.",
    downloadReport: "ವರದಿ ಡೌನ್‌ಲೋಡ್ ಮಾಡಿ",

    adminDashboardTitle: "ಆಡಳಿತ ಡ್ಯಾಶ್‌ಬೋರ್ಡ್",
    adminDashboardDesc: "ನಗರ ನೀತಿ ದಾಖಲೆಗಳನ್ನು ಅಪ್‌ಲೋಡ್ ಮಾಡಿ ಮತ್ತು ನಿರ್ವಹಿಸಿ, ವೆಕ್ಟರ್ ಇಂಡೆಕ್ಸ್ ಮೇಲ್ವಿಚಾರಣೆ ಮಾಡಿ.",
    totalDocuments: "ಒಟ್ಟು ದಾಖಲೆಗಳು",
    totalChunks: "ಒಟ್ಟು ತುಣುಕುಗಳು",
    totalPolicies: "ಒಟ್ಟು ನೀತಿಗಳು",
    uploadDocument: "ನಗರ ದಾಖಲೆ ಅಪ್‌ಲೋಡ್ ಮಾಡಿ",
    uploadDesc: "RAG ಇಂಜಿನ್‌ಗೆ ಸೂಚ್ಯಂಕ ಮಾಡಲು ನಗರ ಗೆಜೆಟ್, ಉಪನಿಯಮ ಅಥವಾ ಪರಿಷತ್ ಸಭೆ ನಿಮಿಷಗಳ PDF ಅಥವಾ ಪಠ್ಯ ಫೈಲ್‌ಗಳನ್ನು ಅಪ್‌ಲೋಡ್ ಮಾಡಿ.",
    chooseFile: "ಫೈಲ್ ಆಯ್ಕೆ ಮಾಡಿ...",
    uploading: "ಅಪ್‌ಲೋಡ್ ಮತ್ತು ಸೂಚ್ಯಂಕ ಮಾಡಲಾಗುತ್ತಿದೆ...",
    uploadSuccess: "ದಾಖಲೆ ಯಶಸ್ವಿಯಾಗಿ ಅಪ್‌ಲೋಡ್ ಮತ್ತು ಸೂಚ್ಯಂಕ ಮಾಡಲಾಗಿದೆ!",
    documentTitle: "ದಾಖಲೆ ಶೀರ್ಷಿಕೆ",
    processingStatus: "ಸ್ಥಿತಿ",
    viewChunks: "ತುಣುಕುಗಳನ್ನು ನೋಡಿ",
    chunksLoaded: "ತುಣುಕುಗಳನ್ನು ಲೋಡ್ ಮಾಡಲಾಗಿದೆ",

    madeFor: "ಗಾಗಿ ನಿರ್ಮಿಸಲಾಗಿದೆ",
    hackathon: "ನಾಗರಿಕ AI ಹ್ಯಾಕಥಾನ್",
    poweredBy: "Python RAG + React + GIS ಮೂಲಕ ನಡೆಸಲಾಗಿದೆ",
    openSource: "ಓಪನ್ ಸೋರ್ಸ್",
  }
};

