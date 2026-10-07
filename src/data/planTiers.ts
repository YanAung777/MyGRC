export interface PlanTier {
  id: string;
  name: string;
  badge?: string;
  priceMonthly: number;
  billingPeriod: string;
  description: string;
  maxProjects: number;
  maxSeats: number;
  storageGb: number;
  features: string[];
  recommended?: boolean;
}

export const PLAN_TIERS: PlanTier[] = [
  {
    id: "starter",
    name: "C&A Foundation Starter",
    priceMonthly: 49,
    billingPeriod: "billed annually ($588/yr) or $59/mo",
    description: "Ideal for emerging startups & teams starting initial AI risk and EU AI Act classification.",
    maxProjects: 5,
    maxSeats: 3,
    storageGb: 2,
    features: [
      "Up to 5 registered AI use-cases",
      "3 team member seats included",
      "2 GB secure evidence vault",
      "EU AI Act risk tiering engine",
      "Standard NIST AI RMF checklist",
      "Community & email support"
    ]
  },
  {
    id: "professional",
    name: "GRC Growth Professional",
    priceMonthly: 149,
    billingPeriod: "billed annually ($1,788/yr) or $179/mo",
    description: "For scaling engineering & risk teams automating multi-framework evidence and reviews.",
    maxProjects: 25,
    maxSeats: 10,
    storageGb: 5,
    features: [
      "Up to 25 registered AI use-cases",
      "10 team member seats included",
      "5 GB secure evidence vault",
      "ISO 42001, ISO 27001 & SOC 2 mapping",
      "Automated evidence connectors",
      "Granular role permissions matrix",
      "SIEM & syslog streaming"
    ]
  },
  {
    id: "enterprise",
    name: "C&A Portal Growth Enterprise",
    badge: "Most Popular",
    priceMonthly: 299,
    billingPeriod: "billed annually ($3,588/yr) or $349/mo",
    description: "Comprehensive enterprise governance with SAML SSO, custom roles, and AI gap detection.",
    maxProjects: 50,
    maxSeats: 25,
    storageGb: 10,
    recommended: true,
    features: [
      "Up to 50 registered AI use-cases",
      "25 team member seats included",
      "10 GB secure evidence vault",
      "Enterprise SAML 2.0 / OIDC & SCIM SSO",
      "Custom RBAC roles & audit log streaming",
      "AI Copilot gap detection engine",
      "Executive regulatory dossier exports",
      "Dedicated Customer Success Manager"
    ]
  },
  {
    id: "sovereign",
    name: "Sovereign / Custom Enterprise",
    badge: "High Assurance",
    priceMonthly: 699,
    billingPeriod: "custom annual contract",
    description: "Tailored for regulated banking, defense, and sovereign public sector AI deployments.",
    maxProjects: 999,
    maxSeats: 100,
    storageGb: 100,
    features: [
      "Unlimited AI project registrations",
      "100+ team seats with multi-tenancy",
      "100 GB dedicated encrypted vault",
      "Air-gapped on-premises deployment",
      "Hardware HSM cryptographic sign-offs",
      "Custom regulatory framework models",
      "24/7 dedicated AI compliance officer"
    ]
  }
];
