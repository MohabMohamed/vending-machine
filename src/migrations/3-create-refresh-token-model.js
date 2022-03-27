'use strict'

var Sequelize = require('sequelize')

/**
 * Actions summary:
 *
 * createTable "RefreshToken", deps: [User]
 *
 **/

var info = {
  revision: 3,
  name: 'create-refresh-token-model',
  created: '2022-03-27T11:57:16.841Z',
  comment: ''
}

var migrationCommands = function (transaction) {
  return [
    {
      fn: 'createTable',
      params: [
        'RefreshToken',
        {
          id: {
            type: Sequelize.INTEGER,
            field: 'id',
            autoIncrement: true,
            primaryKey: true
          },
          userId: {
            type: Sequelize.INTEGER,
            onUpdate: 'cascade',
            onDelete: 'cascade',
            references: {
              model: 'User',
              key: 'id'
            },
            field: 'userId',
            allowNull: false
          },
          token: {
            type: Sequelize.STRING(400),
            field: 'token',
            allowNull: false
          },
          createdAt: {
            type: Sequelize.DATE,
            field: 'createdAt',
            allowNull: false
          },
          updatedAt: {
            type: Sequelize.DATE,
            field: 'updatedAt',
            allowNull: false
          }
        },
        {
          transaction: transaction
        }
      ]
    }
  ]
}
var rollbackCommands = function (transaction) {
  return [
    {
      fn: 'dropTable',
      params: [
        'RefreshToken',
        {
          transaction: transaction
        }
      ]
    }
  ]
}

module.exports = {
  pos: 0,
  useTransaction: true,
  execute: function (queryInterface, Sequelize, _commands) {
    var index = this.pos
    function run (transaction) {
      const commands = _commands(transaction)
      return new Promise(function (resolve, reject) {
        function next () {
          if (index < commands.length) {
            let command = commands[index]
            console.log('[#' + index + '] execute: ' + command.fn)
            index++
            queryInterface[command.fn]
              .apply(queryInterface, command.params)
              .then(next, reject)
          } else resolve()
        }
        next()
      })
    }
    if (this.useTransaction) {
      return queryInterface.sequelize.transaction(run)
    } else {
      return run(null)
    }
  },
  up: function (queryInterface, Sequelize) {
    return this.execute(queryInterface, Sequelize, migrationCommands)
  },
  down: function (queryInterface, Sequelize) {
    return this.execute(queryInterface, Sequelize, rollbackCommands)
  },
  info: info
}
