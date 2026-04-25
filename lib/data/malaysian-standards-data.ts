// Malaysian Standards Data - Source: Department of Standards Malaysia (JSM) via MySOL Portal
// As of: March 2026

export interface MalaysianStandardAmendment {
  number: number
  title: string
  international_publication_date: string
  national_adoption_date: string
  key_changes: {
    clause: string
    change: string
    reference?: string
  }[]
}

export interface MalaysianStandardData {
  standard_id: string
  title: string
  description: string
  adoption_date: string
  status: 'Published' | 'Draft' | 'Withdrawn'
  base_standard: string
  ics_code: string
  nsc?: string
  technical_committee?: string
  industry_standards_committee?: string
  identical_to?: string
  url?: string
  preview_url?: string
  amendment?: MalaysianStandardAmendment
  implementation_requirements: {
    immediate_effect: boolean
    transition_period: string
    impact_assessment: string
  }
  background_and_justification: {
    reason: string
    reference: string
  }
  access: {
    portal: string
    price: string
    availability: string
  }
}

export interface MalaysianStandardsCollection {
  as_of: string
  source: string
  standards: MalaysianStandardData[]
}

// ISO 9001:2015/Amd 1:2024 - Quality Management Systems
export const ISO_9001_AMENDMENT: MalaysianStandardData = {
  standard_id: "MS ISO 9001:2015/Amd 1:2024",
  title: "Quality management systems — Requirements AMENDMENT 1: Climate action changes",
  description: "An amendment to the Malaysian Standard MS ISO 9001:2015, which is identical to ISO 9001:2015. This amendment introduces new requirements for organizations to determine if climate change is a relevant issue to their Quality Management System (QMS) and to consider climate-related needs and expectations of interested parties.",
  adoption_date: "2024-05-30",
  status: "Published",
  base_standard: "MS ISO 9001:2015 (identical to ISO 9001:2015)",
  amendment: {
    number: 1,
    title: "Climate action changes",
    international_publication_date: "2024-02-23",
    national_adoption_date: "2024-05-30",
    key_changes: [
      {
        clause: "4.1 (Understanding the organization and its context)",
        change: "Add the following sentence at the end of the subclause: 'The organization shall determine whether climate change is a relevant issue.'"
      },
      {
        clause: "4.2 (Understanding the needs and expectations of interested parties)",
        change: "Add the following note at the end of the subclause: 'NOTE: Relevant interested parties can have requirements related to climate change.'"
      }
    ]
  },
  ics_code: "03.120.10",
  nsc: "NSC 25 - Quality & Organisational Management",
  technical_committee: "Technical Committee on Quality Management and Quality Assurance - TC 2 on Quality Systems",
  industry_standards_committee: "Industry Standards Committee on Quality Management and Quality Assurance",
  identical_to: "ISO 9001:2015, Quality management systems - Requirements",
  url: "https://mysol.jsm.gov.my/customer/view-standard/eyJpdiI6ImNhNzErN1Q2QU9GQ1JaT2cwMEtTV0E9PSIsInZhbHVlIjoiM0ZJaVVVR0ZBUFlvUWhXTTJUd2J5QT09IiwibWFjIjoiZmUxNGFhZDAxYmU5YTRjNTUwZmIwN2YwMzE5YTE1MzJhZWQ4MTkzZmZkYTk2ZjFkODVkOTQyZWVlNzUwNjA2ZiJ9",
  preview_url: "https://mysol.jsm.gov.my/preview-file/eyJpdiI6ImxpMFc2TzE3VzcyMkhWaHVjUm5Xa2c9PSIsInZhbHVlIjoiUE1lc2dTMVBIYy82OXc0cWpoNFRQZz09IiwibWFjIjoiMDA0M2NlYmUyNzBmMTMzODgyM2Y5MWI1ZjNlMDU3NWIyNzUxMDcxMTU1MGFkMDY1NzliOTZmZmY3YjEwZjA3YiJ9",
  implementation_requirements: {
    immediate_effect: true,
    transition_period: "No transition period provided; changes must be implemented immediately and considered in all relevant audits.",
    impact_assessment: "Organizations must assess whether climate change is relevant to their QMS and, if so, document how it is addressed."
  },
  background_and_justification: {
    reason: "To ensure climate change is considered in all management systems, following the ISO London Declaration.",
    reference: "This update of ISO 9001 is the result of the Paris Agreement and the IAF/ISO Joint Communiqué on the addition of Climate Change considerations to Management System Standards."
  },
  access: {
    portal: "MySOL (Malaysian Standards Online System)",
    price: "Not specified in preview",
    availability: "Available for purchase as PDF or hardcopy via MySOL"
  }
}

