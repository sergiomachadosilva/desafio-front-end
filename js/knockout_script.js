// Configurações do modal com js puro
var instance = [];
var instanceSelect = [];
var instanceSelectCad = [];
var instanceTab = [];
document.addEventListener('DOMContentLoaded', function () {
    //tabs
    var tabElement = document.getElementById('tabs');
    instanceTab = M.Tabs.init(tabElement);
    instanceTab.select('test1');

    // select modal
    var selectElement = document.getElementById('categoriaUp');
    instanceSelect = M.FormSelect.init(selectElement);

    // select cadastro
    var selectElementCad = document.getElementById('categoriaCadastro');
    instanceSelectCad = M.FormSelect.init(selectElementCad);

    const elem = document.getElementById('modal1');
    instance = M.Modal.init(elem, {
        dismissible: false,
        onOpenStart: function () {
            instanceSelect = M.FormSelect.init(selectElement);
        },
        onCloseEnd: function () {
            instanceSelect.destroy();
        }
    });
});


// Função para exibir o alert de erro ou sucesso
function messageAlert(self, visibled, msg, type) {
    self.alerta({ mostrar: visibled, msg: msg, tipo: type });
    setTimeout(function () {
        self.alerta({ mostrar: false, msg: msg, tipo: type });
    }, 5000);
}

// Função para exibir o alert de erro ou sucesso
function messageAlertSend(self, visibled, msg, type) {
    self.alertaSend({ mostrar: visibled, msg: msg, tipo: type });
    setTimeout(function () {
        self.alertaSend({ mostrar: false, msg: msg, tipo: type });
    }, 5000);
}


function formtarMoeda(value) {
    value = value.toFixed(2);
    if (value.length == 7) {
        value = value.replace(/(\d{1})(.*)/, '$1.$2')
    }

    return "R$ " + value;
}

// Função para validar o teto de 1500 antes de cadastrar um novo gasto
function calcularTeto(self, valor, teto) {
    let valorPrevisto = parseFloat(teto) + parseFloat(valor);

    console.log("Valor:", valor, "Valor previsto:", valorPrevisto)

    if (valorPrevisto > 1500.00) {
        return true
    }
}

// Função para calcular o teto na atualização de uma Despesa
function calcularTetoM(self, valorAtual, valor, teto) {
    let novoValor = parseFloat(valor);

    let valorPrevisto = (parseFloat(teto) - valorAtual) + novoValor;

    console.log("Atual", valorAtual, "Novo valor:", novoValor, "Valor previsto:", valorPrevisto)

    if (valorPrevisto > 1500.00) {
        return true
    }
}

// Função para validar email
function validateEmail(email) {
    var re = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
    return re.test(email);
}

const listMock = [
    { id: 1594598348090, descricao: "Energia", categoriaNome: "Moradia", categoriaSlug: "moradia", data: "02/07/2020", valor: 190.00 },
    { id: 1594598777600, descricao: "Dentista", categoriaNome: "Saúde", categoriaSlug: "saude", data: "03/07/2020", valor: 150.50 },
    { id: 1594598929972, descricao: "Shopping", categoriaNome: "Lazer", categoriaSlug: "lazer", data: "04/07/2020", valor: 110.50 },
    { id: 1594722080882, descricao: "Água", categoriaNome: "Moradia", categoriaSlug: "moradia", data: "05/07/2020", valor: 70.00 },
    { id: 1594722248512, descricao: "Internet", categoriaNome: "Moradia", categoriaSlug: "moradia", data: "05/07/2020", valor: 70.00 },
]

function getGasto(id) {
    console.log(id)
}

var Despesa = function (_id, _categoriaNome, _categoriaSlug, _data, _valor) {
    var self = this;
    self.id = ko.observable(_id);
    self.descricao = ko.observable(_descricao);
    self.categoriaNome = ko.observable(_categoriaNome);
    self.categoriaSlug = ko.observable(_categoriaSlug);
    self.valor = ko.observable(_valor);
    self.data = ko.observable(_data);
};


