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

  const moeda = (valor) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL"
    }).format(valor);
  };

  const porcentagem = (valor) => {
    return `${Number(valor).toFixed(2)} %`;
  };

  const formatarDataHora = (data) => {
    if (!data) return "";

    const d = new Date(data);

    return d.toLocaleString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  const buscarPedidos = async () => {
    let url = `http://localhost:3000/pedidos?dataInicio=${dataInicio}&dataFim=${dataFim}`;
    if (codcli) {
      url += `&codcli=${codcli}`;
    }
    const res = await fetch(url);
    const contentType = res.headers.get("content-type") || "";

    if (!res.ok) {
      const body = await res.text(); // pra ver o erro real respondendo em HTML
      throw new Error(`HTML -> ${res.status} - ${body}`);
    }

    if (!contentType.includes("application/json")) {
      const body = await res.text();
      throw new Error(`não é JSON. Content-Type=${contentType}. Body=${body}`);
    }

    const data = await res.json();
    setPedidos(data);
    setItens([]);
  };

  const carregarItens = async (numped) => {

    const resItens = await fetch(`http://localhost:3000/pedido/${numped}/itens`);
    const dataItens = await resItens.json();

    setItens(dataItens);
  };

  return (
    <Container maxWidth={false} sx={{ backgroundColor: "#332C2C", minHeight: "100vh", display: "grid",alignContent: "center", justifyContent: "center" }}>
      <h2 style={{color: "#ffffff", background: "linear-gradient(90deg, #F36F21, #EC008C)", padding: "10px"}}>
        Consulta de Pedidos
      </h2>
      <div style={{ display: "flex", gap: 10, marginBottom: 20, marginTop: 40 }}>

        <TextField
          type="date"
          label="Data de Início"
          InputLabelProps={{ shrink: true }}
          value={dataInicio}
          onChange={(e) => setDataInicio(e.target.value)}
          sx={{
            "& .MuiOutlinedInput-root": {
            "& fieldset": {
              borderColor: "#ffffff"
            },
            "&:hover fieldset": {
              borderColor: "#ffffff"
            },
            "&.Mui-focused fieldset": {
              borderColor: "#ffffff"
            }
            },
            "& label": {
              color: "#ffffff"
            },
            "& input": {
              color: "#ffffff"
            },
            "& input::-webkit-calendar-picker-indicator": {
              filter: "invert(0)"
            }
          }}
        />

        <TextField
          type="date"
          label="Data do Fim"
          InputLabelProps={{ shrink: true }}
          value={dataFim}
          onChange={(e) => setDataFim(e.target.value)}
          sx={{
            "& .MuiOutlinedInput-root": {
              "& fieldset": {
                borderColor: "#ffffff"
              },
              "&:hover fieldset": {
                borderColor: "#ffffff"
              },
              "&.Mui-focused fieldset": {
                borderColor: "#ffffff"
              }
              },
              "& label": {
                color: "#ffffff"
              },
              "& input": {
                color: "#ffffff"
              },
              "& input::-webkit-calendar-picker-indicator": {
                filter: "invert(0)"
              }
          }}
        />

        <TextField
          label="Código Cliente"
          value={codcli}
          onChange={(e) => setCodcli(e.target.value)}
          sx={{
            "& .MuiOutlinedInput-root": {
              "& fieldset": {
                borderColor: "#ffffff"
              },
              "&:hover fieldset": {
                borderColor: "#ffffff"
              },
              "&.Mui-focused fieldset": {
                borderColor: "#ffffff"
              },
              },
              "& label": {
                color: "#ffffff"
              },
              "& input": {
                color: "#ffffff"
              },
              "& input::-webkit-calendar-picker-indicator": {
                filter: "invert(1)"
              }
            }}
        />

        <Button variant="contained" onClick={buscarPedidos} style={{ background: "linear-gradient(90deg, #F36F21, #EC008C)"}}>
          <b style={{ color: "#ffffff" }}>Procurar</b>
        </Button> 
      </div>

      <h3 style={{ marginTop: 40, color: "#ffffff", background: "linear-gradient(90deg, #F36F21, #EC008C)", padding:"10px"}}>Cliente</h3>
      <Table>

        <TableHead>
          <TableRow>
            <TableCell style={{ color: "#ffffff" }}>Código Cliente</TableCell>
            <TableCell style={{ color: "#ffffff" }}>Nome Cliente</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {pedidos.length > 0 && (
            <TableRow>
              <TableCell style={{ color: "#ffffff" }}>{pedidos[0].CODCLI}</TableCell>
              <TableCell style={{ color: "#ffffff" }}>{pedidos[0].CLIENTE}</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      <h3 style={{ marginTop: 40, color: "#ffffff", background: "linear-gradient(90deg, #F36F21, #EC008C)", padding:"10px"}}>Pedidos</h3>
      <Table>
        <TableHead>
          <TableRow>

            <TableCell style={{ color: "#ffffff" }}>Código Filial</TableCell>
            <TableCell style={{ color: "#ffffff" }}>Código Pedido</TableCell>
            <TableCell style={{ color: "#ffffff" }}>Total Peso</TableCell>
            <TableCell style={{ color: "#ffffff" }}>Data</TableCell> 
            <TableCell style={{ color: "#ffffff" }}>Cliente</TableCell>
            <TableCell style={{ color: "#ffffff" }}>Itens</TableCell>
            <TableCell style={{ color: "#ffffff" }}>Valor</TableCell>

          </TableRow>

        </TableHead>
        <TableBody>

          {pedidos.map((p, i) => (

            <TableRow
              key={i}
              hover
              style={{ cursor: "pointer" }}
              onClick={() => carregarItens(p.NUMPED)}>
              
              <TableCell style={{ color: "#ffffff" }}>{p.CODFILIAL}</TableCell>
              <TableCell style={{ color: "#ffffff" }}>{p.NUMPED}</TableCell>
              <TableCell style={{ color: "#ffffff" }}>{p.TOTPESO}</TableCell>
              <TableCell style={{ color: "#ffffff" }}>{formatarDataHora(p.DATA)}</TableCell> 
              <TableCell style={{ color: "#ffffff" }}>{p.CODCLI}</TableCell>
              <TableCell style={{ color: "#ffffff" }}>{p.NUMITENS}</TableCell>
              <TableCell style={{ color: "#ffffff" }}>{moeda(p.VLTOTAL)}</TableCell>

            </TableRow>
          ))}

        </TableBody>
      </Table>

      <h3 style={{ marginTop: 40, color: "#ffffff", background: "linear-gradient(90deg, #F36F21, #EC008C)", padding:"10px" }}>Produtos do Pedido</h3>

      <Table>
        <TableHead>
          <TableRow>

            <TableCell style={{ color: "#ffffff" }}>Código Filial</TableCell>
            <TableCell style={{ color: "#ffffff" }}>Código Produto</TableCell>
            <TableCell style={{ color: "#ffffff" }}>Descrição</TableCell>
            <TableCell style={{ color: "#ffffff" }}>Quantidade</TableCell>
            <TableCell style={{ color: "#ffffff" }}>Preço Tabela</TableCell>
            <TableCell style={{ color: "#ffffff" }}>Tipo de Entrega</TableCell>
            <TableCell style={{ color: "#ffffff" }}>% Desc</TableCell>
            <TableCell style={{ color: "#ffffff" }}>Preço Venda</TableCell>

          </TableRow>
        </TableHead>

        <TableBody>

          {itens.map((i, index) => (

            <TableRow key={index}>

              <TableCell style={{ color: "#ffffff" }}>{i.CODFILIALRETIRA}</TableCell>
              <TableCell style={{ color: "#ffffff" }}>{i.CODPROD}</TableCell>
              <TableCell style={{ color: "#ffffff" }}>{i.DESCRICAO}</TableCell>
              <TableCell style={{ color: "#ffffff" }}>{i.QT}</TableCell>
              <TableCell style={{ color: "#ffffff" }}>{moeda(i.PTABELA)}</TableCell>
              <TableCell style={{ color: "#ffffff" }}>{i.TIPOENTREGA}</TableCell>
              <TableCell style={{ color: "#ffffff" }}>{porcentagem(i.PERDESC)}</TableCell>
              <TableCell style={{ color: "#ffffff" }}>{moeda(i.PVENDA)}</TableCell>

            </TableRow>
          ))}
        </TableBody>
      </Table>

    </Container>
  );
}

export default App;