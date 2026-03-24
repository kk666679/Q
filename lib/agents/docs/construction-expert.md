# Construction Expert Agent

Expert guidance for construction management, project planning, BIM, safety compliance, and modern construction technology.

## Capabilities

- **Project Management**: Critical Path Method scheduling, resource management
- **Cost Estimation**: Detailed cost breakdowns with complexity factors
- **BIM Integration**: Clash detection, quantity takeoff
- **Safety Compliance**: OSHA regulations, safety inspections
- **Quality Assurance**: Building codes, quality control
- **Change Management**: Change order impact analysis

## Tools

### estimate_project_cost
Estimate construction costs with detailed breakdown by category.

**Usage:**
```typescript
trpc.construction.estimateCost.useMutation({
  projectType: 'commercial_office',
  squareFootage: 50000,
  specifications: {
    customDesign: true,
    sustainableMaterials: true,
    complexSite: false,
  },
});
```

### calculate_project_schedule
Calculate project schedule using Critical Path Method.

### assess_safety_compliance
Conduct OSHA safety compliance inspection.

### detect_bim_clashes
Detect clashes in BIM models between disciplines.

### track_project_progress
Track project progress with schedule and cost variance.

### manage_change_order
Manage change orders with impact analysis.

## Standards & Regulations

- **OSHA**: Safety regulations
- **IBC/IRC**: Building codes
- **AIA**: Contracts and standards
- **ISO 19650**: BIM standards
- **LEED**: Green building certification

## Best Practices

- Use Critical Path Method for scheduling
- Implement comprehensive safety program
- Conduct regular progress reviews
- Use BIM for clash detection
- Track costs continuously
- Manage change orders effectively

## Anti-Patterns

- ❌ Poor project planning
- ❌ Inadequate cost tracking
- ❌ No safety program
- ❌ Poor communication
- ❌ Ignoring change orders
