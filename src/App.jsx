import { useMemo, useState } from "react";
import {
  AlertTriangle,
  Check,
  CircleDollarSign,
  Eye,
  Film,
  Info,
  Instagram,
  Link as LinkIcon,
  LockKeyhole,
  Plus,
  Save,
  ShieldAlert,
  Trophy,
  UserRound,
  X
} from "lucide-react";
import { influencers, month, myClips, prizeByPosition } from "./data.js";

function formatNumber(value) {
  return Number(value || 0).toLocaleString("pt-BR");
}

const tabs = [
  { key: "ranking", label: "Ranking", icon: Trophy },
  { key: "clips", label: "Meus clipes", icon: Film, badge: "104" },
  { key: "accounts", label: "Minhas contas", icon: UserRound },
  { key: "warnings", label: "Advertências", icon: ShieldAlert }
];

export default function App() {
  const ranking = useMemo(() => {
    return influencers
      .map((item) => ({
        ...item,
        totalViews: item.clips.reduce((sum, clip) => sum + clip.views, 0)
      }))
      .sort((a, b) => b.totalViews - a.totalViews)
      .map((item, index) => ({
        ...item,
        position: index + 1,
        prize: prizeByPosition[index + 1] || 0
      }));
  }, []);

  const [activeTab, setActiveTab] = useState("ranking");
  const [selected, setSelected] = useState(null);
  const [rulesOpen, setRulesOpen] = useState(false);
  const [sendOpen, setSendOpen] = useState(false);

  return (
    <div className="app-bg">
      <div className="dashboard-shell">
        <header className="topbar">
          <nav className="tabbar" aria-label="Navegação principal">
            {tabs.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.key}
                  className={"tab " + (activeTab === item.key ? "active" : "")}
                  onClick={() => setActiveTab(item.key)}
                >
                  <Icon size={13} strokeWidth={2.4} />
                  <span className="tab-label">{item.label}</span>
                  {item.badge && <span className="tab-badge">{item.badge}</span>}
                </button>
              );
            })}
          </nav>

          <button className="send-clip-top" onClick={() => setSendOpen(true)}>
            <Plus size={14} strokeWidth={2.5} />
            Enviar clipe
          </button>
        </header>

        <main className="content-area">
          {activeTab === "ranking" && (
            <RankingPage
              ranking={ranking}
              onOpenRules={() => setRulesOpen(true)}
              onSelect={setSelected}
            />
          )}
          {activeTab === "clips" && <ClipsPage />}
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
      <div className="ranking-headline">
        <div className="section-title-row">
          <span className="section-icon">
            <Trophy size={16} />
          </span>
          <h1>
            Ranking do mês <span>· {month}</span>
          </h1>
        </div>

        <button className="outline-coral" onClick={onOpenRules}>
          <Info size={13} />
          Regras
        </button>
      </div>

      <p className="ranking-copy">
        Todo mês os 7 clipadores com mais visualizações somadas nos clipes ganham:
        <b> R$ 2.000</b> (1º), <b>R$ 1.500</b> (2º e 3º), <b>R$ 1.000</b> (4º e
        5º) e <b>R$ 500</b> (6º e 7º).
      </p>

      <div className="ranking-scroll">
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
                <span className="influencer-name">{item.name}</span>
                <span className="views">
                  <Eye size={13} />
                  {formatNumber(item.totalViews)}
                </span>
                <span className="prize">R$ {formatNumber(item.prize)}</span>
                <span className="info-circle">
                  <Info size={12} />
                </span>
              </button>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

