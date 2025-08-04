export type LanguageCode = 'en' | 'pt';

export interface Language {
	code: LanguageCode;
	name: string;
}

export const languages: Language[] = [
	{
		code: 'en',
		name: 'English'
	},
	{
		code: 'pt',
		name: 'Português'
	}
];

export function getLanguageByCode(code: LanguageCode): Language | undefined {
	return languages.find((lang) => lang.code === code);
}

export function getLanguageName(code: LanguageCode): string {
	const language = getLanguageByCode(code);
	return language?.name || code;
}
