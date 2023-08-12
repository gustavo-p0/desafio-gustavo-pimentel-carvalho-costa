import { CARDAPIO, EXTRAS } from './cardapio';
import TAXAS from './taxas';
import DESCONTOS from './descontos';
import FORMAS_DE_PAGAMENTO from './formas-de-pagamento';
import MENSAGENS_DE_ERRO from './mensagens';

class CaixaDaLanchonete {
	calcularValorDaCompra(metodoDePagamento, itens) {
		let total = 0;
		let pedidos = new Map();

		const isSacolaVazia = itens.length === 0;
		if (isSacolaVazia) {
			return MENSAGENS_DE_ERRO.CARRINHO_VAZIO;
		}

		const metodoPagamento = FORMAS_DE_PAGAMENTO[metodoDePagamento] ?? null;
		const isPagamentoInvalido = metodoPagamento === null;
		if (isPagamentoInvalido) {
			return MENSAGENS_DE_ERRO.FORMAS_DE_PAGAMENTO_INEXISTENTE;
		}

		for (let item of itens) {
			const [nomeItem = null, qntItem = null] = item.split(',');
			const isItemPrincipal = CARDAPIO[nomeItem];
			const isItemExtra = EXTRAS[nomeItem];
			if (isItemPrincipal) {
				if (pedidos.has(nomeItem)) {
					pedidos.set(nomeItem, pedidos.get(nomeItem) + +qntItem);
				} else {
					pedidos.set(nomeItem, +qntItem);
				}
			} else if (isItemExtra) {
				const itemAssociadoAoExtra = EXTRAS[nomeItem].itemPrincipal;
				const isItemAssociadoJaPedido = pedidos.has(itemAssociadoAoExtra);
				if (isItemAssociadoJaPedido) {
					if (pedidos.has(nomeItem)) {
						pedidos.set(nomeItem, pedidos.get(nomeItem) + +qntItem);
					} else {
						pedidos.set(nomeItem, +qntItem);
					}
				} else {
					return MENSAGENS_DE_ERRO.ITEM_PRINCIPAL_INEXISTENTE;
				}
			} else {
				return MENSAGENS_DE_ERRO.CODIGO_INEXISTENTE;
			}

			if (qntItem === '0' || qntItem === null) {
				return MENSAGENS_DE_ERRO.ZERO_ITENS;
			}
		}

		total = this.somaValores(pedidos);
		total = this.computaTaxasEDescontos(total, metodoPagamento);
		return this.converteValorTotalEmMoeda(total, 'BRL');
	}

	somaValores(pedidos) {
		let total = 0;
		pedidos.forEach((qntItem, nomeItem) => {
			let valor = null;
			if (CARDAPIO[nomeItem]) {
				valor = +CARDAPIO[nomeItem].valor;
			} else {
				valor = +EXTRAS[nomeItem].valor;
			}
			total += Number(valor * qntItem);
		});
		return total;
	}

	computaTaxasEDescontos(total, metodoPagamento) {
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

	converteValorTotalEmMoeda(total, currency) {
		return Number(total.toPrecision(4)).toLocaleString('pt-BR', {
			style: 'currency',
			currency: `${currency}`,
		});
	}
}

export { CaixaDaLanchonete };
