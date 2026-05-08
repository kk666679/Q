// src/config/skill.config.ts

import { SkillDefinition, QueryType } from '../types/jkkp.types';

export const skillDefinition: SkillDefinition = {
  skill_name: "jkkp_osh_advisor",
  version: "1.0",
  description: "Answers questions about Malaysia's Jabatan Keselamatan dan Kesihatan Pekerjaan (JKKP/DOSH), including regulations, licensing, statistics, enforcement actions, and OSHMP30.",
  trigger_phrases: [
    "JKKP regulations",
    "DOSH requirements",
    "Certificate of Fitness",
    "JKKP 8 report",
    "OSHMP30",
    "workplace accident penalty Malaysia",
    "pressure vessel approval JKKP",
    "MyKKP portal"
  ],
  input_schema: {
    type: "object",
    properties: {
      query_type: {
        type: "string",
        enum: [
          "agency_info",
          "legislation",
          "statistics",
          "enforcement",
          "oshmp30",
          "licensing",
          "online_services",
          "contact",
          "deadline"
        ],
        description: "The category of information requested."
      },
      search_terms: {
        type: "array",
        items: { type: "string" },
        description: "Specific keywords or phrases to look up within the knowledge base."
      }
    },
    required: ["query_type"]
  },
  output_examples: [
    {
      query: { query_type: "deadline", search_terms: ["JKKP 8"] },
      response: "The JKKP 8 annual return must be submitted by 31 January each year via the MyKKP portal. A nil return is required even if no incidents occurred. Failure to submit may lead to fines or legal action under Act 514."
    },
    {
      query: { query_type: "licensing", search_terms: ["Certificate of Fitness", "pressure vessel"] },
      response: "A Certificate of Fitness (CF) from JKKP is mandatory for pressure vessels and lifting equipment. It is valid for 15 months, requires annual visual inspection, and a hydrostatic test every 5 years. The application is done via MyKKP and MySKUD."
    },
    {
      query: { query_type: "statistics", search_terms: ["Q1 2026", "fatalities"] },
      response: "In Q1 2026, nationwide at least 7 workplace fatalities were recorded (Selangor had 7, of which 5 were in construction). There were 36 dangerous occurrences and 576 occupational diseases reported. For exact figures, refer to the official DOSH report."
    }
  ],
  action_definition: {
    function_name: "query_jkkp_knowledge",
    description: "Retrieves and synthesises information from the JKKP knowledge base based on the user's question.",
    implementation_hint: "Load knowledge.ts, filter relevant section using query_type and search_terms, respond factually. If not found, state 'This information is not available in the current knowledge base. Please check the official DOSH portal at dosh.gov.my.'"
  },
  guardrails: [
    "Never provide legal advice. Always recommend consulting a registered OSH professional or JKKP directly.",
    "Do not invent penalties or regulations beyond what is explicitly stated in knowledge base.",
    "Do not respond to queries about specific companies, individuals, or confidential enforcement cases."
  ],
  knowledge_source_file: "knowledge.ts",
  as_of_date: "2026-04-30"
};