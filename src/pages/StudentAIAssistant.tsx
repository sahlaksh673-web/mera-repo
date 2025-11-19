import { useState, useRef, useEffect } from "react";
import { 
  Send, 
  Image, 
  Camera, 
  Mic, 
  Volume2, 
  VolumeX, 
  Plus, 
  Trash2, 
  Edit2, 
  Check, 
  X,
  MessageSquare,
  AlertTriangle
} from "lucide-react";
import { AudioRecorder } from "react-audio-voice-recorder";
import { Button } from "../components/ui/button";
import { Textarea } from "../components/ui/textarea";
import { ScrollArea } from "../components/ui/scroll-area";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../components/ui/alert-dialog";
import { Input } from "../components/ui/input";
import { ChatMessage } from "../components/ChatMessage";
import { 
  geminiService, 
  Message, 
  ChatSession,
  loadChatSessions,
  saveChatSessions,
  createNewSession
} from "../lib/geminiService";
import { toast } from "sonner";

export default function StudentAIAssistant() {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [language, setLanguage] = useState<string>("en");
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [showClearDialog, setShowClearDialog] = useState(false);
  const [sessionToDelete, setSessionToDelete] = useState<string | null>(null);
  const [editingSessionId, setEditingSessionId] = useState<string | null>(null);
  const [editingSessionName, setEditingSessionName] = useState("");
  const [showCamera, setShowCamera] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const speechSynthesisRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    const loaded = loadChatSessions();
    if (loaded.length === 0) {
      const newSession = createNewSession();
      setSessions([newSession]);
      setCurrentSessionId(newSession.id);
      saveChatSessions([newSession]);
    } else {
      setSessions(loaded);
      setCurrentSessionId(loaded[0].id);
    }
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [sessions, currentSessionId]);

  const currentSession = sessions.find(s => s.id === currentSessionId);

  const handleSendMessage = async () => {
    if (!inputMessage.trim() && selectedImages.length === 0) return;
    if (!currentSession) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: inputMessage,
      timestamp: new Date(),
      images: imagePreviews,
    };

    const updatedSessions = sessions.map(session =>
      session.id === currentSessionId
        ? {
            ...session,
            messages: [...session.messages, userMessage],
            updatedAt: new Date()
          }
        : session
    );

    setSessions(updatedSessions);
    saveChatSessions(updatedSessions);
    setInputMessage("");
    setIsLoading(true);

    try {
      const response = await geminiService.sendMessage(
        inputMessage,
        selectedImages.length > 0 ? selectedImages : undefined,
        language,
        currentSession.messages
      );

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: response,
        timestamp: new Date(),
      };

      const finalSessions = updatedSessions.map(session =>
        session.id === currentSessionId
          ? {
              ...session,
              messages: [...session.messages, assistantMessage],
              updatedAt: new Date()
            }
          : session
      );

      setSessions(finalSessions);
      saveChatSessions(finalSessions);
    } catch (error) {
      toast.error("Failed to get response from AI. Please try again.");
      console.error(error);
    } finally {
      setIsLoading(false);
      setSelectedImages([]);
      setImagePreviews([]);
    }
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const imageFiles = files.filter(file => file.type.startsWith("image/"));
    
    if (imageFiles.length > 0) {
      setSelectedImages(imageFiles);
      const previews = imageFiles.map(file => URL.createObjectURL(file));
      setImagePreviews(previews);
    }
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setShowCamera(true);
      }
    } catch (error) {
      toast.error("Failed to access camera. Please check permissions.");
      console.error(error);
    }
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.drawImage(video, 0, 0);
        canvas.toBlob((blob) => {
          if (blob) {
            const file = new File([blob], `capture-${Date.now()}.jpg`, { type: "image/jpeg" });
            setSelectedImages([file]);
            const preview = URL.createObjectURL(file);
            setImagePreviews([preview]);
            stopCamera();
          }
        }, "image/jpeg");
      }
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
      setShowCamera(false);
    }
  };

  const handleAudioRecording = async (blob: Blob) => {
    try {
      setIsLoading(true);
      const transcription = await geminiService.transcribeAudio(blob);
      setInputMessage(transcription);
      toast.success("Audio transcribed successfully!");
    } catch (error) {
      toast.error("Failed to transcribe audio. Please try again.");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const speakResponse = (text: string) => {
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    
    const voices = window.speechSynthesis.getVoices();
    if (language === "hi") {
      const hindiVoice = voices.find(voice => voice.lang.includes("hi"));
      if (hindiVoice) utterance.voice = hindiVoice;
    } else {
      const englishVoice = voices.find(voice => voice.lang.includes("en"));
      if (englishVoice) utterance.voice = englishVoice;
    }

    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    
    speechSynthesisRef.current = utterance;
    window.speechSynthesis.speak(utterance);
    setIsSpeaking(true);
  };

  const handleNewChat = () => {
    const newSession = createNewSession();
    const updated = [newSession, ...sessions];
    setSessions(updated);
    setCurrentSessionId(newSession.id);
    saveChatSessions(updated);
  };

  const handleDeleteSession = (sessionId: string) => {
    setSessionToDelete(sessionId);
  };

  const confirmDeleteSession = () => {
    if (!sessionToDelete) return;
    
    const updated = sessions.filter(s => s.id !== sessionToDelete);
    
    if (updated.length === 0) {
      const newSession = createNewSession();
      setSessions([newSession]);
      setCurrentSessionId(newSession.id);
      saveChatSessions([newSession]);
    } else {
      setSessions(updated);
      if (currentSessionId === sessionToDelete) {
        setCurrentSessionId(updated[0].id);
      }
      saveChatSessions(updated);
    }
    
    setSessionToDelete(null);
  };

  const handleRenameSession = (sessionId: string, currentName: string) => {
    setEditingSessionId(sessionId);
    setEditingSessionName(currentName);
  };

  const saveSessionName = () => {
    if (!editingSessionId) return;
    
    const updated = sessions.map(s =>
      s.id === editingSessionId
        ? { ...s, name: editingSessionName }
        : s
    );
    
    setSessions(updated);
    saveChatSessions(updated);
    setEditingSessionId(null);
  };

  const handleClearAllChats = () => {
    setShowClearDialog(true);
  };

  const confirmClearAllChats = () => {
    const newSession = createNewSession();
    setSessions([newSession]);
    setCurrentSessionId(newSession.id);
    saveChatSessions([newSession]);
    setShowClearDialog(false);
    toast.success("All chats cleared successfully!");
  };

  const handleEditMessage = (messageId: string, newContent: string) => {
    if (!currentSession) return;

    const messageIndex = currentSession.messages.findIndex(m => m.id === messageId);
    if (messageIndex === -1) return;

    const updatedMessages = [...currentSession.messages];
    updatedMessages[messageIndex] = {
      ...updatedMessages[messageIndex],
      content: newContent,
      isEdited: true,
    };

    updatedMessages.splice(messageIndex + 1);

    const updatedSessions = sessions.map(s =>
      s.id === currentSessionId
        ? { ...s, messages: updatedMessages, updatedAt: new Date() }
        : s
    );

    setSessions(updatedSessions);
    saveChatSessions(updatedSessions);

    setInputMessage(newContent);
  };

  return (
    <div className="flex h-screen bg-black">
      <div className="w-64 bg-gray-900 border-r border-gray-700 flex flex-col">
        <div className="p-4 border-b border-gray-700">
          <Button onClick={handleNewChat} className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white">
            <Plus className="w-4 h-4 mr-2" />
            New Chat
          </Button>
        </div>

        <ScrollArea className="flex-1 p-2">
          {sessions.map(session => (
            <div
              key={session.id}
              className={`p-3 mb-2 rounded-lg cursor-pointer transition-colors ${
                currentSessionId === session.id
                  ? "bg-blue-900 text-white"
                  : "hover:bg-gray-800 text-gray-300"
              }`}
              onClick={() => setCurrentSessionId(session.id)}
            >
              {editingSessionId === session.id ? (
                <div className="flex gap-1" onClick={(e) => e.stopPropagation()}>
                  <Input
                    value={editingSessionName}
                    onChange={(e) => setEditingSessionName(e.target.value)}
                    className="h-7 text-sm"
                    autoFocus
                  />
                  <Button size="sm" variant="ghost" onClick={saveSessionName}>
                    <Check className="w-3 h-3" />
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => setEditingSessionId(null)}>
                    <X className="w-3 h-3" />
                  </Button>
                </div>
              ) : (
                <div>
                  <div className="flex items-center justify-between">
                    <MessageSquare className="w-4 h-4 text-gray-400" />
                    <div className="flex gap-1">
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-6 w-6 p-0 text-gray-300 hover:text-white"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRenameSession(session.id, session.name);
                        }}
                      >
                        <Edit2 className="w-3 h-3" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-6 w-6 p-0 text-red-400 hover:text-red-300"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteSession(session.id);
                        }}
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                  <p className="text-sm font-medium mt-1 truncate text-white">{session.name}</p>
                  <p className="text-xs text-gray-400">
                    {session.messages.length} messages
                  </p>
                </div>
              )}
            </div>
          ))}
        </ScrollArea>

        <div className="p-4 border-t border-gray-700">
          <Button
            variant="destructive"
            className="w-full bg-red-600 hover:bg-red-700 text-white"
            onClick={handleClearAllChats}
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Clear All Chats
          </Button>
        </div>
      </div>

      <div className="flex-1 flex flex-col">
        <div className="bg-gray-900 border-b border-gray-700 p-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              AI Assistant
            </h1>
            <p className="text-sm text-gray-400">Powered by Gemini 2.5 Pro</p>
          </div>
          
          <Select value={language} onValueChange={setLanguage}>
            <SelectTrigger className="w-48 bg-gray-800 text-white border-gray-700">
              <SelectValue placeholder="Select language" />
            </SelectTrigger>
            <SelectContent className="bg-gray-800 text-white border-gray-700">
              <SelectItem value="en">English</SelectItem>
              <SelectItem value="indian-english">Indian English</SelectItem>
              <SelectItem value="hinglish">Hinglish</SelectItem>
              <SelectItem value="hi">हिंदी (Hindi)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <ScrollArea className="flex-1 p-4 bg-black">
          {currentSession?.messages.length === 0 ? (
            <div className="h-full flex items-center justify-center">
              <div className="text-center max-w-md">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MessageSquare className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-2xl font-bold mb-2 text-white">Welcome to AI Assistant</h2>
                <p className="text-gray-300 mb-4">
                  I can help you with coding, answer questions, analyze images, transcribe audio, and search the internet. 
                  I speak English, Hinglish, and Hindi!
                </p>
                <div className="grid grid-cols-2 gap-2 text-sm text-left">
                  <div className="bg-blue-900/30 p-3 rounded-lg border border-blue-700">
                    <p className="font-semibold text-blue-400">💬 Ask anything</p>
                    <p className="text-gray-300 text-xs">Get detailed answers</p>
                  </div>
                  <div className="bg-purple-900/30 p-3 rounded-lg border border-purple-700">
                    <p className="font-semibold text-purple-400">💻 Code help</p>
                    <p className="text-gray-300 text-xs">Debug and learn</p>
                  </div>
                  <div className="bg-green-900/30 p-3 rounded-lg border border-green-700">
                    <p className="font-semibold text-green-400">📷 Image analysis</p>
                    <p className="text-gray-300 text-xs">Upload or capture</p>
                  </div>
                  <div className="bg-orange-900/30 p-3 rounded-lg border border-orange-700">
                    <p className="font-semibold text-orange-400">🎤 Voice input</p>
                    <p className="text-gray-300 text-xs">Speak your question</p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {currentSession?.messages.map((message, index) => (
                <div key={message.id} className="relative group">
                  <ChatMessage
                    message={message}
                    onEdit={handleEditMessage}
                  />
                  {message.role === "assistant" && (
                    <Button
                      size="sm"
                      variant="ghost"
                      className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => speakResponse(message.content)}
                    >
                      {isSpeaking ? (
                        <VolumeX className="w-4 h-4" />
                      ) : (
                        <Volume2 className="w-4 h-4" />
                      )}
                    </Button>
                  )}
                </div>
              ))}
              {isLoading && (
                <div className="flex gap-4 p-4 bg-gray-900 rounded-lg">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 animate-pulse" />
                  <div className="space-y-2 flex-1">
                    <div className="h-4 bg-gray-700 rounded w-24 animate-pulse" />
                    <div className="h-4 bg-gray-700 rounded w-full animate-pulse" />
                    <div className="h-4 bg-gray-700 rounded w-3/4 animate-pulse" />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
        </ScrollArea>

        {showCamera && (
          <div className="absolute inset-0 bg-black/80 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 max-w-2xl">
              <video ref={videoRef} autoPlay className="rounded-lg mb-4 w-full" />
              <div className="flex gap-2 justify-center">
                <Button onClick={capturePhoto} className="bg-blue-600 hover:bg-blue-700">
                  <Camera className="w-4 h-4 mr-2" />
                  Capture Photo
                </Button>
                <Button variant="outline" onClick={stopCamera}>
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        )}

        <canvas ref={canvasRef} className="hidden" />

        <div className="bg-gray-900 border-t border-gray-700 p-4">
          {imagePreviews.length > 0 && (
            <div className="mb-4 flex gap-2 flex-wrap">
              {imagePreviews.map((preview, idx) => (
                <div key={idx} className="relative">
                  <img
                    src={preview}
                    alt={`Preview ${idx + 1}`}
                    className="w-20 h-20 object-cover rounded-lg border border-gray-600"
                  />
                  <Button
                    size="sm"
                    variant="destructive"
                    className="absolute -top-2 -right-2 h-6 w-6 p-0 rounded-full"
                    onClick={() => {
                      setSelectedImages([]);
                      setImagePreviews([]);
                    }}
                  >
                    <X className="w-3 h-3" />
                  </Button>
                </div>
              ))}
            </div>
          )}

          <div className="flex gap-2">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageSelect}
              multiple
            />
            
            <Button
              variant="outline"
              size="icon"
              onClick={() => fileInputRef.current?.click()}
              title="Upload image"
              className="bg-gray-800 border-gray-600 text-white hover:bg-gray-700"
            >
              <Image className="w-5 h-5" />
            </Button>

            <Button
              variant="outline"
              size="icon"
              onClick={startCamera}
              title="Take photo"
              className="bg-gray-800 border-gray-600 text-white hover:bg-gray-700"
            >
              <Camera className="w-5 h-5" />
            </Button>

            <div className="flex items-center">
              <AudioRecorder
                onRecordingComplete={handleAudioRecording}
                audioTrackConstraints={{
                  noiseSuppression: true,
                  echoCancellation: true,
                }}
                downloadFileExtension="mp3"
              />
            </div>

            <Textarea
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Ask me anything... (Text, code, questions, analysis)"
              className="flex-1 min-h-12 max-h-32 bg-gray-800 border-gray-600 text-white placeholder:text-gray-400"
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
            />

            <Button
              onClick={handleSendMessage}
              disabled={isLoading || (!inputMessage.trim() && selectedImages.length === 0)}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
            >
              <Send className="w-5 h-5" />
            </Button>
          </div>

          <p className="text-xs text-gray-400 mt-2 text-center">
            Press Enter to send, Shift+Enter for new line
          </p>
        </div>
      </div>

      <AlertDialog open={showClearDialog} onOpenChange={setShowClearDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-red-500" />
              Clear All Chats?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete all your chat history. This action cannot be undone.
              Are you sure you want to continue?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmClearAllChats} className="bg-red-600 hover:bg-red-700">
              Yes, Clear All
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={sessionToDelete !== null} onOpenChange={(open) => !open && setSessionToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Chat?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this chat conversation. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteSession} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
