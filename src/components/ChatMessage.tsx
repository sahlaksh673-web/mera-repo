import { useState } from "react";
import { Copy, Check, Edit2, Save, X } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { Message } from "../lib/geminiService";

interface ChatMessageProps {
  message: Message;
  onEdit?: (messageId: string, newContent: string) => void;
  onCancelEdit?: () => void;
}

export const ChatMessage = ({ message, onEdit, onCancelEdit }: ChatMessageProps) => {
  const [copied, setCopied] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(message.content);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const handleSaveEdit = () => {
    if (onEdit && editedContent.trim()) {
      onEdit(message.id, editedContent);
      setIsEditing(false);
    }
  };

  const handleCancelEdit = () => {
    setEditedContent(message.content);
    setIsEditing(false);
    if (onCancelEdit) onCancelEdit();
  };

  return (
    <div className={`flex gap-4 p-4 rounded-lg ${message.role === "user" ? "bg-blue-900/30 border border-blue-700" : "bg-gray-900/50 border border-gray-700"}`}>
      <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
        message.role === "user"
          ? "bg-blue-600 text-white"
          : "bg-gradient-to-br from-purple-600 to-pink-600 text-white"
      }`}>
        {message.role === "user" ? "U" : "AI"}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-2">
          <span className="font-semibold text-sm text-white">
            {message.role === "user" ? "You" : "AI Assistant"}
          </span>
          <span className="text-xs text-gray-400">
            {message.timestamp.toLocaleTimeString()}
          </span>
          {message.isEdited && (
            <span className="text-xs text-gray-500 italic">(edited)</span>
          )}
        </div>

        {message.images && message.images.length > 0 && (
          <div className="flex gap-2 mb-3 flex-wrap">
            {message.images.map((img, idx) => (
              <img
                key={idx}
                src={img}
                alt={`Uploaded ${idx + 1}`}
                className="max-w-xs max-h-48 rounded-lg border border-gray-600"
              />
            ))}
          </div>
        )}

        {isEditing ? (
          <div className="space-y-2">
            <Textarea
              value={editedContent}
              onChange={(e) => setEditedContent(e.target.value)}
              className="min-h-24 bg-gray-800 text-white border-gray-600"
              autoFocus
            />
            <div className="flex gap-2">
              <Button size="sm" onClick={handleSaveEdit} className="bg-blue-600 hover:bg-blue-700 text-white">
                <Save className="w-4 h-4 mr-1" />
                Save
              </Button>
              <Button size="sm" variant="outline" onClick={handleCancelEdit} className="border-gray-600 text-white hover:bg-gray-800">
                <X className="w-4 h-4 mr-1" />
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <div className="prose prose-invert max-w-none">
            <ReactMarkdown
              components={{
                code({ className, children, ...props }: any) {
                  const match = /language-(\w+)/.exec(className || "");
                  const codeString = String(children).replace(/\n$/, "");
                  const codeId = `code-${message.id}-${Math.random()}`;
                  const isInline = !className;

                  return !isInline && match ? (
                    <div className="relative group">
                      <Button
                        size="sm"
                        variant="ghost"
                        className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => copyToClipboard(codeString, codeId)}
                      >
                        {copied === codeId ? (
                          <Check className="w-4 h-4 text-green-500" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </Button>
                      <SyntaxHighlighter
                        style={vscDarkPlus as any}
                        language={match[1]}
                        PreTag="div"
                      >
                        {codeString}
                      </SyntaxHighlighter>
                    </div>
                  ) : (
                    <code className={className} {...props}>
                      {children}
                    </code>
                  );
                },
              }}
            >
              {message.content}
            </ReactMarkdown>
          </div>
        )}

        {message.role === "user" && !isEditing && onEdit && (
          <Button
            size="sm"
            variant="ghost"
            className="mt-2 text-gray-300 hover:text-white hover:bg-gray-800"
            onClick={() => setIsEditing(true)}
          >
            <Edit2 className="w-3 h-3 mr-1" />
            Edit
          </Button>
        )}
      </div>
    </div>
  );
};