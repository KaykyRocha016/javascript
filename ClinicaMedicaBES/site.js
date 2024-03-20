//FUNÇÕES DE CLICK
function agendamentoClick() {
    let agendar = $(".navbar-menu a").last();
    $(agendar).click(() => {
        exibirAgendamento();
    })
}

function cadastroClick() {
    let cadastro = $(".navbar-dropdown a:last-child");
    for (let opcoes of cadastro) {
        $(opcoes).click(() => {
            let origem = $(opcoes).parent().prev();
            switch (origem.text()) {
                case "Pacientes":
                    exibirCadastrosPacientes();
                    break;
                case "Médicos":

                    exibirCadastrosMedicos();
                    break;
            }
        })
    }
}

function listagemClick() {
    let listagem = $(".navbar-dropdown a:first-child");
    for (let opcoes of listagem) {
        $(opcoes).click(() => {
            let origem = $(opcoes).parent().prev();
            switch (origem.text()) {
                case "Pacientes":
                    exibirListaPacientes();
                    break;
                case "Médicos":
                    exibirListaMedicos();
                    break;
            }
        })
    }
}

function cadastrarAgendamentoClick() {
    let cadastrar = $(".button").text("Agendar");
    cadastrar.click(() => {
        cadastrarConsulta($("#medico option:selected").attr("value"), $("#paciente option:selected").attr("value"), ($("#data").val() + " " + $("#horario").val()));

    
    });
}

function cadastrarMedicoClick() {
    let cadastrar = $(".button").text("Cadastrar");
    cadastrar.click(() => {
        cadastrarMedico($("#cadastro-medico").val(), $("#especialidade").attr("value"));
    });
}

function cadastrarPacienteClick() {
    let cadastrar = $(".button").text("Cadastrar");
    cadastrar.click(() => {
        cadastrarPaciente($("#cadastro-paciente").val(), $("#dataNascimento").val());
    })
}


//FUNÇÕES Consultas
async function exibirAgendamento() {
    let section = criar("section", "column is-6 is-offset-3");
    let header = criar("header");
    let form = criar("form");

    await $.ajax({
        url: 'https://ifsp.ddns.net/webservices/clinicaMedica/medicos',
        type: 'GET',
        success: function (medicos) {
            form.attr("id", "agendarConsulta");

            header.append(criar("h1", "title mt-4 mb-4 has-text-centered", "Agendar Consulta"));
            section.append(header, form);

            //Campo "Médico"
            let labelMedico = criar("label", "has-text-weight-bold", "Médico");
            let divM1 = criar("div", "field pb-5");
            let divM2 = criar("div", "select");
            let selectMedico = criar("select", "select is-danger ng-untouched ng-pristine ng-invalid");

            for (let medico of medicos) {
                let option = criar("option", "", medico.nome);
                option.attr("value", medico.id);
                selectMedico.append(option);
            }

            labelMedico.attr("for", "medico");
            selectMedico.attr("id", "medico");

            divM2.append(selectMedico);
            divM1.append(divM2);
            form.append(labelMedico, divM1);
        },
        error: function () {
            alert("erro ao buscar médicos");
        }
    })

    $.ajax({
        url: 'https://ifsp.ddns.net/webservices/clinicaMedica/pacientes',
        type: 'GET',
        success: function (pacientes) {
            //campo "Paciente"
            let labelPaciente = criar("label", "has-text-weight-bold mt-4", "Paciente");
            let divP1 = criar("div", "field pb-5");
            let divP2 = criar("div", "select");
            let selectPaciente = criar("select", "select is-success ng-dirty ng-valid ng-touched");

            for (let paciente of pacientes) {
                let option = criar("option", "", paciente.nome);
                option.attr("value", paciente.id);
                selectPaciente.append(option);
            }

            labelPaciente.attr("for", "paciente");
            selectPaciente.attr("id", "paciente");

            divP2.append(selectPaciente);
            divP1.append(divP2);

            //Campo "Data"
            let divData = criar("div", "field");
            let labelData = criar("label", "has-text-weight-bold mt-5", "Data:");
            let inputData = criar("input", "input is-danger ng-pristine ng-invalid ng-touched");

            labelData.attr("for", "data");
            inputData.attr("id", "data");

            inputData.attr("type", "date");
            inputData.attr("formcontrolname", "data");

            divData.append(labelData, inputData, criar("p", "help is-danger ng-star-inserted pb-3", "Selecione uma data futura!"));

            //Campo "Horário"
            let divHorario = criar("div", "field");
            let labelHorario = criar("label", "has-text-weight-bold", "Horário:");
            let inputHorario = criar("input", "input is-danger ng-untouched ng-pristine ng-invalid");

            labelHorario.attr("for", "horario");
            inputHorario.attr("id", "horario");

            inputHorario.attr("type", "time");
            inputHorario.attr("formcontrolname", "hora");

            divHorario.append(labelHorario, inputHorario, criar("p", "help is-danger ng-star-inserted pb-3", "Selecione um horário válido!"));

            //Botao
            let botao = criar("button", "button is-link", "Agendar");
            botao.attr("type", "button");
            botao.attr("id","botao")
  
            
            

            form.append(labelPaciente, divP1, divData, divHorario, botao);

            limparMain();
            $("main").append(section);
            cadastrarAgendamentoClick();
        },
        error: function () {
            alert("erro ao buscar pacientes");
        }
    });
}

