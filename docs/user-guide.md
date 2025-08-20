# User Guide

## 🎮 Frontend Interface Guide

![Frontend Demo Interface](/images/frontend_demo.png)

### Mode Switching

1. **Select Mode**: Choose display mode in the Basic Parameters area
2. **Auto Adaptation**: Interface automatically adjusts available parameters and default values
3. **Real-time Preview**: Click Generate to view results after configuration

### Smart Parameter Adjustment

**When switching to Repository Aggregate mode**:
- Fields automatically switch to repository statistics related
- Sorting resets to by merge count and star count
- Hide status filter option

**When switching back to PR List mode**:
- Fields restore to PR detailed information
- Sorting resets to by status and star count
- Restore status filter option

## 🏆 Use Cases

### Personal Resume and Portfolio
Showcase your real contributions to famous projects (TensorFlow, Kubernetes, VS Code), highlighting your open source impact.

### Technical Recruiting
Quickly assess candidates' open source activity and code quality, understand their hands-on experience with tech stacks.

### Project Showcase
Quantify technical contributions: number of projects involved, star recognition received by these projects, and pull request merge rate.

## 🎨 Output Format

### Table Structure
- **Title Area**: Project name and username
- **Statistics Area**: Configurable statistics information
- **Table Header**: Dynamic field display
- **Data Rows**: Sorted records

### Visual Design
- GitHub native style theme
- Dark/light mode switching
- Clear table borders
- Alternating row backgrounds
- Responsive fonts and spacing

### Data Display
- Star count ⭐ highlighting
- Humanized date format
- Merge rate percentage display
- Smart PR number truncation

## ✨ Core Advantages

1. **Dual Modes**: PR detailed list + repository aggregate statistics, meeting different display needs
2. **Smart Caching**: Redis caching reduces API calls and improves response speed  
3. **Visual Interface**: Parameter debugger + real-time preview, lowering the barrier to use
4. **High-quality Filtering**: Star count filtering highlights high-impact contributions
5. **Flexible Customization**: Show fields on demand, adapting to various scenarios
6. **Professional Appearance**: GitHub-style design, perfectly integrates with technical documentation
7. **Mode Switching**: Frontend smart adaptation, seamless mode switching