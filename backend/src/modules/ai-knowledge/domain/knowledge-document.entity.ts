export type KnowledgeCategory =
  | 'policy'
  | 'brochure'
  | 'price'
  | 'law'
  | 'faq'
  | 'planning';

export class KnowledgeDocumentEntity {
  constructor(
    public readonly id: string,
    public readonly title: string,
    public readonly category: KnowledgeCategory,
    public readonly fileSize: string,
    public readonly projectId: string | null,
    public readonly contentSummary: string,
    public readonly contentRaw: string,
    public readonly vectorEmbedding?: number[],
  ) {}

  /**
   * Tính điểm liên quan ngữ nghĩa (Semantic Keyword Match Scoring)
   */
  public calculateRelevanceScore(query: string): number {
    const cleanQuery = query.toLowerCase();
    const cleanContent = (this.title + ' ' + this.contentSummary + ' ' + this.contentRaw).toLowerCase();

    const terms = cleanQuery.split(/\s+/).filter((t) => t.length > 2);
    if (terms.length === 0) return 0;

    let matchCount = 0;
    for (const term of terms) {
      if (cleanContent.includes(term)) {
        matchCount++;
      }
    }

    return Math.round((matchCount / terms.length) * 100);
  }
}