function exibirConsultas(e, tabela) {
    $.ajax({
        url: 'https://ifsp.ddns.net/webservices/clinicaMedica/consultas',
        type: 'GET',
        success: async function (consultas) {
            let modal = criar("div", "modal modal-fx-fadeInScale is-active");
            let modalBackground = criar("div", "modal-background");
            let modalContent = criar("div", "modal-content");
            let box = criar("div", "box");
            let titulo = criar("h3", "subtitle has-text-centered", "Consultas");
            let table = criar("table", "table is-hoverable is-fullwidth has-text-centered");
            let thead = criar("thead");
            let tbody = criar("tbody");
            let trHeader = criar("tr");
            trHeader.append(criar("th", "has-text-centered", "Médico"), criar("th", "has-text-centered", "Paciente"), criar("th", "has-text-centered", "Data"), criar("th", "has-text-centered", "Cancelar"));
            let botaoClose = criar("button", "modal-close is-large");

            modal.attr("id", "modal");
            tbody.attr("id", "numeroConsultas")
            botaoClose.attr("aria-label", "close");

            $(botaoClose).click(() => { limparModal() });

            modal.append(modalBackground, modalContent, botaoClose);
            modalContent.append(box);
            box.append(titulo, table);
            table.append(thead, tbody);
            thead.append(trHeader);

            linha = e.target.parentElement.parentElement;
            let flag = await tratarExibirConsultas(consultas, tabela, linha, tbody);

            if (flag == 0){
                $(modalContent).children().empty();
                let titulo = criar("h3", "subtitle has-text-centered", "Não há consultas agendadas");
                box.append(titulo);
            }

            $("main").append(modal);
        },
        error: function (error) {
            alert(error);
        }
    })
}

async function tratarExibirConsultas(consultas, tabela, linha, tbody) {
    let listaPacientes = [], listaMedicos = [];
    let idTarget = $(linha).attr("data-id");

    let medico, paciente;

    if (tabela == "pacientes") {
        await $.ajax({
            url: 'https://ifsp.ddns.net/webservices/clinicaMedica/medicos',
            type: 'GET',
            success: function (medicos) {
                for (med of medicos) {
                    medico = criar("td", "", (med.nome));
                    medico.attr("data-id", med.id);
                    listaMedicos.push(medico);
                }
            },
            error: function (error) {
                alert(error);
            }
        })
    } else {
        await $.ajax({
            url: 'https://ifsp.ddns.net/webservices/clinicaMedica/pacientes',
            type: 'GET',
            success: function (pacientes) {
                for (pac of pacientes) {
                    paciente = criar("td", "", (pac.nome));
                    paciente.attr("data-id", pac.id);
                    listaPacientes.push(paciente);
                }
            },
            error: function (error) {
                alert(error);
            }
        })
    }

    let pass, flag = 0;
    for (let consulta of consultas) {
        pass = false;
        if (tabela == "pacientes") {
            if (consulta.idPaciente == idTarget) {
                pass = true;
            }
        } else {
            if (consulta.idMedico == idTarget) {
                pass = true;
            }
        }

        if (pass) {
            let subLinha = criar("tr");

            if (tabela == "pacientes") {
                for (medico of listaMedicos) {
                    if (consulta.idMedico == medico.attr("data-id")) {
                        subLinha.append(criar("td", "", medico.text()));
                        break;
                    }
                }
                subLinha.append(criar("td", "", $(linha).children().eq(0).text()));
            } else {
                subLinha.append(criar("td", "", $(linha).children().eq(0).text()));
                for (paciente of listaPacientes) {
                    if (consulta.idPaciente == paciente.attr("data-id")) {
                        subLinha.append(criar("td", "", paciente.text()));
                        break;
                    }
                }
            }

            let botao = criar("td");
            let botaoRemover = criar("button", "button is-danger", "Desagendar");

            $(botaoRemover).click((e) => {
                let linha = e.target.parentElement.parentElement;
                let id = linha.getAttribute("data-id")

                $.ajax({
                    url: 'https://ifsp.ddns.net/webservices/clinicaMedica/consultas/' + id,
                    type: 'DELETE',
                    success: function () {
                        linha.remove();
                    },
                    error: function () {
                        alert("erro");
                    }
                });
            })

            subLinha.append(criar("td", "", consulta.data))
            botao.append(botaoRemover);
            subLinha.append(botao);
            subLinha.attr("data-id", consulta.id);
            tbody.append(subLinha);
            flag = 1;
        }
    }
    return flag;
}

