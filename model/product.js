const Sequelize = require("sequelize");
const {DataTypes} = Sequelize;

module.exports=(database, Sequelize)=>{

    return database.define("product", {
        name: DataTypes.STRING,
        harga_jual: DataTypes.STRING,
        harga_beli: DataTypes.STRING,
        stok: DataTypes.STRING,
        image: DataTypes.STRING,
        url: DataTypes.STRING,
        createdAt: {
            type: Sequelize.DATE,
            field: 'created_at',
          },
          updatedAt: {
            type: Sequelize.DATE,
            field: 'updated_at'
          }
    })
}