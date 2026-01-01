import { useState, useEffect } from "react";
import Editor from "@monaco-editor/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Play, Save, Download, Upload } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface CodeProject {
  id: string;
  name: string;
  code: string;
  language: string;
  lastModified: Date;
}

interface CodeEditorProps {
  initialCode?: string;
  initialLanguage?: string;
  onCodeChange?: (code: string) => void;
}

const CodeEditor = ({ 
  initialCode = "// Welcome to the DSA Coding Practice Area!\n// Write your data structures and algorithms here\n\n#include <iostream>\nusing namespace std;\n\nint main() {\n    cout << \"Hello, World!\" << endl;\n    return 0;\n}", 
  initialLanguage = "cpp",
  onCodeChange 
}: CodeEditorProps) => {
  const [code, setCode] = useState(initialCode);
  const [language, setLanguage] = useState(initialLanguage);
  const [projects, setProjects] = useState<CodeProject[]>([]);
  const [currentProject, setCurrentProject] = useState<CodeProject | null>(null);
  const [output, setOutput] = useState<string>("");
  const [isRunning, setIsRunning] = useState(false);
  const { toast } = useToast();

  // Load projects from localStorage on mount
  useEffect(() => {
    const savedProjects = localStorage.getItem("dsa-code-projects");
    if (savedProjects) {
      try {
        const parsed = JSON.parse(savedProjects).map((p: any) => ({
          ...p,
          lastModified: new Date(p.lastModified)
        }));
        setProjects(parsed);
      } catch (error) {
        console.error("Failed to load projects:", error);
      }
    }
  }, []);

  // Save projects to localStorage whenever projects change
  useEffect(() => {
    localStorage.setItem("dsa-code-projects", JSON.stringify(projects));
  }, [projects]);

  const handleCodeChange = (value: string | undefined) => {
    const newCode = value || "";
    setCode(newCode);
    onCodeChange?.(newCode);
    
    // Update current project if one is selected
    if (currentProject) {
      const updatedProject = {
        ...currentProject,
        code: newCode,
        lastModified: new Date()
      };
      setCurrentProject(updatedProject);
      setProjects(prev => 
        prev.map(p => p.id === currentProject.id ? updatedProject : p)
      );
    }
  };

  const saveProject = () => {
    const projectName = prompt("Enter project name:");
    if (!projectName) return;

    const newProject: CodeProject = {
      id: Date.now().toString(),
      name: projectName,
      code,
      language,
      lastModified: new Date()
    };

    setProjects(prev => [...prev, newProject]);
    setCurrentProject(newProject);
    
    toast({
      title: "Project Saved",
      description: `"${projectName}" has been saved successfully.`
    });
  };

  const loadProject = (project: CodeProject) => {
    setCode(project.code);
    setLanguage(project.language);
    setCurrentProject(project);
    
    toast({
      title: "Project Loaded",
      description: `"${project.name}" has been loaded.`
    });
  };

  const deleteProject = (projectId: string) => {
    if (confirm("Are you sure you want to delete this project?")) {
      setProjects(prev => prev.filter(p => p.id !== projectId));
      if (currentProject?.id === projectId) {
        setCurrentProject(null);
      }
      
      toast({
        title: "Project Deleted",
        description: "Project has been deleted successfully."
      });
    }
  };

  const runCode = async () => {
    setIsRunning(true);
    setOutput("⏳ Compiling and executing...");
    
    const startTime = Date.now();
    
    try {
      // For C, C++, Python, TypeScript, and Java - use the compile-code edge function
      if (['c', 'cpp', 'python', 'typescript', 'java'].includes(language)) {
        const { data, error } = await supabase.functions.invoke('compile-code', {
          body: { language, code }
        });

        const elapsed = ((Date.now() - startTime) / 1000).toFixed(2);

        if (error) {
          setOutput(`Compilation error: ${error.message}`);
          toast({
            title: "Compilation Error",
            description: error.message,
            variant: "destructive"
          });
          return;
        }

        if (data.error) {
          setOutput(`Error: ${data.error}\n${data.details || ''}`);
        } else {
          setOutput(`${data.output || 'Code executed successfully (no output)'}\n\n--- Executed in ${elapsed}s ---`);
        }
      } else if (language === "javascript") {
        // Capture console.log output for JavaScript
        let logs: string[] = [];
        const originalLog = console.log;
        console.log = (...args) => {
          logs.push(args.map(arg => 
            typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
          ).join(' '));
        };

        // Execute the code
        try {
          const func = new Function(code);
          func();
          console.log = originalLog;
          setOutput(logs.join('\n') || 'Code executed successfully (no output)');
        } catch (error) {
          console.log = originalLog;
          setOutput(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
      } else {
        setOutput(`Note: Full execution for ${language} requires a backend server. 
This is a code editor for practice - you can write and save your ${language} code here.`);
      }
    } catch (error) {
      setOutput(`Execution error: ${error instanceof Error ? error.message : 'Unknown error'}`);
      toast({
        title: "Execution Error",
        description: error instanceof Error ? error.message : 'Unknown error',
        variant: "destructive"
      });
    } finally {
      setIsRunning(false);
    }
  };

  const exportProject = () => {
    if (!currentProject) {
      toast({
        title: "No Project Selected",
        description: "Please save or load a project first."
      });
      return;
    }

    const dataStr = JSON.stringify(currentProject, null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${currentProject.name}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-4">
      {/* Project Management Bar */}
      <div className="glass-card p-4 rounded-xl">
        <div className="flex flex-wrap gap-4 items-center justify-between">
          <div className="flex gap-2 items-center">
            <Button onClick={saveProject} variant="outline" size="sm">
              <Save className="w-4 h-4 mr-2" />
              Save Project
            </Button>
            
            <Select value={language} onValueChange={setLanguage}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="cpp">C++</SelectItem>
                <SelectItem value="c">C</SelectItem>
                <SelectItem value="python">Python</SelectItem>
                <SelectItem value="javascript">JavaScript</SelectItem>
                <SelectItem value="typescript">TypeScript</SelectItem>
                <SelectItem value="java">Java</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-2">
            <Button 
              onClick={runCode} 
              disabled={isRunning}
              className={`${isRunning ? 'animate-pulse' : ''} bg-success hover:bg-success/90`}
            >
              <Play className={`w-4 h-4 mr-2 ${isRunning ? 'animate-spin' : ''}`} />
              {isRunning ? "Compiling..." : "Run Code"}
            </Button>
            
            {currentProject && (
              <Button onClick={exportProject} variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            )}
          </div>
        </div>

        {/* Current Project Info */}
        {currentProject && (
          <div className="mt-3 pt-3 border-t border-border/20">
            <p className="text-sm text-muted-foreground">
              Current project: <span className="text-foreground font-medium">{currentProject.name}</span>
              <span className="ml-3">Last modified: {currentProject.lastModified.toLocaleDateString()}</span>
            </p>
          </div>
        )}
      </div>

      <div className="grid lg:grid-cols-4 gap-6">
        {/* Projects Sidebar */}
        <div className="lg:col-span-1">
          <div className="glass-card p-4 rounded-xl">
            <h3 className="font-space font-semibold text-lg mb-4">Your Projects</h3>
            
            {projects.length === 0 ? (
              <p className="text-muted-foreground text-sm">No projects yet. Save your first project!</p>
            ) : (
              <div className="space-y-2">
                {projects.map((project) => (
                  <div 
                    key={project.id}
                    className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                      currentProject?.id === project.id 
                        ? 'border-primary bg-primary/10' 
                        : 'border-border/20 hover:border-primary/50'
                    }`}
                    onClick={() => loadProject(project)}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium text-sm truncate">{project.name}</h4>
                        <p className="text-xs text-muted-foreground">{project.language}</p>
                        <p className="text-xs text-muted-foreground">
                          {project.lastModified.toLocaleDateString()}
                        </p>
                      </div>
                      <Button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteProject(project.id);
                        }}
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0 text-destructive hover:text-destructive"
                      >
                        ×
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Main Editor Area */}
        <div className="lg:col-span-3 space-y-6">
          {/* Code Editor */}
          <div className="glass-card p-4 rounded-xl">
            <div className="h-96 border border-border/20 rounded-lg overflow-hidden">
              <Editor
                height="100%"
                language={language}
                value={code}
                onChange={handleCodeChange}
                theme="vs-dark"
                options={{
                  minimap: { enabled: false },
                  fontSize: 14,
                  lineNumbers: "on",
                  wordWrap: "on",
                  automaticLayout: true,
                  scrollBeyondLastLine: false,
                  padding: { top: 16, bottom: 16 }
                }}
              />
            </div>
          </div>

          {/* Output Section */}
          <div className="glass-card p-4 rounded-xl">
            <h3 className="font-space font-semibold text-lg mb-4">Output</h3>
            <div className="bg-card/50 border border-border/20 rounded-lg p-4 min-h-24 font-mono text-sm">
              {output ? (
                <pre className="whitespace-pre-wrap text-foreground">{output}</pre>
              ) : (
                <p className="text-muted-foreground italic">Click "Run Code" to see output here...</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CodeEditor;