function cadastrarConsulta(medico, paciente, data) {
    console.log(data)
    $.ajax({
        url: 'https://ifsp.ddns.net/webservices/clinicaMedica/consultas',
        type: 'POST',
        data: {
            "idMedico": medico,
            "idPaciente": paciente,
            "data": data,
        },
        success: function () {
            $("#cadastro-medico").val("");
            $("#cadastro-paciente").val("");
            $("#cadastro-data").val("");
            $("#cadastro-hora").val("");

            let alerta = criar('div', 'notification is-success', 'Cadastrado com sucesso!');
            $('nav').append(alerta);
            setTimeout(function() {
                alerta.remove();
            }, 1000);
        },
        error: function () {
            let alertaErro = criar('div', 'notification is-danger', 'Erro no cadastro!');
            $('nav').append(alertaErro);
            setTimeout(function() {
                alertaErro.remove();
            }, 1000);
        }
    });
}

//FUNÇÕES MÉDICO
function exibirListaMedicos() {
    $.ajax({
        url: 'https://ifsp.ddns.net/webservices/clinicaMedica/medicos',
        type: 'GET',
        success: function (medicos) {
            let section = criar("section", "column is-8 is-offset-2");

            let header = criar("header");
            header.append(criar("h1", "title mt-4 mb-4 has-text-centered", "Lista de Médicos"));
            section.append(header);

            let table = criar("table", "table is-striped is-fullwidth is-hoverable");
            let thead = criar("thead");
            let tbody = criar("tbody");
            let trHeader = criar("tr");

            trHeader.append(criar("th", "has-text-centered", "Nome"), criar("th", "has-text-centered", "Data de Cadastro"), criar("th", "has-text-centered", "Especialidade"), criar("th", "has-text-centered", "Ações"));
            thead.append(trHeader);
            tbody.attr("id", "medicos");
            table.append(thead, tbody);
            section.append(table);

            tratarExibirMedicos(medicos, tbody);

            limparMain();
            $("main").append(section);
        },
        error: function () {
            alert("erro");
        }
    });
}

function exibirCadastrosMedicos() {
    let section = criar("section", "column is-4 is-offset-4");
    let header = criar("header");
    header.append(criar("h1", "title mt-4 mb-4 has-text-centered", "Cadastrar Médico"));

    let form = criar("form");
    let labelNome = criar("label", "has-text-weight-bold", "Nome:");
    let divM1 = criar("div", "field pb-1");
    let divM2 = criar("div", "control");
    let inputNome = criar("input", "input is-danger ng-untouched ng-pristine ng-invalid");

    labelNome.attr("for", "cadastro-medico");
    inputNome.attr("id", "cadastro-medico");

    divM2.append(inputNome, criar("p", "help is-danger ng-star-inserted", "Insira um nome válido!"));
    divM1.append(divM2);

    let labelEspecialidade = criar("label", "has-text-weight-bold", "Especialidade:");
    let divM3 = criar("div", "field pb-1");
    let divM4 = criar("div", "select");
    let selectEspecialidade = criar("select", "select is-danger ng-pristine ng-invalid ng-touched");

    for (item of listaEspecialidades) {
        let opcao = selectEspecialidade.append(criar("option", "", item.text()));
        opcao.attr("value", item.attr("data-id"));
    }

    labelEspecialidade.attr("for", "especialidade");
    selectEspecialidade.attr("id", "especialidade");

    divM4.append(selectEspecialidade);
    divM3.append(divM4, criar("p"));

    let botao = criar("button", "button is-link", "Cadastrar");
    botao.attr("type", "button");

    form.append(labelNome, divM1, labelEspecialidade, divM3, botao);
    section.append(header, form);

    limparMain();
    $("main").append(section);
    cadastrarMedicoClick();
}

