import { supabase } from '@/integrations/supabase/client';

type ScrapeResponse = {
  success: boolean;
  error?: string;
  data?: {
    combinedContent: string;
    results: Array<{
      url: string;
      success: boolean;
      content?: string;
      title?: string;
      error?: string;
    }>;
    successCount: number;
    totalCount: number;
  };
};

export const firecrawlApi = {
  async scrapeMultiple(urls: string[]): Promise<ScrapeResponse> {
    const { data, error } = await supabase.functions.invoke('firecrawl-scrape', {
      body: { urls },
    });

    if (error) {
      return { success: false, error: error.message };
    }
    return data;
  },
};
