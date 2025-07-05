import { ProjectData } from "@/components/ReadmeGenerator";

interface GitHubRepo {
  name: string;
  description: string;
  language: string;
  topics: string[];
  homepage: string;
  license: { name: string } | null;
  stargazers_count: number;
  forks_count: number;
  html_url: string;
}

interface GitHubContent {
  name: string;
  type: string;
  content?: string;
}

export async function analyzeGitHubRepo(githubUrl: string): Promise<ProjectData> {
  // Extract owner and repo from GitHub URL
  const match = githubUrl.match(/github\.com\/([^\/]+)\/([^\/]+)/);
  if (!match) {
    throw new Error('Invalid GitHub URL format');
  }

  const [, owner, repo] = match;
  const cleanRepo = repo.replace('.git', '');

  try {
    // Fetch repository metadata
    const repoResponse = await fetch(`https://api.github.com/repos/${owner}/${cleanRepo}`);
    if (!repoResponse.ok) {
      throw new Error('Repository not found or not accessible');
    }
    const repoData: GitHubRepo = await repoResponse.json();

    // Fetch repository contents to analyze structure
    const contentsResponse = await fetch(`https://api.github.com/repos/${owner}/${cleanRepo}/contents`);
    const contents: GitHubContent[] = contentsResponse.ok ? await contentsResponse.json() : [];

    // Analyze project structure
    const projectAnalysis = await analyzeProjectStructure(owner, cleanRepo, contents);

    // Generate project data
    const projectData: ProjectData = {
      title: repoData.name,
      tagline: generateTagline(repoData.description, repoData.language),
      description: repoData.description || `A ${repoData.language} project that provides innovative solutions.`,
      projectType: determineProjectType(contents, projectAnalysis),
      features: await extractFeatures(owner, cleanRepo, contents, projectAnalysis),
      installCommand: generateInstallCommand(projectAnalysis),
      usageExample: await generateUsageExample(owner, cleanRepo, projectAnalysis),
      demoUrl: repoData.homepage || undefined,
      githubUrl: repoData.html_url,
      license: repoData.license?.name || undefined,
      techStack: await extractTechStack(owner, cleanRepo, contents, repoData.language)
    };

    return projectData;
  } catch (error) {
    console.error('Error analyzing repository:', error);
    throw new Error(`Failed to analyze repository: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

async function analyzeProjectStructure(owner: string, repo: string, contents: GitHubContent[]) {
  const structure = {
    hasPackageJson: false,
    hasRequirementsTxt: false,
    hasCargoToml: false,
    hasGoMod: false,
    hasDockerfile: false,
    hasSrcFolder: false,
    hasTestFolder: false,
    hasDocsFolder: false,
    packageManager: 'npm',
    mainLanguage: '',
    frameworks: [] as string[]
  };

  // Analyze root files
  for (const item of contents) {
    switch (item.name.toLowerCase()) {
      case 'package.json':
        structure.hasPackageJson = true;
        break;
      case 'requirements.txt':
        structure.hasRequirementsTxt = true;
        break;
      case 'cargo.toml':
        structure.hasCargoToml = true;
        break;
      case 'go.mod':
        structure.hasGoMod = true;
        break;
      case 'dockerfile':
        structure.hasDockerfile = true;
        break;
      case 'yarn.lock':
        structure.packageManager = 'yarn';
        break;
      case 'pnpm-lock.yaml':
        structure.packageManager = 'pnpm';
        break;
    }

    if (item.type === 'dir') {
      switch (item.name.toLowerCase()) {
        case 'src':
        case 'source':
          structure.hasSrcFolder = true;
          break;
        case 'test':
        case 'tests':
        case '__tests__':
          structure.hasTestFolder = true;
          break;
        case 'docs':
        case 'doc':
          structure.hasDocsFolder = true;
          break;
      }
    }
  }

  // Try to get package.json content for deeper analysis
  if (structure.hasPackageJson) {
    try {
      const pkgResponse = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/package.json`);
      if (pkgResponse.ok) {
        const pkgData = await pkgResponse.json();
        const pkgContent = JSON.parse(atob(pkgData.content));
        
        // Detect frameworks from dependencies
        const allDeps = { ...pkgContent.dependencies, ...pkgContent.devDependencies };
        const frameworks = [];
        
        if (allDeps.react) frameworks.push('React');
        if (allDeps.vue) frameworks.push('Vue.js');
        if (allDeps.angular || allDeps['@angular/core']) frameworks.push('Angular');
        if (allDeps.svelte) frameworks.push('Svelte');
        if (allDeps.next) frameworks.push('Next.js');
        if (allDeps.nuxt) frameworks.push('Nuxt.js');
        if (allDeps.express) frameworks.push('Express.js');
        if (allDeps.fastify) frameworks.push('Fastify');
        if (allDeps.nestjs || allDeps['@nestjs/core']) frameworks.push('NestJS');
        
        structure.frameworks = frameworks;
      }
    } catch (error) {
      console.warn('Could not analyze package.json:', error);
    }
  }

  return structure;
}

