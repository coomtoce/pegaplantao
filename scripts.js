// scripts.js

document.addEventListener('DOMContentLoaded', () => {
    const addPlantonistaBtn = document.getElementById('add-plantonista');
    const ordenarPlantonistasBtn = document.getElementById('ordenar-plantonistas');
    const calcularDisponibilidadeBtn = document.getElementById('calcular-disponibilidade');
    const gerarCadastroReservaBtn = document.getElementById('gerar-cadastro-reserva');
    const plantonistasContainer = document.getElementById('plantonistas-container');
    const listaPlantonistas = document.getElementById('lista-plantonistas');
    const resultadoDisponibilidade = document.getElementById('resultado-disponibilidade');
    const resultadoImediato = document.getElementById('resultado-imediato');
    const resultadoCadastroReserva = document.getElementById('resultado-cadastro-reserva');
    const vacanciaPlantoesInput = document.getElementById('vacancia-plantoes');
    const totalCooperadosInput = document.getElementById('total-cooperados');
    
    let plantonistas = [];
    let grupos = [];

    addPlantonistaBtn.addEventListener('click', () => {
        const nome = document.getElementById('nome').value;
        const plantoes = parseInt(document.getElementById('plantoes').value);
        
        if (nome && !isNaN(plantoes)) {
            plantonistas.push({ nome, plantoes });
            updatePlantonistasList();
            document.getElementById('nome').value = '';
            document.getElementById('plantoes').value = '';
        }
    });

    function updatePlantonistasList() {
        listaPlantonistas.innerHTML = '';
        plantonistas.forEach((plantonista, index) => {
            const li = document.createElement('li');
            li.textContent = `${index + 1}. ${plantonista.nome} - ${plantonista.plantoes} plantões`;
            listaPlantonistas.appendChild(li);
        });
    }

    ordenarPlantonistasBtn.addEventListener('click', () => {
        plantonistas.sort((a, b) => b.plantoes - a.plantoes);
        updatePlantonistasList();
        listaPlantonistas.querySelectorAll('li').forEach((li, index) => {
            if (index < 15) {
                li.classList.add('destaque');
            }
        });
    });

    calcularDisponibilidadeBtn.addEventListener('click', () => {
        const vacanciaPlantoes = parseInt(vacanciaPlantoesInput.value);
        const plantoesDisponiveis = Math.floor(vacanciaPlantoes * 0.6);
        resultadoImediato.textContent = `Disponibilidade = ${plantoesDisponiveis}`;
        resultadoDisponibilidade.innerHTML = `A quantidade de plantões disponíveis para sorteio entre os 15 maiores plantonistas, nessa fase (2a etapa) é de <strong>${plantoesDisponiveis}</strong> plantões. Cada um dos 15 maiores plantonistas pode assumir até 6 plantões nesta fase.`;
    });

    gerarCadastroReservaBtn.addEventListener('click', () => {
        const totalCooperados = parseInt(totalCooperadosInput.value);
        const plantonistasOrdenados = [...plantonistas].sort((a, b) => a.plantoes - b.plantoes);

        grupos = [];
        let index = 0;

        // Formando grupos de 15 ou menos, começando pelos plantonistas com menos plantões
        while (index < plantonistasOrdenados.length) {
            const grupo = plantonistasOrdenados.slice(index, index + 15);
            grupos.push(grupo);
            index += 15;
        }

        // Verificando o último grupo
        const ultimoGrupo = grupos[grupos.length - 1];
        if (ultimoGrupo.length < 12) {
            grupos.pop();
            let i = 0;
            while (ultimoGrupo.length > 0) {
                if (grupos[i]) {
                    grupos[i].push(ultimoGrupo.shift());
                }
                i = (i + 1) % grupos.length;
            }
        }

        // Reordenando os grupos para garantir que o primeiro grupo tenha os plantonistas com menos plantões e o último grupo tenha os plantonistas com mais plantões
        const reordenado = [].concat(...grupos).sort((a, b) => a.plantoes - b.plantoes);
        const finalGrupos = [];
        index = 0;

        // Determinando o tamanho ideal de cada grupo
        const tamanhoGrupo = Math.ceil(reordenado.length / grupos.length);

        while (index < reordenado.length) {
            const grupo = reordenado.slice(index, index + tamanhoGrupo);
            finalGrupos.push(grupo);
            index += tamanhoGrupo;
        }

        grupos = finalGrupos; // Atualizando os grupos com a nova ordenação

        resultadoCadastroReserva.innerHTML = '';
        grupos.forEach((grupo, i) => {
            const div = document.createElement('div');
            div.innerHTML = `<h3>Cadastro de reserva ${i + 1}:</h3>`;
            const ul = document.createElement('ul');
            grupo.forEach((plantonista, index) => {
                const li = document.createElement('li');
                li.textContent = `${index + 1}. ${plantonista.nome} - ${plantonista.plantoes} plantões`;
                ul.appendChild(li);
            });
            div.appendChild(ul);
            div.insertAdjacentHTML('beforeend', `<p>Total: ${grupo.length} plantonistas</p>`);
            const sortearBtn = document.createElement('button');
            sortearBtn.textContent = 'Sortear';
            sortearBtn.addEventListener('click', () => sortearPlantonista(grupo, i));
            div.appendChild(sortearBtn);
            const resultadoSorteio = document.createElement('p');
            resultadoSorteio.id = `resultado-sorteio-${i}`;
            div.appendChild(resultadoSorteio);
            resultadoCadastroReserva.appendChild(div);
        });
    });

    function sortearPlantonista(grupo, grupoIndex) {
        const sorteadoIndex = Math.floor(Math.random() * grupo.length);
        const sorteado = grupo[sorteadoIndex];
        const resultadoSorteio = document.getElementById(`resultado-sorteio-${grupoIndex}`);
        resultadoSorteio.textContent = `Plantonista sorteado: ${sorteado.nome}`;
    }
});
