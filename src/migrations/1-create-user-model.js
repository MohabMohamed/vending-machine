'use strict'

var Sequelize = require('sequelize')

/**
 * Actions summary:
 *
 * createTable "User", deps: []
 *
 **/

var info = {
  revision: 1,
  name: 'create-user-model',
  created: '2022-03-27T01:43:44.707Z',
  comment: ''
}

var migrationCommands = function (transaction) {
  return [
    {
      fn: 'createTable',
      params: [
        'User',
        {
          id: {
            type: Sequelize.INTEGER,
            field: 'id',
            autoIncrement: true,
            primaryKey: true
          },
          username: {
            type: Sequelize.STRING(20),
            field: 'username',
            allowNull: false,
            unique: true
          },
          password: {
            type: Sequelize.STRING,
            field: 'password',
            allowNull: false
          },
          deposit: {
            type: Sequelize.INTEGER,
            field: 'deposit',
            allowNull: false,
            defaultValue: 0
          },
          role: {
            type: Sequelize.ENUM('buyer', 'seller'),
            field: 'role'
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
        'User',
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
