import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { 
  Type, Image, Square, Minus, Space, Mail, 
  Trash2, GripVertical, Save, Eye 
} from "lucide-react";
import { toast } from "sonner";

type BlockType = "text" | "image" | "button" | "divider" | "spacer" | "header";

interface Block {
  id: string;
  type: BlockType;
  content: {
    text?: string;
    imageUrl?: string;
    buttonText?: string;
    buttonUrl?: string;
    height?: number;
  };
}

interface EmailTemplateBuilderProps {
  open: boolean;
  onClose: () => void;
  template?: {
    id?: string;
    name: string;
    category: string;
  };
}

export const EmailTemplateBuilder = ({ open, onClose, template }: EmailTemplateBuilderProps) => {
  const [templateName, setTemplateName] = useState(template?.name || "");
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [draggedBlock, setDraggedBlock] = useState<string | null>(null);
  const [editingBlock, setEditingBlock] = useState<string | null>(null);

  const blockTypes = [
    { type: "header" as BlockType, icon: Mail, label: "Header" },
    { type: "text" as BlockType, icon: Type, label: "Text" },
    { type: "image" as BlockType, icon: Image, label: "Image" },
    { type: "button" as BlockType, icon: Square, label: "Button" },
    { type: "divider" as BlockType, icon: Minus, label: "Divider" },
    { type: "spacer" as BlockType, icon: Space, label: "Spacer" },
  ];

  const addBlock = (type: BlockType) => {
    const newBlock: Block = {
      id: `block-${Date.now()}`,
      type,
      content: {
        text: type === "text" ? "Edit this text..." : type === "header" ? "Email Header" : "",
        imageUrl: type === "image" ? "https://via.placeholder.com/600x300" : undefined,
        buttonText: type === "button" ? "Click Here" : undefined,
        buttonUrl: type === "button" ? "#" : undefined,
        height: type === "spacer" ? 40 : undefined,
      },
    };
    setBlocks([...blocks, newBlock]);
  };

  const deleteBlock = (id: string) => {
    setBlocks(blocks.filter(b => b.id !== id));
  };

  const updateBlock = (id: string, content: Block["content"]) => {
    setBlocks(blocks.map(b => b.id === id ? { ...b, content } : b));
    setEditingBlock(null);
  };

  const handleDragStart = (id: string) => {
    setDraggedBlock(id);
  };

  const handleDragOver = (e: React.DragEvent, targetId: string) => {
    e.preventDefault();
    if (!draggedBlock || draggedBlock === targetId) return;

    const draggedIndex = blocks.findIndex(b => b.id === draggedBlock);
    const targetIndex = blocks.findIndex(b => b.id === targetId);

    if (draggedIndex !== -1 && targetIndex !== -1) {
      const newBlocks = [...blocks];
      const [removed] = newBlocks.splice(draggedIndex, 1);
      newBlocks.splice(targetIndex, 0, removed);
      setBlocks(newBlocks);
    }
  };

  const handleSave = () => {
    if (!templateName.trim()) {
      toast.error("Please enter a template name");
      return;
    }
    toast.success("Template saved successfully!");
    onClose();
  };

  const renderBlockPreview = (block: Block) => {
    switch (block.type) {
      case "header":
        return (
          <div className="bg-primary text-primary-foreground p-6 text-center">
            <h1 className="text-2xl font-bold">{block.content.text}</h1>
          </div>
        );
      case "text":
        return <p className="text-sm">{block.content.text}</p>;
      case "image":
        return <img src={block.content.imageUrl} alt="Email" className="w-full h-auto" />;
      case "button":
        return (
          <div className="text-center">
            <button className="bg-primary text-primary-foreground px-6 py-3 rounded-md">
              {block.content.buttonText}
            </button>
          </div>
        );
      case "divider":
        return <hr className="border-t border-border" />;
      case "spacer":
        return <div style={{ height: `${block.content.height}px` }} />;
      default:
        return null;
    }
  };

  const renderBlockEditor = (block: Block) => {
    return (
      <Card className="p-4 space-y-3">
        {block.type === "text" || block.type === "header" ? (
          <div>
            <Label>Text Content</Label>
            <Textarea
              value={block.content.text}
              onChange={(e) => updateBlock(block.id, { ...block.content, text: e.target.value })}
              rows={3}
            />
          </div>
        ) : null}

        {block.type === "image" ? (
          <div>
            <Label>Image URL</Label>
            <Input
              value={block.content.imageUrl}
              onChange={(e) => updateBlock(block.id, { ...block.content, imageUrl: e.target.value })}
              placeholder="https://..."
            />
          </div>
        ) : null}

        {block.type === "button" ? (
          <>
            <div>
              <Label>Button Text</Label>
              <Input
                value={block.content.buttonText}
                onChange={(e) => updateBlock(block.id, { ...block.content, buttonText: e.target.value })}
              />
            </div>
            <div>
              <Label>Button URL</Label>
              <Input
                value={block.content.buttonUrl}
                onChange={(e) => updateBlock(block.id, { ...block.content, buttonUrl: e.target.value })}
                placeholder="https://..."
              />
            </div>
          </>
        ) : null}

        {block.type === "spacer" ? (
          <div>
            <Label>Height (px)</Label>
            <Input
              type="number"
              value={block.content.height}
              onChange={(e) => updateBlock(block.id, { ...block.content, height: parseInt(e.target.value) || 40 })}
            />
          </div>
        ) : null}

        <Button onClick={() => setEditingBlock(null)} size="sm" className="w-full">
          Done Editing
        </Button>
      </Card>
    );
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Email Template Builder</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-12 gap-4 flex-1 overflow-hidden">
          {/* Toolbox */}
          <div className="col-span-2 border-r pr-4 overflow-y-auto">
            <div className="mb-4">
              <Label>Template Name</Label>
              <Input
                value={templateName}
                onChange={(e) => setTemplateName(e.target.value)}
                placeholder="My Template"
              />
            </div>

            <div className="space-y-2">
              <h3 className="font-semibold text-sm mb-2">Add Blocks</h3>
              {blockTypes.map(({ type, icon: Icon, label }) => (
                <Button
                  key={type}
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => addBlock(type)}
                  size="sm"
                >
                  <Icon className="w-4 h-4 mr-2" />
                  {label}
                </Button>
              ))}
            </div>
          </div>

          {/* Canvas */}
          <div className="col-span-6 border-r pr-4 overflow-y-auto">
            <div className="bg-muted/30 p-4 rounded-lg min-h-full">
              <div className="bg-background max-w-2xl mx-auto shadow-lg">
                {blocks.length === 0 ? (
                  <div className="p-12 text-center text-muted-foreground">
                    <Mail className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>Add blocks from the left to start building</p>
                  </div>
                ) : (
                  blocks.map((block) => (
                    <div
                      key={block.id}
                      draggable
                      onDragStart={() => handleDragStart(block.id)}
                      onDragOver={(e) => handleDragOver(e, block.id)}
                      className="group relative border-b border-border p-4 hover:bg-accent/50 cursor-move"
                    >
                      <div className="absolute left-1 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100">
                        <GripVertical className="w-4 h-4 text-muted-foreground" />
                      </div>
                      <div className="absolute right-1 top-1 opacity-0 group-hover:opacity-100 flex gap-1">
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-7 w-7"
                          onClick={() => setEditingBlock(block.id)}
                        >
                          <Eye className="w-3 h-3" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-7 w-7"
                          onClick={() => deleteBlock(block.id)}
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                      {renderBlockPreview(block)}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Properties Panel */}
          <div className="col-span-4 overflow-y-auto">
            <h3 className="font-semibold mb-4">Properties</h3>
            {editingBlock ? (
              renderBlockEditor(blocks.find(b => b.id === editingBlock)!)
            ) : (
              <p className="text-sm text-muted-foreground">
                Click the eye icon on a block to edit its properties
              </p>
            )}
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-4 border-t">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            <Save className="w-4 h-4 mr-2" />
            Save Template
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
