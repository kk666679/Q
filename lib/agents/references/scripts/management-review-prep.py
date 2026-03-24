#!/usr/bin/env python3
"""Management Review Preparation - ISO 13485 Clause 5.6"""

from datetime import datetime
from typing import Dict, List

class ManagementReviewPrep:
    def __init__(self):
        self.review_inputs = {
            'audit_results': [],
            'customer_feedback': [],
            'process_performance': {},
            'product_conformity': {},
            'capa_status': [],
            'qms_changes': [],
            'improvement_recommendations': []
        }
    
    def compile_inputs(self) -> Dict:
        """Compile all management review inputs per ISO 13485 5.6.2"""
        return {
            'a_audit_results': self._summarize_audits(),
            'b_customer_feedback': self._summarize_feedback(),
            'c_process_performance': self._process_metrics(),
            'd_product_conformity': self._product_metrics(),
            'e_capa_status': self._capa_summary(),
            'f_followup_actions': self._previous_actions(),
            'g_qms_changes': self._qms_changes(),
            'h_improvement_recommendations': self._improvements()
        }
    
    def _summarize_audits(self) -> Dict:
        """Summarize internal and external audit results"""
        return {
            'internal_audits': len([a for a in self.review_inputs['audit_results'] 
                                   if a.get('type') == 'internal']),
            'external_audits': len([a for a in self.review_inputs['audit_results'] 
                                   if a.get('type') == 'external']),
            'total_findings': sum(a.get('findings_count', 0) 
                                 for a in self.review_inputs['audit_results']),
            'open_findings': sum(a.get('open_findings', 0) 
                                for a in self.review_inputs['audit_results'])
        }
    
    def _summarize_feedback(self) -> Dict:
        """Summarize customer feedback and complaints"""
        feedback = self.review_inputs['customer_feedback']
        return {
            'total_complaints': len([f for f in feedback if f.get('type') == 'complaint']),
            'total_feedback': len(feedback),
            'satisfaction_score': self._calc_satisfaction(),
            'trending_issues': self._identify_trends()
        }
    
    def _process_metrics(self) -> Dict:
        """Process performance and product conformity metrics"""
        return self.review_inputs['process_performance']
    
    def _product_metrics(self) -> Dict:
        """Product conformity status"""
        return self.review_inputs['product_conformity']
    
    def _capa_summary(self) -> Dict:
        """CAPA status summary"""
        capa = self.review_inputs['capa_status']
        return {
            'total': len(capa),
            'open': len([c for c in capa if c.get('status') == 'open']),
            'closed': len([c for c in capa if c.get('status') == 'closed']),
            'overdue': len([c for c in capa if c.get('overdue', False)])
        }
    
    def _previous_actions(self) -> List:
        """Follow-up on previous management review actions"""
        return []
    
    def _qms_changes(self) -> List:
        """Changes that could affect the QMS"""
        return self.review_inputs['qms_changes']
    
    def _improvements(self) -> List:
        """Recommendations for improvement"""
        return self.review_inputs['improvement_recommendations']
    
    def _calc_satisfaction(self) -> float:
        """Calculate customer satisfaction score"""
        feedback = [f for f in self.review_inputs['customer_feedback'] 
                   if f.get('satisfaction_score')]
        if not feedback:
            return 0.0
        return sum(f['satisfaction_score'] for f in feedback) / len(feedback)
    
    def _identify_trends(self) -> List[str]:
        """Identify trending issues from feedback"""
        return []
    
    def generate_agenda(self) -> str:
        """Generate management review meeting agenda"""
        inputs = self.compile_inputs()
        
        agenda = f"""
MANAGEMENT REVIEW MEETING AGENDA
ISO 13485 Clause 5.6
Date: {datetime.now().strftime('%Y-%m-%d')}
{'='*60}

1. AUDIT RESULTS (5.6.2.a)
   - Internal Audits: {inputs['a_audit_results']['internal_audits']}
   - External Audits: {inputs['a_audit_results']['external_audits']}
   - Total Findings: {inputs['a_audit_results']['total_findings']}
   - Open Findings: {inputs['a_audit_results']['open_findings']}

2. CUSTOMER FEEDBACK (5.6.2.b)
   - Total Complaints: {inputs['b_customer_feedback']['total_complaints']}
   - Satisfaction Score: {inputs['b_customer_feedback']['satisfaction_score']:.1f}

3. PROCESS PERFORMANCE (5.6.2.c)
   - Review process metrics and KPIs

4. PRODUCT CONFORMITY (5.6.2.d)
   - Review product quality metrics

5. CAPA STATUS (5.6.2.e)
   - Total CAPA: {inputs['e_capa_status']['total']}
   - Open: {inputs['e_capa_status']['open']}
   - Overdue: {inputs['e_capa_status']['overdue']}

6. FOLLOW-UP ACTIONS (5.6.2.f)
   - Review previous action items

7. QMS CHANGES (5.6.2.g)
   - Review changes affecting QMS

8. IMPROVEMENT RECOMMENDATIONS (5.6.2.h)
   - Discuss improvement opportunities

9. DECISIONS AND ACTIONS
   - Document management decisions
   - Assign action items with owners and due dates
"""
        return agenda

if __name__ == '__main__':
    prep = ManagementReviewPrep()
    print(prep.generate_agenda())