function tratarExibirMedicos(medicos, tbody) {
    let linha, nome, dataCadastro;
    for (let medico of medicos) {
        linha = criar("tr", "has-text-centered ng-star-inserted");
        nome = criar("td", "", medico.nome);
        dataCadastro = criar("td", "", medico.dataCadastro);

        for (item of listaEspecialidades) {
            if (medico.idEspecialidade == item.attr("data-id")) {
                linha.append(criar("td", "", item.text()));
            }
        }

        linha.attr("data-id", medico.id);

        linha.prepend(nome, dataCadastro);
        linha.append(criarBotoes("medicos"));
        tbody.append(linha);
    }
}

function cadastrarMedico(nome, idEspecialidade) {
    $.ajax({
        url: "https://ifsp.ddns.net/webservices/clinicaMedica/medicos",
        type: 'POST',
        data: {
            "nome": nome,
            "idEspecialidade": idEspecialidade,
        },
        success: function () {
            $("#cadastro-medico").val("");
            let alerta = criar('div', 'notification is-success', 'Cadastrado com sucesso!');
            $('nav').append(alerta);
            setTimeout(function() {
                alerta.remove();
            }, 1000);
        },

        error: function (erro) {
            console.log("Erro no cadastro:", erro);
            let alertaErro = criar('div', 'notification is-danger', 'Erro no cadastro!');
            $('nav').append(alertaErro);
            setTimeout(function() {
                alertaErro.remove();
            }, 1000);
        }
    });
}

function editarMedico(e) {
    let modal = criar("div", "modal modal-fx-fadeInScale is-active");
    let modalBackground = criar("div", "modal-background");
    let modalContent = criar("div", "modal-content");
    let box = criar("div", "box");
    let titulo = criar("h3", "title has-text-centered", "Editar Médico");
    let form = criar("form", "ng-untouched ng-pristine ng-valid");
    let field = criar("div", "field");
    let labelNome = criar("label", "label", "Nome");
    let inputNome = criar("input", "input is-success ng-untouched ng-pristine ng-valid");
    let p = criar("p", "help is-sucess ng-star-inserted", "OK!");
    let field2 = criar("div", "field");
    let labelEspecialidade = criar("label", "label", "Especialidade:");
    let selectDiv = criar("div", "select");
    let selectEspecialidade = criar("select", "select is-danger ng-pristine ng-invalid ng-touched");
    let p2 = criar("p", "help is-sucess ng-star-inserted", "OK!");
    let botao = criar("button", "button is-link", "Editar");
    let botaoClose = criar("button", "modal-close is-large");

    modal.attr("id", "modal");
    form.attr("novalidate", "");
    botao.attr("type", "button");
    botaoClose.attr("aria-label", "close");
    selectEspecialidade.attr("id", "especialidade");

    linha = e.target.parentElement.parentElement;
    inputNome.val($(linha).children().eq(0).text());

    let i = 0;
    for (item of listaEspecialidades) {
        let opcao = criar("option", "", item.text());
        opcao.attr("value", item.attr("data-id"))
        selectEspecialidade.append(opcao);
        if (item.text() == $(linha).children().eq(2).text()) {
            selectEspecialidade.prop("selectedIndex", i);
        }
        i++;
    }

    $(botaoClose).click(() => { limparModal() });

    modal.append(modalBackground, modalContent, botao, botaoClose);
    modalContent.append(box);
    box.append(titulo, form);
    form.append(field, field2, botao);
    field.append(labelNome, inputNome, p);
    field2.append(labelEspecialidade, selectDiv, p2);
    selectDiv.append(selectEspecialidade);

    let id = linha.getAttribute("data-id")
    $("main").append(modal);

    $(botao).click(() => {
        console.log($("#especialidade option:selected"))
        $.ajax({
            url: 'https://ifsp.ddns.net/webservices/clinicaMedica/medicos/' + id,
            type: 'PUT',
            data: {
                "nome": inputNome.val(),
                "idEspecialidade": $("#especialidade option:selected").attr("value"),
            },
            success: function () {
                console.log("deu bom");
                $(linha).children().eq(0).text(inputNome.val());
                $(linha).children().eq(2).text($("#especialidade option:selected").text());
                limparModal();
            },
            error: function () {
                alert("deu erro");
            }
        });

    })
}


