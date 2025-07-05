import { ProjectData } from "@/components/ReadmeGenerator";

export function generateReadme(data: ProjectData): string {
  const {
    title,
    tagline,
    description,
    projectType,
    features,
    installCommand,
    usageExample,
    demoUrl,
    githubUrl,
    license,
    techStack
  } = data;

  let readme = '';

  // Header Section
  readme += `# ${title}\n`;
  if (tagline) {
    readme += `${tagline}\n\n`;
  }

  // Badges (if GitHub URL is provided)
  if (githubUrl) {
    const repoPath = githubUrl.replace('https://github.com/', '');
    readme += `[![Build Status](https://github.com/${repoPath}/workflows/CI/badge.svg)](${githubUrl}/actions) `;
    if (license) {
      readme += `[![License](https://img.shields.io/badge/license-${license}-blue.svg)](${githubUrl}/blob/main/LICENSE) `;
    }
    readme += `[![GitHub stars](https://img.shields.io/github/stars/${repoPath}.svg)](${githubUrl}/stargazers)\n\n`;
  }

  // Description
  readme += `${description}\n\n`;

  // Demo section (if demo URL provided)
  if (demoUrl) {
    readme += `## 🚀 Quick Start\n\n`;
    readme += `### Live Demo\n`;
    readme += `[**Try it now →**](${demoUrl})\n\n`;
  } else {
    readme += `## 🚀 Quick Start\n\n`;
  }

  // Installation
  if (installCommand) {
    readme += `### Installation\n`;
    readme += `\`\`\`bash\n${installCommand}\n\`\`\`\n\n`;
  }

  // Usage
  if (usageExample) {
    readme += `### Basic Usage\n`;
    const language = detectLanguage(usageExample);
    readme += `\`\`\`${language}\n${usageExample}\n\`\`\`\n\n`;
  }

  // Features
  if (features.length > 0) {
    readme += `## ✨ Features\n\n`;
    features.forEach(feature => {
      readme += `- **${feature}**\n`;
    });
    readme += `\n`;
  }

  // Tech Stack
  if (techStack.length > 0) {
    readme += `## 🛠 Technology Stack\n\n`;
    techStack.forEach(tech => {
      readme += `- ${tech}\n`;
    });
    readme += `\n`;
  }

  // Project-specific sections based on type
  switch (projectType) {
    case 'library':
      readme += generateLibrarySection(data);
      break;
    case 'cli':
      readme += generateCliSection(data);
      break;
    case 'framework':
      readme += generateFrameworkSection(data);
      break;
    default:
      readme += generateApplicationSection(data);
  }

  // Contributing section
  readme += `## 🤝 Contributing\n\n`;
  readme += `Contributions are welcome! Please feel free to submit a Pull Request.\n\n`;
  readme += `1. Fork the project\n`;
  readme += `2. Create your feature branch (\`git checkout -b feature/AmazingFeature\`)\n`;
  readme += `3. Commit your changes (\`git commit -m 'Add some AmazingFeature'\`)\n`;
  readme += `4. Push to the branch (\`git push origin feature/AmazingFeature\`)\n`;
  readme += `5. Open a Pull Request\n\n`;

  // License
  if (license) {
    readme += `## 📄 License\n\n`;
    readme += `This project is licensed under the ${license} License - see the [LICENSE](LICENSE) file for details.\n\n`;
  }

  // Support section
  readme += `## 💬 Support\n\n`;
  if (githubUrl) {
    readme += `- 📫 [Create an issue](${githubUrl}/issues) for bug reports or feature requests\n`;
  }
  readme += `- ⭐ Star this repository if you find it helpful\n`;
  readme += `- 🐦 Follow us for updates\n\n`;

  // Acknowledgments
  readme += `## 🙏 Acknowledgments\n\n`;
  readme += `- Thanks to all contributors who have helped improve this project\n`;
  readme += `- Inspired by the open source community\n`;

  return readme;
}

function detectLanguage(code: string): string {
  if (code.includes('import ') || code.includes('const ') || code.includes('function ')) {
    return 'javascript';
  }
  if (code.includes('def ') || code.includes('import ')) {
    return 'python';
  }
  if (code.includes('package ') || code.includes('func ')) {
    return 'go';
  }
  if (code.includes('#include') || code.includes('int main')) {
    return 'cpp';
  }
  return 'bash';
}

function generateLibrarySection(data: ProjectData): string {
  let section = `## 📚 API Reference\n\n`;
  section += `### Core Functions\n\n`;
  section += `Documentation for the main API endpoints and functions will be available here.\n\n`;
  section += `### Examples\n\n`;
  section += `Check the [examples](examples/) directory for comprehensive usage examples.\n\n`;
  return section;
}

function generateCliSection(data: ProjectData): string {
  let section = `## 🖥 Command Line Usage\n\n`;
  section += `### Available Commands\n\n`;
  section += `\`\`\`bash\n`;
  section += `# Show help\n`;
  section += `${data.title.toLowerCase()} --help\n\n`;
  section += `# Basic usage\n`;
  section += `${data.title.toLowerCase()} [options] <input>\n`;
  section += `\`\`\`\n\n`;
  return section;
}

function generateFrameworkSection(data: ProjectData): string {
  let section = `## 🏗 Architecture\n\n`;
  section += `### Core Concepts\n\n`;
  section += `This framework is built around the following key concepts:\n\n`;
  section += `- **Component System**: Modular and reusable components\n`;
  section += `- **Plugin Architecture**: Extensible through plugins\n`;
  section += `- **Configuration**: Flexible configuration system\n\n`;
  section += `### Getting Started\n\n`;
  section += `Check out our [documentation](docs/) for detailed guides and tutorials.\n\n`;
  return section;
}

function generateApplicationSection(data: ProjectData): string {
  let section = `## 🎯 Use Cases\n\n`;
  section += `This application is perfect for:\n\n`;
  section += `- Teams looking to streamline their workflow\n`;
  section += `- Developers who need efficient tools\n`;
  section += `- Organizations seeking scalable solutions\n\n`;
  section += `## 🔧 Configuration\n\n`;
  section += `Configuration options and environment setup will be documented here.\n\n`;
  return section;
}