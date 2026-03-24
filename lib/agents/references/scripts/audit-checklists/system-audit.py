#!/usr/bin/env python3
"""System Audit Checklist Generator - ISO 13485 Full QMS Audit"""

from datetime import datetime
from typing import Dict, List

class SystemAuditChecklist:
    def __init__(self):
        self.iso_clauses = self._build_iso_clauses()
    
    def _build_iso_clauses(self) -> Dict:
        """Build comprehensive ISO 13485 clause checklist"""
        return {
            '4': 'Quality Management System',
            '5': 'Management Responsibility',
            '6': 'Resource Management',
            '7': 'Product Realization',
            '8': 'Measurement, Analysis and Improvement'
        }
    
    def generate_checklist(self) -> List[Dict]:
        """Generate comprehensive system audit checklist"""
        items = [
            # Clause 4 - QMS
            {'clause': '4.1', 'title': 'General requirements', 
             'checks': ['QMS processes identified', 'Process interactions documented']},
            {'clause': '4.2', 'title': 'Documentation requirements',
             'checks': ['Quality Manual', 'Document control', 'Record control']},
            
            # Clause 5 - Management
            {'clause': '5.1', 'title': 'Management commitment',
             'checks': ['Quality policy', 'Resource availability']},
            {'clause': '5.5', 'title': 'Management representative',
             'checks': ['MR appointed', 'Responsibilities defined']},
            {'clause': '5.6', 'title': 'Management review',
             'checks': ['Reviews conducted', 'Inputs per 5.6.2', 'Outputs documented']},
            
            # Clause 6 - Resources
            {'clause': '6.2', 'title': 'Human resources',
             'checks': ['Competency requirements', 'Training records']},
            {'clause': '6.3', 'title': 'Infrastructure',
             'checks': ['Facilities adequate', 'Equipment maintained']},
            {'clause': '6.4', 'title': 'Work environment',
             'checks': ['Environment controlled', 'Contamination prevented']},
            
            # Clause 7 - Product Realization
            {'clause': '7.1', 'title': 'Planning of product realization',
             'checks': ['Quality objectives', 'Risk management']},
            {'clause': '7.3', 'title': 'Design and development',
             'checks': ['Design controls', 'Verification/validation']},
            {'clause': '7.4', 'title': 'Purchasing',
             'checks': ['Supplier evaluation', 'Purchasing information']},
            {'clause': '7.5', 'title': 'Production and service provision',
             'checks': ['Process validation', 'Traceability', 'Cleanliness']},
            
            # Clause 8 - Measurement
            {'clause': '8.2', 'title': 'Monitoring and measurement',
             'checks': ['Customer feedback', 'Internal audit', 'Process monitoring']},
            {'clause': '8.3', 'title': 'Control of nonconforming product',
             'checks': ['NC identification', 'Disposition', 'Records']},
            {'clause': '8.5', 'title': 'Improvement',
             'checks': ['CAPA system', 'Root cause analysis']}
        ]
        return items
    
    def generate_report_template(self) -> str:
        """Generate system audit report template"""
        checklist = self.generate_checklist()
        
        report = f"""
ISO 13485 SYSTEM AUDIT CHECKLIST
Date: {datetime.now().strftime('%Y-%m-%d')}
Organization: _______________________
Auditor(s): _________________________
{'='*60}

"""
        for item in checklist:
            report += f"""
CLAUSE {item['clause']}: {item['title'].upper()}
"""
            for check in item['checks']:
                report += f"  □ {check}\n"
            report += f"""
  Conformance: [ ] Yes  [ ] No  [ ] N/A
  Findings:
  
  {'─'*60}
"""
        
        report += """
AUDIT CONCLUSION
Overall QMS Effectiveness: [ ] Effective  [ ] Needs Improvement
Major Nonconformities: ____
Minor Nonconformities: ____
Observations: ____

Recommendation: [ ] Maintain Certification  [ ] Conditional  [ ] Suspend

LEAD AUDITOR: ________________  DATE: __________
"""
        return report

if __name__ == '__main__':
    audit = SystemAuditChecklist()
    print(audit.generate_report_template())
