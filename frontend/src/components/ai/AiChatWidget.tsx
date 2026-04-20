import { useState } from 'react';
import { Bot, Loader2, MessageCircle, Send, Sparkles, X } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { aiApi } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

type Mode = 'ideas' | 'rewrite' | 'continue';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

interface AiChatWidgetProps {
  context?: string;
  onInsertSuggestion?: (text: string) => void;
  title?: string;
}

export const AiChatWidget = ({
  context = '',
  onInsertSuggestion,
  title = 'Ink AI Assistant',
}: AiChatWidgetProps) => {
  const { accessToken } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [prompt, setPrompt] = useState('');
  const [mode, setMode] = useState<Mode>('ideas');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content:
        "Hi! I can help with writing ideas, rewrites, or continuing your draft. Ask me anything about your document.",
    },
  ]);

  const submitPrompt = async () => {
    const trimmedPrompt = prompt.trim();
    if (!trimmedPrompt || !accessToken || loading) return;

    const userMessage: Message = {
      id: `u-${Date.now()}`,
      role: 'user',
      content: trimmedPrompt,
    };

    setMessages((prev) => [...prev, userMessage]);
    setPrompt('');
    setLoading(true);
    setError(null);

    try {
      const response = await aiApi.assist(
        {
          prompt: trimmedPrompt,
          context: context.slice(0, 5000),
          mode,
        },
        accessToken
      );

      setMessages((prev) => [
        ...prev,
        { id: `a-${Date.now()}`, role: 'assistant', content: response.suggestion },
      ]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to get response');
    } finally {
      setLoading(false);
    }
  };

  const latestAssistantMessage = [...messages].reverse().find((message) => message.role === 'assistant');

  return (
    <>
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 w-[min(420px,calc(100vw-2rem))] rounded-xl border border-border bg-card shadow-xl">
          <div className="flex items-center justify-between border-b border-border px-4 py-3">
            <div className="flex items-center gap-2">
              <div className="rounded-full bg-primary/10 p-1.5">
                <Bot className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="text-sm font-semibold">{title}</p>
                <p className="text-xs text-muted-foreground">Writing help powered by Groq</p>
              </div>
            </div>
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setIsOpen(false)}>
              <X className="h-4 w-4" />
            </Button>
          </div>

          <div className="space-y-3 p-4">
            <div className="flex gap-2">
              <Button
                size="sm"
                variant={mode === 'ideas' ? 'default' : 'secondary'}
                onClick={() => setMode('ideas')}
              >
                <Sparkles className="h-3.5 w-3.5 mr-1" />
                Ideas
              </Button>
              <Button
                size="sm"
                variant={mode === 'rewrite' ? 'default' : 'secondary'}
                onClick={() => setMode('rewrite')}
              >
                Rewrite
              </Button>
              <Button
                size="sm"
                variant={mode === 'continue' ? 'default' : 'secondary'}
                onClick={() => setMode('continue')}
              >
                Continue
              </Button>
            </div>

            <div className="max-h-64 space-y-2 overflow-y-auto rounded-lg border border-border bg-background-secondary p-3">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`rounded-md p-2 text-sm ${
                    message.role === 'assistant' ? 'bg-card border border-border' : 'bg-primary/10'
                  }`}
                >
                  <p className="mb-1 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    {message.role === 'assistant' ? 'Ink AI' : 'You'}
                  </p>
                  <p className="whitespace-pre-wrap text-foreground">{message.content}</p>
                </div>
              ))}
            </div>

            <Textarea
              value={prompt}
              onChange={(event) => setPrompt(event.target.value)}
              placeholder="Ask for ideas, rewrites, or next paragraph..."
              className="min-h-[90px] resize-none"
            />

            {error && <p className="text-xs text-destructive">{error}</p>}

            <div className="flex items-center justify-between gap-2">
              {onInsertSuggestion && latestAssistantMessage ? (
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => onInsertSuggestion(latestAssistantMessage.content)}
                >
                  Insert into document
                </Button>
              ) : (
                <div />
              )}
              <Button onClick={submitPrompt} disabled={loading || !prompt.trim()} size="sm" className="gap-2">
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                {loading ? 'Thinking...' : 'Send'}
              </Button>
            </div>
          </div>
        </div>
      )}

      <Button
        onClick={() => setIsOpen((prev) => !prev)}
        size="icon"
        className="fixed bottom-8 right-8 h-14 w-14 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 z-50"
        title="Open AI writing assistant"
      >
        <MessageCircle className="h-6 w-6" />
      </Button>
    </>
  );
};
