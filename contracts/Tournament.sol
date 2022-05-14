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
  
  address private host;
  bool private open = true;
  uint256 private minTeamSize;
  uint256 private maxTeamSize;
  uint256 private minTeamCount;
  uint256 private maxTeamCount;
  uint256 private teamCount = 0;
  string[] private teamNames;
  mapping(string => Player[]) private teams;
  mapping(string => uint256) private externalGameIdToGamesIndex;
  uint256 private gameIndex = 0;
  Game[] private games;
  string[] private winner;

  /** Create tournament with contract caller as host */
  constructor(
    uint256 _minTeamSize,
    uint256 _maxTeamSize,
    uint256 _minTeamCount,
    uint256 _maxTeamCount
  ) {
    require(_minTeamSize <= _maxTeamSize, "Invalid team size limit");
    require(_minTeamCount <= _maxTeamCount, "Invalid team count limit");
    minTeamSize = _minTeamSize;
    maxTeamSize = _maxTeamSize;
    minTeamCount = _minTeamCount;
    maxTeamCount = _maxTeamCount;
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
    require(teamCount < maxTeamCount, "Tourament is full");
    require(teams[_teamName].length == 0, "Team name already registered");
    for (uint256 i = 0; i < _players.length; i++) {
      teams[_teamName].push(_players[i]);
    }
    teamNames.push(_teamName);
    teamCount++;
  }

  // Removes team from tournament, can be done when tournament is closed
  function unregister(string calldata _teamName) external {
    for (uint256 i = 0; i < teams[_teamName].length; i++) {
      teams[_teamName].pop();
    }
    teamCount--;
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

  /** Closes tournament to new registrations */
  function closeRegisteration() public {
    require(msg.sender == host, "Only host can close tournament");
    require(minTeamCount <= teamCount, "Not enough teams");
    require(maxTeamCount > teamCount, "Too many teams"); // Should never trigger since there's a check during register()
    open = false;
  }

  // ----- GETTERS / SETTERS -----

  function getOpen() external view returns (bool) {
    return open;
  }

  function getMinTeamSize() external view returns (uint256) {
    return minTeamSize;
  }

  function getMaxTeamSize() external view returns (uint256) {
    return maxTeamSize;
  }

  function getMinTeamCount() external view returns (uint256) {
    return minTeamCount;
  }

  function getMaxTeamCount() external view returns (uint256) {
    return maxTeamCount;
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
}
