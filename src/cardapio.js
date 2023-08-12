export const CARDAPIO = Object.freeze({
	cafe: {
		descricao: 'Café',
		valor: 3.0,
	},
	suco: {
		descricao: 'Suco Natural',
		valor: 6.2,
	},
	sanduiche: {
		descricao: 'Sanduíche',
		valor: 6.5,
	},
	salgado: {
		descricao: 'Salgado',
		valor: 7.25,
	},
	combo1: {
		descricao: '1 Suco e 1 Sanduíche',
		valor: 9.5,
	},
	combo2: {
		descricao: '1 Café e 1 Sanduíche',
		valor: 7.5,
	},
});

export const EXTRAS = Object.freeze({
	chantily: {
		itemPrincipal: 'cafe',
		descricao: 'Chantily (extra do Café)',
		valor: 1.5,
	},
	queijo: {
		itemPrincipal: 'sanduiche',
		descricao: 'Queijo (extra do Sanduíche)',
		valor: 2,
	},
});
