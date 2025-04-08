// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./Verifier.sol";

contract Voting is Ownable {
    // Eventos
    event VoterRemoved(address voter);

    // Struct do voto (exemplo simples: sim/não)
    enum VoteOption {
        None,
        Yes,
        No
    }

    // Mapeia cada endereco para seu storedHash (identidade)
    mapping(address => uint256) public storedHashes;

    // Mapeia quem ja votou
    mapping(address => bool) public hasVoted;

    // Mapeia a opção de voto de cada endereço
    mapping(address => VoteOption) public voterChoice;

    // Contagem dos votos
    uint256 public yesVotes;
    uint256 public noVotes;

    // Endereco do contrato de verificacao ZK
    Groth16Verifier public verifier;

    constructor(address _verifier) Ownable(msg.sender) {
        verifier = Groth16Verifier(_verifier);
    }

    // Registro do hash de identidade (feito pelo admin)
    function registerVoter(address _voter, uint256 _storedHash) external onlyOwner {
        require(storedHashes[_voter] == 0, "Ja registrado");
        storedHashes[_voter] = _storedHash;
    }

    // Realiza o voto (com prova ZK)
    function vote(
        VoteOption _vote,
        uint[2] calldata a,
        uint[2][2] calldata b,
        uint[2] calldata c,
        uint[2] calldata publicSignals
    ) external {
        // Verifica se isValid é 1 (prova correta)
        require(publicSignals[0] == 1, "Prova invalida: biometria incorreta");

        // Verifica a prova ZK primeiro
        require(verifier.verifyProof(a, b, c, publicSignals), "Prova ZK invalida");

        require(!hasVoted[msg.sender], "Ja votou");
        require(_vote == VoteOption.Yes || _vote == VoteOption.No, "Voto invalido");

        // Marca como votado e salva a escolha
        hasVoted[msg.sender] = true;
        voterChoice[msg.sender] = _vote;

        // Contabiliza o voto
        if (_vote == VoteOption.Yes) {
            yesVotes++;
        } else {
            noVotes++;
        }
    }

    // Consulta simples
    function getResults() external view returns (uint256 yes, uint256 no) {
        return (yesVotes, noVotes);
    }

    // Remove o registro do votante atual
    function unregisterCurrentVoter() external {
        address voter = msg.sender;
        
        // Garante que o endereço está registrado
        require(storedHashes[voter] != 0, "Votante nao registrado");

        // Se o votante tinha votado, ajusta o contador
        if (hasVoted[voter]) {
            if (voterChoice[voter] == VoteOption.Yes && yesVotes > 0) {
                yesVotes--;
            } else if (voterChoice[voter] == VoteOption.No && noVotes > 0) {
                noVotes--;
            }
        }
        
        // Limpa os registros do votante
        delete storedHashes[voter];
        delete hasVoted[voter];
        delete voterChoice[voter];

        emit VoterRemoved(voter);
    }
} 