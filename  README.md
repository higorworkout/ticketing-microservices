# Ticketing Microservices

Sistema de gerenciamento de tickets baseado em **arquitetura de microsserviços orientada a eventos**, com infraestrutura provisionada na AWS utilizando **CDK** e execução em **Kubernetes (EKS)**.

Projeto desenvolvido com foco em **arquitetura real de mercado**, escalabilidade, organização de código e boas práticas de sistemas distribuídos.

---

## Stack Tecnológica

- **Node.js**
- **Express**
- **TypeScript**
- **Docker**
- **Kubernetes (Amazon EKS)**
- **Apache Kafka** (event streaming)
- **AWS Cognito** (autenticação e autorização)
- **OAuth 2.0 / OpenID Connect**
- **JWT**
- **CI/CD**
- **AWS CDK** (infraestrutura como código)

---

## Arquitetura

O sistema adota uma combinação de padrões arquiteturais amplamente utilizados no mercado:

- **Microservices Architecture**
- **Event-Driven Architecture**
- **Clean Architecture**
- **Hexagonal Architecture (Ports and Adapters)**
- **Domain-Driven Design (DDD)**

### Organização interna dos serviços

Cada microsserviço é estruturado seguindo **Clean Architecture + Hexagonal**, separando claramente:

- **Inbound adapters**  
  Entradas da aplicação (HTTP controllers, consumers Kafka, handlers)

- **Core / Domain**  
  Regras de negócio, casos de uso e entidades (independentes de frameworks)

- **Outbound adapters**  
  Saídas da aplicação (banco de dados, mensageria Kafka, APIs externas)

Essa abordagem garante:

- baixo acoplamento  
- alta testabilidade  
- independência de frameworks  
- facilidade de evolução e manutenção  

---

## Comunicação entre serviços

- Comunicação **assíncrona** via **Apache Kafka**
- Eventos de domínio publicados e consumidos entre microsserviços
- Cada serviço mantém sua própria responsabilidade e contexto

---

## Serviços

- **auth** → integração com AWS Cognito e controle de acesso
- **tickets** → gerenciamento de tickets
- **orders** → criação e controle de pedidos

Cada serviço é:

- isolado
- independente para deploy
- escalável horizontalmente
- comunicado por eventos via Kafka

---

## Autenticação e Segurança

- Autenticação centralizada com **AWS Cognito**
- Protocolo **OAuth 2.0 / OpenID Connect**
- Tokens **JWT** utilizados para autorização entre serviços
- Integração com o cluster Kubernetes (EKS)

---

## Infraestrutura na AWS

Provisionada utilizando **AWS CDK**, incluindo:

- **Amazon EKS** (cluster Kubernetes)
- **Amazon Cognito** (identity provider)
- **Networking, IAM e permissões**
- **Mensageria baseada em Kafka**
- Estrutura preparada para observabilidade e escalabilidade

---