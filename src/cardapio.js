const CARDAPIO = Object.freeze({
	cafe: {
		descricao: 'Café',
		valor: 3.0,
		extras: {
			chantily: {
				descricao: 'Chantily (extra do Café)',
				valor: 1.5,
			},
		},
	},
	suco: {
		descricao: 'Suco Natural',
		valor: 6.2,
	},
	sanduiche: {
		descricao: 'Sanduíche',
		valor: 6.5,
		extras: {
			queijo: {
				descricao: 'Queijo (extra do Sanduíche)',
				valor: 2,
			},
		},
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

export default CARDAPIO;
