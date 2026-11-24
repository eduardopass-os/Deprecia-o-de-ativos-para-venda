import React, { useState } from "react";
import { Printer, Plus, Trash2, Search, Calculator, AlertTriangle, CheckCircle2 } from "lucide-react";

interface AvariaItem {
  id: string;
  nome: string;
  custo: number;
  ativo: boolean;
}

const AMBIENTES_SEVERIDADE = [
  { label: "Normal - Construção Civil Leve (Fs = 1,00)", fs: 1.0 },
  { label: "Terraplanagem Pesada / Mineração (Fs = 1,15)", fs: 1.15 },
  { label: "Fertilizantes - Corrosão Leve (Fs = 1,20)", fs: 1.2 },
  { label: "Fertilizantes - Corrosão Moderada (Fs = 1,35)", fs: 1.35 },
  { label: "Fertilizantes - Corrosão Severa (Fs = 1,50)", fs: 1.5 },
];

export default function Index() {
  const [modelo, setModelo] = useState("Retroescavadeira JCB 3CX 4x4");
  const [ano, setAno] = useState<number>(2019);
  const [chassi, setChassi] = useState("S0R3CXTTCK2740752");
  const [horimetro, setHorimetro] = useState<number>(4495);

  const [vMercado, setVMercado] = useState<number>(235000);
  const [vResidual, setVResidual] = useState<number>(50000);
  const [vidaUtil, setVidaUtil] = useState<number>(10000);
  const [fatorFs, setFatorFs] = useState<number>(1.35);
  const [buscandoWeb, setBuscandoWeb] = useState(false);
  const [fontesWeb, setFontesWeb] = useState<string[]>([
    "MF Rural (2019 / 4.500h): R$ 240.000",
    "Caminhões e Carretas (2019 / 4.257h): R$ 230.000",
    "Mercado Livre (2019 Cabine Fechada): R$ 235.000",
  ]);

  const [avarias, setAvarias] = useState<AvariaItem[]>([
    { id: "1", nome: "Tratamento de Ferrugem / Pintura PU", custo: 20000, ativo: true },
    { id: "2", nome: "Reparo Sistema Ar-Condicionado (Condensador)", custo: 5500, ativo: true },
    { id: "3", nome: "Revisão Cilindro Hidráulico (Vazamento)", custo: 4250, ativo: true },
    { id: "4", nome: "Alavanca Seletora / Chicote Oxidado", custo: 2350, ativo: true },
    { id: "5", nome: "Reposição Grade Frontal Completa", custo: 2650, ativo: true },
    { id: "6", nome: "Substituição de Pneus / Material Rodante", custo: 12000, ativo: false },
  ]);

  const [novaAvariaNome, setNovaAvariaNome] = useState("");
  const [novaAvariaCusto, setNovaAvariaCusto] = useState<number>(0);

  const formatBRL = (val: number) =>
    val.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

  const hEquivalente = horimetro * fatorFs;
  let depreciacaoSeveridade = 0;

  if (hEquivalente >= vidaUtil) {
    depreciacaoSeveridade = Math.max(0, vMercado - vResidual);
  } else if (vidaUtil > horimetro) {
    depreciacaoSeveridade =
      (vMercado - vResidual) * ((hEquivalente - horimetro) / (vidaUtil - horimetro));
  }

  const valorBaseAjustado = Math.max(0, vMercado - depreciacaoSeveridade);

  const avariasAtivas = avarias.filter((a) => a.ativo);
  const totalReforma = avariasAtivas.reduce((acc, item) => acc + item.custo, 0);

  const valorFinalJusto = Math.max(0, valorBaseAjustado - totalReforma);
  const pisoNegociacao = valorFinalJusto * 0.95;
  const tetoNegociacao = valorFinalJusto * 1.05;

  const toggleAvaria = (id: string) => {
    setAvarias((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ativo: !item.ativo } : item))
    );
  };

  const updateCustoAvaria = (id: string, novoCusto: number) => {
    setAvarias((prev) =>
      prev.map((item) => (item.id === id ? { ...item, custo: novoCusto } : item))
    );
  };

  const adicionarAvaria = () => {
    if (!novaAvariaNome.trim() || novaAvariaCusto <= 0) return;
    setAvarias((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        nome: novaAvariaNome.trim(),
        custo: novaAvariaCusto,
        ativo: true,
      },
    ]);
    setNovaAvariaNome("");
    setNovaAvariaCusto(0);
  };

  const removerAvaria = (id: string) => {
    setAvarias((prev) => prev.filter((item) => item.id !== id));
  };

  const handleBuscarMercadoWeb = async () => {
    setBuscandoWeb(true);
    setTimeout(() => {
      setBuscandoWeb(false);
    }, 800);
  };

  return (
    <div className="min-h-screen bg-slate-100 p-4 md:p-8 text-slate-800 print:bg-white print:p-0">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 print:block">
        <div className="lg:col-span-6 space-y-6 print:hidden">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center gap-2 border-b-2 border-amber-500 pb-2 mb-4">
              <Calculator className="w-5 h-5 text-amber-600" />
              <h2 className="font-bold text-slate-800 uppercase tracking-wide text-sm">
                1. Identificação e Referência de Mercado
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  Equipamento / Modelo
                </label>
                <input
                  type="text"
                  value={modelo}
                  onChange={(e) => setModelo(e.target.value)}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-amber-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Ano</label>
                <input
                  type="number"
                  value={ano}
                  onChange={(e) => setAno(Number(e.target.value))}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-amber-500 outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  Número de Série / Chassi
                </label>
                <input
                  type="text"
                  value={chassi}
                  onChange={(e) => setChassi(e.target.value)}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm font-mono focus:ring-2 focus:ring-amber-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  Horímetro Atual (h)
                </label>
                <input
                  type="number"
                  value={horimetro}
                  onChange={(e) => setHorimetro(Number(e.target.value))}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-amber-500 outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  Média Mercado (R$)
                </label>
                <input
                  type="number"
                  value={vMercado}
                  onChange={(e) => setVMercado(Number(e.target.value))}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm font-semibold text-slate-900 focus:ring-2 focus:ring-amber-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  Valor Residual (R$)
                </label>
                <input
                  type="number"
                  value={vResidual}
                  onChange={(e) => setVResidual(Number(e.target.value))}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-amber-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  Vida Útil (h)
                </label>
                <input
                  type="number"
                  value={vidaUtil}
                  onChange={(e) => setVidaUtil(Number(e.target.value))}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-amber-500 outline-none"
                />
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                Ambiente Operacional / Fator de Severidade (Fs)
              </label>
              <select
                value={fatorFs}
                onChange={(e) => setFatorFs(Number(e.target.value))}
                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm bg-white focus:ring-2 focus:ring-amber-500 outline-none"
              >
                {AMBIENTES_SEVERIDADE.map((amb) => (
                  <option key={amb.fs} value={amb.fs}>
                    {amb.label}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="button"
              onClick={handleBuscarMercadoWeb}
              disabled={buscandoWeb}
              className="w-full bg-slate-800 hover:bg-slate-900 text-white text-xs font-semibold py-2.5 px-4 rounded-lg flex items-center justify-center gap-2 transition disabled:opacity-60"
            >
              <Search className="w-4 h-4 text-amber-400" />
              {buscandoWeb ? "Consultando portais..." : "Atualizar Referências de Mercado na Rede"}
            </button>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center gap-2 border-b-2 border-amber-500 pb-2 mb-4">
              <AlertTriangle className="w-5 h-5 text-amber-600" />
              <h2 className="font-bold text-slate-800 uppercase tracking-wide text-sm">
                2. Checklist de Avarias e Reforma (C_reforma)
              </h2>
            </div>

            <div className="space-y-2 mb-4">
              {avarias.map((item) => (
                <div
                  key={item.id}
                  className={`flex items-center justify-between p-2.5 rounded-lg border transition ${
                    item.ativo
                      ? "bg-amber-50/50 border-amber-300"
                      : "bg-slate-50 border-slate-200 opacity-70"
                  }`}
                >
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <button
                      type="button"
                      onClick={() => toggleAvaria(item.id)}
                      title={item.ativo ? "Desmarcar avaria" : "Marcar avaria"}
                      className={`flex-shrink-0 w-5 h-5 rounded border flex items-center justify-center transition ${
                        item.ativo
                          ? "bg-amber-500 border-amber-500 text-slate-950"
                          : "bg-white border-slate-300"
                      }`}
                    >
                      {item.ativo && <CheckCircle2 className="w-3.5 h-3.5" />}
                    </button>
                    <span
                      className={`text-xs truncate ${
                        item.ativo ? "text-slate-800 font-medium" : "text-slate-500 line-through"
                      }`}
                    >
                      {item.nome}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 ml-3">
                    <span className="text-xs text-slate-500 font-semibold">R$</span>
                    <input
                      type="number"
                      value={item.custo}
                      onChange={(e) => updateCustoAvaria(item.id, Number(e.target.value))}
                      className="w-24 border border-slate-300 rounded px-2 py-1 text-right text-xs font-semibold bg-white"
                    />
                    <button
                      type="button"
                      onClick={() => removerAvaria(item.id)}
                      className="text-slate-400 hover:text-red-600 p-1"
                      title="Remover item"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex items-center gap-2 pt-3 border-t border-slate-200">
              <input
                type="text"
                placeholder="Nova avaria constatada..."
                value={novaAvariaNome}
                onChange={(e) => setNovaAvariaNome(e.target.value)}
                className="flex-1 border border-slate-300 rounded-lg px-3 py-1.5 text-xs"
              />
              <input
                type="number"
                placeholder="Valor R$"
                value={novaAvariaCusto || ""}
                onChange={(e) => setNovaAvariaCusto(Number(e.target.value))}
                className="w-24 border border-slate-300 rounded-lg px-2 py-1.5 text-xs text-right"
              />
              <button
                type="button"
                onClick={adicionarAvaria}
                disabled={!novaAvariaNome.trim() || novaAvariaCusto <= 0}
                className="bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1 transition disabled:opacity-40"
              >
                <Plus className="w-3.5 h-3.5" />
                Add
              </button>
            </div>

            <div className="mt-4 flex items-center justify-between bg-slate-50 rounded-lg px-3 py-2 border border-slate-200">
              <span className="text-xs font-semibold text-slate-600">Total C_reforma</span>
              <span className="text-sm font-bold text-amber-700">{formatBRL(totalReforma)}</span>
            </div>

            <button
              type="button"
              onClick={() => window.print()}
              className="w-full bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold py-3.5 px-6 rounded-xl shadow-md flex items-center justify-center gap-2 transition text-sm mt-4"
            >
              <Printer className="w-4 h-4" />
              IMPRIMIR / EXPORTAR LAUDO EM PDF
            </button>
          </div>
        </div>

        <div className="lg:col-span-6">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 md:p-8 print:shadow-none print:border-0 print:p-0">
            <div className="border-b-4 border-amber-500 pb-4 mb-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h1 className="text-xl md:text-2xl font-black text-slate-900 uppercase tracking-tight">
                    Laudo Técnico de Avaliação
                  </h1>
                  <p className="text-sm text-slate-500 mt-1">Precificação de Ativo Pesado</p>
                  <p className="text-xs text-amber-700 font-semibold mt-2">
                    Metodologia: Depreciação por Severidade Química/Operacional
                  </p>
                </div>
                <div className="text-right text-xs text-slate-500 shrink-0">
                  <p>Data: {new Date().toLocaleDateString("pt-BR")}</p>
                  <p>Categoria: Linha Amarela</p>
                </div>
              </div>
            </div>

            <div className="mb-6">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                Ficha do Ativo
              </h2>
              <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                <div>
                  <span className="block text-xs text-slate-500">Equipamento</span>
                  <p className="font-semibold">{modelo}</p>
                </div>
                <div>
                  <span className="block text-xs text-slate-500">Ano</span>
                  <p className="font-semibold">{ano}</p>
                </div>
                <div>
                  <span className="block text-xs text-slate-500">Série / Chassi</span>
                  <p className="font-mono text-xs font-semibold">{chassi}</p>
                </div>
                <div>
                  <span className="block text-xs text-slate-500">Horímetro</span>
                  <p className="font-semibold">{horimetro.toLocaleString("pt-BR")} h</p>
                </div>
              </div>
            </div>

            <div className="mb-6">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                1. Memória de Cálculo (Severidade Ambiental)
              </h2>
              <div className="bg-slate-50 rounded-lg p-4 text-xs space-y-1 border border-slate-200">
                <p>
                  <span className="font-semibold">Horas Equivalentes (Heq):</span>{" "}
                  {horimetro.toLocaleString("pt-BR")}h × {fatorFs.toFixed(2)} ={" "}
                  <span className="font-bold">{Math.round(hEquivalente).toLocaleString("pt-BR")}h</span>
                </p>
                <p className="text-slate-600 break-words">
                  Fórmula Depreciação: ({formatBRL(vMercado)} - {formatBRL(vResidual)}) × [(
                  {Math.round(hEquivalente).toLocaleString("pt-BR")} -{" "}
                  {horimetro.toLocaleString("pt-BR")}) / ({vidaUtil.toLocaleString("pt-BR")} -{" "}
                  {horimetro.toLocaleString("pt-BR")})]
                </p>
              </div>
              <table className="w-full text-sm mt-3">
                <thead>
                  <tr className="border-b border-slate-300 text-left">
                    <th className="py-2 text-xs uppercase text-slate-500">Etapa de Valoração</th>
                    <th className="py-2 text-xs uppercase text-slate-500 text-right">Valor</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-slate-100">
                    <td className="py-2">Valor Médio de Mercado (Operação Padrão)</td>
                    <td className="py-2 text-right font-semibold">{formatBRL(vMercado)}</td>
                  </tr>
                  <tr className="border-b border-slate-100">
                    <td className="py-2">
                      Deságio por Severidade Operacional (Fs = {fatorFs.toFixed(2)})
                    </td>
                    <td className="py-2 text-right font-semibold text-red-600">
                      • {formatBRL(depreciacaoSeveridade)}
                    </td>
                  </tr>
                  <tr className="border-b-2 border-slate-300">
                    <td className="py-2 font-bold">Valor Base Ajustado pelo Ambiente</td>
                    <td className="py-2 text-right font-bold">{formatBRL(valorBaseAjustado)}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="mb-6">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                2. Abatimentos por Avarias Constatadas (C_reforma)
              </h2>
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-300 text-left">
                    <th className="py-2 text-xs uppercase text-slate-500">Item / Defeito Apontado</th>
                    <th className="py-2 text-xs uppercase text-slate-500 text-right">
                      Custo Estimado
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {avariasAtivas.length === 0 ? (
                    <tr>
                      <td colSpan={2} className="py-3 text-center text-xs text-slate-500">
                        Nenhuma avaria selecionada
                      </td>
                    </tr>
                  ) : (
                    avariasAtivas.map((av) => (
                      <tr key={av.id} className="border-b border-slate-100">
                        <td className="py-2">{av.nome}</td>
                        <td className="py-2 text-right font-semibold text-red-600">
                          • {formatBRL(av.custo)}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
                <tfoot>
                  <tr className="border-t-2 border-slate-300">
                    <td className="py-2 font-bold">Total de Reforma</td>
                    <td className="py-2 text-right font-bold">{formatBRL(totalReforma)}</td>
                  </tr>
                </tfoot>
              </table>
            </div>

            <div className="bg-slate-900 text-white rounded-xl p-6 mb-6 print:bg-white print:text-slate-900 print:border-2 print:border-slate-900">
              <p className="text-xs uppercase tracking-wider text-amber-400 print:text-amber-700">
                Valor Justo de Negociação
              </p>
              <p className="text-3xl font-black mt-1">{formatBRL(valorFinalJusto)}</p>
              <p className="text-xs text-slate-300 mt-2 print:text-slate-600">
                Faixa recomendada (±5%): {formatBRL(pisoNegociacao)} a{" "}
                {formatBRL(tetoNegociacao)}
              </p>
            </div>

            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                Amostras de Mercado Utilizadas como Base:
              </h2>
              <ul className="space-y-1">
                {fontesWeb.map((fonte, idx) => (
                  <li key={idx} className="text-xs text-slate-600 flex gap-2">
                    <span>•</span>
                    {fonte}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
