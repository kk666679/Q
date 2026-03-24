#!/usr/bin/env python3
"""Document Control Compliance Audit - ISO 13485 Clause 4.2.3"""

from datetime import datetime
from typing import List, Dict

class DocumentControlAudit:
    def __init__(self):
        self.findings = []
        self.checks = {
            'approval_workflow': False,
            'version_control': False,
            'distribution_control': False,
            'obsolete_prevention': False,
            'retention_compliance': False
        }
    
    def audit_document(self, doc: Dict) -> List[str]:
        """Audit a single document for compliance"""
        issues = []
        
        # Check approval status
        if not doc.get('approved_by') or not doc.get('approval_date'):
            issues.append("Missing approval signature or date")
        
        # Check version control
        if not doc.get('version') or not doc.get('revision_history'):
            issues.append("Inadequate version control")
        
        # Check distribution
        if doc.get('controlled') and not doc.get('distribution_list'):
            issues.append("Controlled document missing distribution list")
        
        # Check review date
        if doc.get('review_date'):
            review_date = datetime.fromisoformat(doc['review_date'])
            if review_date < datetime.now():
                issues.append("Document overdue for periodic review")
        
        # Check obsolete documents
        if doc.get('status') == 'obsolete' and doc.get('accessible'):
            issues.append("Obsolete document not properly controlled")
        
        return issues
    
    def audit_system(self, documents: List[Dict]) -> Dict:
        """Audit entire document control system"""
        results = {
            'total_documents': len(documents),
            'compliant': 0,
            'non_compliant': 0,
            'findings': []
        }
        
        for doc in documents:
            issues = self.audit_document(doc)
            if issues:
                results['non_compliant'] += 1
                results['findings'].append({
                    'document_id': doc.get('id'),
                    'title': doc.get('title'),
                    'issues': issues
                })
            else:
                results['compliant'] += 1
        
        return results
    
    def generate_report(self, results: Dict) -> str:
        """Generate audit report"""
        compliance_rate = (results['compliant'] / results['total_documents'] * 100 
                          if results['total_documents'] > 0 else 0)
        
        report = f"""
DOCUMENT CONTROL AUDIT REPORT
ISO 13485 Clause 4.2.3
Date: {datetime.now().strftime('%Y-%m-%d')}
{'='*60}

SUMMARY
- Total Documents Audited: {results['total_documents']}
- Compliant: {results['compliant']}
- Non-Compliant: {results['non_compliant']}
- Compliance Rate: {compliance_rate:.1f}%

FINDINGS
"""
        for finding in results['findings']:
            report += f"\nDocument: {finding['document_id']} - {finding['title']}\n"
            for issue in finding['issues']:
                report += f"  • {issue}\n"
        
        return report

if __name__ == '__main__':
    auditor = DocumentControlAudit()
    sample_docs = [
        {
            'id': 'QMS-001',
            'title': 'Quality Manual',
            'approved_by': 'QA Manager',
            'approval_date': '2024-01-15',
            'version': '2.0',
            'revision_history': True,
            'controlled': True,
            'distribution_list': ['All Staff'],
            'status': 'active'
        }
    ]
    results = auditor.audit_system(sample_docs)
    print(auditor.generate_report(results))
