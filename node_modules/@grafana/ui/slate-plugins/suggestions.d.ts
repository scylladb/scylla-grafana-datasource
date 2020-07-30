import { Plugin as SlatePlugin } from '@grafana/slate-react';
import { TypeaheadOutput, TypeaheadInput, SuggestionsState } from '../types/completion';
export declare const TYPEAHEAD_DEBOUNCE = 250;
export declare function SuggestionsPlugin({ onTypeahead, cleanText, onWillApplySuggestion, portalOrigin, }: {
    onTypeahead?: (typeahead: TypeaheadInput) => Promise<TypeaheadOutput>;
    cleanText?: (text: string) => string;
    onWillApplySuggestion?: (suggestion: string, state: SuggestionsState) => string;
    portalOrigin: string;
}): SlatePlugin;
