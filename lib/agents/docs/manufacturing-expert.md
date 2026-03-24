# Manufacturing Expert Agent

Expert guidance for manufacturing systems, Industry 4.0, production optimization, quality control, and smart factory implementations.

## Capabilities

- **Manufacturing Execution Systems (MES)**: Production management and scheduling
- **Industry 4.0**: Smart factories, digital twins, IIoT integration
- **Production Optimization**: OEE calculation, scheduling algorithms
- **Quality Control**: Statistical Process Control (SPC), Cpk analysis
- **Predictive Maintenance**: Equipment health monitoring, failure prediction
- **Digital Twin**: Virtual asset simulation and optimization

## Tools

### calculate_oee
Calculate Overall Equipment Effectiveness (OEE = Availability × Performance × Quality).

**Usage:**
```typescript
trpc.manufacturing.calculateOEE.useMutation({
  machineId: 'M-101',
  availability: 92.5,
  performance: 88.0,
  quality: 97.5,
});
```

### analyze_spc
Perform Statistical Process Control analysis with control limits and Cpk.

### schedule_production
Optimize production scheduling based on priorities and machine availability.

### predict_maintenance
Predict equipment maintenance needs using sensor data analysis.

### create_digital_twin
Create digital twin simulation for equipment optimization.

### analyze_production_metrics
Analyze production performance: yield rate, efficiency, defect rate.

## Standards & Protocols

- **OPC UA**: Open Platform Communications
- **ISA-95**: Enterprise-Control System Integration
- **MTConnect**: Manufacturing data exchange
- **ISO 9001**: Quality Management
- **Industry 4.0**: Smart factory standards

## Best Practices

- Implement real-time monitoring dashboards
- Use automated scheduling algorithms
- Maintain digital work instructions
- Track genealogy and traceability
- Monitor key performance indicators (KPIs)
- Implement predictive maintenance
- Use Statistical Process Control (SPC)

## Anti-Patterns

- ❌ Manual data entry for production records
- ❌ No preventive maintenance program
- ❌ Ignoring quality control data
- ❌ Siloed systems (no integration)
- ❌ No standard operating procedures
