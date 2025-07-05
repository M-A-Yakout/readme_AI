import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Github, Sparkles } from "lucide-react";
import { analyzeGitHubRepo } from "@/lib/githubAnalyzer";
import { ProjectData } from "./ReadmeGenerator";

interface GitHubAnalyzerProps {
  onAnalysisComplete: (projectData: ProjectData) => void;
}

export const GitHubAnalyzer = ({ onAnalysisComplete }: GitHubAnalyzerProps) => {
  const [githubUrl, setGithubUrl] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const { toast } = useToast();

  const handleAnalyze = async () => {
    if (!githubUrl.trim()) {
      toast({
        title: "Missing GitHub URL",
        description: "Please enter a valid GitHub repository URL.",
        variant: "destructive"
      });
      return;
    }

    // Validate GitHub URL format
    const githubRegex = /^https?:\/\/(www\.)?github\.com\/[^\/]+\/[^\/]+/;
    if (!githubRegex.test(githubUrl)) {
      toast({
        title: "Invalid URL Format",
        description: "Please enter a valid GitHub repository URL (e.g., https://github.com/owner/repo).",
        variant: "destructive"
      });
      return;
    }

    setIsAnalyzing(true);

    try {
      const projectData = await analyzeGitHubRepo(githubUrl);
      onAnalysisComplete(projectData);
      
      toast({
        title: "Analysis Complete! ✨",
        description: "Repository analyzed successfully. Check the form and preview below.",
      });
    } catch (error) {
      console.error('Analysis error:', error);
      toast({
        title: "Analysis Failed",
        description: error instanceof Error ? error.message : "Failed to analyze the repository. Please check the URL and try again.",
        variant: "destructive"
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !isAnalyzing) {
      handleAnalyze();
    }
  };

  return (
    <Card className="bg-gradient-card border-0 shadow-soft mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl">
          <Github className="w-5 h-5 text-primary" />
          Analyze GitHub Repository
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Paste a GitHub repository URL to automatically generate a professional README
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="github-url">GitHub Repository URL</Label>
          <Input
            id="github-url"
            value={githubUrl}
            onChange={(e) => setGithubUrl(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="https://github.com/username/repository-name"
            className="mt-1"
            disabled={isAnalyzing}
          />
        </div>

        <Button 
          onClick={handleAnalyze}
          disabled={isAnalyzing || !githubUrl.trim()}
          className="w-full bg-gradient-primary hover:shadow-glow transition-all duration-300"
          size="lg"
        >
          {isAnalyzing ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Analyzing Repository...
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 mr-2" />
              Analyze & Generate README
            </>
          )}
        </Button>

        <div className="text-xs text-muted-foreground space-y-1">
          <p>• Supports public GitHub repositories</p>
          <p>• Automatically detects project type, dependencies, and structure</p>
          <p>• Generates features, installation instructions, and usage examples</p>
        </div>
      </CardContent>
    </Card>
  );
};