var appViewModel = function () {

    var self = this;

    self.descricao = ko.observable("");
    self.data = ko.observable([]);
    self.valor = ko.observable([]);
    self.tetoGastos = ko.observable(1500.00);
    self.chosenCategorias = ko.observable([]);
    self.alerta = ko.observable({ mostrar: false, msg: "", tipo: "" });

    self.listaGastos = ko.observableArray(listMock);
    // Ordena o array inicial de gastos
    self.listaGastos.sort(function (left, right) {
        return left.id == right.id ? 0 : (left.id < right.id ? 1 : -1)
    });

    self.categorias = [
        { name: "Moradia", slug: "moradia" },
        { name: "Alimentação", slug: "alimentacao" },
        { name: "Transporte", slug: "transporte" },
        { name: "Lazer", slug: "lazer" },
        { name: "Saúde", slug: "saude" },
    ];


    // Atualizar uma Despesa
    self.descricaoUpdate = ko.observable();
    self.chosenCategoriasUpdate = ko.observableArray([]);
    self.dataUpdate = ko.observable([]);
    self.valorUpdate = ko.observable([]);
    self.itemEdit = ko.observable();

    // Enviar Despesas por E-mail  
    self.email = ko.observable('');
    self.emailConfirm = ko.observable('');
    self.carregando = ko.observable(false);
    self.enviado = ko.observable(false);
    self.alertaSend = ko.observable({ mostrar: false, msg: "", tipo: "" });

    self.totalPorCategoria = ko.observableArray([])

    // Cadastrar uma nova despesa
    self.addDespesa = function () {

        // Validação básica nos campos
        if (self.descricao().length < 5) {
            messageAlert(self, true, 'Informe uma Descrição', "erro")
        } else if (!self.chosenCategorias()) {
            messageAlert(self, true, 'Selecione uma categoria', "erro")
        } else if (self.data() == "") {
            messageAlert(self, true, 'Informe uma Data', "erro")
        } else if (self.valor() == "") {
            messageAlert(self, true, 'Informe um Valor', "erro")
        } else if (calcularTeto(self, self.valor(), self.tetoGastos())) {
            messageAlert(self, true, 'Suas depesas não podem ultrapassar o total de 1.500,00', "erro")
        }
        else {
            self.listaGastos.push({
                id: new Date().getTime(),
                descricao: self.descricao(),
                categoriaNome: self.chosenCategorias().name,
                categoriaSlug: self.chosenCategorias().slug,
                data: self.data(),
                valor: parseFloat(self.valor())
            });

            // Reseta os campos após o cadastro do gasto
            self.descricao("");
            self.chosenCategorias("");
            $('select').formSelect();
            self.data("");
            self.valor("");

            //Exibi mensagem de sucesso
            messageAlert(self, true, 'Despesa cadastrada com sucesso', "sucesso")

            // Ordena novamente o arry após a inclusão de um novo gasto
            self.listaGastos.sort(function (left, right) {
                return left.id == right.id ? 0 : (left.id < right.id ? 1 : -1)
            });
        }

        console.table(self.listaGastos())

    };

    // Deletar uma despesa
    self.removeGasto = function (item) {
        self.listaGastos.remove(item);
        var toastHTML = `<spna><strong>${item.descricao}&nbsp;</strong> excluída com sucesso</spna>`;
        M.toast({ html: toastHTML, classes: 'red lighten-1' });
    };


    self.totalGeral = ko.computed(function () {
        // Calcula o total
        var total = 0;
        for (var i = 0; i < self.listaGastos().length; i++) {
            total += self.listaGastos()[i].valor;
        }
        self.tetoGastos(total);

        // Calcula o total por categoria
        var result = [];
        self.listaGastos().reduce(function (res, value) {
            if (!res[value.categoriaSlug]) {
                res[value.categoriaSlug] = {
                    valor: 0,
                    slug: value.categoriaSlug,
                    nome: value.categoriaNome
                };
                result.push(res[value.categoriaSlug])
            }
            res[value.categoriaSlug].valor += value.valor
            return res;
        }, {});
       self.totalPorCategoria(result);

        return total;
    });

    // Editar uma despesa
    self.edit = function (item) {
        self.itemEdit(item);
        self.descricaoUpdate(item.descricao)
        self.dataUpdate(item.data);
        self.valorUpdate(item.valor);
    };

    self.atualizar = function () {
        let item = self.itemEdit()
        if (!self.dataUpdate()) {
            M.toast({ html: "Informe uma Data", classes: 'red lighten-1' });
        } else if (!self.valorUpdate()) {
            M.toast({ html: "Informe um Valor", classes: 'red lighten-1' });
        } else if (calcularTetoM(self, item.valor, self.valorUpdate(), self.tetoGastos())) {
            M.toast({ html: "Teto acima de 1.500,00", classes: 'red lighten-1' });
        } else {
            self.listaGastos.replace(item, {
                id: item.id,
                descricao: self.descricaoUpdate(),
                categoriaNome: self.chosenCategoriasUpdate() ? self.chosenCategoriasUpdate().name : item.categoriaNome,
                categoriaSlug: self.chosenCategoriasUpdate() ? self.chosenCategoriasUpdate().slug : item.categoriaSlug,
                data: self.dataUpdate(),
                valor: parseFloat(self.valorUpdate())
            });
            self.chosenCategoriasUpdate("")
            M.toast({ html: "Despesa atualizada com sucesso", classes: 'green' });
            instance.close();
        }

    }



    // Enviar E-mail
    self.EnviarEmail = function () {
        self.enviado(false)
        // Validações
        if (self.email() === '' || self.emailConfirm() === '') {
            messageAlertSend(self, true, 'Preencha os dois campos de e-mail', "erro");
        } else if (self.email() != self.emailConfirm()) {
            messageAlertSend(self, true, 'E-mail não conferem!', "erro");
        } else if (!validateEmail(self.email()) || !validateEmail(self.emailConfirm())) {
            messageAlertSend(self, true, 'E-mail inválido', "erro");
        } else {
            self.carregando(true)
            setTimeout(function () {
                self.carregando(false);
                self.enviado(true);
                self.email("");
                self.emailConfirm("");
            }, 5000);

        }

    };




};

ko.applyBindings(new appViewModel());