//FUNÇÕES PACIENTE
function exibirListaPacientes() {
    $.ajax({
        url: 'https://ifsp.ddns.net/webservices/clinicaMedica/pacientes',
        type: 'GET',
        success: function (pacientes) {
            let section = criar("section", "column is-8 is-offset-2");

            let header = criar("header");
            header.append(criar("h1", "title mt-4 mb-4 has-text-centered", "Lista de Pacientes"));
            section.append(header);

            let table = criar("table", "table is-striped is-fullwidth is-hoverable");
            let thead = criar("thead");
            let tbody = criar("tbody");
            let trHeader = criar("tr");

            trHeader.append(criar("th", "has-text-centered", "Nome"), criar("th", "has-text-centered", "Data de Nascimento"), criar("th", "has-text-centered", "Data de Cadastro"), criar("th", "has-text-centered", "Ações"));
            thead.append(trHeader);
            tbody.attr("id", "pacientes")

            table.append(thead, tbody);
            section.append(table);

            tratarExibirPacientes(pacientes, tbody);

            limparMain();
            $("main").append(section);
        },
        error: function () {
            alert("erro");
        }
    });

}

function exibirCadastrosPacientes() {
    let section = criar("section", "column is-4 is-offset-4");
    let header = criar("header");
    header.append(criar("h1", "title mt-4 mb-4 has-text-centered", "Cadastrar Paciente"));

    let form = criar("form");
    let labelNome = criar("label", "has-text-weight-bold", "Nome:")
    let divP1 = criar("div", "field pb-5");
    let divP2 = criar("div", "control");
    let inputNome = criar("input", "input is-danger ng-untouched ng-pristine ng-invalid");

    labelNome.attr("for", "cadastro-paciente");
    inputNome.attr("id", "cadastro-paciente");

    divP2.append(inputNome, criar("p", "help is-danger ng-star-inserted", "Insira um nome válido!"));
    divP1.append(divP2);

    let labelDataNascimento = criar("label", "has-text-weight-bold", "Data de Nascimento");
    let divP3 = criar("div", "field");
    let inputData = criar("input", "input is-danger ng-untouched ng-pristine ng-invalid");

    labelDataNascimento.attr("for", "data-nascimento");
    inputData.attr("id", "dataNascimento");

    inputData.attr("type", "date");
    inputData.attr("formcontrolname", "nascimento");

    divP3.append(inputData, criar("p", "help is-danger ng-star-inserted pb-3", "Insira uma data válida!"));

    let botao = criar("button", "button is-link", "Cadastrar");
    botao.attr("type", "button");

    form.append(labelNome, divP1, labelDataNascimento, divP3, botao);
    section.append(header, form);
    botao.click(function () {
    })

    limparMain();
    $("main").append(section);
    cadastrarPacienteClick();
}

function tratarExibirPacientes(pacientes, tbody) {
    let linha, nome, dataNascimento, dataCadastro;
    for (let paciente of pacientes) {
        linha = criar("tr", "has-text-centered ng-star-inserted");
        nome = criar("td", "", paciente.nome);
        dataNascimento = criar("td", "", paciente.dataNascimento);
        dataCadastro = criar("td", "", paciente.dataCadastro);
        linha.attr("data-id", paciente.id);

        linha.append(nome, dataNascimento, dataCadastro)
        linha.append(criarBotoes("pacientes"));
        tbody.append(linha);
    }
}

function cadastrarPaciente(nome, DataNascimento) {
    $.ajax({
        url: "https://ifsp.ddns.net/webservices/clinicaMedica/pacientes",
        type: 'POST',
        data: {
            "nome": nome,
            "dataNascimento": DataNascimento,
        },
        success: function () {
            $("#cadastro-paciente").val("");
            $("#dataNascimento").val("");
            let alerta = criar('div', 'notification is-success', 'Cadastrado com sucesso!');
            $('body').append(alerta);
            setTimeout(function() {
                alerta.remove();
            }, 1000);
        },
        error: function () {
            let alertaErro = criar('div', 'notification is-danger', 'Erro no cadastro!');
            $('nav').append(alertaErro);
            setTimeout(function() {
                alertaErro.remove();
            }, 1000);
        }
    });
}

function editarPaciente(e) {
    let modal = criar("div", "modal modal-fx-fadeInScale is-active");
    let modalBackground = criar("div", "modal-background");
    let modalContent = criar("div", "modal-content");
    let box = criar("div", "box");
    let titulo = criar("h3", "title has-text-centered", "Editar Paciente");
    let form = criar("form", "ng-untouched ng-pristine ng-valid");
    let field = criar("div", "field");
    let labelNome = criar("label", "label", "Nome");
    let inputNome = criar("input", "input is-success ng-untouched ng-pristine ng-valid");
    let p = criar("p", "help is-sucess ng-star-inserted", "OK!");
    let field2 = criar("div", "field");
    let labelDataNascimento = criar("label", "label", "Data de Nascimento");
    let inputNascimento = criar("input", "input is-success ng-untouched ng-pristine ng-valid");
    let p2 = criar("p", "help is-sucess ng-star-inserted", "OK!");
    let botao = criar("button", "button is-link", "Editar");
    let botaoClose = criar("button", "modal-close is-large");

    modal.attr("id", "modal");
    form.attr("novalidate", "");
    inputNome.attr("type", "text");
    inputNascimento.attr("type", "date");
    inputNascimento.attr("id","dataNascimento")
    botao.attr("type", "button");
    botaoClose.attr("aria-label", "close");

    linha = e.target.parentElement.parentElement;
    inputNome.val($(linha).children().eq(0).text());
    inputNascimento.val($(linha).children().eq(1).text());

    $(botaoClose).click(() => { limparModal() });

    modal.append(modalBackground, modalContent, botao, botaoClose);
    modalContent.append(box);
    box.append(titulo, form);
    form.append(field, field2, botao);
    field.append(labelNome, inputNome, p);
    field2.append(labelDataNascimento, inputNascimento, p2);

    let id = linha.getAttribute("data-id");
    $(botao).click(function () {
        $.ajax({
            url: 'https://ifsp.ddns.net/webservices/clinicaMedica/pacientes/' + id,
            type: 'PUT',
            data: {
                "nome": inputNome.val(),
                "dataNascimento": inputNascimento.val()
            },
            success: function () {
                console.log("deu bom");
                $(linha).children().eq(0).text($(inputNome).val());
                $(linha).children().eq(1).html($(inputNascimento).val());
                limparModal();

            },
            error: function () {
                alert("deu erro");
            }
        });
    })

    $("main").append(modal);
}


//FUNÇÕES COMPLEMENTARES
function controleValidado() {

    $(document).on("input", "input", function () {
        if($(this).not("#data") && $(this).not("#dataNascimento") ){
            if ($(this).val() != "") {
                $(this).removeClass("is-danger ng-pristine ng-invalid");
                $(this).addClass("is-success ng-untouched ng-pristine ng-valid");
    
                $(this).next().text("OK!");
                $(this).next().removeClass("is-danger ng-star-inserted");
                $(this).next().addClass("is-sucess ng-star-inserted");
            } else {
                $(this).removeClass("is-success ng-untouched ng-pristine ng-valid");
                $(this).addClass("is-danger ng-pristine ng-invalid");
    
                $(this).next().text("NOT OK!");
                $(this).next().removeClass("is-sucess ng-star-inserted");
                $(this).next().addClass("is-danger ng-star-inserted");
            }
        }
        if($(this).attr("id")=="data"){
            let data=$(this).val()
            let data_convertida= new Date(data)
            let data_atual= new Date()
            if(data_convertida>data_atual){
                $(this).removeClass("is-danger ng-pristine ng-invalid");
                $(this).addClass("is-success ng-untouched ng-pristine ng-valid");
    
                $(this).next().text("Data válida!");
                $(this).next().removeClass("is-danger ng-star-inserted");
                $(this).next().addClass("is-sucess ng-star-inserted");



                


            }
            else{
                $(this).removeClass("is-success ng-untouched ng-pristine ng-valid");
                $(this).addClass("is-danger ng-pristine ng-invalid");
    
                $(this).next().text("Selecione uma data futura!");
                $(this).next().removeClass("is-sucess ng-star-inserted");
                $(this).next().addClass("is-danger ng-star-inserted");  



            }

            
        }

        if($(this).attr("id")=="dataNascimento"){
            let data=$(this).val()
            let data_convertida= new Date(data)
            let data_atual= new Date()
            if(data_convertida<data_atual){
                $(this).removeClass("is-danger ng-pristine ng-invalid");
                $(this).addClass("is-success ng-untouched ng-pristine ng-valid");
    
                $(this).next().text("Data válida!");
                $(this).next().removeClass("is-danger ng-star-inserted");
                $(this).next().addClass("is-sucess ng-star-inserted");

            }
            else{
                $(this).removeClass("is-success ng-untouched ng-pristine ng-valid");
                $(this).addClass("is-danger ng-pristine ng-invalid");
    
                $(this).next().text("Selecione uma data passada!");
                $(this).next().removeClass("is-sucess ng-star-inserted");
                $(this).next().addClass("is-danger ng-star-inserted");  


            }
        }
    


    })

    $(document).on("change", "select", function () {
        let value = $(this).val();
        console.log(value)
        if ($(this).val() != "") {
            $(this).removeClass("is-danger ng-untouched ng-pristine ng-invalid");
            $(this).addClass("is-success ng-dirty ng-valid ng-touched");

            $(this).next().text("OK!");
            $(this).next().removeClass("is-danger ng-star-inserted");
            $(this).next().addClass("is-sucess ng-star-inserted");
        } else {
            $(this).removeClass("is-success ng-dirty ng-valid ng-touched");
            $(this).addClass("is-danger ng-untouched ng-pristine ng-invalid");

            $(this).next().text("NOT OK!");
            $(this).next().removeClass("is-sucess ng-star-inserted");
            $(this).next().addClass("is-danger ng-star-inserted");
        }
    });
}

var listaEspecialidades = [];
function listarEspecialidades() {
    $.ajax({
        url: 'https://ifsp.ddns.net/webservices/clinicaMedica/especialidades',
        type: 'GET',
        success: function (especialidades) {
            let especialidade;
            for (item of especialidades) {
                especialidade = criar("td", "", ("" + item.nome));
                especialidade.attr("data-id", item.id);
                listaEspecialidades.push(especialidade);
            }
        },
        error: function () {
            alert("erro");
        }
    });
}

function remover(e) {
    let linha = e.target.parentElement.parentElement;
    let id = linha.getAttribute("data-id");
    let tabela = linha.parentElement.getAttribute("id") + '/';

    $.ajax({
        url: 'https://ifsp.ddns.net/webservices/clinicaMedica/' + tabela + id,
        type: 'DELETE',
        success: function () {
            linha.remove();
        },
        error: function () {
            alert("erro");
        }
    });
}


//FUNÇÕES AUXILIARES


function criar(elemento, classe, texto) {
    let elem = $(`<${elemento}>`);

    //se classe existir
    if (classe) { elem.addClass(classe); }

    //se texto existir
    if (texto) { elem.text(texto); }

    return elem;
}

function criarBotoes(tabela) {
    let botoes = criar("td");

    let botaoVer = criar("button", "button is-primary mr-1", "Ver Consultas");
    let botaoEdit = criar("button", "button is-warning mr-1", "Editar");
    let botaoDelete = criar("button", "button is-danger", "Apagar");

    $(botaoVer).click((e) => exibirConsultas(e, tabela));

    $(botaoDelete).click((e) => { remover(e) });
    if (tabela == "pacientes") {
        $(botaoEdit).click((e) => editarPaciente(e));
    } else {
        $(botaoEdit).click((e) => editarMedico(e));
    }

    botoes.append(botaoVer, botaoEdit, botaoDelete);
    return botoes;
}

function limparMain() {
    let section = $("section");
    if (section.length) {
        section.remove();
    }
}

function limparModal() {
    let modal = document.querySelector("#modal");
    modal.remove();
}


//Main
function main() {
    listarEspecialidades();
    controleValidado();

    agendamentoClick();
    cadastroClick();
    listagemClick();
}
main();