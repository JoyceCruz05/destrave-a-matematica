document.addEventListener('DOMContentLoaded', () => {
  const anoAtual = document.getElementById('ano-atual');
  if (anoAtual) {
    anoAtual.textContent = new Date().getFullYear();
  }

  const formulario = document.getElementById('formulario-contato');
  const mensagemEnvio = document.getElementById('mensagem-envio');

  if (formulario) {
    formulario.addEventListener('submit', (event) => {
      event.preventDefault();
      if (mensagemEnvio) {
        mensagemEnvio.textContent = 'Obrigada! Sua inscrição foi enviada com sucesso.';
      }

      formulario.reset();
      const enderecoFields = document.getElementById('endereco-fields');
      if (enderecoFields) {
        enderecoFields.hidden = true;
      }
    });
  }

  const cepInput = document.getElementById('cep');
  const enderecoFields = document.getElementById('endereco-fields');
  const ruaInput = document.getElementById('rua');
  const bairroInput = document.getElementById('bairro');
  const cidadeInput = document.getElementById('cidade');
  const cepStatus = document.getElementById('cep-status');
  const limparCampos = () => {
    ruaInput.value = '';
    bairroInput.value = '';
    cidadeInput.value = '';
  };

  cepInput.addEventListener('input', () => {
    const cep = cepInput.value.replace(/\D/g, '');
    cepInput.value = cep;
    if (cep.length !== 8) {
      limparCampos();
      enderecoFields.hidden = true;
      cepStatus.textContent = '';
      return;
    }

    cepStatus.textContent = 'Buscando endereço...';

    fetch(`https://viacep.com.br/ws/${cep}/json/`)
      .then((response) => response.json())
      .then((data) => {
        if (data.erro) {
          limparCampos();
          enderecoFields.hidden = true;
          cepStatus.textContent = 'CEP não encontrado';
          return;
        }

        ruaInput.value = data.logradouro || '';
        bairroInput.value = data.bairro || '';
        cidadeInput.value = data.localidade && data.uf
          ? `${data.localidade} / ${data.uf}`
          : data.localidade || '';

        enderecoFields.hidden = false;
        cepStatus.textContent = 'Endereço encontrado';
      })
      .catch(() => {
        limparCampos();
        enderecoFields.hidden = true;
        cepStatus.textContent = 'Não foi possível buscar o CEP';
      });
  });
});
