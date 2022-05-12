//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "hardhat/console.sol";

contract Tournament {
    struct Player {
        address wallet;
        // Unique identification for game
        string gameId;
    }

    // TODO: change to private w/ getters
    uint256 private minTeamSize;
    uint256 private maxTeamSize;
    uint256 private teamLimit;
    uint256 private teamCount = 0;
    mapping(string => Player[]) private teams;

    constructor(
        uint256 _minTeamSize,
        uint256 _maxTeamSize,
        uint256 _teamLimit
    ) {
        require(_minTeamSize <= _maxTeamSize, "Invalid team sizes");
        minTeamSize = _minTeamSize;
        maxTeamSize = _maxTeamSize;
        teamLimit = _teamLimit;
    }

    // Adds team to tournament
    function register(string calldata _teamName, Player[] calldata _players)
        external
    {
        // FIXME: check if team exists. 
        require(_players.length >= minTeamSize, "Team has too little players");
        require(_players.length <= maxTeamSize, "Team has too many players");
        require(teamCount < teamLimit, "Tourament is full");
        require(teams[_teamName].length == 0, "Team name already registered");
        for (uint i = 0; i < _players.length; i++) {
            teams[_teamName].push(_players[i]);
        }
        teamCount++;
    }

    // Removes team from tournament
    function unregister(string calldata _teamName) external {
        for (uint i = 0; i < teams[_teamName].length; i++) {
            teams[_teamName].pop();
        }
        teamCount--;
    }

    // Confirm registered teams are correct, and commences tournament
    function confirm() external {
        createGameContracts();
    }

    // Create contracts to track each game in the tournament
    function createGameContracts() private {}

    // Complete and calculates tournament
    function complete() external {}

    // ----- GETTERS -----

    function getMinTeamSize() external view returns (uint256) {
        return minTeamSize;
    }

    function getMaxTeamSize() external view returns (uint256) {
        return maxTeamSize;
    }

    function getTeamLimit() external view returns (uint256) {
        return teamLimit;
    }

    function getTeamCount() external view returns (uint256) {
        return teamCount;
    }

    function getTeam(string calldata _teamName) external view returns (Player[] memory){
        return teams[_teamName];
    }
}
