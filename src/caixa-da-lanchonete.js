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
	#qnt_itens = 0;
	#total = 0;

	get qnt_itens() {
		return this.#qnt_itens;
	}

	get total() {
		return this.#total;
	}

	calcularValorDaCompra(metodoDePagamento, itens) {
		const carrinhoVazio = itens.length === 0;
		if (carrinhoVazio) {
			return MENSAGENS_DE_ERRO.CARRINHO_VAZIO;
		}

		const metodoPagamento = FORMAS_DE_PAGAMENTO[metodoDePagamento] ?? null;
		if (metodoPagamento === null) {
			return MENSAGENS_DE_ERRO.FORMAS_DE_PAGAMENTO_INEXISTENTE;
		}

		for (let i = 0; i < itens.length; i++) {
			const item = itens[i];
			const itemData = item.split(',');
			if (itemData.length < 2 || itemData.length > 2) {
				return MENSAGENS_DE_ERRO.CODIGO_INEXISTENTE;
			}
			const nome_item = itemData[0];
			const qnt_item = Number(itemData[1]) ?? 0;
			const zero_item = qnt_item === 0;
			if (zero_item) {
				return MENSAGENS_DE_ERRO.ZERO_ITENS;
			}
			const cod_inexistente = !Object.keys(CARDAPIO).includes(nome_item);
			let extra_inexistente = false;
			let item_principal_extra = null;
			const pedidos_anteriores = itens.slice(0, i + 1);
			if (cod_inexistente) {
				for (let i = 0; i < pedidos_anteriores.length; i++) {
					const pedido = pedidos_anteriores[i];
					const pedidoData = pedido.split(',');
					const extras = CARDAPIO[pedidoData[0]]?.extras ?? {};
					extra_inexistente = !Object.keys(extras).includes(nome_item);
					if (extra_inexistente === false) {
						item_principal_extra = CARDAPIO[pedidoData[0]];
						break;
					}
					if (i === pedidos_anteriores.length - 1) {
						for (const item_cardapio_nome in CARDAPIO) {
							const item_cardapio = CARDAPIO[item_cardapio_nome];
							if (
								Object.keys(item_cardapio?.extras ?? {}).includes(nome_item)
							) {
								return MENSAGENS_DE_ERRO.ITEM_PRINCIPAL_INEXISTENTE;
							}
						}
						console.log('AAA');
						return MENSAGENS_DE_ERRO.CODIGO_INEXISTENTE;
					}
				}
			}

			this.#total +=
				(CARDAPIO[nome_item]?.valor ??
					item_principal_extra?.extras[nome_item]?.valor) * qnt_item;

			this.#qnt_itens = this.qnt_itens + qnt_item;
		}
		this.computaTaxasEDescontos(metodoPagamento);
		return `${Number(this.total.toPrecision(4)).toLocaleString('pt-BR', {
			style: 'currency',
			currency: 'BRL',
			// maximumFractionDigits: 2,
			// minimumFractionDigits: 2,
		})}`;
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
}

export { CaixaDaLanchonete };

// Atualmente a Lanchonete aceita as seguintes formas de pagamento:

// dinheiro
// debito
// credito
// O sistema deve receber essa informação como string, utilizando a grafia exatamente igual aos exemplos acima.

//  Você pode desenvolver a sua lógica criando outros arquivos, métodos e até mesmo outras classes, porém o resultado deve poder ser obtido através do método calcularValorDaCompra.
