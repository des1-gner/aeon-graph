import { Article, FilterOptions } from '../types';

/** 
 * Parses a comma-separated string into an array of values 
 */
export const parseFilterValue = (value: string): string[] => {
  return value ? value.split(',').filter(Boolean) : [];
};

/** 
 * Checks if any filters are actively set in the filter options
 * This should only return true if specific filters have been selected 
 */
export const hasActiveFilters = (options: FilterOptions): boolean => {
  // Check if any actual values have been selected
  const hasBroadClaims = parseFilterValue(options.broadClaim).length > 0;
  const hasSubClaims = parseFilterValue(options.subClaim).length > 0;
  const hasSources = parseFilterValue(options.source).length > 0;
  const hasThinkTankRef = options.think_tank_ref === 'yes' || options.think_tank_ref === 'no';
  const hasIsDuplicate = options.isDuplicate === 'yes' || options.isDuplicate === 'no';
  const hasArticleBody = (options.articleBody?.trim() || '') !== '';

  return hasBroadClaims || hasSubClaims || hasSources || hasThinkTankRef || hasIsDuplicate || hasArticleBody;
};

/** 
 * Checks if an article matches the given filter criteria 
 */
export const matchesFilter = (
  article: Article,
  filterOptions: FilterOptions
): boolean => {
  // If no filters are active, return false instead of true
  if (!hasActiveFilters(filterOptions)) {
    return false;
  }

  // Handle broad claims
  const selectedBroadClaims = parseFilterValue(filterOptions.broadClaim);
  if (selectedBroadClaims.length > 0) {
    if (!article.broadClaims) return false;
    const hasMatchingBroadClaim = selectedBroadClaims.some(claimId => 
      article.broadClaims && claimId in article.broadClaims
    );
    if (!hasMatchingBroadClaim) return false;
  }

  // Handle sub claims
  const selectedSubClaims = parseFilterValue(filterOptions.subClaim);
  if (selectedSubClaims.length > 0) {
    if (!article.subClaims) return false;
    const hasMatchingSubClaim = selectedSubClaims.some(claimId => 
      article.subClaims && claimId in article.subClaims
    );
    if (!hasMatchingSubClaim) return false;
  }

  // Handle sources
// Handle sources
const selectedSources = parseFilterValue(filterOptions.source);
if (selectedSources.length > 0) {
  if (!article.source) return false;
  if (!selectedSources.includes(article.source)) return false;
}

  // Handle think tank reference
  if (filterOptions.think_tank_ref !== '') {
    const hasThinkTankRef = article.think_tank_ref !== null && 
                           article.think_tank_ref !== undefined && 
                           article.think_tank_ref.trim() !== '';
    if (hasThinkTankRef !== (filterOptions.think_tank_ref === 'yes')) {
      return false;
    }
  }

  // Handle duplicate status
  if (filterOptions.isDuplicate !== '') {
    const isDuplicateMatch = article.isDuplicate === (filterOptions.isDuplicate === 'yes');
    if (!isDuplicateMatch) {
      return false;
    }
  }

  // Handle article body text
  if (filterOptions.articleBody && filterOptions.articleBody.trim() !== '') {
    if (!article.body || !article.body.toLowerCase().includes(filterOptions.articleBody.toLowerCase().trim())) {
      return false;
    }
  }

  return true;
};