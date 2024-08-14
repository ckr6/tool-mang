const fetch = require('node-fetch');

async function getMapaApartamentos(req, res) {
  try {
    const tokenResponse = await fetch('http://10.20.7.245:8366/datasnap/rest/v1/liberar?client_id=657AF93B25CAD27AE4915462B8A435E1&client_secret=4CF32679AF1D153A664CE843FFFFC82F', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    const tokenData = await tokenResponse.json();
    const token = tokenData.access_token;

    if (!token) {
      return res.status(500).json({ message: 'Erro ao obter token de acesso' });
    }

    const mapaResponse = await fetch('http://10.20.7.245:8366/datasnap/rest/v1/MapaApartamento', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!mapaResponse.ok) {
      return res.status(500).json({ message: 'Erro ao requisitar dados do mapa de apartamentos' });
    }

    const mapaData = await mapaResponse.json();

    const today = new Date().toISOString().split('T')[0]; // Formato YYYY-MM-DD
    const reservaResponse = await fetch(`http://10.20.7.245:8366/datasnap/rest/v1/ListaReserva?dataInicial=${today}&dataFinal=${today}&situacao=CONFIRMADA`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!reservaResponse.ok) {
      return res.status(500).json({ message: 'Erro ao requisitar dados de reservas' });
    }

    const reservasData = await reservaResponse.json();
    console.log('Reservas Data:', reservasData); // Verifique a estrutura dos dados aqui

    // Verifique se reservasData é um objeto e se contém a chave listaReserva
    if (!reservasData.listaReserva || !Array.isArray(reservasData.listaReserva)) {
      return res.status(500).json({ message: 'Dados de reservas não estão no formato esperado' });
    }

    const reservas = reservasData.listaReserva;

    const mapaDataWithReservations = mapaData.map(apartamento => {
      const reservasParaApartamento = reservas.filter(reserva => 
        reserva.listaReservaItem.some(item => item.codigoApartamento === apartamento.codigo)
      );

      return {
        ...apartamento,
        reservas: reservasParaApartamento.map(reserva => ({
          titular: reserva.titular,
          dataHora: reserva.dataHora
        }))
      };
    });

    res.json(mapaDataWithReservations);

  } catch (error) {
    console.error('Erro ao requisitar dados do mapa de apartamentos:', error);
    res.status(500).json({ message: 'Erro ao requisitar dados do mapa de apartamentos' });
  }
}

module.exports = { getMapaApartamentos };
