import express from "express";
import oracledb from "oracledb";
import cors from "cors";

const app = express();

app.use(cors());
app.use(express.json());

const dbConfig = {
  user: "SISTEMA",
  password: "SISTEMA",
  connectString: "192.168.0.188/WINT"
};

/* TESTE */

app.get("/", (req, res) => {
  res.send("API Oracle funcionando 🚀");
});

/* BUSCAR PEDIDOS */

app.get("/pedidos", async (req, res) => {

  const { dataInicio, dataFim, codcli } = req.query;

  try {

    const connection = await oracledb.getConnection(dbConfig);

    let sql = `
      SELECT
        codfilial,
        data,
        codcli,
        numped,
        totpeso,
        numitens,
        vltotal
      FROM pcpedc
      WHERE data BETWEEN TO_DATE(:dataInicio,'YYYY-MM-DD')
      AND TO_DATE(:dataFim,'YYYY-MM-DD')
    `;

    let binds = {
      dataInicio,
      dataFim
    };

    if (codcli) {
      sql += " AND codcli = :codcli";
      binds.codcli = codcli;
    }

    sql += " ORDER BY data DESC";

    const result = await connection.execute(
      sql,
      binds,
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );

    await connection.close();

    res.json(result.rows);

  } catch (err) {

    console.error(err);

    res.status(500).json({ erro: "Erro ao buscar pedidos" });

  }

});

/* BUSCAR ITENS DO PEDIDO */

app.get("/pedido/:numped/itens", async (req, res) => {

  const numped = req.params.numped;

  try {

    const connection = await oracledb.getConnection(dbConfig);

    const result = await connection.execute(
      `
      SELECT
        i.codprod,
        p.descricao,
        i.qt,
        i.ptabela,
        i.perdesc,
        i.pvenda,
        i.tipoentrega,
        i.codfilialretira
      FROM pcpedi i
      JOIN pcprodut p
        ON p.codprod = i.codprod
      WHERE i.numped = :numped
      `,
      [numped],
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );

    await connection.close();

    res.json(result.rows);

  } catch (err) {

    console.error(err);

    res.status(500).json({ erro: "Erro ao buscar itens do pedido" });

  }

});

app.listen(3000, () => {
  console.log("Servidor rodando na porta 3000 🚀");
});