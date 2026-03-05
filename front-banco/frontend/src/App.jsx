import { useState } from "react";
import {
  Container,
  TextField,
  Button,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody
} from "@mui/material";

function App() {

  const [dataInicio, setDataInicio] = useState("");
  const [dataFim, setDataFim] = useState("");
  const [codcli, setCodcli] = useState("");

  const [pedidos, setPedidos] = useState([]);
  const [itens, setItens] = useState([]);

  const buscarPedidos = async () => {

    let url = `http://localhost:3000/pedidos?dataInicio=${dataInicio}&dataFim=${dataFim}`;

    if (codcli) {
      url += `&codcli=${codcli}`;
    }

    const res = await fetch(url);

    const contentType = res.headers.get("content-type") || "";

    if (!res.ok) {
      const body = await res.text(); // pra ver o HTML/erro real
      throw new Error(`HTTP ${res.status} - ${body}`);
    }

    if (!contentType.includes("application/json")) {
      const body = await res.text();
      throw new Error(`Resposta não é JSON. Content-Type=${contentType}. Body=${body}`);
    }

    const data = await res.json();

    setPedidos(data);
    setItens([]);

  };

  const carregarItens = async (numped) => {

    const res = await fetch(`http://localhost:3000/pedido/${numped}/itens`);
    const data = await res.json();

    setItens(data);

  };

  return (

    <Container>

      <h2>Consulta de Pedidos</h2>

      <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>

        <TextField
          type="date"
          label="Data de Início"
          InputLabelProps={{ shrink: true }}
          value={dataInicio}
          onChange={(e) => setDataInicio(e.target.value)}
        />

        <TextField
          type="date"
          label="Data do Fim"
          InputLabelProps={{ shrink: true }}
          value={dataFim}
          onChange={(e) => setDataFim(e.target.value)}
        />

        <TextField
          label="Código Cliente"
          value={codcli}
          onChange={(e) => setCodcli(e.target.value)}
        />

        <Button variant="contained" onClick={buscarPedidos}>
          Procurar
        </Button> 

      </div>

      <h3>Pedidos</h3>

      <Table>

        <TableHead>

          <TableRow>

            <TableCell>Pedido</TableCell>
            <TableCell>Data</TableCell>
            <TableCell>Cliente</TableCell>
            <TableCell>Itens</TableCell>
            <TableCell>Valor</TableCell>

          </TableRow>

        </TableHead>

        <TableBody>

          {pedidos.map((p, i) => (

            <TableRow
              key={i}
              hover
              style={{ cursor: "pointer" }}
              onClick={() => carregarItens(p.NUMPED)}
            >

              <TableCell>{p.NUMPED}</TableCell>
              <TableCell>{p.DATA}</TableCell>
              <TableCell>{p.CODCLI}</TableCell>
              <TableCell>{p.NUMITENS}</TableCell>
              <TableCell>{p.VLTOTAL}</TableCell>

            </TableRow>

          ))}

        </TableBody>

      </Table>

      <h3 style={{ marginTop: 40 }}>Produtos do Pedido</h3>

      <Table>

        <TableHead>

          <TableRow>

            <TableCell>Produto</TableCell>
            <TableCell>Descrição</TableCell>
            <TableCell>Quantidade</TableCell>
            <TableCell>Preço</TableCell>

          </TableRow>

        </TableHead>

        <TableBody>

          {itens.map((i, index) => (

            <TableRow key={index}>

              <TableCell>{i.CODPROD}</TableCell>
              <TableCell>{i.DESCRICAO}</TableCell>
              <TableCell>{i.QT}</TableCell>
              <TableCell>{i.PVENDA}</TableCell>

            </TableRow>

          ))}

        </TableBody>

      </Table>

    </Container>

  );
}

export default App;