// ISO 14001:2015/Amd 1:2024 - Environmental Management Systems
export const ISO_14001_AMENDMENT: MalaysianStandardData = {
  standard_id: "MS ISO 14001:2015/Amd 1:2024",
  title: "Environmental management systems – Requirements with guidance for use AMENDMENT 1: Climate action changes",
  description: "This Malaysian Standard specifies the requirements for an environmental management system that an organization can use to enhance its environmental performance. Amendment 1 introduces mandatory considerations for climate change within the environmental management system.",
  adoption_date: "2024-05-30",
  status: "Published",
  base_standard: "MS ISO 14001:2015 (identical to ISO 14001:2015)",
  amendment: {
    number: 1,
    title: "Climate action changes",
    international_publication_date: "2024-02-23",
    national_adoption_date: "2024-05-30",
    key_changes: [
      {
        clause: "4.1 (Understanding the organization and its context)",
        change: "Add the following sentence at the end of the subclause: 'The organization shall determine whether climate change is a relevant issue.'"
      },
      {
        clause: "4.2 (Understanding the needs and expectations of interested parties)",
        change: "Add the following note at the end of the subclause: 'NOTE: Relevant interested parties can have requirements related to climate change.'"
      }
    ]
  },
  ics_code: "13.020.10",
  nsc: "NSC 26 - Environmental Management",
  technical_committee: "Malaysian National Mirror Committee for ISO/TC 207/SC 1 (Environmental Management Systems)",
  industry_standards_committee: "Industry Standards Committee on Environmental Management",
  identical_to: "ISO 14001:2015, Environmental management systems – Requirements with guidance for use",
  url: "https://mysol.jsm.gov.my/customer/view-standard/eyJpdiI6ImZ2V2lYbWtGR0czMnNiZnpBQXhFMHc9PSIsInZhbHVlIjoiQXNTay92eW0yYzhueFBMa0IvNXNQUT09IiwibWFjIjoiMGUxODUwZDU5ZWQ0ZDliNDZmMTM4MDdkZjMwMzY4NTE5NzgyMDJmOGFlMzY4NjA0MzE0OGU1NzQ2NDRlOTIxOSJ9",
  preview_url: "https://mysol.jsm.gov.my/preview-file/eyJpdiI6IlhhaXdpUHZjMmFXcVE5bkh5UnR4VUE9PSIsInZhbHVlIjoiTFZjMkRpR2JHT01rUVRPbDV0dXpkZz09IiwibWFjIjoiNTU4NTUxMTNhZTdlODU3YzBmOTVjZTY3ZTAyYzVjNGVmYjI0ZGFmNjQ2MzM0ODc3ZTI4ZGM5MzgzNmM1MjEyZSJ9",
  implementation_requirements: {
    immediate_effect: true,
    transition_period: "Typically a maximum of three years, but may be shorter for limited changes. Full compliance expected by February 2027.",
    impact_assessment: "Organizations must assess whether climate change is relevant to their EMS and, if so, document how it is addressed as part of their context and interested parties analysis."
  },
  background_and_justification: {
    reason: "To ensure climate change is considered in all management systems, following the ISO London Declaration (2021) and the IAF/ISO Joint Communiqué on adding climate change considerations to management system standards.",
    reference: "This update of ISO 14001 is the result of the Paris Agreement and a formal decision by the ISO Technical Committee to clarify existing requirements related to climate change. The amendment is effective immediately and affects all organizations certified to ISO 14001:2015."
  },
  access: {
    portal: "MySOL (Malaysian Standards Online System)",
    price: "Not specified in preview",
    availability: "Available for purchase as PDF or hardcopy via MySOL"
  }
}

// ISO 45001:2018 - Occupational Health and Safety
export const ISO_45001_STANDARD: MalaysianStandardData = {
  standard_id: "MS ISO 45001:2018",
  title: "Occupational health and safety management systems — Requirements with guidance for use",
  description: "Specifies requirements for an occupational health and safety (OH&S) management system, and gives guidance for its use, to enable organizations to provide safe and healthy workplaces by preventing work-related injury and ill health, as well as by proactively improving its OH&S performance. This standard is identical to ISO 45001:2018.",
  adoption_date: "2019-05-03",
  status: "Published",
  base_standard: "ISO 45001:2018",
  ics_code: "13.100",
  nsc: "NSC 23 - Occupational Safety & Health",
  identical_to: "ISO 45001:2018, IDT",
  url: "https://mysol.jsm.gov.my/customer/view-standard/eyJpdiI6ImdUTGpBcGRXRS9XUlBJYmVIY2pzY2c9PSIsInZhbHVlIjoib25ybkgwVWVmR3hMYms5OExzSmVnUT09IiwibWFjIjoiZDY2YjI3MTBiNzQyZTRiZDYxYjJiZTQzYzNmODQxM2EyM2Y3NWNiMjRiNDEyOWZlNDUzMGYzMzNmNzM1NGUyZiJ9",
  implementation_requirements: {
    immediate_effect: true,
    transition_period: "Three years from March 2018; all certifications to OHSAS 18001 must transition by March 2021.",
    impact_assessment: "Organizations must establish, implement, maintain and continually improve an OH&S management system to improve occupational health and safety, eliminate hazards and minimize OH&S risks."
  },
  background_and_justification: {
    reason: "To replace OHSAS 18001:2007 with an international standard that aligns with other ISO management system standards (e.g., ISO 9001, ISO 14001).",
    reference: "Published in March 2018, superseding OHSAS 18001:2007."
  },
  access: {
    portal: "MySOL (Malaysian Standards Online System)",
    price: "RM 75.00 (as of May 2019)",
    availability: "Available for purchase as PDF or hardcopy via MySOL"
  }
}

