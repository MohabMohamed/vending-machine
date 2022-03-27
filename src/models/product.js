const db = require('../db')
const { DataTypes } = require('sequelize')

const Product = db.sequelize.define('Product', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    productName: {
        type: DataTypes.STRING(20),
        allowNull: false
    },
    amountAvailable: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
    },
    cost: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
    },
    sellerId: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
})

Product.associate = models => {
    Product.belongsTo(models.User, {
        foreignKey: 'sellerId',
        as: 'seller',
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
    })
}

module.exports = Product