function ClipsPage() {
  return (
    <section className="panel clips-panel">
      <div className="simple-title">
        <span className="section-icon">
          <Film size={15} />
        </span>
        <h2>Meus clipes</h2>
      </div>

      <div className="table-wrap">
        <table className="clips-table">
          <thead>
            <tr>
              <th>CLIPE</th>
              <th>ENVIADO EM</th>
              <th>VIEWS</th>
              <th>STATUS</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {myClips.map((clip) => (
              <tr key={clip.id}>
                <td>
                  <div className="clip-name">
                    <span className="platform-mark">◆</span>
                    <strong>{clip.platform}</strong>
                  </div>
                  {clip.status === "removed" && (
                    <div className="removed-note">
                      Clipe apagado ou indisponível na rede — parou de contar.
                    </div>
                  )}
                </td>
                <td>{clip.sentAt}</td>
                <td className="views-cell">{formatNumber(clip.views)}</td>
                <td>
                  <span className={"status " + clip.status}>
                    {clip.status === "live" ? (
                      <>
                        <Check size={10} /> No ar
                      </>
                    ) : (
                      <>
                        <X size={10} /> Removido
                      </>
                    )}
                  </span>
                </td>
                <td>
                  <button className="ghost-icon" aria-label="Privado">
                    <LockKeyhole size={12} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function AccountsPage() {
  const [handle, setHandle] = useState("");
  const [pix, setPix] = useState("clipador@exemplo.com");
  const [saved, setSaved] = useState(true);

  return (
    <div className="accounts-stack">
      <section className="panel settings-panel">
        <div className="simple-title">
          <span className="section-icon">
            <Instagram size={15} />
          </span>
          <h2>Minhas contas</h2>
        </div>

        <p className="settings-copy">
          Cadastre o(s) @ que você usa pra postar os clipes. Não pedimos senha nem
          conexão com a rede — é só identificação.
        </p>

        <div className="account-chip">
          <span className="platform-mark">◆</span>
          <strong>@seuusuario</strong>
          <small>· TikTok</small>
          <button aria-label="Remover conta">×</button>
        </div>

        <div className="account-form-row">
          <select aria-label="Rede social">
            <option>TikTok</option>
            <option>Instagram</option>
          </select>
          <input
            value={handle}
            onChange={(event) => setHandle(event.target.value)}
            placeholder="@seuusuario"
          />
          <button className="coral-button" onClick={() => setHandle("")}>
            <Plus size={13} />
            Adicionar
          </button>
        </div>
      </section>

      <section className="panel settings-panel">
        <div className="simple-title">
          <span className="section-icon">
            <CircleDollarSign size={15} />
          </span>
          <h2>
            Chave Pix <span>· pra receber seus prêmios</span>
          </h2>
        </div>

        <p className="settings-copy">
          É pra essa chave que a equipe manda o prêmio se você ficar entre os
          premiados do mês.
        </p>

        <div className="pix-row">
          <input
            value={pix}
            onChange={(event) => {
              setPix(event.target.value);
              setSaved(false);
            }}
          />
          <button className="coral-button" onClick={() => setSaved(true)}>
            <Save size={13} />
            Salvar
          </button>
        </div>

        {saved && (
          <p className="saved-note">
            <Check size={12} />
            Chave cadastrada
          </p>
        )}
      </section>
    </div>
  );
}

function WarningsPage() {
  return (
    <section className="panel warnings-panel">
      <div className="simple-title">
        <span className="section-icon">
          <ShieldAlert size={15} />
        </span>
        <h2>Advertências</h2>
      </div>

      <div className="empty-state">
        <span>
          <Check size={20} />
        </span>
        <h3>Nenhuma advertência ativa</h3>
        <p>
          Quando houver alguma ocorrência relacionada aos seus clipes ou às regras
          da campanha, ela aparece aqui.
        </p>
      </div>
    </section>
  );
}

function InfluencerModal({ influencer, onClose }) {
  return (
    <Modal onClose={onClose} width="440px">
      <div className="modal-list-title">
        <div>
          <strong>{influencer.name}</strong>
          <span>{influencer.username}</span>
        </div>
        <span className="total-mini">
          <Eye size={12} />
          {formatNumber(influencer.totalViews)}
        </span>
      </div>

      <div className="clip-detail-list">
        {influencer.clips.map((clip) => (
          <div className="clip-detail-row" key={clip.id}>
            <div>
              <strong>
                <span className="platform-mark">◆</span> {clip.platform}
              </strong>
              <small>postado em {clip.date}</small>
            </div>

            <span className="clip-detail-views">
              <Eye size={11} />
              {formatNumber(clip.views)}
            </span>

            <button className="ghost-icon" aria-label="Abrir clipe">
              <LinkIcon size={11} />
            </button>
          </div>
        ))}
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
    <Modal onClose={onClose} width="430px">
      <div className="rules-title">
        <span className="section-icon">
          <Trophy size={15} />
        </span>
        <div>
          <strong>Regras do ranking</strong>
          <small>Premiação mensal</small>
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

  return (
    <Modal onClose={onClose} width="460px">
      <div className="send-title">
        <strong>Enviar clipe</strong>
        <span>Todo clipe já conta pras suas visualizações do mês.</span>
      </div>

      <label className="field-label">
        Link do clipe
        <input
          value={link}
          onChange={(event) => setLink(event.target.value)}
          placeholder="https://www.tiktok.com/@voce/video/..."
        />
      </label>

      <label className="field-label">
        Título <small>(opcional)</small>
        <input
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="Ex.: Corte da aula de Matemática"
        />
      </label>

      <p className="legal-note">
        <AlertTriangle size={12} />
        Ao enviar, você autoriza a equipe a repostar e reutilizar este clipe nos
        canais e materiais da campanha.
      </p>

      <div className="modal-footer">
        <button className="soft-button" onClick={onClose}>
          Cancelar
        </button>
        <button className="coral-button" onClick={onClose}>
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
          <X size={15} />
        </button>
        {children}
      </div>
    </div>
  );
}
