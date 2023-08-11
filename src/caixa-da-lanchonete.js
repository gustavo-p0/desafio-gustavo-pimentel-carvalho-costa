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
	#total = 0;
	get total() {
		return this.#total;
	}
	calcularValorDaCompra(metodoDePagamento, itens) {
		const metodoPagamento = FORMAS_DE_PAGAMENTO[metodoDePagamento];

		if (metodoDePagamento === null) {
			return;
		}
		// calcularValorDaCompra(string[debito, credito, dinheiro], itens[array[string[cod,qnt]]])
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
