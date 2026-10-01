import { useMemo, useState } from "react";
import {
  AlertTriangle,
  Check,
  CircleDollarSign,
  Eye,
  Film,
  Info,
  Instagram,
  Plus,
  Save,
  ShieldAlert,
  Sparkles,
  Trophy,
  UserRound,
  X
} from "lucide-react";
import { influencers, month, myClips, prizeByPosition } from "./data.js";

function formatNumber(value) {
  return Number(value || 0).toLocaleString("pt-BR");
}

function formatCurrency(value) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 0,
  }).format(value || 0);
}

const tabs = [
  { key: "ranking", label: "Ranking", icon: Trophy },
  { key: "clips", label: "Meus clipes", icon: Film },
  { key: "accounts", label: "Minhas contas", icon: UserRound },
  { key: "warnings", label: "Advertências", icon: ShieldAlert },
];

export default function App() {
  const ranking = useMemo(() => {
    return [...influencers]
      .sort((a, b) => b.totalViews - a.totalViews)
      .map((item, index) => ({
        ...item,
        position: index + 1,
        prize: prizeByPosition[index + 1] || 0,
      }));
  }, []);

  const [activeTab, setActiveTab] = useState("ranking");
  const [selected, setSelected] = useState(null);
  const [rulesOpen, setRulesOpen] = useState(false);
  const [sendOpen, setSendOpen] = useState(false);

  return (
    <div className="app-bg">
      <div className="dashboard-shell">
        <header className="app-header">
          <div className="app-heading">
            <span className="app-logo">
              <Trophy size={18} />
            </span>
            <div>
              <p className="eyebrow">Painel do clipador</p>
              <h1 className="app-title">Ranking e desempenho</h1>
            </div>
          </div>

          <button className="send-clip-top" onClick={() => setSendOpen(true)}>
            <Plus size={15} strokeWidth={2.5} />
            Enviar clipe
          </button>
        </header>

        <div className="nav-shell">
          <nav className="tabbar" aria-label="Navegação principal">
            {tabs.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.key}
                  className={"tab " + (activeTab === item.key ? "active" : "")}
                  onClick={() => setActiveTab(item.key)}
                >
                  <Icon size={14} strokeWidth={2.2} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        <main className="content-area">
          {activeTab === "ranking" && (
            <RankingPage
              ranking={ranking}
              onOpenRules={() => setRulesOpen(true)}
              onSelect={setSelected}
            />
          )}

          {activeTab === "clips" && (
            <ClipsPage clips={myClips} onSend={() => setSendOpen(true)} />
          )}

          {activeTab === "accounts" && <AccountsPage />}
          {activeTab === "warnings" && <WarningsPage />}
        </main>
      </div>

      {rulesOpen && <RulesModal onClose={() => setRulesOpen(false)} />}
      {selected && (
        <InfluencerModal influencer={selected} onClose={() => setSelected(null)} />
      )}
      {sendOpen && <SendClipModal onClose={() => setSendOpen(false)} />}
    </div>
  );
}

function RankingPage({ ranking, onOpenRules, onSelect }) {
  return (
    <section className="panel ranking-panel">
      <div className="panel-header ranking-headline">
        <div className="section-title-row">
          <span className="section-icon">
            <Trophy size={17} />
          </span>
          <div>
            <div className="title-with-pill">
              <h2>Ranking do mês</h2>
              <span className="month-label">· {month}</span>
            </div>
            <p className="panel-subtitle">
              Classificação por visualizações acumuladas no mês.
            </p>
          </div>
        </div>

        <div className="ranking-actions">
          <span className="demo-pill">
            <Sparkles size={11} />
            Dados demonstrativos
          </span>
          <button className="outline-coral" onClick={onOpenRules}>
            <Info size={13} />
            Regras
          </button>
        </div>
      </div>

      <div className="reward-strip">
        <span>
          <b>1º</b> R$ 2.000
        </span>
        <span>
          <b>2º–3º</b> R$ 1.500
        </span>
        <span>
          <b>4º–5º</b> R$ 1.000
        </span>
        <span>
          <b>6º–7º</b> R$ 500
        </span>
      </div>

      <ol className="ranking-list">
        {ranking.map((item) => (
          <li key={item.id}>
            <button className="ranking-row" onClick={() => onSelect(item)}>
              <span
                className={
                  "position-badge pos-" +
                  (item.position <= 3 ? item.position : "other")
                }
              >
                {item.position}º
              </span>

              <span className="ranking-person">
                <strong>{item.name}</strong>
                <small>{item.position <= 7 ? "Faixa de premiação" : "Ranking"}</small>
              </span>

              <span className="views">
                <Eye size={14} />
                {formatNumber(item.totalViews)}
              </span>

              <span className="prize">{formatCurrency(item.prize)}</span>

              <span className="info-circle">
                <Info size={12} />
              </span>
            </button>
          </li>
        ))}
      </ol>

      <p className="demo-footnote">
        Os nomes e números desta tela são fictícios por enquanto. A estrutura já está
        pronta para receber os dados reais depois.
      </p>
    </section>
  );
}

