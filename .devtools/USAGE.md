# QMS DevTools Usage Guide

A complete suite of CLI tools for analyzing, validating, and managing QMS AI generation logs stored in `.devtools/`.

## Quick Start

### Installation

1. Navigate to the project root and run:
   ```bash
   npm install
   ```

2. The devtools tools are automatically available in the `.devtools/` directory.

### Basic Commands

All devtools commands are available from the project root:

```bash
# Analyze generation logs for insights
npm run devtools analyze

# Validate log integrity
npm run devtools validate

# Generate HTML/JSON reports
npm run devtools report

# Maintain and cleanup logs
npm run devtools maintain

# Quick clean operation (dry-run by default)
npm run devtools clean

# Strict validation (treat warnings as errors)
npm run devtools check
```

### Examples

#### Analyze All Logs

```bash
# Generate console report with all logs
npm run devtools analyze

# Export analysis to JSON file
npm run devtools analyze -- --output analysis.json

# Only analyze specific files
npm run devtools analyze -- --include .devtools/generations.json --include .devtools/flow-designer-generations.json
```

#### Validate Logs

```bash
# Validate all logs
npm run devtools validate

# Strict validation (stops on first error)
npm run devtools validate -- --strict

# Export validation results
npm run devtools validate -- --output validation.json --format json
```

#### Generate Reports

```bash
# Generate HTML report for first file
npm run devtools report

# Generate both HTML and JSON reports
npm run devtools report -- --format both

# Custom title for reports
npm run devtools report -- --title "QMS Compliance Analysis"
```

#### Maintenance Operations

```bash
# Dry-run cleanup (show what would be deleted)
npm run devtools clean

# Actually delete logs older than 90 days
npm run devtools maintain -- --cleanup-days 90

# Rotate logs older than 180 days
npm run devtools maintain -- --rotate-days 180

# Consolidate multiple logs into one
npm run devtools maintain -- --consolidate
```

## File Formats

### generations.json

Contains multi-agent RAG compliance checks:
- ISO 45001 compliance evaluations
- Risk assessment results
- Audit findings

### flow-designer-generations.json

Contains BPMN process flow designs:
- Medical device QMS process flows
- ISO 13485 compliance mapping
- Risk management workflows

## Analysis Output

The `analyze` command provides insights including:

- Total runs, costs, and duration metrics
- Provider usage statistics
- Domain and standard distribution
- Step type breakdown
- Performance and cost analysis per step type

## Validation Checks

The `validate` command verifies:

- Schema conformance
- Required field presence
- Step ID consistency
- Cost reasonableness
- Safety compliance

## Report Features

Generated reports include:

- Statistical summaries
- Visual data tables
- Raw analysis data
- System metadata
- Actionable insights

## Maintenance Operations

- **Cleanup**: Delete logs older than specified days
- **Rotate**: Rename old logs to backup with timestamps
- **Consolidate**: Merge multiple log files into single comprehensive report

## Configuration

All tools support common options:

- `--directory`: Specify custom log directory (default: `.devtools`)
- `--verbose`: Enable detailed output
- `--dry-run`: Show actions without executing (for maintenance)

## Development

To extend devtools:

1. Add new log processing logic to `.devtools/tools/`
2. Update schema definitions in `.devtools/types.ts`
3. Add utility functions to `.devtools/utils.ts`
4. Modify CLI commands in the respective tool files

## Troubleshooting

### Common Issues

1. **"Command not found" errors**
   ```bash
   # Ensure you are in the project root
   cd /path/to/QMS
   npm run devtools analyze
   ```

2. **Validation fails due to warnings**
   ```bash
   npm run devtools validate -- --strict
   ```

3. **Report generation takes too long**
   ```bash
   npm run devtools report -- --include specific-file.json
   ```

### Help

For detailed help on any command:
```bash
npm run devtools analyze -- --help
npm run devtools validate -- --help
```

## Technical Details

The devtools suite is built with:

- **TypeScript**: Full type safety and IDE support
- **Zod**: Runtime schema validation
- **Commander**: CLI argument parsing
- **Node.js**: Cross-platform compatibility

All tools write human-readable output and support JSON exports for programmatic use.

## Support

For issues or feature requests:
1. Check the [QMS repository issues](https://github.com/Kilo-Org/kilocode/issues)
2. Review the devtools source code in `.devtools/`
3. File an issue with detailed error output

---

**Version**: 1.0.0  
**Last Updated**: 2026-10-06  
**License**: MIT
