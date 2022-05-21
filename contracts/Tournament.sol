//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "hardhat/console.sol";

contract Tournament {
  struct Player {
    address wallet;
    string externalPlayerId;
  }

  struct Game {
    string externalGameId;
    string redTeamName;
    string blueTeamName;
    string winner;
  }

  string private name; 
  address private host;
  bool private open = true;
  string private password;
  uint256 private minTeamSize;
  uint256 private maxTeamSize;
  uint256 private requiredTeamCount;
  uint256 private teamCount = 0;
  string[] private teamNames;
  mapping(string => Player[]) private teams;
  mapping(string => uint256) private externalGameIdToGamesIndex;
  uint256 private gameIndex = 0;
  Game[] private games;
  string[] private winner;

  /** Create tournament with contract caller as host */
  constructor(
    string memory _name,
    string memory _password,
    uint256 _minTeamSize,
    uint256 _maxTeamSize,
    uint256 _requiredTeamCount
  ) {
    require(_minTeamSize <= _maxTeamSize, "Invalid team size limit");
    name = _name;
    password = _password;
    minTeamSize = _minTeamSize;
    maxTeamSize = _maxTeamSize;
    requiredTeamCount = _requiredTeamCount;
    host = msg.sender;
  }

  // Adds team to tournament
  function register(string calldata _teamName, Player[] calldata _players)
    external
  {
    // FIXME: check if team exists.
    require(open, "Tournament has closed");
    require(_players.length >= minTeamSize, "Team has too little players");
    require(_players.length <= maxTeamSize, "Team has too many players");
    require(teamCount < requiredTeamCount, "Tourament is full");
    require(teams[_teamName].length == 0, "Team name already registered");
    for (uint256 i = 0; i < _players.length; i++) {
      teams[_teamName].push(_players[i]);
    }
    teamNames.push(_teamName);
    teamCount++;
  }

  // Removes team from tournament, can be done when tournament is closed
  function unregister(string calldata _teamName) external {
    require(teamCount > 0, "There are no registered teams");
    for (uint256 i = 0; i < teams[_teamName].length; i++) {
      teams[_teamName].pop();
    }
    teamCount--;
  }

  /** Closes tournament to new registrations */
  function closeRegisteration() public {
    require(msg.sender == host, "Only host can close tournament");
    require(requiredTeamCount <= teamCount, "Not enough teams");
    open = false;
  }

  /** Creates a game  */
  function createGameContracts(
    string calldata _externalGameId,
    string calldata _redTeamName,
    string calldata _blueTeamName
  ) external {
    Game memory game = Game({
      externalGameId: _externalGameId,
      redTeamName: _redTeamName,
      blueTeamName: _blueTeamName,
      winner: ""
    });
    externalGameIdToGamesIndex[_externalGameId] = gameIndex;
    games.push(game);
    gameIndex++;
  }

  /** Resolves game and calculates the game result */
  function resolveGame(string calldata _externalGameId)
    public
    returns (string memory)
  {
    // TODO(rdiao) handle tournament team withdrawing
    uint256 _gameIndex = externalGameIdToGamesIndex[_externalGameId];
    // TODO(rdiao) determine winner by randomiser
    games[_gameIndex].winner = games[_gameIndex].blueTeamName;
    return games[_gameIndex].blueTeamName;
  }

  // Complete and calculates tournament
  function completeTournament() external view returns (string memory) {
    require(!open, "Tournament registration is open");
    return teamNames[0];
  }

  // ----- GETTERS / SETTERS -----
  function getPassword() external view returns (string memory) {
    require(msg.sender == host, "Only host can see password");
    return password;
  }

  function isPasswordRequired() external view returns (bool) {
    bytes memory _passwordBytes = bytes(password);
    return _passwordBytes.length != 0;
  }

  function getOpen() external view returns (bool) {
    return open;
  }

  function getMinTeamSize() external view returns (uint256) {
    return minTeamSize;
  }

  function getMaxTeamSize() external view returns (uint256) {
    return maxTeamSize;
  }

  function getRequiredTeamCount() external view returns (uint256) {
    return requiredTeamCount;
  }


  function getTeamCount() external view returns (uint256) {
    return teamCount;
  }

  function getTeam(string calldata _teamName)
    external
    view
    returns (Player[] memory)
  {
    return teams[_teamName];
  }

  function getTeamNames() external view returns (string[] memory) {
    return teamNames;
  }
}
