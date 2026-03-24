#!/usr/bin/env python3
"""Process Audit Checklist Generator - ISO 13485 Clause 8.2.2"""

from datetime import datetime
from typing import List, Dict

class ProcessAuditChecklist:
    def __init__(self, process_name: str):
        self.process_name = process_name
        self.checklist_items = []
    
    def generate_checklist(self) -> List[Dict]:
        """Generate process-specific audit checklist"""
        base_items = [
            {
                'clause': '4.1.1',
                'requirement': 'Process documented and maintained',
                'check': 'Verify process documentation exists and is current',
                'evidence': []
            },
            {
                'clause': '4.1.2',
                'requirement': 'Process objectives defined',
                'check': 'Confirm measurable objectives are established',
                'evidence': []
            },
            {
                'clause': '4.1.3',
                'requirement': 'Process monitoring and measurement',
                'check': 'Review process performance metrics',
                'evidence': []
            },
            {
                'clause': '4.1.4',
                'requirement': 'Resources allocated',
                'check': 'Verify adequate resources (personnel, equipment)',
                'evidence': []
            },
            {
                'clause': '4.1.5',
                'requirement': 'Process improvement',
                'check': 'Review improvement actions and effectiveness',
                'evidence': []
            }
        ]
        return base_items
    
    def add_custom_item(self, clause: str, requirement: str, check: str):
        """Add custom checklist item"""
        self.checklist_items.append({
            'clause': clause,
            'requirement': requirement,
            'check': check,
            'evidence': []
        })
    
    def generate_report_template(self) -> str:
        """Generate audit report template"""
        checklist = self.generate_checklist() + self.checklist_items
        
        report = f"""
PROCESS AUDIT CHECKLIST
Process: {self.process_name}
Date: {datetime.now().strftime('%Y-%m-%d')}
Auditor: ___________________
{'='*60}

"""
        for idx, item in enumerate(checklist, 1):
            report += f"""
{idx}. ISO 13485 Clause {item['clause']}
   Requirement: {item['requirement']}
   Check: {item['check']}
   
   Conformance: [ ] Yes  [ ] No  [ ] N/A
   Evidence:
   
   Findings:
   
   {'─'*60}
"""
        
        report += """
AUDIT SUMMARY
Total Items Checked: ____
Conforming: ____
Non-Conforming: ____
Observations: ____

AUDITOR SIGNATURE: ________________  DATE: __________
AUDITEE SIGNATURE: ________________  DATE: __________
"""
        return report

if __name__ == '__main__':
    audit = ProcessAuditChecklist("Design and Development")
    audit.add_custom_item('7.3.2', 'Design planning', 
                         'Verify design plans include stages, reviews, verification')
    print(audit.generate_report_template())