function ClipsPage({ clips, onSend }) {
  return (
    <section className="panel content-panel">
      <div className="panel-header">
        <div className="section-title-row">
          <span className="section-icon">
            <Film size={17} />
          </span>
          <div>
            <h2>Meus clipes</h2>
            <p className="panel-subtitle">
              Acompanhe aqui os clipes que você enviar.
            </p>
          </div>
        </div>
      </div>

      {clips.length === 0 ? (
        <div className="empty-state empty-clips">
          <span className="empty-icon">
            <Film size={23} />
          </span>
          <h3>Você ainda não enviou nenhum clipe</h3>
          <p>
            Quando você enviar o primeiro, ele aparecerá aqui com visualizações,
            data e status.
          </p>
          <button className="coral-button empty-cta" onClick={onSend}>
            <Plus size={14} />
            Enviar primeiro clipe
          </button>
        </div>
      ) : (
        <div className="table-wrap">
          <table className="clips-table">
            <thead>
              <tr>
                <th>CLIPE</th>
                <th>ENVIADO EM</th>
                <th>VIEWS</th>
                <th>STATUS</th>
              </tr>
            </thead>
            <tbody>
              {clips.map((clip) => (
                <tr key={clip.id}>
                  <td>{clip.platform}</td>
                  <td>{clip.sentAt}</td>
                  <td>{formatNumber(clip.views)}</td>
                  <td>{clip.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

function AccountsPage() {
  const [network, setNetwork] = useState("TikTok");
  const [handle, setHandle] = useState("");
  const [accounts, setAccounts] = useState([]);
  const [pix, setPix] = useState("");
  const [pixSaved, setPixSaved] = useState(false);

  function addAccount() {
    const cleanHandle = handle.trim();
    if (!cleanHandle) return;

    const normalized = cleanHandle.startsWith("@")
      ? cleanHandle
      : `@${cleanHandle}`;

    setAccounts((current) => [
      ...current,
      { id: Date.now(), network, handle: normalized },
    ]);
    setHandle("");
  }

  function removeAccount(id) {
    setAccounts((current) => current.filter((account) => account.id !== id));
  }

  return (
    <div className="settings-grid">
      <section className="panel settings-panel">
        <div className="panel-header">
          <div className="section-title-row">
            <span className="section-icon">
              <Instagram size={17} />
            </span>
            <div>
              <h2>Minhas contas</h2>
              <p className="panel-subtitle">
                Cadastre somente os perfis que você realmente usa para postar.
              </p>
            </div>
          </div>
        </div>

        {accounts.length === 0 ? (
          <div className="inline-empty">Nenhuma conta cadastrada.</div>
        ) : (
          <div className="account-list">
            {accounts.map((account) => (
              <div className="account-chip" key={account.id}>
                <span className="platform-dot" />
                <strong>{account.handle}</strong>
                <small>{account.network}</small>
                <button
                  type="button"
                  onClick={() => removeAccount(account.id)}
                  aria-label="Remover conta"
                >
                  <X size={12} />
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="form-row account-form-row">
          <select
            aria-label="Rede social"
            value={network}
            onChange={(event) => setNetwork(event.target.value)}
          >
            <option>TikTok</option>
            <option>Instagram</option>
          </select>
          <input
            value={handle}
            onChange={(event) => setHandle(event.target.value)}
            placeholder="@seuusuario"
          />
          <button className="coral-button" onClick={addAccount}>
            <Plus size={13} />
            Adicionar
          </button>
        </div>
      </section>

      <section className="panel settings-panel">
        <div className="panel-header">
          <div className="section-title-row">
            <span className="section-icon">
              <CircleDollarSign size={17} />
            </span>
            <div>
              <h2>Chave Pix</h2>
              <p className="panel-subtitle">
                Informe a chave que deverá receber eventuais premiações.
              </p>
            </div>
          </div>
        </div>

        <div className="form-row pix-row">
          <input
            value={pix}
            onChange={(event) => {
              setPix(event.target.value);
              setPixSaved(false);
            }}
            placeholder="Digite sua chave Pix"
          />
          <button
            className="coral-button"
            disabled={!pix.trim()}
            onClick={() => setPixSaved(Boolean(pix.trim()))}
          >
            <Save size={13} />
            Salvar
          </button>
        </div>

        {pixSaved && (
          <p className="saved-note">
            <Check size={13} />
            Chave cadastrada nesta sessão
          </p>
        )}
      </section>
    </div>
  );
}

function WarningsPage() {
  return (
    <section className="panel content-panel">
      <div className="panel-header">
        <div className="section-title-row">
          <span className="section-icon">
            <ShieldAlert size={17} />
          </span>
          <div>
            <h2>Advertências</h2>
            <p className="panel-subtitle">
              Avisos relacionados aos seus clipes aparecerão aqui.
            </p>
          </div>
        </div>
      </div>

      <div className="empty-state">
        <span className="empty-icon success">
          <Check size={23} />
        </span>
        <h3>Nenhuma advertência</h3>
        <p>Não há nenhuma ocorrência registrada no momento.</p>
      </div>
    </section>
  );
}

function InfluencerModal({ influencer, onClose }) {
  return (
    <Modal onClose={onClose} width="470px">
      <div className="modal-profile">
        <span
          className={
            "position-badge pos-" +
            (influencer.position <= 3 ? influencer.position : "other")
          }
        >
          {influencer.position}º
        </span>
        <div>
          <p className="eyebrow">Resumo do ranking</p>
          <strong>{influencer.name}</strong>
        </div>
      </div>

      <div className="metric-grid">
        <div className="metric-card">
          <span>Visualizações</span>
          <strong>{formatNumber(influencer.totalViews)}</strong>
        </div>
        <div className="metric-card">
          <span>Premiação atual</span>
          <strong className="metric-prize">{formatCurrency(influencer.prize)}</strong>
        </div>
      </div>

      <div className="demo-box">
        <Sparkles size={14} />
        <p>
          Este participante faz parte do ranking demonstrativo. Ainda não existem
          clipes reais cadastrados no sistema.
        </p>
      </div>

      <div className="modal-footer">
        <button className="soft-button" onClick={onClose}>
          Fechar
        </button>
      </div>
    </Modal>
  );
}

function RulesModal({ onClose }) {
  return (
    <Modal onClose={onClose} width="440px">
      <div className="modal-heading">
        <span className="section-icon">
          <Trophy size={16} />
        </span>
        <div>
          <p className="eyebrow">Premiação mensal</p>
          <strong>Regras do ranking</strong>
        </div>
      </div>

      <div className="prize-grid">
        <div>
          <span>1º lugar</span>
          <strong>R$ 2.000</strong>
        </div>
        <div>
          <span>2º e 3º lugares</span>
          <strong>R$ 1.500</strong>
        </div>
        <div>
          <span>4º e 5º lugares</span>
          <strong>R$ 1.000</strong>
        </div>
        <div>
          <span>6º e 7º lugares</span>
          <strong>R$ 500</strong>
        </div>
      </div>

      <p className="modal-help">
        A classificação considera a soma das visualizações dos clipes válidos no mês
        atual.
      </p>
    </Modal>
  );
}

function SendClipModal({ onClose }) {
  const [link, setLink] = useState("");
  const [title, setTitle] = useState("");

  const canSubmit = link.trim().length > 8;

  return (
    <Modal onClose={onClose} width="480px">
      <div className="send-title">
        <p className="eyebrow">Novo envio</p>
        <strong>Enviar clipe</strong>
        <span>Adicione o link do conteúdo publicado.</span>
      </div>

      <label className="field-label">
        Link do clipe
        <input
          value={link}
          onChange={(event) => setLink(event.target.value)}
          placeholder="Cole aqui o link do vídeo"
          autoFocus
        />
      </label>

      <label className="field-label">
        Título <small>(opcional)</small>
        <input
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="Dê um nome para identificar o clipe"
        />
      </label>

      <p className="legal-note">
        <AlertTriangle size={13} />
        O envio definitivo será conectado ao banco de dados na próxima etapa.
      </p>

      <div className="modal-footer">
        <button className="soft-button" onClick={onClose}>
          Cancelar
        </button>
        <button className="coral-button" disabled={!canSubmit} onClick={onClose}>
          Enviar
        </button>
      </div>
    </Modal>
  );
}

function Modal({ children, onClose, width }) {
  return (
    <div className="modal-overlay" onMouseDown={onClose}>
      <div
        className="modal-card"
        style={{ maxWidth: width }}
        onMouseDown={(event) => event.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <button className="modal-x" onClick={onClose} aria-label="Fechar">
          <X size={16} />
        </button>
        {children}
      </div>
    </div>
  );
}
