#!/usr/bin/env python3
"""QMS Performance Dashboard - Automated metrics tracking and reporting"""

from datetime import datetime, timedelta
from typing import Dict, List

class QMSMetrics:
    def __init__(self):
        self.metrics = {
            'audit_findings': [],
            'capa_records': [],
            'customer_complaints': [],
            'training_records': [],
            'document_changes': []
        }
    
    def calculate_kpis(self) -> Dict:
        """Calculate Key Quality Indicators"""
        return {
            'audit_closure_rate': self._audit_closure_rate(),
            'capa_on_time_closure': self._capa_timeliness(),
            'complaint_response_time': self._complaint_metrics(),
            'training_compliance': self._training_compliance(),
            'document_control_compliance': self._document_compliance()
        }
    
    def _audit_closure_rate(self) -> float:
        """Calculate percentage of audit findings closed on time"""
        if not self.metrics['audit_findings']:
            return 100.0
        closed = sum(1 for f in self.metrics['audit_findings'] if f.get('status') == 'closed')
        return (closed / len(self.metrics['audit_findings'])) * 100
    
    def _capa_timeliness(self) -> float:
        """Calculate CAPA on-time closure rate"""
        if not self.metrics['capa_records']:
            return 100.0
        on_time = sum(1 for c in self.metrics['capa_records'] 
                     if c.get('closed_on_time', False))
        return (on_time / len(self.metrics['capa_records'])) * 100
    
    def _complaint_metrics(self) -> Dict:
        """Calculate customer complaint metrics"""
        return {
            'total': len(self.metrics['customer_complaints']),
            'avg_response_days': self._avg_response_time(),
            'open': sum(1 for c in self.metrics['customer_complaints'] 
                       if c.get('status') == 'open')
        }
    
    def _training_compliance(self) -> float:
        """Calculate training compliance rate"""
        if not self.metrics['training_records']:
            return 100.0
        compliant = sum(1 for t in self.metrics['training_records'] 
                       if t.get('compliant', False))
        return (compliant / len(self.metrics['training_records'])) * 100
    
    def _document_compliance(self) -> Dict:
        """Calculate document control compliance"""
        return {
            'total_documents': len(self.metrics['document_changes']),
            'pending_review': sum(1 for d in self.metrics['document_changes'] 
                                 if d.get('status') == 'pending_review'),
            'overdue': sum(1 for d in self.metrics['document_changes'] 
                          if d.get('overdue', False))
        }
    
    def _avg_response_time(self) -> float:
        """Calculate average complaint response time in days"""
        if not self.metrics['customer_complaints']:
            return 0.0
        total_days = sum(c.get('response_days', 0) 
                        for c in self.metrics['customer_complaints'])
        return total_days / len(self.metrics['customer_complaints'])
    
    def generate_report(self) -> str:
        """Generate formatted QMS performance report"""
        kpis = self.calculate_kpis()
        report = f"""
QMS PERFORMANCE DASHBOARD
Generated: {datetime.now().strftime('%Y-%m-%d %H:%M')}
{'='*60}

AUDIT PERFORMANCE
- Closure Rate: {kpis['audit_closure_rate']:.1f}%

CAPA PERFORMANCE
- On-Time Closure: {kpis['capa_on_time_closure']:.1f}%

CUSTOMER COMPLAINTS
- Total: {kpis['complaint_response_time']['total']}
- Open: {kpis['complaint_response_time']['open']}
- Avg Response: {kpis['complaint_response_time']['avg_response_days']:.1f} days

TRAINING COMPLIANCE
- Compliance Rate: {kpis['training_compliance']:.1f}%

DOCUMENT CONTROL
- Total Documents: {kpis['document_control_compliance']['total_documents']}
- Pending Review: {kpis['document_control_compliance']['pending_review']}
- Overdue: {kpis['document_control_compliance']['overdue']}
"""
        return report

if __name__ == '__main__':
    dashboard = QMSMetrics()
    print(dashboard.generate_report())
