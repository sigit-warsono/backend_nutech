const Sequelize = require("sequelize");
const {Op} = Sequelize;
const path = require("path");
const fs = require("fs");
const db = require("../model");
const Product = db.product;

exports.getProducts = async(req, res) => {
    const page = parseInt(req.query.page) || 0;
  const limit = parseInt(req.query.limit) || 4;
  const search = req.query.search_query || "";
  const filter = req.query.filter || "DESC";

    console.log(filter);
    console.log("sigit")
  const offset = limit * page;
  const totalRows = await Product.count({
    where: {
      [Op.or]: [
        {
          name: {
            [Op.like]: "%" + search + "%",
          },
        },
      ],
    },
  });
  const varTotalRows = 0;
  const totalPage = Math.ceil(totalRows / limit);

  if (filter==="HighLow") {
    const result = await Product.findAll({
      where: {
        [Op.or]: [
          {
            name: {
              [Op.like]: "%" + search + "%",
            },
          },
        ],
      },
      offset: offset,
      limit: limit,
      order: [["harga_jual", "DESC"]],
    });
    res.json({
      result: result,
      page: page,
      limit: limit,
      totalRows: totalRows,
      totalPage: totalPage,
    });
    
  } else if (filter==="LowHigh") {
    const result = await Product.findAll({
      where: {
        [Op.or]: [
          {
            name: {
              [Op.like]: "%" + search + "%",
            },
          },
        ],
      },
      offset: offset,
      limit: limit,
      order: [["harga_jual", "ASC"]],
    });
    res.json({
      result: result,
      page: page,
      limit: limit,
      totalRows: totalRows,
      totalPage: totalPage,
    });

  }else{
    const result = await Product.findAll({
      where: {
        [Op.or]: [
          {
            name: {
              [Op.like]: "%" + search + "%",
            },
          },
        ],
      },
      offset: offset,
      limit: limit,
      order: [["id", filter]],
    });
    res.json({
      result: result,
      page: page,
      limit: limit,
      totalRows: totalRows,
      totalPage: totalPage,
    });
  }

  

  };

  exports.getProductById = async (req, res) => {
    try {
      const response = await Product.findOne({
        where: {
          id: req.params.id,
        },
      });
      res.json(response);
    } catch (error) {
      console.log(error.message);
    }
  };

  exports.saveProduct = (req, res) => {
    if (req.files === null)
      return res.status(400).json({ msg: "No File Uploaded" });
    const name = req.body.title;
    const harga_beli = req.body.harga_beli;
    const resHarga_beli = harga_beli.replace(/\D/g, "");
    const harga_jual = req.body.harga_jual;
    const resHarga_jual = harga_jual.replace(/\D/g, "");
    const stok = req.body.stok;
    const resStok = stok.replace(/\D/g, "");
    const file = req.files.file;
    const fileSize = file.data.length;
    const ext = path.extname(file.name);
    const fileName = file.md5 + Date.now() + ext;
    const url = `${req.protocol}://${req.get("host")}/images/${fileName}`;
    const allowedType = [".png", ".jpg"];
  
    if (!allowedType.includes(ext.toLowerCase()))
      return res.status(422).json({ msg: "Invalid_Images" });
    if (fileSize >= 100000)
      return res.status(422).json({ msg: "Max_image" });
  
    file.mv(`./public/images/${fileName}`, async (err) => {
      if (err) return res.status(500).json({ msg: err.message });
      try {
        await Product.create({
          name: name,
          harga_beli: resHarga_beli,
          harga_jual: resHarga_jual,
          stok: resStok,
          image: fileName,
          url: url,
        });
        res.status(201).json({ msg: "Product Created Successfuly" });
      } catch (error) {
        console.log(error.message);
        return res.status(404).json({ message: "Image_Unique" });
        
      }
    });
  };
  
  exports.updateProduct = async (req, res) => {
    const product = await Product.findOne({
      where: {
        id: req.params.id,
      },
    });
    if (!product) return res.status(404).json({ msg: "No Data Found" });
  
    let fileName = "";
    if (req.files === null) {
      fileName = product.image;
    } else {
      const file = req.files.file;
      const fileSize = file.data.length;
      const ext = path.extname(file.name);
      fileName = file.md5 + ext;
      const allowedType = [".png", ".jpg"];
  
      if (!allowedType.includes(ext.toLowerCase()))
        return res.status(404).json({ msg: "Invalid Images" });
      if (fileSize > 5000000)
        return res.status(404).json({ msg: "Image must be less than 5 MB" });
  
      const filepath = `./public/images/${product.image}`;
      fs.unlinkSync(filepath);
  
      file.mv(`./public/images/${fileName}`, (err) => {
        if (err) return res.status(500).json({ msg: err.message });
      });
    }
    const name = req.body.title;
    const harga_beli = req.body.harga_beli;
    const harga_jual = req.body.harga_jual;
    const stok = req.body.stok;
    const url = `${req.protocol}://${req.get("host")}/images/${fileName}`;
  
    try {
      await Product.update(
        {
          name: name,
          image: fileName,
          harga_beli: harga_beli,
          harga_jual: harga_jual,
          stok: stok,
          url: url,
        },
        {
          where: {
            id: req.params.id,
          },
        }
      );
      res.status(200).json({ msg: "Product Updated Successfuly" });
    } catch (error) {
      console.log(error.message);
      
    }
  };
  
  exports.deleteProduct = async (req, res) => {
    const product = await Product.findOne({
      where: {
        id: req.params.id,
      },
    });
    if (!product) return res.status(404).json({ msg: "No Data Found" });
  
    try {
      const filepath = `./public/images/${product.image}`;
      fs.unlinkSync(filepath);
      await Product.destroy({
        where: {
          id: req.params.id,
        },
      });
      res.status(200).json({ msg: "Product Deleted Successfuly" });
    } catch (error) {
      console.log(error.message);
    }
  };
  