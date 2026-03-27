# Root Cause Analysis Tools and Methodologies

## 5 Whys Analysis

### Description
Simple iterative technique that explores cause-and-effect relationships by asking "Why?" five times.

### When to Use
- Simple to moderately complex problems
- Quick analysis needed
- Single root cause suspected

### Process
1. Define the problem clearly
2. Ask "Why did this happen?"
3. For each answer, ask "Why?" again
4. Continue until root cause identified (typically 5 iterations)
5. Verify root cause addresses the problem

### Example
**Problem:** Product failed final inspection

1. Why? → Dimension out of specification
2. Why? → Machine calibration drift
3. Why? → Calibration schedule not followed
4. Why? → Technician unaware of due date
5. Why? → No automated calibration reminder system

**Root Cause:** Lack of automated calibration tracking system

---

## Fishbone Diagram (Ishikawa)

### Description
Visual tool that categorizes potential causes of problems to identify root causes.

### Categories (6Ms for Manufacturing)
- **Man** (People): Training, competency, procedures
- **Machine** (Equipment): Calibration, maintenance, capability
- **Material**: Specifications, supplier quality, storage
- **Method** (Process): Procedures, work instructions, controls
- **Measurement**: Accuracy, precision, calibration
- **Mother Nature** (Environment): Temperature, humidity, cleanliness

### Process
1. Define problem statement (head of fish)
2. Draw main categories as bones
3. Brainstorm potential causes for each category
4. Identify most likely root causes
5. Verify through data analysis

### When to Use
- Complex problems with multiple potential causes
- Team brainstorming sessions
- Visual representation needed

---

## Failure Mode and Effects Analysis (FMEA)

### Description
Systematic method for identifying potential failure modes and their effects.

### Types
- **Design FMEA (DFMEA)**: Product design failures
- **Process FMEA (PFMEA)**: Manufacturing process failures

### Process
1. Identify potential failure modes
2. Determine effects of each failure
3. Assess severity (S: 1-10)
4. Identify potential causes
5. Assess occurrence (O: 1-10)
6. Identify current controls
7. Assess detection (D: 1-10)
8. Calculate Risk Priority Number (RPN = S × O × D)
9. Prioritize actions for high RPN items
10. Implement and verify effectiveness

### RPN Interpretation
- **High (>200)**: Immediate action required
- **Medium (100-200)**: Action recommended
- **Low (<100)**: Monitor

---

## Pareto Analysis (80/20 Rule)

### Description
Statistical technique that identifies the vital few causes that contribute to most problems.

### Principle
80% of problems come from 20% of causes

### Process
1. Collect data on problem categories
2. Calculate frequency or cost for each category
3. Sort categories in descending order
4. Calculate cumulative percentage
5. Create Pareto chart (bar chart + line graph)
6. Focus on top 20% of causes

### When to Use
- Multiple problems or causes
- Prioritization needed
- Resource allocation decisions

---

## Fault Tree Analysis (FTA)

### Description
Top-down deductive analysis that uses Boolean logic to determine root causes.

### Symbols
- **Rectangle**: Event (usually top event)
- **Circle**: Basic event (root cause)
- **AND Gate**: All inputs must occur
- **OR Gate**: Any input can cause output

### Process
1. Define top event (undesired outcome)
2. Identify immediate causes
3. Continue breaking down until basic events reached
4. Analyze logical relationships
5. Calculate probability (if quantitative)
6. Identify critical paths

### When to Use
- Complex systems
- Safety-critical failures
- Probability analysis needed

---

## Kepner-Tregoe Problem Analysis

### Description
Structured methodology for problem solving and decision making.

### Four Phases
1. **Situation Appraisal**: Identify and prioritize concerns
2. **Problem Analysis**: Find root cause
3. **Decision Analysis**: Choose best solution
4. **Potential Problem Analysis**: Prevent future issues

### Problem Analysis Steps
1. Define the problem (IS/IS NOT analysis)
2. Describe the problem in detail
3. Identify possible causes
4. Test most probable cause
5. Verify true cause

### IS/IS NOT Matrix
| Dimension | IS | IS NOT |
|-----------|-------|---------|
| What | What is the problem? | What could it be but isn't? |
| Where | Where does it occur? | Where could it occur but doesn't? |
| When | When does it occur? | When could it occur but doesn't? |
| Extent | How big is the problem? | How big could it be but isn't? |

---

## A3 Problem Solving

### Description
Toyota-developed structured problem-solving approach documented on single A3-sized paper.

### Sections
1. **Background**: Problem context and importance
2. **Current Condition**: Current state analysis
3. **Goal/Target**: Desired future state
4. **Root Cause Analysis**: Why problem exists
5. **Countermeasures**: Proposed solutions
6. **Implementation Plan**: Who, what, when
7. **Follow-up**: Verification and monitoring

### When to Use
- Continuous improvement initiatives
- Cross-functional problems
- Visual communication needed

---

## Comparative Analysis

| Tool | Complexity | Time Required | Best For |
|------|------------|---------------|----------|
| 5 Whys | Low | Minutes | Simple problems |
| Fishbone | Medium | Hours | Brainstorming |
| FMEA | High | Days/Weeks | Risk assessment |
| Pareto | Low | Hours | Prioritization |
| FTA | High | Days | Complex systems |
| Kepner-Tregoe | Medium | Hours/Days | Structured analysis |
| A3 | Medium | Days | Continuous improvement |

---

## Selection Criteria

**Use 5 Whys when:**
- Problem is straightforward
- Quick analysis needed
- Single root cause likely

**Use Fishbone when:**
- Multiple potential causes
- Team input valuable
- Visual tool preferred

**Use FMEA when:**
- Proactive risk assessment needed
- Design or process development
- Quantitative risk prioritization required

**Use Pareto when:**
- Multiple problems to prioritize
- Resource constraints exist
- Data-driven decisions needed

**Use FTA when:**
- Safety-critical systems
- Complex failure scenarios
- Probability analysis required

**Use Kepner-Tregoe when:**
- Structured approach needed
- Problem definition unclear
- Decision making involved

**Use A3 when:**
- Continuous improvement culture
- Cross-functional collaboration
- Visual communication important
