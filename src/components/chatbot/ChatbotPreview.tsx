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
    <div className="h-full flex flex-col">
      {/* Preview Header */}
      <div className="p-4 border-b border-border bg-card">
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
      <div className="flex-1 p-4 flex items-end justify-end relative overflow-hidden bg-gradient-to-br from-slate-100 to-slate-200">
        {/* Chat Widget */}
        {isOpen ? (
          <div
            className={cn(
              'w-full max-w-sm shadow-strong rounded-2xl overflow-hidden flex flex-col bg-card',
              'absolute bottom-4',
              appearanceSettings.launcherPosition === 'bottom-right' ? 'right-4' : 'left-4'
            )}
            style={{ maxHeight: 'calc(100% - 2rem)' }}
          >
            {/* Widget Header */}
            <div
              className="p-4 text-white flex items-center justify-between"
              style={{ backgroundColor: appearanceSettings.primaryColor }}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                  <MessageSquare className="h-5 w-5" />
                </div>
                <div>
                  <div className="font-semibold">{bot.bot.name}</div>
                  <div className="text-xs opacity-90">{getBotTypeLabel()}</div>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:bg-white/20"
                onClick={() => setIsOpen(false)}
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            {/* Chat Content */}
            <ScrollArea className="flex-1 p-4" style={{ maxHeight: '300px' }}>
              {previewState === 'offline' ? (
                <div className="text-center py-6">
                  <div className="w-12 h-12 rounded-full bg-muted mx-auto mb-3 flex items-center justify-center">
                    <MessageSquare className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">
                    {appearanceSettings.offlineMessage}
                  </p>
                  <Button size="sm" style={{ backgroundColor: appearanceSettings.primaryColor }} className="text-white">
                    Leave a Message
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
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
                          'max-w-[80%] rounded-2xl px-4 py-2 text-sm',
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
                    <div className="flex flex-wrap gap-2 mt-2">
                      {quickReplies.map((btn) => (
                        <Button
                          key={btn.id}
                          variant="outline"
                          size="sm"
                          className="rounded-full text-xs"
                          style={{ borderColor: appearanceSettings.primaryColor, color: appearanceSettings.primaryColor }}
                        >
                          {btn.label}
                        </Button>
                      ))}
                    </div>
                  )}

                  {/* AI Bot hint */}
                  {bot.bot.type === 'ai' && (
                    <div className="text-xs text-center text-muted-foreground py-2">
                      Ask me anything! 🤖
                    </div>
                  )}

                  {/* Live Chat hint */}
                  {bot.bot.type === 'live' && (
                    <div className="flex items-center gap-2 text-xs text-muted-foreground py-2">
                      <div className="flex -space-x-2">
                        {bot.liveChatSettings.agents.slice(0, 3).map((agent, i) => (
                          <div
                            key={agent.id}
                            className="w-6 h-6 rounded-full bg-muted border-2 border-card flex items-center justify-center"
                          >
                            <User className="h-3 w-3" />
                          </div>
                        ))}
                      </div>
                      <span>Agent will reply shortly</span>
                    </div>
                  )}
                </div>
              )}
            </ScrollArea>

            {/* Input Area */}
            {previewState !== 'offline' && (
              <div className="p-3 border-t border-border">
                <div className="flex gap-2">
                  <Input
                    placeholder={bot.bot.type === 'ai' ? 'Ask anything...' : 'Type a message...'}
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    className="flex-1"
                  />
                  <Button
                    size="icon"
                    style={{ backgroundColor: appearanceSettings.primaryColor }}
                    className="text-white"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}

            {/* Branding */}
            {appearanceSettings.showBranding && (
              <div className="py-2 text-center text-xs text-muted-foreground border-t border-border">
                Powered by Reseau
              </div>
            )}
          </div>
        ) : (
          /* Launcher Button */
          <button
            onClick={() => setIsOpen(true)}
            className={cn(
              'w-14 h-14 rounded-full shadow-strong flex items-center justify-center text-white transition-transform hover:scale-110',
              'absolute bottom-4',
              appearanceSettings.launcherPosition === 'bottom-right' ? 'right-4' : 'left-4'
            )}
            style={{ backgroundColor: appearanceSettings.primaryColor }}
          >
            <MessageSquare className="h-6 w-6" />
          </button>
        )}
      </div>

      {/* Preview Info */}
      <div className="p-4 bg-card border-t border-border">
        <div className="text-xs text-muted-foreground space-y-1">
          <div className="flex justify-between">
            <span>Position:</span>
            <span className="font-medium">{appearanceSettings.launcherPosition}</span>
          </div>
          <div className="flex justify-between">
            <span>Primary Color:</span>
            <div className="flex items-center gap-2">
              <div
                className="w-4 h-4 rounded-full border"
                style={{ backgroundColor: appearanceSettings.primaryColor }}
              />
              <span className="font-medium">{appearanceSettings.primaryColor}</span>
            </div>
          </div>
          <div className="flex justify-between">
            <span>Bot Type:</span>
            <Badge variant="outline" className="text-xs">
              {bot.bot.type === 'prefed' ? 'Pre-fed' : bot.bot.type === 'live' ? 'Live' : 'AI'}
            </Badge>
          </div>
        </div>
      </div>
    </div>
  );
};
