import express from "express";
import oracledb from "oracledb";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

const dbConfig = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  connectString: process.env.DB_CONNECT
};

app.get("/", (req, res) => {
  res.send("API Oracle funcionando 🚀");
});

/* busca pedidos */
app.get("/pedidos", async (req, res) => {
  const { dataInicio, dataFim, codcli } = req.query;

  try {
    const connection = await oracledb.getConnection(dbConfig);

    let sql = `
      SELECT
        ped.codfilial,
        ped.data,
        ped.codcli,
        cli.cliente,
        ped.numped,
        ped.totpeso,
        ped.numitens,
        ped.vltotal
      FROM pcpedc ped
      JOIN pcclient cli
        ON cli.codcli = ped.codcli
      WHERE TRUNC(ped.data) BETWEEN TO_DATE(:dataInicio,'YYYY-MM-DD')
      AND TO_DATE(:dataFim,'YYYY-MM-DD')
    `;

    let binds = { dataInicio, dataFim };

    if (codcli) {
      sql += " AND ped.codcli = :codcli";
      binds.codcli = Number(codcli);
    }

    sql += " ORDER BY ped.data DESC";

    const result = await connection.execute(
      sql,
      binds,
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );

    await connection.close();
    res.json(result.rows);

  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: err.message });
  }
});

/* busca itens do pedido */
app.get("/pedido/:numped/itens", async (req, res) => {

  const numped = req.params.numped;

  try {
    const connection = await oracledb.getConnection(dbConfig);

    const result = await connection.execute(`
      SELECT
        i.codprod,
        p.descricao,
        i.qt,
        i.ptabela,
        i.perdesc,
        i.pvenda,
        ROUND(i.qt * i.pvenda, 2) vltotalitem,
        ROUND(i.perdesc, 2) perdesc_formatado,
        i.tipoentrega,
        i.codfilialretira
      FROM pcpedi i
      JOIN pcprodut p
        ON p.codprod = i.codprod
      WHERE i.numped = :numped
    `,
    [numped],
    { outFormat: oracledb.OUT_FORMAT_OBJECT });

    await connection.close();

    res.json(result.rows);

  } catch (err) {

    console.error(err);

    res.status(500).json({
      erro: "Erro ao buscar itens do pedido"
    });

  }

});

app.listen(3000, () => {
  console.log("Servidor rodando na porta 3000 🚀");
});

/* 146519 CODCLI para testes -> Guilherme */