Sistema de Reserva de Mesas
Projeto de Sistemas Distribuídos e Mobile
Este projeto foi desenvolvido como parte prática da disciplina de Sistemas Distribuídos e Mobile, com o objetivo de aplicar, de forma concreta, os conceitos de comunicação entre processos e o funcionamento de sistemas cliente-servidor. A ideia é simular um sistema real de reservas para um restaurante, lidando com diferentes perfis de usuários e os desafios que envolvem a troca de informações entre cliente e servidor.

🛠️ Sobre a Aplicação

A proposta consiste em criar um sistema com três perfis distintos de interação com um mesmo servidor, cada um com responsabilidades bem definidas no processo de reserva:
Atendente: responsável por registrar ou cancelar reservas.


Garçom: confirma quando uma reserva foi realmente utilizada.


Gerente: acompanha o andamento das reservas por meio de relatórios em tempo real.


A aplicação foi desenvolvida em JavaScript (Node.js), utilizando Sockets TCP para uma comunicação direta e eficiente entre clientes e servidor. O banco de dados utilizado é um simples arquivo JSON, que armazena todas as reservas feitas, confirmadas ou canceladas.

⚙️ Como Funciona

👨‍💼 Atendente

O atendente interage com o sistema para criar novas reservas ou cancelar reservas existentes. Cada reserva contém os seguintes dados:
Data


Hora

Número da mesa

Quantidade de pessoas

Nome da pessoa responsável


Após o envio da solicitação, o servidor responde com uma mensagem informando se a operação foi bem-sucedida ou se houve algum erro (por exemplo, caso a mesa já esteja reservada).

🧑‍🍳 Garçom

O garçom entra em ação quando o cliente chega ao restaurante. Ele utiliza o sistema para confirmar que a mesa foi ocupada, liberando-a para novas reservas futuras. O servidor responde confirmando o sucesso da operação ou indicando possíveis erros (como tentar confirmar uma mesa não reservada).

📊 Gerente

O gerente possui acesso a funcionalidades de acompanhamento e análise do sistema. Ele pode solicitar relatórios que indicam:
Reservas atendidas ou não dentro de um período específico;

Todas as reservas feitas para uma mesa específica;

Relação de mesas confirmadas por garçom.

Além disso, o gerente também pode limpar todo o banco de dados, caso deseje reiniciar o sistema do zero.

🖥️ Servidor

O servidor centraliza toda a lógica da aplicação. Ele recebe as solicitações dos clientes, consulta ou atualiza o banco de dados e responde com base na ação solicitada. A comunicação é feita por meio de conexões TCP simples, sem o uso de bibliotecas externas adicionais.

💻 Tecnologias Utilizadas

Linguagem: JavaScript


Ambiente de execução: Node.js


Comunicação: Sockets TCP (módulo net do Node.js)


Banco de dados: Arquivo JSON local



🚀 Como Executar o Projeto

Certifique-se de que o Node.js está instalado na sua máquina.


Faça o download ou clone este repositório.


Para iniciar o servidor, acesse a pasta servidor e execute o arquivo index.js.


Em seguida, abra terminais separados para cada tipo de cliente e execute os arquivos correspondentes:


atendente.js


garcom.js


gerente.js


Cada cliente possui um menu simples e intuitivo baseado em texto, facilitando a simulação de uma interação real com o sistema.
🧠 Por que escolhemos Sockets?
Optamos pelos Sockets TCP por proporcionarem um maior controle sobre a comunicação e por permitirem uma compreensão mais profunda do que acontece entre cliente e servidor. Essa abordagem direta nos desafiou a pensar cuidadosamente na lógica da aplicação, no formato das mensagens e no comportamento do servidor diante de cada solicitação. O aprendizado foi significativo e prático.
