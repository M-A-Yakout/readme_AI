import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { ProjectData } from "./ReadmeGenerator";

interface ProjectFormProps {
  projectData: ProjectData;
  setProjectData: (data: ProjectData) => void;
}

export const ProjectForm = ({ projectData, setProjectData }: ProjectFormProps) => {
  const [newFeature, setNewFeature] = useState('');
  const [newTech, setNewTech] = useState('');

  const addFeature = () => {
    if (newFeature.trim()) {
      setProjectData({
        ...projectData,
        features: [...projectData.features, newFeature.trim()]
      });
      setNewFeature('');
    }
  };

  const removeFeature = (index: number) => {
    setProjectData({
      ...projectData,
      features: projectData.features.filter((_, i) => i !== index)
    });
  };

  const addTech = () => {
    if (newTech.trim()) {
      setProjectData({
        ...projectData,
        techStack: [...projectData.techStack, newTech.trim()]
      });
      setNewTech('');
    }
  };

  const removeTech = (index: number) => {
    setProjectData({
      ...projectData,
      techStack: projectData.techStack.filter((_, i) => i !== index)
    });
  };

  return (
    <div className="space-y-6">
      {/* Basic Info */}
      <div className="space-y-4">
        <div>
          <Label htmlFor="title">Project Title *</Label>
          <Input
            id="title"
            value={projectData.title}
            onChange={(e) => setProjectData({ ...projectData, title: e.target.value })}
            placeholder="My Awesome Project"
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="tagline">Tagline</Label>
          <Input
            id="tagline"
            value={projectData.tagline}
            onChange={(e) => setProjectData({ ...projectData, tagline: e.target.value })}
            placeholder="A brief, compelling description in <15 words"
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="description">Project Description *</Label>
          <Textarea
            id="description"
            value={projectData.description}
            onChange={(e) => setProjectData({ ...projectData, description: e.target.value })}
            placeholder="Describe what your project does, why it exists, and who should use it..."
            className="mt-1 min-h-[100px]"
          />
        </div>

        <div>
          <Label htmlFor="projectType">Project Type</Label>
          <Select value={projectData.projectType} onValueChange={(value: ProjectData['projectType']) => 
            setProjectData({ ...projectData, projectType: value })
          }>
            <SelectTrigger className="mt-1">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="library">Library/Package</SelectItem>
              <SelectItem value="application">Application</SelectItem>
              <SelectItem value="cli">CLI Tool</SelectItem>
              <SelectItem value="framework">Framework</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Features */}
      <div>
        <Label>Key Features</Label>
        <div className="mt-2 space-y-2">
          <div className="flex gap-2">
            <Input
              value={newFeature}
              onChange={(e) => setNewFeature(e.target.value)}
              placeholder="Add a key feature..."
              onKeyPress={(e) => e.key === 'Enter' && addFeature()}
            />
            <Button type="button" onClick={addFeature} variant="outline">
              Add
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {projectData.features.map((feature, index) => (
              <Badge 
                key={index} 
                variant="secondary" 
                className="cursor-pointer hover:bg-destructive hover:text-destructive-foreground"
                onClick={() => removeFeature(index)}
              >
                {feature} ×
              </Badge>
            ))}
          </div>
        </div>
      </div>

      {/* Tech Stack */}
      <div>
        <Label>Technology Stack</Label>
        <div className="mt-2 space-y-2">
          <div className="flex gap-2">
            <Input
              value={newTech}
              onChange={(e) => setNewTech(e.target.value)}
              placeholder="Add technology..."
              onKeyPress={(e) => e.key === 'Enter' && addTech()}
            />
            <Button type="button" onClick={addTech} variant="outline">
              Add
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {projectData.techStack.map((tech, index) => (
              <Badge 
                key={index} 
                variant="outline" 
                className="cursor-pointer hover:bg-destructive hover:text-destructive-foreground"
                onClick={() => removeTech(index)}
              >
                {tech} ×
              </Badge>
            ))}
          </div>
        </div>
      </div>

      {/* Installation & Usage */}
      <div className="space-y-4">
        <div>
          <Label htmlFor="installCommand">Installation Command</Label>
          <Input
            id="installCommand"
            value={projectData.installCommand}
            onChange={(e) => setProjectData({ ...projectData, installCommand: e.target.value })}
            placeholder="npm install my-package"
            className="mt-1 font-mono text-sm"
          />
        </div>

        <div>
          <Label htmlFor="usageExample">Basic Usage Example</Label>
          <Textarea
            id="usageExample"
            value={projectData.usageExample}
            onChange={(e) => setProjectData({ ...projectData, usageExample: e.target.value })}
            placeholder="import myPackage from 'my-package';"
            className="mt-1 font-mono text-sm min-h-[80px]"
          />
        </div>
      </div>

      {/* Optional Fields */}
      <div className="space-y-4">
        <div>
          <Label htmlFor="demoUrl">Demo URL (optional)</Label>
          <Input
            id="demoUrl"
            value={projectData.demoUrl || ''}
            onChange={(e) => setProjectData({ ...projectData, demoUrl: e.target.value })}
            placeholder="https://demo.myproject.com"
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="githubUrl">GitHub URL (optional)</Label>
          <Input
            id="githubUrl"
            value={projectData.githubUrl || ''}
            onChange={(e) => setProjectData({ ...projectData, githubUrl: e.target.value })}
            placeholder="https://github.com/username/repo"
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="license">License (optional)</Label>
          <Input
            id="license"
            value={projectData.license || ''}
            onChange={(e) => setProjectData({ ...projectData, license: e.target.value })}
            placeholder="MIT"
            className="mt-1"
          />
        </div>
      </div>
    </div>
  );
};