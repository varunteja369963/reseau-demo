import { useState, useEffect } from 'react';
import { Check, TrendingUp, Users, Target, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';

interface CardOption {
  key: string;
  label: string;
  icon: any;
  description: string;
}

const AVAILABLE_CARDS: CardOption[] = [
  { key: 'total_leads', label: 'Total Leads', icon: Users, description: 'All leads in system' },
  { key: 'qualified', label: 'Qualified Leads', icon: TrendingUp, description: 'High-priority leads' },
  { key: 'cold', label: 'Cold Leads', icon: AlertCircle, description: 'Inactive leads' },
  { key: 'dnp', label: 'Do Not Pursue', icon: Target, description: 'Leads to avoid' },
  { key: 'hot', label: 'Hot Leads', icon: TrendingUp, description: 'Ready to close' },
  { key: 'warm', label: 'Warm Leads', icon: TrendingUp, description: 'Engaged leads' },
  { key: 'new', label: 'New Leads', icon: Users, description: 'Recently added' },
  { key: 'follow_up', label: 'Follow Up', icon: Target, description: 'Requires follow-up' },
  { key: 'contacted', label: 'Contacted', icon: Users, description: 'First contact made' },
  { key: 'negotiating', label: 'Negotiating', icon: TrendingUp, description: 'In negotiation' },
  { key: 'closed_won', label: 'Closed Won', icon: TrendingUp, description: 'Successfully closed' },
  { key: 'closed_lost', label: 'Closed Lost', icon: AlertCircle, description: 'Lost opportunities' },
  { key: 'avg_deal_value', label: 'Avg Deal Value', icon: TrendingUp, description: 'Average deal size' },
  { key: 'conversion_rate', label: 'Conversion Rate', icon: Target, description: 'Lead to customer %' },
  { key: 'active_deals', label: 'Active Deals', icon: Users, description: 'Deals in progress' },
  { key: 'this_month', label: 'This Month', icon: TrendingUp, description: 'Current month leads' },
];

const DEFAULT_CARDS = ['total_leads', 'qualified', 'cold', 'dnp'];

interface CardSelectionProps {
  userId?: string;
}

export const CardSelection = ({ userId }: CardSelectionProps) => {
  const [selectedCards, setSelectedCards] = useState<string[]>(DEFAULT_CARDS);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [showAll, setShowAll] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (!userId) return;
    loadCardSettings();
  }, [userId]);

  const loadCardSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('crm_card_settings')
        .select('selected_cards')
        .eq('user_id', userId)
        .maybeSingle();

      if (error) throw error;

      if (data?.selected_cards) {
        setSelectedCards(data.selected_cards);
      }
    } catch (error) {
      console.error('Error loading card settings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleCard = async (cardKey: string) => {
    let newSelection: string[];

    if (selectedCards.includes(cardKey)) {
      if (selectedCards.length <= 1) {
        toast({
          title: 'Minimum Required',
          description: 'You must have at least 1 card selected.',
          variant: 'destructive',
        });
        return;
      }
      newSelection = selectedCards.filter(c => c !== cardKey);
    } else {
      if (selectedCards.length >= 4) {
        toast({
          title: 'Maximum Reached',
          description: 'You can only select up to 4 cards.',
          variant: 'destructive',
        });
        return;
      }
      newSelection = [...selectedCards, cardKey];
    }

    setSelectedCards(newSelection);
    await saveCardSettings(newSelection);
  };

  const saveCardSettings = async (cards: string[]) => {
    if (!userId) return;

    setIsSaving(true);
    try {
      const { error } = await supabase
        .from('crm_card_settings')
        .upsert({
          user_id: userId,
          selected_cards: cards,
        }, {
          onConflict: 'user_id'
        });

      if (error) throw error;

      toast({
        title: 'Settings Saved',
        description: 'Your card selection has been updated.',
      });
    } catch (error) {
      console.error('Error saving card settings:', error);
      toast({
        title: 'Error',
        description: 'Failed to save card settings. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const resetToDefault = async () => {
    setSelectedCards(DEFAULT_CARDS);
    await saveCardSettings(DEFAULT_CARDS);
  };

  if (isLoading && userId) {
    return <div className="text-sm text-muted-foreground">Loading card settings...</div>;
  }

  // Sort cards to show selected ones first
  const sortedCards = [...AVAILABLE_CARDS].sort((a, b) => {
    const aSelected = selectedCards.includes(a.key);
    const bSelected = selectedCards.includes(b.key);
    if (aSelected && !bSelected) return -1;
    if (!aSelected && bSelected) return 1;
    return 0;
  });

  const displayCards = showAll ? sortedCards : sortedCards.slice(0, 8);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Select up to 4 cards to display ({selectedCards.length}/4 selected)
        </p>
        <button
          onClick={resetToDefault}
          className="text-sm text-[hsl(var(--teal))] hover:text-[hsl(var(--teal))]/80 transition-smooth font-medium"
          disabled={isSaving}
        >
          Reset to Default
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {displayCards.map((card) => {
          const isSelected = selectedCards.includes(card.key);
          const Icon = card.icon;

          return (
            <button
              key={card.key}
              onClick={() => toggleCard(card.key)}
              disabled={isSaving}
              className={cn(
                "flex items-start gap-3 p-4 rounded-xl transition-smooth border-2 text-left",
                isSelected
                  ? "bg-[hsl(var(--teal))]/10 border-[hsl(var(--teal))]"
                  : "bg-muted/30 border-transparent hover:border-border",
                isSaving && "opacity-50 cursor-not-allowed"
              )}
            >
              <div className={cn(
                "p-2 rounded-lg",
                isSelected ? "bg-[hsl(var(--teal))]" : "bg-muted"
              )}>
                <Icon className={cn(
                  "w-4 h-4",
                  isSelected ? "text-white" : "text-muted-foreground"
                )} />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-foreground">{card.label}</span>
                  {isSelected && (
                    <div className="w-5 h-5 rounded-full bg-[hsl(var(--teal))] flex items-center justify-center">
                      <Check className="w-3 h-3 text-white" />
                    </div>
                  )}
                </div>
                <p className="text-xs text-muted-foreground mt-1">{card.description}</p>
              </div>
            </button>
          );
        })}
      </div>

      {AVAILABLE_CARDS.length > 8 && (
        <div className="flex justify-center">
          <Button
            variant="outline"
            onClick={() => setShowAll(!showAll)}
            disabled={isSaving}
            className="w-full md:w-auto"
          >
            {showAll ? 'View Less' : `View More (${AVAILABLE_CARDS.length - 8} more)`}
          </Button>
        </div>
      )}

      <div className="flex justify-end pt-2">
        <Button
          variant="default"
          className="bg-[hsl(var(--teal))] hover:bg-[hsl(var(--teal))]/90 text-white"
          disabled={isSaving}
        >
          Done
        </Button>
      </div>
    </div>
  );
};
