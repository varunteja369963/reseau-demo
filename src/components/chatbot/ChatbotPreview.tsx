import { useState } from 'react';
import { MessageSquare, Send, X, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { BotConfiguration } from '@/types/chatbot';
import { cn } from '@/lib/utils';

interface ChatbotPreviewProps {
  bot: BotConfiguration;
  previewState: 'online' | 'offline' | 'conversation';
  setPreviewState: (state: 'online' | 'offline' | 'conversation') => void;
}

export const ChatbotPreview = ({ bot, previewState, setPreviewState }: ChatbotPreviewProps) => {
  const [isOpen, setIsOpen] = useState(true);
  const [inputMessage, setInputMessage] = useState('');
  const { appearanceSettings, flowSettings } = bot;

  const sampleMessages = [
    { sender: 'bot', text: appearanceSettings.welcomeMessage },
    { sender: 'user', text: "I'm looking for a new car" },
    { sender: 'bot', text: "Great! I'd be happy to help. What type of vehicle are you interested in?" },
  ];

  const getBotTypeLabel = () => {
    switch (bot.bot.type) {
      case 'prefed':
        return 'Flow Bot';
      case 'live':
        return 'Live Agent';
      case 'ai':
        return 'AI Assistant';
    }
  };

  const activeFlow = flowSettings.flows.find(f => f.id === flowSettings.activeFlowId);
  const quickReplies = activeFlow?.jsonDefinition.find(n => n.type === 'buttons')?.data.buttons;

  return (
    <div className="h-full flex flex-col overflow-hidden">
      {/* Preview Header */}
      <div className="p-4 border-b border-border bg-card flex-shrink-0">
        <h3 className="font-semibold text-foreground mb-3">Live Preview</h3>
        <Select value={previewState} onValueChange={(v) => setPreviewState(v as typeof previewState)}>
          <SelectTrigger className="h-9">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="online">Online State</SelectItem>
            <SelectItem value="offline">Offline State</SelectItem>
            <SelectItem value="conversation">In Conversation</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Preview Area */}
      <div className="flex-1 min-h-0 p-4 flex items-end justify-end relative bg-gradient-to-br from-slate-100 to-slate-200 overflow-hidden">
        {/* Chat Widget */}
        {isOpen ? (
          <div
            className={cn(
              'w-full max-w-[280px] shadow-strong rounded-2xl flex flex-col bg-card',
              'absolute bottom-4 max-h-[calc(100%-2rem)]',
              appearanceSettings.launcherPosition === 'bottom-right' ? 'right-4' : 'left-4'
            )}
          >
            {/* Widget Header */}
            <div
              className="p-3 text-white flex items-center justify-between flex-shrink-0 rounded-t-2xl"
              style={{ backgroundColor: appearanceSettings.primaryColor }}
            >
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                  <MessageSquare className="h-4 w-4" />
                </div>
                <div className="min-w-0">
                  <div className="font-semibold text-sm truncate">{bot.bot.name}</div>
                  <div className="text-xs opacity-90">{getBotTypeLabel()}</div>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:bg-white/20 h-7 w-7 flex-shrink-0"
                onClick={() => setIsOpen(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* Chat Content */}
            <ScrollArea className="flex-1 min-h-0 max-h-[200px]">
              <div className="p-3">
                {previewState === 'offline' ? (
                  <div className="text-center py-4">
                    <div className="w-10 h-10 rounded-full bg-muted mx-auto mb-2 flex items-center justify-center">
                      <MessageSquare className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <p className="text-xs text-muted-foreground mb-3">
                      {appearanceSettings.offlineMessage}
                    </p>
                    <Button size="sm" style={{ backgroundColor: appearanceSettings.primaryColor }} className="text-white text-xs h-7">
                      Leave a Message
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {sampleMessages.map((msg, idx) => (
                      <div
                        key={idx}
                        className={cn(
                          'flex',
                          msg.sender === 'user' ? 'justify-end' : 'justify-start'
                        )}
                      >
                        <div
                          className={cn(
                            'max-w-[85%] rounded-xl px-3 py-1.5 text-xs',
                            msg.sender === 'user'
                              ? 'bg-muted text-foreground rounded-br-sm'
                              : 'text-white rounded-bl-sm'
                          )}
                          style={msg.sender === 'bot' ? { backgroundColor: appearanceSettings.primaryColor } : {}}
                        >
                          {msg.text}
                        </div>
                      </div>
                    ))}

                    {/* Quick Replies for Pre-fed bots */}
                    {bot.bot.type === 'prefed' && quickReplies && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {quickReplies.slice(0, 2).map((btn) => (
                          <Button
                            key={btn.id}
                            variant="outline"
                            size="sm"
                            className="rounded-full text-[10px] h-6 px-2"
                            style={{ borderColor: appearanceSettings.primaryColor, color: appearanceSettings.primaryColor }}
                          >
                            {btn.label}
                          </Button>
                        ))}
                      </div>
                    )}

                    {/* AI Bot hint */}
                    {bot.bot.type === 'ai' && (
                      <div className="text-[10px] text-center text-muted-foreground py-1">
                        Ask me anything! 🤖
                      </div>
                    )}

                    {/* Live Chat hint */}
                    {bot.bot.type === 'live' && (
                      <div className="flex items-center gap-1 text-[10px] text-muted-foreground py-1">
                        <div className="flex -space-x-1">
                          {bot.liveChatSettings.agents.slice(0, 2).map((agent, i) => (
                            <div
                              key={agent.id}
                              className="w-4 h-4 rounded-full bg-muted border border-card flex items-center justify-center"
                            >
                              <User className="h-2 w-2" />
                            </div>
                          ))}
                        </div>
                        <span>Agent will reply</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </ScrollArea>

            {/* Input Area */}
            {previewState !== 'offline' && (
              <div className="p-2 border-t border-border flex-shrink-0">
                <div className="flex gap-1">
                  <Input
                    placeholder={bot.bot.type === 'ai' ? 'Ask anything...' : 'Type a message...'}
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    className="flex-1 h-8 text-xs"
                  />
                  <Button
                    size="icon"
                    className="h-8 w-8 flex-shrink-0"
                    style={{ backgroundColor: appearanceSettings.primaryColor }}
                  >
                    <Send className="h-3 w-3 text-white" />
                  </Button>
                </div>
              </div>
            )}

            {/* Branding */}
            {appearanceSettings.showBranding && (
              <div className="py-1.5 text-center text-[10px] text-muted-foreground border-t border-border flex-shrink-0">
                Powered by Reseau
              </div>
            )}
          </div>
        ) : (
          /* Launcher Button */
          <button
            onClick={() => setIsOpen(true)}
            className={cn(
              'w-12 h-12 rounded-full shadow-strong flex items-center justify-center text-white transition-transform hover:scale-110',
              'absolute bottom-4',
              appearanceSettings.launcherPosition === 'bottom-right' ? 'right-4' : 'left-4'
            )}
            style={{ backgroundColor: appearanceSettings.primaryColor }}
          >
            <MessageSquare className="h-5 w-5" />
          </button>
        )}
      </div>

      {/* Preview Info */}
      <div className="p-3 bg-card border-t border-border flex-shrink-0">
        <div className="text-xs text-muted-foreground space-y-1">
          <div className="flex justify-between">
            <span>Position:</span>
            <span className="font-medium">{appearanceSettings.launcherPosition}</span>
          </div>
          <div className="flex justify-between">
            <span>Primary Color:</span>
            <div className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full border"
                style={{ backgroundColor: appearanceSettings.primaryColor }}
              />
              <span className="font-medium">{appearanceSettings.primaryColor}</span>
            </div>
          </div>
          <div className="flex justify-between">
            <span>Bot Type:</span>
            <Badge variant="outline" className="text-[10px] h-5">
              {bot.bot.type === 'prefed' ? 'Pre-fed' : bot.bot.type === 'live' ? 'Live' : 'AI'}
            </Badge>
          </div>
        </div>
      </div>
    </div>
  );
};