function determineProjectType(contents: GitHubContent[], analysis: any): ProjectData['projectType'] {
  // Check for CLI indicators
  const hasBinFolder = contents.some(item => item.name === 'bin' && item.type === 'dir');
  const hasCliKeywords = contents.some(item => 
    item.name.toLowerCase().includes('cli') || 
    item.name.toLowerCase().includes('command')
  );

  if (hasBinFolder || hasCliKeywords) {
    return 'cli';
  }

  // Check for library indicators
  if (analysis.hasPackageJson) {
    // Libraries often have src folder and are meant for consumption
    if (analysis.hasSrcFolder && !contents.some(item => item.name.toLowerCase().includes('app'))) {
      return 'library';
    }
  }

  // Check for framework indicators
  if (analysis.frameworks.length > 0 && analysis.frameworks.some((f: string) => 
    ['Express.js', 'Fastify', 'NestJS'].includes(f)
  )) {
    return 'framework';
  }

  // Default to application
  return 'application';
}

async function extractFeatures(owner: string, repo: string, contents: GitHubContent[], analysis: any): Promise<string[]> {
  const features: string[] = [];

  // Add framework-based features
  if (analysis.frameworks.includes('React')) {
    features.push('Modern React components with hooks');
  }
  if (analysis.frameworks.includes('TypeScript')) {
    features.push('Full TypeScript support');
  }

  // Add structure-based features
  if (analysis.hasTestFolder) {
    features.push('Comprehensive test suite');
  }
  if (analysis.hasDockerfile) {
    features.push('Docker containerization support');
  }
  if (analysis.hasDocsFolder) {
    features.push('Detailed documentation');
  }

  // Add generic features based on project type
  features.push('Easy installation and setup');
  features.push('Production-ready code');
  
  if (features.length === 0) {
    features.push('Clean and maintainable codebase');
    features.push('Well-structured project architecture');
  }

  return features.slice(0, 6); // Limit to 6 features
}

function generateInstallCommand(analysis: any): string {
  if (analysis.hasPackageJson) {
    return `${analysis.packageManager} install`;
  }
  if (analysis.hasRequirementsTxt) {
    return 'pip install -r requirements.txt';
  }
  if (analysis.hasCargoToml) {
    return 'cargo build';
  }
  if (analysis.hasGoMod) {
    return 'go mod download';
  }
  return 'git clone <repository-url>';
}

async function generateUsageExample(owner: string, repo: string, analysis: any): Promise<string> {
  // Try to find and read common entry files
  const commonFiles = ['index.js', 'index.ts', 'main.js', 'main.ts', 'app.js', 'app.ts'];
  
  for (const filename of commonFiles) {
    try {
      const response = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${filename}`);
      if (response.ok) {
        const data = await response.json();
        const content = atob(data.content);
        
        // Extract first few meaningful lines
        const lines = content.split('\n').filter(line => 
          line.trim() && 
          !line.trim().startsWith('//') && 
          !line.trim().startsWith('/*')
        ).slice(0, 5);
        
        return lines.join('\n');
      }
    } catch (error) {
      // Continue to next file
    }
  }

  // Fallback examples based on project structure
  if (analysis.hasPackageJson) {
    return `import { ${repo} } from './${repo}';

// Basic usage
const result = ${repo}();
console.log(result);`;
  }

  return `// Basic usage example
// Install and run the project following the installation steps above`;
}

async function extractTechStack(owner: string, repo: string, contents: GitHubContent[], mainLanguage: string): Promise<string[]> {
  const techStack: string[] = [];

  // Add main language
  if (mainLanguage) {
    techStack.push(mainLanguage);
  }

  // Detect from file extensions
  const fileExtensions = contents
    .filter(item => item.type === 'file')
    .map(item => item.name.split('.').pop()?.toLowerCase())
    .filter(Boolean);

  const techMap: Record<string, string> = {
    'ts': 'TypeScript',
    'js': 'JavaScript',
    'py': 'Python',
    'rs': 'Rust',
    'go': 'Go',
    'java': 'Java',
    'cpp': 'C++',
    'c': 'C',
    'php': 'PHP',
    'rb': 'Ruby',
    'kt': 'Kotlin',
    'swift': 'Swift',
    'html': 'HTML',
    'css': 'CSS',
    'scss': 'SCSS',
    'yml': 'YAML',
    'yaml': 'YAML',
    'json': 'JSON',
    'md': 'Markdown'
  };

  const detectedTech = [...new Set(
    fileExtensions
      .map(ext => techMap[ext!])
      .filter(Boolean)
  )];

  techStack.push(...detectedTech);

  // Add common tools based on files
  if (contents.some(item => item.name === 'Dockerfile')) {
    techStack.push('Docker');
  }
  if (contents.some(item => item.name.includes('webpack'))) {
    techStack.push('Webpack');
  }
  if (contents.some(item => item.name.includes('babel'))) {
    techStack.push('Babel');
  }

  return [...new Set(techStack)].slice(0, 8); // Remove duplicates and limit
}

function generateTagline(description: string | null, language: string): string {
  if (description && description.length <= 60) {
    return description;
  }

  const languageTaglines: Record<string, string> = {
    'JavaScript': 'A powerful JavaScript solution for modern development',
    'TypeScript': 'Type-safe development with modern TypeScript',
    'Python': 'Elegant Python solution for complex problems',
    'Rust': 'Fast and memory-safe Rust application',
    'Go': 'Efficient and scalable Go application',
    'Java': 'Robust Java application with enterprise features'
  };

  return languageTaglines[language] || 'A modern development solution';
}