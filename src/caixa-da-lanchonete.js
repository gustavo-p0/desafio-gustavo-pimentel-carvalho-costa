import { CARDAPIO, EXTRAS } from './cardapio';
import TAXAS from './taxas';
import DESCONTOS from './descontos';
import FORMAS_DE_PAGAMENTO from './formas-de-pagamento';
import MENSAGENS_DE_ERRO from './mensagens';

class CaixaDaLanchonete {
	#converteValorTotalEmMoeda(total, currency) {
		return Number(total.toPrecision(4)).toLocaleString('pt-BR', {
			style: 'currency',
			currency: `${currency}`,
		});
	}

	#computaTaxasEDescontos(total, metodoPagamento) {
		let newTotal = total;
		switch (metodoPagamento) {
			case FORMAS_DE_PAGAMENTO.credito:
				newTotal = total * (1 + TAXAS[FORMAS_DE_PAGAMENTO.credito]);
				break;
			case FORMAS_DE_PAGAMENTO.dinheiro:
				newTotal = total * (1 - DESCONTOS[FORMAS_DE_PAGAMENTO.dinheiro]);
				break;
		}

		return newTotal;
	}

	#somaValores(pedidos) {
		let total = 0;
		pedidos.forEach((qntItem, nomeItem) => {
			let valor = 0;
			if (CARDAPIO[nomeItem]) {
				valor = +CARDAPIO[nomeItem]?.valor ?? 0;
			} else {
				valor = +EXTRAS[nomeItem]?.valor ?? 0;
			}
			total += Number(valor * qntItem);
		});
		return total;
	}

	#validaQntItem(qntItem) {
		if (qntItem === null || qntItem === 0) {
			throw new Error(MENSAGENS_DE_ERRO.ZERO_ITENS);
		}
	}

	#adicionaItemAosPedidos(pedidos, nomeItem, qntItem) {
		if (pedidos.has(nomeItem)) {
			pedidos.set(nomeItem, pedidos.get(nomeItem) + qntItem);
		} else {
			pedidos.set(nomeItem, qntItem);
		}
	}

	#parseItemPedido(item) {
		const splittedItem = item.split(',');
		if (splittedItem.length !== 2) {
			throw new Error(MENSAGENS_DE_ERRO.CODIGO_INEXISTENTE);
		}
		const [nomeItem = null, qntItem = null] = splittedItem;
		const isItemPrincipal = CARDAPIO[nomeItem] ?? null;
		const isItemExtra = EXTRAS[nomeItem] ?? null;
		return { nomeItem, qntItem: +qntItem, isItemPrincipal, isItemExtra };
	}

	#checaSeItemPrincipalDoExtraJaFoiPedido(nomeItem, pedidos) {
		const itemAssociadoAoExtra = EXTRAS[nomeItem]?.itemPrincipal ?? null;
		return pedidos.has(itemAssociadoAoExtra);
	}

	#computaItensAosPedidos(itens, pedidos) {
		for (let item of itens) {
			const { nomeItem, qntItem, isItemPrincipal, isItemExtra } =
				this.#parseItemPedido(item);

			if (isItemPrincipal) {
				this.#adicionaItemAosPedidos(pedidos, nomeItem, qntItem);
			} else if (isItemExtra) {
				const isItemAssociadoJaPedido =
					this.#checaSeItemPrincipalDoExtraJaFoiPedido(nomeItem, pedidos);
				if (isItemAssociadoJaPedido) {
					this.#adicionaItemAosPedidos(pedidos, nomeItem, qntItem);
				} else {
					throw new Error(MENSAGENS_DE_ERRO.ITEM_PRINCIPAL_INEXISTENTE);
				}
			} else {
				throw new Error(MENSAGENS_DE_ERRO.CODIGO_INEXISTENTE);
			}

			this.#validaQntItem(qntItem);
		}
	}

	#validaMetodoPagamento(metodoDePagamento) {
		const metodo = FORMAS_DE_PAGAMENTO[metodoDePagamento] ?? null;
		const isPagamentoInvalido = metodo === null;
		if (isPagamentoInvalido) {
			throw new Error(MENSAGENS_DE_ERRO.FORMAS_DE_PAGAMENTO_INEXISTENTE);
		}
	}

	#checaSeASacolaVeioVazia(itens) {
		const isSacolaVazia = itens.length === 0;
		if (isSacolaVazia) {
			throw new Error(MENSAGENS_DE_ERRO.CARRINHO_VAZIO);
		}
	}

	calcularValorDaCompra(metodoDePagamento, itens) {
		let total = 0;
		let pedidos = new Map();
		try {
			this.#checaSeASacolaVeioVazia(itens);
			this.#validaMetodoPagamento(metodoDePagamento);
			this.#computaItensAosPedidos(itens, pedidos);
		} catch (error) {
			return error.message;
		}
		total = this.#somaValores(pedidos);
		total = this.#computaTaxasEDescontos(
			total,
			FORMAS_DE_PAGAMENTO[metodoDePagamento]
		);
		return this.#converteValorTotalEmMoeda(total, 'BRL');
	}
}

export { CaixaDaLanchonete };
