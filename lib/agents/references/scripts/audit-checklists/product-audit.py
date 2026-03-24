#!/usr/bin/env python3
"""Product Audit Checklist Generator - ISO 13485 Product Conformity"""

from datetime import datetime
from typing import List, Dict

class ProductAuditChecklist:
    def __init__(self, product_name: str):
        self.product_name = product_name
    
    def generate_checklist(self) -> List[Dict]:
        """Generate product audit checklist"""
        return [
            {
                'area': 'Design Requirements',
                'checks': [
                    'Design inputs documented and approved',
                    'Design outputs meet input requirements',
                    'Design verification completed',
                    'Design validation completed',
                    'Risk management file complete'
                ]
            },
            {
                'area': 'Manufacturing Process',
                'checks': [
                    'Process validated per 7.5.6',
                    'Work instructions current and followed',
                    'Process parameters within specification',
                    'In-process controls effective',
                    'Environmental controls maintained'
                ]
            },
            {
                'area': 'Product Specifications',
                'checks': [
                    'Product meets design specifications',
                    'Critical dimensions verified',
                    'Material specifications confirmed',
                    'Labeling requirements met',
                    'Packaging integrity verified'
                ]
            },
            {
                'area': 'Testing and Inspection',
                'checks': [
                    'Inspection and test records complete',
                    'Acceptance criteria defined and met',
                    'Test equipment calibrated',
                    'Non-conforming product identified',
                    'Release authorization documented'
                ]
            },
            {
                'area': 'Traceability',
                'checks': [
                    'Unique device identification present',
                    'Lot/serial number traceability',
                    'Component traceability maintained',
                    'Distribution records available',
                    'Implantable device records per 7.5.9.2'
                ]
            },
            {
                'area': 'Documentation',
                'checks': [
                    'Device Master Record (DMR) complete',
                    'Device History Record (DHR) complete',
                    'Technical file current',
                    'Instructions for use adequate',
                    'Risk management documentation'
                ]
            }
        ]
    
    def generate_report_template(self) -> str:
        """Generate product audit report template"""
        checklist = self.generate_checklist()
        
        report = f"""
PRODUCT AUDIT CHECKLIST
Product: {self.product_name}
Date: {datetime.now().strftime('%Y-%m-%d')}
Auditor: ___________________
Lot/Serial: _________________
{'='*60}

"""
        for area in checklist:
            report += f"""
{area['area'].upper()}
"""
            for check in area['checks']:
                report += f"  □ {check}\n"
            report += f"""
  Status: [ ] Pass  [ ] Fail  [ ] N/A
  Comments:
  
  {'─'*60}
"""
        
        report += """
PRODUCT AUDIT SUMMARY
Total Checks: ____
Passed: ____
Failed: ____
N/A: ____

Product Disposition: [ ] Release  [ ] Hold  [ ] Reject

AUDITOR SIGNATURE: ________________  DATE: __________
QA APPROVAL: ______________________  DATE: __________
"""
        return report

if __name__ == '__main__':
    audit = ProductAuditChecklist("Medical Device XYZ")
    print(audit.generate_report_template())
