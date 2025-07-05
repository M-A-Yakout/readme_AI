import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { ProjectForm } from "./ProjectForm";
import { ReadmePreview } from "./ReadmePreview";
import { GitHubAnalyzer } from "./GitHubAnalyzer";
import { generateReadme } from "@/lib/readmeGenerator";
import heroImage from "@/assets/hero-image.jpg";

export interface ProjectData {
  title: string;
  tagline: string;
  description: string;
  projectType: 'library' | 'application' | 'cli' | 'framework';
  features: string[];
  installCommand: string;
  usageExample: string;
  demoUrl?: string;
  githubUrl?: string;
  license?: string;
  prerequisites?: string;
  techStack: string[];
}

const ReadmeGenerator = () => {
  const [projectData, setProjectData] = useState<ProjectData>({
    title: '',
    tagline: '',
    description: '',
    projectType: 'application',
    features: [],
    installCommand: '',
    usageExample: '',
    techStack: []
  });
  
  const [generatedReadme, setGeneratedReadme] = useState<string>('');
  const { toast } = useToast();

  const handleAnalysisComplete = (analyzedData: ProjectData) => {
    setProjectData(analyzedData);
    // Auto-generate README after analysis
    const readme = generateReadme(analyzedData);
    setGeneratedReadme(readme);
  };

  const handleGenerate = () => {
    if (!projectData.title || !projectData.description) {
      toast({
        title: "Missing Information",
        description: "Please fill in at least the project title and description.",
        variant: "destructive"
      });
      return;
    }

    const readme = generateReadme(projectData);
    setGeneratedReadme(readme);
    
    toast({
      title: "README Generated!",
      description: "Your professional README has been generated successfully.",
    });
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(generatedReadme);
      toast({
        title: "Copied to Clipboard",
        description: "README content has been copied to your clipboard.",
      });
    } catch (error) {
      toast({
        title: "Copy Failed",
        description: "Failed to copy to clipboard. Please try selecting and copying manually.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div 
        className="bg-gradient-hero text-white py-16 relative overflow-hidden"
        style={{
          backgroundImage: `linear-gradient(135deg, rgba(37, 99, 235, 0.9), rgba(6, 182, 212, 0.9)), url(${heroImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            Professional README Generator
          </h1>
          <p className="text-xl md:text-2xl opacity-90 max-w-2xl mx-auto">
            Transform your GitHub projects with world-class documentation that drives adoption and contribution
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Form Section */}
          <div className="space-y-6">
            {/* GitHub Analyzer */}
            <GitHubAnalyzer onAnalysisComplete={handleAnalysisComplete} />

            <Card className="bg-gradient-card border-0 shadow-medium">
              <CardHeader>
                <CardTitle className="text-2xl">Project Details</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Fine-tune the generated details or fill manually
                </p>
              </CardHeader>
              <CardContent>
                <ProjectForm 
                  projectData={projectData} 
                  setProjectData={setProjectData} 
                />
                <div className="mt-6 flex gap-3">
                  <Button 
                    onClick={handleGenerate}
                    className="bg-gradient-primary hover:shadow-glow transition-all duration-300"
                    size="lg"
                  >
                    Generate README
                  </Button>
                  {generatedReadme && (
                    <Button 
                      onClick={handleCopy}
                      variant="outline"
                      size="lg"
                      className="border-primary/20 hover:border-primary"
                    >
                      Copy to Clipboard
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Preview Section */}
          <div className="space-y-6">
            <Card className="bg-gradient-card border-0 shadow-medium">
              <CardHeader>
                <CardTitle className="text-2xl">README Preview</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <ReadmePreview content={generatedReadme} />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReadmeGenerator;