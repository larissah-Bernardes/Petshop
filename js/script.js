// JavaScript do Amigo Pet - Fase 2
document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("formAgendamento");
    const dataInput = document.getElementById("dataAgendamento");
    const horarioSelect = document.getElementById("horario");
    const mensagem = document.getElementById("mensagemSucesso");
    const cpfInput = document.getElementById("cpf");
    const telefoneInput = document.getElementById("telefone");

    // Atualiza o ano automaticamente no rodapé (função temporal).
    document.getElementById("anoAtual").textContent = new Date().getFullYear();

    // Impede a escolha de datas anteriores ao dia atual.
    const hoje = new Date();
    const hojeLocal = new Date(hoje.getTime() - hoje.getTimezoneOffset() * 60000)
        .toISOString().split("T")[0];
    dataInput.min = hojeLocal;

    // Aplica máscara simples ao CPF para facilitar o preenchimento.
    cpfInput.addEventListener("input", () => {
        let valor = cpfInput.value.replace(/\D/g, "").slice(0, 11);
        valor = valor.replace(/(\d{3})(\d)/, "$1.$2");
        valor = valor.replace(/(\d{3})(\d)/, "$1.$2");
        valor = valor.replace(/(\d{3})(\d{1,2})$/, "$1-$2");
        cpfInput.value = valor;
    });

    // Aplica máscara simples ao telefone.
    telefoneInput.addEventListener("input", () => {
        let valor = telefoneInput.value.replace(/\D/g, "").slice(0, 11);
        if (valor.length > 10) {
            valor = valor.replace(/^(\d{2})(\d{5})(\d{0,4}).*/, "($1) $2-$3");
        } else if (valor.length > 6) {
            valor = valor.replace(/^(\d{2})(\d{4})(\d{0,4}).*/, "($1) $2-$3");
        } else if (valor.length > 2) {
            valor = valor.replace(/^(\d{2})(\d+)/, "($1) $2");
        }
        telefoneInput.value = valor;
    });

    // Monta opções de horário quando o usuário escolhe uma data.
    dataInput.addEventListener("change", () => {
        horarioSelect.innerHTML = '<option value="">Selecione um horário</option>';
        if (!dataInput.value) return;

        // Horários ilustrativos de atendimento, de segunda a sábado.
        const dataEscolhida = new Date(`${dataInput.value}T12:00:00`);
        if (dataEscolhida.getDay() === 0) {
            horarioSelect.innerHTML = '<option value="">Não há atendimento aos domingos</option>';
            return;
        }

        ["09:00", "10:00", "11:00", "13:00", "14:00", "15:00", "16:00", "17:00"]
            .forEach((hora) => {
                const option = document.createElement("option");
                option.value = hora;
                option.textContent = hora;
                horarioSelect.appendChild(option);
            });
    });

    // Valida os campos e apresenta um resumo local, sem transmitir dados.
    form.addEventListener("submit", (event) => {
        event.preventDefault();
        event.stopPropagation();

        const dataSelecionada = dataInput.value;
        const dataValida = dataSelecionada && dataSelecionada >= hojeLocal;
        dataInput.setCustomValidity(dataValida ? "" : "Escolha uma data atual ou futura.");

        if (!form.checkValidity()) {
            form.classList.add("was-validated");
            return;
        }

        const dados = new FormData(form);
        const nome = dados.get("nomeCliente");
        const pet = dados.get("nomePet");
        const servico = dados.get("servico");
        const modalidade = dados.get("modalidade");
        const data = dataSelecionada.split("-").reverse().join("/");
        const horario = dados.get("horario");

        mensagem.innerHTML = `<strong>Agendamento demonstrativo preenchido!</strong><br>
            Cliente: ${escaparTexto(nome)}<br>
            Pet: ${escaparTexto(pet)}<br>
            Serviço: ${escaparTexto(servico)}<br>
            Modalidade: ${escaparTexto(modalidade)}<br>
            Data: ${data} às ${escaparTexto(horario)}.<br>
            <span class="small">Nenhum dado foi enviado ou armazenado. Entre em contato com o petshop para confirmar um atendimento real.</span>`;
        mensagem.classList.remove("d-none");
        mensagem.scrollIntoView({ behavior: "smooth", block: "center" });
    });

    // Limpa mensagens e estados de validação ao reiniciar o formulário.
    form.addEventListener("reset", () => {
        form.classList.remove("was-validated");
        mensagem.classList.add("d-none");
        mensagem.textContent = "";
        setTimeout(() => {
            horarioSelect.innerHTML = '<option value="">Selecione a data primeiro</option>';
            dataInput.setCustomValidity("");
        }, 0);
    });

    // Evita inserir conteúdo digitado pelo usuário como HTML na confirmação.
    function escaparTexto(texto) {
        return String(texto).replace(/[&<>"']/g, (caractere) => ({
            "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;"
        })[caractere]);
    }
});
