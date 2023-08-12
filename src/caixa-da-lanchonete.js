import { CARDAPIO, EXTRAS } from './cardapio';
import TAXAS from './taxas';
import DESCONTOS from './descontos';
import FORMAS_DE_PAGAMENTO from './formas-de-pagamento';
import MENSAGENS_DE_ERRO from './mensagens';

class CaixaDaLanchonete {
	#total = 0;
	#itensPrincipais = new Map();
	#itensExtras = new Map();

	set total(valor) {
		this.#total += valor;
	}

	get total() {
		return this.#total;
	}

	calcularValorDaCompra(metodoDePagamento, itens) {
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
			const isItemNoCardapio = CARDAPIO[nomeItem];
			const isItemExtra = EXTRAS[nomeItem];
			if (isItemNoCardapio) {
				this.#itensPrincipais.set(nomeItem, +qntItem);
			} else if (isItemExtra) {
				const itemAssociadoAoExtra = EXTRAS[nomeItem].itemPrincipal;
				const isItemAssociadoPedido =
					this.#itensPrincipais.has(itemAssociadoAoExtra);
				if (isItemAssociadoPedido) {
					this.#itensExtras.set(nomeItem, +qntItem);
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

		this.somaValores();
		this.computaTaxasEDescontos(metodoPagamento);
		return this.converteValorTotalEmMoeda('BRL');
	}

	somaValores() {
		this.#itensPrincipais.forEach((qntItem, nomeItem) => {
			const valor = +CARDAPIO[nomeItem].valor;
			this.#total += Number(valor * qntItem);
		});
		this.#itensExtras.forEach((qntItem, nomeItem) => {
			const valor = +EXTRAS[nomeItem].valor;
			this.#total += Number(valor * qntItem);
		});
	}

	computaTaxasEDescontos(metodoPagamento) {
		switch (metodoPagamento) {
			case FORMAS_DE_PAGAMENTO.credito:
				this.#total = this.#total * (1 + TAXAS[FORMAS_DE_PAGAMENTO.credito]);
				break;
			case FORMAS_DE_PAGAMENTO.dinheiro:
				this.#total =
					this.#total * (1 - DESCONTOS[FORMAS_DE_PAGAMENTO.dinheiro]);
				break;
		}
	}

	converteValorTotalEmMoeda(currency) {
		return Number(this.#total.toPrecision(4)).toLocaleString('pt-BR', {
			style: 'currency',
			currency: `${currency}`,
		});
	}
}

export { CaixaDaLanchonete };
