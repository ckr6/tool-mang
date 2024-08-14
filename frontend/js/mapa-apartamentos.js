document.addEventListener('DOMContentLoaded', () => {
    async function fetchMapaApartamento() {
        try {
            const response = await fetch('/api/mapa-apartamentos', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('userToken')}`, 
                },
            });

            if (!response.ok) {
                throw new Error(`Erro ao requisitar dados do mapa de apartamentos: ${response.statusText}`);
            }

            const data = await response.json();
            console.log('Dados completos recebidos:', data);

            const filterStatus = document.getElementById('filter-status').value.trim().toUpperCase();
            const apartamentosContainer = document.getElementById('apartamentos-container');
            apartamentosContainer.innerHTML = ''; 

            const filteredData = data.filter(apartamento => {
                const apartamentoStatus = apartamento.situacao.trim().toUpperCase();
                const hasReservation = apartamento.reserva !== undefined;
                
                if (filterStatus === 'RESERVADO') {
                    return hasReservation;
                }
                
                return !filterStatus || apartamentoStatus === filterStatus;
            });

            if (filteredData.length > 0) {
                filteredData.forEach(apartamento => {
                    console.log('Dados do apartamento:', apartamento);

                    const statusClass = apartamento.situacao === 'OCUPADO' ? 'bg-red-500 text-white' :
                        apartamento.situacao === 'LIVRE' ? 'bg-green-500 text-white' :
                        apartamento.situacao === 'LIMPEZA' ? 'bg-yellow-500 text-white' :
                        apartamento.situacao === 'MANUTENCAO' ? 'bg-gray-500 text-white' : '';

                    const reservationIcon = apartamento.reserva ? 
                        `<span class="inline-block ml-2 bg-black text-white font-bold rounded-full" style="width: 24px; height: 24px; display: flex; align-items: center; justify-content: center; line-height: 24px; margin-left: auto;">R</span>` 
                        : '';

                    const apartamentoElement = document.createElement('div');
                    apartamentoElement.className = `border p-4 rounded-md shadow-md mb-2 w-full max-w-full sm:max-w-sm lg:max-w-lg mx-auto flex items-center justify-between ${statusClass}`;

                    apartamentoElement.innerHTML = `
                        <span class="font-bold">Apartamento ${apartamento.codigo} Status: ${apartamento.situacao}</span>
                        ${reservationIcon}
                    `;
                    apartamentosContainer.appendChild(apartamentoElement);
                });
            } else {
                apartamentosContainer.innerHTML = '<p class="text-center">Nenhum apartamento encontrado.</p>';
            }

        } catch (error) {
            console.error('Erro ao requisitar dados do mapa de apartamentos:', error);
        }
    }

    fetchMapaApartamento();

    document.getElementById('filter-status').addEventListener('change', () => {
        fetchMapaApartamento();
    });
});
