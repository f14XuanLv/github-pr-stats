> [中文文档](./README_zh.md) | Read this document in Chinese

# GitHub PR Stats

<div align="center">
  <img src="https://img.shields.io/badge/version-1.0.1-white.svg?style=flat-square&labelColor=black&color=8250df&logo=data:image/svg+xml;base64,PHN2ZyB2aWV3Qm94PSIwIDAgMTYgMTYiIGZpbGw9InJnYmEoMTgwLCAxMjAsIDI1NSwgMSkiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+ICAgPHBhdGggZD0iTTUuNDUgNS4xNTRBNC4yNSA0LjI1IDAgMCAwIDkuMjUgNy41aDEuMzc4YTIuMjUxIDIuMjUxIDAgMSAxIDAgMS41SDkuMjVBNS43MzQgNS43MzQgMCAwIDEgNSA3LjEyM3YzLjUwNWEyLjI1IDIuMjUgMCAxIDEtMS41IDBWNS4zNzJhMi4yNSAyLjI1IDAgMSAxIDEuOTUtLjIxOFpNNC4yNSAxMy41YS43NS43NSAwIDEgMCAwLTEuNS43NS43NSAwIDAgMCAwIDEuNVptOC41LTQuNWEuNzUuNzUgMCAxIDAgMC0xLjUuNzUuNzUgMCAwIDAgMCAxLjVaTTUgMy4yNWEuNzUuNzUgMCAxIDAgMCAuMDA1VjMuMjVaIi8+IDwvc3ZnPg==" alt="Version" height="24">
</div>

<div align="center">
  <img src="https://img.shields.io/badge/React-61DAFB?style=flat-square&logo=react&logoColor=white" alt="React" height="24">
  <img src="https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white" alt="TypeScript" height="24">
  <img src="https://img.shields.io/badge/Vite-646CFF?style=flat-square&logo=vite&logoColor=white" alt="Vite" height="24">
</div>

<div align="center">
  <img src="https://img.shields.io/badge/Vercel-000000?style=flat-square&logo=vercel&logoColor=white" alt="Vercel" height="24">
  <img src="https://img.shields.io/badge/Redis-DC382D?style=flat-square&logo=redis&logoColor=white" alt="Redis" height="24">
  <img src="https://img.shields.io/badge/GraphQL-E10098?style=flat-square&logo=graphql&logoColor=white" alt="GraphQL" height="24">
</div>

**🏆 Showcase your open source achievements and make every merged PR a badge of honor.**

Transform your scattered GitHub PR contributions into beautiful, shareable statistics. Perfect for resumes, portfolios, and technical recruiting.

## ✨ Live Demo

> **Note**: The following demos use public GitHub data accessible via the GitHub API for demonstration purposes only.

### 📊 PR List Mode - Your Contribution Timeline
![PR List Demo](https://github-pr-stats-five.vercel.app/api/github-pr-stats?username=f14xuanlv&limit=6&theme=dark)

### 📈 Repository Stats Mode - Impact Overview  
![Repo Stats Demo](https://github-pr-stats-five.vercel.app/api/github-pr-stats?username=torvalds&mode=repo-aggregate&limit=5&theme=dark)
*Using Linux creator Linus Torvalds' public PR data for technical demonstration*

### ☀️ Light Theme Available
![Light Theme Demo](https://github-pr-stats-five.vercel.app/api/github-pr-stats?username=f14xuanlv&theme=light&limit=6)

## 🚀 Get Started in 2 Minutes

### 1. Deploy Instantly
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/f14xuanlv/github-pr-stats)

For detailed setup instructions, see **[📚 Documentation](#📚-documentation)** → **[🚀 Deployment Guide](docs/deployment.md)**

### 2. Add to Your Profile
```markdown
![My PR Stats](https://github-pr-stats-five.vercel.app/api/github-pr-stats?username=yourname)
```

### 3. Customize Your Display
```markdown
# Show only merged PRs from high-star projects
![Elite Contributions](https://github-pr-stats-five.vercel.app/api/github-pr-stats?username=yourname&status=merged&min_stars=1000&limit=5)

# Repository overview with merge rates
![Repository Stats](https://github-pr-stats-five.vercel.app/api/github-pr-stats?username=yourname&mode=repo-aggregate)
```

## 🎯 Why Choose GitHub PR Stats?

| Feature | Benefit |
|---------|---------|
| **🎨 Two Display Modes** | PR timeline or repository overview - choose what fits your story |
| **⚡ Smart Caching** | Fast loading with Redis - your visitors won't wait |
| **🎮 Visual Interface** | No code needed - configure everything with our web UI |
| **🌟 Quality Focus** | Filter by stars to highlight your high-impact contributions |
| **📱 Works Everywhere** | SVG output works in GitHub, websites, presentations, anywhere |
| **🔒 Privacy First** | Your tokens stay secure on the server |

## 🏆 Perfect For

- **🎓 Developers**: Show your open source impact on LinkedIn, resume, or personal website
- **🏢 Companies**: Quickly assess candidates' real-world contribution quality and consistency  
- **📈 Project Maintainers**: Visualize contributor engagement and project health metrics
- **🌟 Open Source Stars**: Celebrate your contributions to major projects like Linux, React, TensorFlow

## 🎮 Interactive Configuration

![Frontend Demo Interface](images/frontend_demo.png)

Visit your deployed instance to use our visual parameter debugger:

- **Real-time Preview**: See changes instantly as you adjust parameters
- **Smart Defaults**: Interface adapts when you switch between PR list and repository modes
- **One-Click Copy**: Generate and copy the perfect URL for your use case
- **Mobile Friendly**: Configure on any device

## 📚 Documentation

- **[📖 API Reference](docs/api-reference.md)** - Complete parameter guide and examples
- **[🚀 Deployment Guide](docs/deployment.md)** - Setup instructions and configuration  
- **[👥 User Guide](docs/user-guide.md)** - Tips, use cases, and best practices

## 🎨 Themes & Customization

Choose from multiple themes and customize every aspect:

- **🌙 Dark Theme** - Perfect for developer portfolios
- **☀️ Light Theme** - Great for professional websites  
- **🎯 Custom Fields** - Show exactly what matters for your audience
- **📊 Smart Stats** - Highlight your contribution metrics automatically

## 🤝 Contributing

Pull Requests or Issues are welcome.

[![Contributors](https://contrib.rocks/image?repo=f14XuanLv/github-pr-stats)](https://github.com/f14XuanLv/github-pr-stats/graphs/contributors)

## ⭐ Star History

[![Star History Chart](https://api.star-history.com/svg?repos=f14XuanLv/github-pr-stats&type=Date)](https://star-history.com/#f14XuanLv/github-pr-stats&Date)

## 📄 License

[MIT License](https://github.com/f14XuanLv/github-pr-stats/blob/main/LICENSE) - Completely free, contributions welcome

---

**🌟 If this project helps you, please give it a Star!**