// ISO 45001:2018/Amd 1:2024 - OH&S Climate Amendment
export const ISO_45001_AMENDMENT: MalaysianStandardData = {
  standard_id: "MS ISO 45001:2018/Amd 1:2024",
  title: "Occupational health and safety management systems — Requirements with guidance for use AMENDMENT 1: Climate action changes",
  description: "An amendment to MS ISO 45001:2018, introducing requirements for organizations to consider climate change as a relevant factor when determining the context of the organization and the needs and expectations of interested parties.",
  adoption_date: "2024-05-30",
  status: "Published",
  base_standard: "MS ISO 45001:2018",
  amendment: {
    number: 1,
    title: "Climate action changes",
    international_publication_date: "2024-02-23",
    national_adoption_date: "2024-05-30",
    key_changes: [
      {
        clause: "4.1 (Understanding the organization and its context)",
        change: "Add the following sentence at the end of the subclause: 'The organization shall determine whether climate change is a relevant issue.'"
      },
      {
        clause: "4.2 (Understanding the needs and expectations of interested parties)",
        change: "Add the following note at the end of the subclause: 'NOTE: Relevant interested parties can have requirements related to climate change.'"
      }
    ]
  },
  ics_code: "13.100",
  nsc: "NSC 23 - Occupational Safety & Health",
  identical_to: "ISO 45001:2018/Amd 1:2024",
  url: "https://mysol.jsm.gov.my/customer/view-standard/eyJpdiI6IklWeGNIRExtSG9Scnh4eGlDS2xQT3c9PSIsInZhbHVlIjoiSjdlUVZ5dDQ0R0RHSXJtSWovQXlCQT09IiwibWFjIjoiNmQ5NjBiNzgwYmMxZjYzNWRlYzFjYjllYjQ1NTYxYWQ0ZTYzOWMwODVmY2Y2OGVkMTU4MGYwMjBiZTk5MmNjZCJ9",
  implementation_requirements: {
    immediate_effect: true,
    transition_period: "No transition period provided; changes must be implemented immediately.",
    impact_assessment: "Organizations must assess whether climate change is relevant to their OH&S management system and, if so, document how it is addressed."
  },
  background_and_justification: {
    reason: "To ensure climate change is considered in all management systems, following the ISO London Declaration (2021) and the IAF/ISO Joint Communiqué on adding climate change considerations to management system standards.",
    reference: "This amendment is effective immediately and affects all organizations certified to ISO 45001:2018."
  },
  access: {
    portal: "MySOL (Malaysian Standards Online System)",
    price: "Not specified",
    availability: "Available for purchase as PDF or hardcopy via MySOL"
  }
}

// ISO 27001:2022 - Information Security
export const ISO_27001_STANDARD: MalaysianStandardData = {
  standard_id: "MS ISO/IEC 27001:2022",
  title: "Information security, cybersecurity and privacy protection — Information security management systems — Requirements",
  description: "Specifies the requirements for establishing, implementing, maintaining and continually improving an information security management system (ISMS) within the context of the organization. This standard is identical to ISO/IEC 27001:2022.",
  adoption_date: "2023-04-21",
  status: "Published",
  base_standard: "ISO/IEC 27001:2022",
  ics_code: "35.030; 03.100.70",
  identical_to: "ISO/IEC 27001:2022, IDT",
  url: "https://mysol.jsm.gov.my/customer/view-standard/eyJpdiI6ImdUTGpBcGRXRS9XUlBJYmVIY2pzY2c9PSIsInZhbHVlIjoib25ybkgwVWVmR3hMYms5OExzSmVnUT09IiwibWFjIjoiZDY2YjI3MTBiNzQyZTRiZDYxYjJiZTQzYzNmODQxM2EyM2Y3NWNiMjRiNDEyOWZlNDUzMGYzMzNmNzM1NGUyZiJ9",
  implementation_requirements: {
    immediate_effect: true,
    transition_period: "Three years from October 2022; all certifications to ISO/IEC 27001:2013 must transition by 31 October 2025.",
    impact_assessment: "Organizations must update their ISMS to align with the new requirements and controls of the 2022 revision."
  },
  background_and_justification: {
    reason: "To align with the latest international revision of the information security management system standard, reflecting current best practices in cybersecurity and privacy protection.",
    reference: "Published in October 2022, superseding ISO/IEC 27001:2013."
  },
  access: {
    portal: "MySOL (Malaysian Standards Online System)",
    price: "Not specified",
    availability: "Available for purchase as PDF or hardcopy via MySOL"
  }
}

