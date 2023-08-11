import CARDAPIO from './cardapio';
import TAXAS from './taxas';
import DESCONTOS from './descontos';
import FORMAS_DE_PAGAMENTO from './formas-de-pagamento';

const MENSAGENS_DE_ERRO = Object.freeze({
	ITEM_PRINCIPAL_INEXISTENTE: 'Item extra não pode ser pedido sem o principal',
	CARRINHO_VAZIO: 'Não há itens no carrinho de compra!',
	ZERO_ITENS: 'Quantidade inválida!',
	CODIGO_INEXISTENTE: 'Item inválido!',
	FORMAS_DE_PAGAMENTO_INEXISTENTE: 'Forma de pagamento inválida!',
});

class CaixaDaLanchonete {
	#quantidadeDeItensNoCaixa = 0;
	#total = 0;

	get quantidadeDeItensNoCaixa() {
		return this.#quantidadeDeItensNoCaixa;
	}

	get total() {
		return this.#total;
	}

	calcularValorDaCompra(metodoDePagamento, itens) {
		const isCarrinhoVazio = itens.length === 0;
		if (isCarrinhoVazio) {
			return MENSAGENS_DE_ERRO.CARRINHO_VAZIO;
		}

		const metodoPagamento = FORMAS_DE_PAGAMENTO[metodoDePagamento] ?? null;
		const isPagamentoInvalido = metodoPagamento === null;
		if (isPagamentoInvalido) {
			return MENSAGENS_DE_ERRO.FORMAS_DE_PAGAMENTO_INEXISTENTE;
		}

		for (let i = 0; i < itens.length; i++) {
			const item = itens[i];
			const itemData = item.split(',');
			const isDadosInvalidos = itemData.length < 2 || itemData.length > 2;
			if (isDadosInvalidos) {
				return MENSAGENS_DE_ERRO.CODIGO_INEXISTENTE;
			}
			const nomeItem = itemData[0];
			const quantidadeItem = Number(itemData[1]) ?? 0;
			const isZeroItem = quantidadeItem === 0;
			if (isZeroItem) {
				return MENSAGENS_DE_ERRO.ZERO_ITENS;
			}

			const isCodigoInexistente = !Object.keys(CARDAPIO).includes(nomeItem);

			let isExtraExistente = false;
			let itemPrincipalDoExtra = null;
			const colecaoPedidosAnteriores = itens.slice(0, i + 1);
			if (isCodigoInexistente) {
				for (let j = 0; j < colecaoPedidosAnteriores.length; j++) {
					const itemAnterior = colecaoPedidosAnteriores[j];
					const itemAnteriorData = itemAnterior.split(',');
					const extrasDoItemAnterior =
						CARDAPIO[itemAnteriorData[0]]?.extras ?? {};
					isExtraExistente =
						Object.keys(extrasDoItemAnterior).includes(nomeItem);
					if (isExtraExistente) {
						itemPrincipalDoExtra = CARDAPIO[itemAnteriorData[0]];
						break;
					}

					const ultimoItemPedidoDaColecao =
						j === colecaoPedidosAnteriores.length - 1;
					if (ultimoItemPedidoDaColecao) {
						for (const item_cardapio_nome in CARDAPIO) {
							const itemDoCardapio = CARDAPIO[item_cardapio_nome];
							const extrasDoItemDoCardapio = Object.keys(
								itemDoCardapio?.extras ?? {}
							);
							if (extrasDoItemDoCardapio.includes(nomeItem)) {
								return MENSAGENS_DE_ERRO.ITEM_PRINCIPAL_INEXISTENTE;
							}
						}
						return MENSAGENS_DE_ERRO.CODIGO_INEXISTENTE;
					}
				}
			}

			const valor_do_item =
				CARDAPIO[nomeItem]?.valor ??
				itemPrincipalDoExtra?.extras[nomeItem]?.valor;

			this.#total += this.calculaTotalDoItem(valor_do_item, quantidadeItem);
			this.#quantidadeDeItensNoCaixa += quantidadeItem;
		}
		this.computaTaxasEDescontos(metodoPagamento);
		return this.converteValorEmMoeda(this.#total, 'BRL');
	}

	computaTaxasEDescontos(metodoPagamento) {
		switch (metodoPagamento) {
			case FORMAS_DE_PAGAMENTO.credito:
				this.#total = this.#total * (1 + TAXAS[metodoPagamento]);
				break;
			case FORMAS_DE_PAGAMENTO.dinheiro:
				this.#total = this.#total * (1 - DESCONTOS[metodoPagamento]);
				break;
		}
	}

	calculaTotalDoItem(valor, quantidade) {
		return valor * quantidade;
	}

	converteValorEmMoeda(total, currency) {
		return Number(total.toPrecision(4)).toLocaleString('pt-BR', {
			style: 'currency',
			currency: `${currency}`,
		});
	}
}

export { CaixaDaLanchonete };
