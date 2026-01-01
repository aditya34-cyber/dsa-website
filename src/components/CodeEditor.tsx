import { useState, useEffect } from "react";
import Editor from "@monaco-editor/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Play, Save, Download } from "lucide-react";
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
  initialCode = `// Welcome to the DSA Coding Practice Area!\n\n#include <iostream>\nusing namespace std;\n\nint main() {\n  cout << "Hello, World!";\n  return 0;\n}`,
  initialLanguage = "cpp",
  onCodeChange,
}: CodeEditorProps) => {
  const [code, setCode] = useState(initialCode);
  const [language, setLanguage] = useState(initialLanguage);
  const [projects, setProjects] = useState<CodeProject[]>([]);
  const [currentProject, setCurrentProject] = useState<CodeProject | null>(null);
  const [output, setOutput] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const saved = localStorage.getItem("dsa-code-projects");
    if (saved) {
      setProjects(
        JSON.parse(saved).map((p: any) => ({
          ...p,
          lastModified: new Date(p.lastModified),
        }))
      );
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("dsa-code-projects", JSON.stringify(projects));
  }, [projects]);

  const handleCodeChange = (value?: string) => {
    const updated = value || "";
    setCode(updated);
    onCodeChange?.(updated);

    if (currentProject) {
      const updatedProject = {
        ...currentProject,
        code: updated,
        lastModified: new Date(),
      };
      setProjects((p) =>
        p.map((x) => (x.id === updatedProject.id ? updatedProject : x))
      );
      setCurrentProject(updatedProject);
    }
  };

  const saveProject = () => {
    const name = prompt("Project name?");
    if (!name) return;

    const project: CodeProject = {
      id: Date.now().toString(),
      name,
      code,
      language,
      lastModified: new Date(),
    };

    setProjects((p) => [...p, project]);
    setCurrentProject(project);

    toast({ title: "Saved", description: `"${name}" saved successfully` });
  };

  const loadProject = (project: CodeProject) => {
    setCode(project.code);
    setLanguage(project.language);
    setCurrentProject(project);

    toast({ title: "Loaded", description: project.name });
  };

  const runCode = async () => {
    setIsRunning(true);
    setOutput("⏳ Running...");

    try {
      const { data, error } = await supabase.functions.invoke("compile-code", {
        body: { language, code },
      });

      if (error) throw error;
      setOutput(data?.output || "Execution completed");
    } catch (err: any) {
      setOutput(err.message || "Execution failed");
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Bar */}
      <div className="glass-card p-4 rounded-xl">
        <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
          <div className="flex flex-wrap gap-2">
            <Button size="sm" variant="outline" onClick={saveProject}>
              <Save className="w-4 h-4 mr-2" />
              Save
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

          <Button
            onClick={runCode}
            disabled={isRunning}
            className="w-full sm:w-auto"
          >
            <Play className="w-4 h-4 mr-2" />
            {isRunning ? "Running..." : "Run"}
          </Button>
        </div>
      </div>

      {/* MAIN GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Projects */}
        <div className="lg:col-span-1">
          <div className="glass-card p-4 rounded-xl">
            <h3 className="font-semibold mb-3">Your Projects</h3>

            <div className="space-y-2 max-h-64 overflow-y-auto">
              {projects.map((p) => (
                <div
                  key={p.id}
                  onClick={() => loadProject(p)}
                  className={`p-3 rounded-lg border cursor-pointer ${
                    currentProject?.id === p.id
                      ? "border-primary bg-primary/10"
                      : "border-border/20"
                  }`}
                >
                  <p className="font-medium text-sm truncate">{p.name}</p>
                  <p className="text-xs text-muted-foreground">{p.language}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Editor */}
        <div className="lg:col-span-3 space-y-6">
          <div className="glass-card p-4 rounded-xl">
            <div className="h-[320px] sm:h-[420px] border rounded-lg overflow-hidden">
              <Editor
                height="100%"
                language={language}
                value={code}
                onChange={handleCodeChange}
                theme="vs-dark"
                options={{
                  minimap: { enabled: false },
                  fontSize: 14,
                  wordWrap: "on",
                  automaticLayout: true,
                }}
              />
            </div>
          </div>

          {/* Output */}
          <div className="glass-card p-4 rounded-xl">
            <h3 className="font-semibold mb-2">Output</h3>
            <pre className="text-sm whitespace-pre-wrap break-words">
              {output || "Run code to see output"}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CodeEditor;