// ISO 27001:2022/Amd 1:2024 - Information Security Climate Amendment
export const ISO_27001_AMENDMENT: MalaysianStandardData = {
  standard_id: "MS ISO/IEC 27001:2022/Amd 1:2024",
  title: "Information security, cybersecurity and privacy protection — Information security management systems — Requirements AMENDMENT 1: Climate action changes",
  description: "An amendment to MS ISO/IEC 27001:2022, introducing requirements for organizations to consider climate change as a relevant factor when determining the context of the organization and the needs and expectations of interested parties.",
  adoption_date: "2024-05-30",
  status: "Published",
  base_standard: "MS ISO/IEC 27001:2022",
  amendment: {
    number: 1,
    title: "Climate action changes",
    international_publication_date: "2024-02-23",
    national_adoption_date: "2024-05-30",
    key_changes: [
      {
        clause: "4.1 (Understanding the organization and its context)",
        change: "Add the following sentence at the end of the subclause: 'The organization shall determine whether climate change is a relevant issue.'"
      },
      {
        clause: "4.2 (Understanding the needs and expectations of interested parties)",
        change: "Add the following note at the end of the subclause: 'NOTE: Relevant interested parties can have requirements related to climate change.'"
      }
    ]
  },
  ics_code: "35.030; 03.100.70",
  identical_to: "ISO/IEC 27001:2022/Amd 1:2024, IDT",
  implementation_requirements: {
    immediate_effect: true,
    transition_period: "No transition period provided; changes must be implemented immediately.",
    impact_assessment: "Organizations must assess whether climate change is relevant to their ISMS and, if so, document how it is addressed."
  },
  background_and_justification: {
    reason: "To ensure climate change is considered in all management systems, following the ISO London Declaration (2021) and the IAF/ISO Joint Communiqué on adding climate change considerations to management system standards.",
    reference: "This amendment is effective immediately and affects all organizations certified to ISO/IEC 27001:2022."
  },
  access: {
    portal: "MySOL (Malaysian Standards Online System)",
    price: "Not specified",
    availability: "Available for purchase as PDF or hardcopy via MySOL"
  }
}

// Collection of all Malaysian Standards with Climate Amendments
export const MALAYSIAN_STANDARDS_COLLECTION: MalaysianStandardsCollection = {
  as_of: "March 2026",
  source: "Department of Standards Malaysia (JSM) via MySOL Portal",
  standards: [
    ISO_9001_AMENDMENT,
    ISO_14001_AMENDMENT,
    ISO_45001_STANDARD,
    ISO_45001_AMENDMENT,
    ISO_27001_STANDARD,
    ISO_27001_AMENDMENT,
  ]
}

// Helper functions
export function getStandardById(id: string): MalaysianStandardData | undefined {
  return MALAYSIAN_STANDARDS_COLLECTION.standards.find(s => s.standard_id === id)
}

export function getStandardsByCategory(category: 'quality' | 'environmental' | 'ohs' | 'security'): MalaysianStandardData[] {
  const categoryMap: Record<string, string[]> = {
    quality: ['MS ISO 9001'],
    environmental: ['MS ISO 14001'],
    ohs: ['MS ISO 45001'],
    security: ['MS ISO/IEC 27001'],
  }
  
  const prefixes = categoryMap[category] || []
  return MALAYSIAN_STANDARDS_COLLECTION.standards.filter(s => 
    prefixes.some(prefix => s.standard_id.startsWith(prefix))
  )
}

export function getClimateAmendments(): MalaysianStandardData[] {
  return MALAYSIAN_STANDARDS_COLLECTION.standards.filter(s => s.amendment !== undefined)
}

export function getBaseStandards(): MalaysianStandardData[] {
  return MALAYSIAN_STANDARDS_COLLECTION.standards.filter(s => s.amendment === undefined)
}
