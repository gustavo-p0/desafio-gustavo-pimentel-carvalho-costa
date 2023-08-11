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
		const metodoPagamento = FORMAS_DE_PAGAMENTO[metodoDePagamento] ?? null;

		if (metodoPagamento === null) {
			return MENSAGENS_DE_ERRO.FORMAS_DE_PAGAMENTO_INEXISTENTE;
		}

		for (let i = 0; i < itens.length; i++) {
			const item = itens[i];
			const itemData = item.split(',');
			const nome_item = itemData[0];
			const qnt_item = itemData[1];
			const item_vazio = qnt_item === 0;
			const cod_inexistente = !Object.keys(itens).includes(nome_item);
			let extra_inexistente = false;
			for (const pedido of itens.slice(0, i + 1)) {
				const pedidoData = pedido.split(',');
				const extras = CARDAPIO[pedidoData[0]]?.extras ?? {};
				extra_inexistente = !Object.keys(extras).includes(nome_item);
			}

			if (extra_inexistente) {
				return MENSAGENS_DE_ERRO.ITEM_PRINCIPAL_INEXISTENTE;
			} else if (cod_inexistente) {
				return MENSAGENS_DE_ERRO.CODIGO_INEXISTENTE;
			} else if (item_vazio) {
				return MENSAGENS_DE_ERRO.ZERO_ITENS;
			}

			this.#total += CARDAPIO[nome_item];
			this.#qnt_itens += Number(qnt_item);
		}

		const carrinhoVazio = this.#qnt_itens === 0;
		if (carrinhoVazio) {
			return MENSAGENS_DE_ERRO.CARRINHO_VAZIO;
		}

		return `R$ ${this.total}`;
	}
}

export { CaixaDaLanchonete };

// Atualmente a Lanchonete aceita as seguintes formas de pagamento:

// dinheiro
// debito
// credito
// O sistema deve receber essa informação como string, utilizando a grafia exatamente igual aos exemplos acima.

//  Você pode desenvolver a sua lógica criando outros arquivos, métodos e até mesmo outras classes, porém o resultado deve poder ser obtido através do método calcularValorDaCompra.
