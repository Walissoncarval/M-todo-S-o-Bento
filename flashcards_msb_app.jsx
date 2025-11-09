import React, { useState } from "react";

// Flashcards MSB - Single-file React component (TailwindCSS)
// Tema: Escuro
// Rodapé: Desenvolvido por W. Carvalho | Flashcards MSB © 2025

export default function FlashcardsMSBApp() {
  // Estados básicos
  const [decks, setDecks] = useState([]); // cada deck: { id, title, cards: [{id, front, back, level}] }
  const [selectedDeckId, setSelectedDeckId] = useState(null);
  const [showCreateDeck, setShowCreateDeck] = useState(false);
  const [showCreateCard, setShowCreateCard] = useState(false);
  const [showStudy, setShowStudy] = useState(false);
  const [newDeckTitle, setNewDeckTitle] = useState("");
  const [newCardFront, setNewCardFront] = useState("");
  const [newCardBack, setNewCardBack] = useState("");

  // Simulador (apenas UI)
  const [seed, setSeed] = useState(369);
  const [numQuestions, setNumQuestions] = useState(100);
  const [numCandidates, setNumCandidates] = useState(100000);
  const [gabaritoPct, setGabaritoPct] = useState(0.5);
  const [brancoMin, setBrancoMin] = useState(0.1);
  const [brancoMax, setBrancoMax] = useState(0.3);

  // Funções utilitárias
  const totalDecks = decks.length;
  const totalCards = decks.reduce((acc, d) => acc + (d.cards?.length || 0), 0);
  const toReviewToday = decks.reduce((acc, d) => acc + (d.cards?.filter(c => c.level !== 3).length || 0), 0);
  const cardsReviewed = 0; // placehold
  const cardsMastered = decks.reduce((acc, d) => acc + (d.cards?.filter(c => c.level === 3).length || 0), 0);

  function createDeck() {
    if (!newDeckTitle.trim()) return;
    const id = Date.now().toString();
    setDecks([...decks, { id, title: newDeckTitle.trim(), cards: [] }]);
    setNewDeckTitle("");
    setShowCreateDeck(false);
    setSelectedDeckId(id);
  }

  function createCard() {
    if (!selectedDeckId) return alert("Crie ou selecione um baralho primeiro.");
    if (!newCardFront.trim() || !newCardBack.trim()) return;
    setDecks(decks.map(d => {
      if (d.id !== selectedDeckId) return d;
      const card = {
        id: Date.now().toString(),
        front: newCardFront.trim(),
        back: newCardBack.trim(),
        level: 0 // 0..3 (F1, F2, F3: consider 3 = dominado)
      };
      return { ...d, cards: [...(d.cards || []), card] };
    }));
    setNewCardFront("");
    setNewCardBack("");
    setShowCreateCard(false);
  }

  function openStudy(deckId) {
    if (!deckId) return;
    setSelectedDeckId(deckId);
    setShowStudy(true);
  }

  // Remover deck (simples)
  function removeDeck(id) {
    if (!confirm("Remover este baralho?")) return;
    setDecks(decks.filter(d => d.id !== id));
    if (selectedDeckId === id) setSelectedDeckId(null);
  }

  // Render helpers
  const selectedDeck = decks.find(d => d.id === selectedDeckId) || null;

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 antialiased">
      <header className="max-w-6xl mx-auto p-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-yellow-400 to-amber-600 flex items-center justify-center text-gray-900 font-bold">MSB</div>
          <div>
            <h1 className="text-2xl font-extrabold">Flashcards MSB</h1>
            <p className="text-sm text-gray-400">Métodos São Bento — "ora et labora et legere"</p>
          </div>
        </div>
        <nav className="flex items-center gap-3">
          <button onClick={() => { setShowCreateDeck(true); setShowCreateCard(false); }} className="px-3 py-2 rounded-md bg-amber-500 text-gray-900 font-semibold">Novo Baralho</button>
          <button onClick={() => { setShowCreateCard(true); setShowCreateDeck(false); }} className="px-3 py-2 rounded-md border border-gray-700">Novo Cartão</button>
        </nav>
      </header>

      <main className="max-w-6xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Painel - coluna grande */}
        <section className="lg:col-span-2 bg-gray-800 rounded-2xl p-6 shadow-lg">
          <h2 className="text-xl font-bold mb-2">Painel</h2>
          <p className="text-sm text-gray-400 mb-4">Transforme seu aprendizado com flashcards inteligentes e repetição espaçada</p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <StatCard title="Total de Baralhos" value={totalDecks} />
            <StatCard title="Total de Cartões" value={totalCards} />
            <StatCard title="Para Revisar Hoje" value={toReviewToday} />
          </div>

          <div className="mb-6">
            <h3 className="font-semibold mb-2">Sessão Rápida</h3>
            <div className="p-4 rounded-lg bg-gray-900 border border-gray-800">
              <p>Você tem <strong>{toReviewToday}</strong> cartões para revisar hoje. Continue seu progresso!</p>
              <div className="mt-4 flex gap-2">
                <button className="px-3 py-2 rounded-md bg-green-600 text-white" onClick={() => {
                  if (toReviewToday === 0) return alert('Você não possui cartões para revisar hoje. Crie alguns!')
                  // iniciar estudo - selecionar primeiro deck com cards para revisar
                  const deckWithReview = decks.find(d => d.cards && d.cards.some(c => c.level !== 3));
                  if (deckWithReview) openStudy(deckWithReview.id);
                }}>Começar Estudo</button>
                <button className="px-3 py-2 rounded-md border border-gray-700">Simular</button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-lg bg-gray-900 border border-gray-800">
              <h4 className="font-semibold mb-2">Progresso de Estudo</h4>
              <p className="text-sm">Cartões Revisados: <strong>{cardsReviewed} / {totalCards}</strong></p>
              <p className="text-sm">Cartões Dominados: <strong>{cardsMastered} / {totalCards}</strong></p>
              <p className="text-sm">Última atividade: <strong>—</strong></p>
            </div>

            <div className="p-4 rounded-lg bg-gray-900 border border-gray-800">
              <h4 className="font-semibold mb-2">Dicas de Estudo</h4>
              <ul className="text-sm space-y-2">
                <li>💡 <strong>Estude regularmente</strong> — 15-30 minutos por dia é mais eficaz.</li>
                <li>🧠 <strong>Use a repetição espaçada</strong> — revise nos intervalos sugeridos.</li>
                <li>✨ <strong>Seja honesto</strong> na avaliação — classifique sua dificuldade com precisão.</li>
              </ul>
            </div>

            <div className="p-4 rounded-lg bg-gray-900 border border-gray-800">
              <h4 className="font-semibold mb-2">Baralhos Recentes</h4>
              {decks.length === 0 ? (
                <p className="text-sm text-gray-400">Nenhum baralho encontrado. Crie seu primeiro baralho para começar.</p>
              ) : (
                <ul className="space-y-2">
                  {decks.slice(-5).map(d => (
                    <li key={d.id} className="flex items-center justify-between">
                      <div>
                        <div className="font-semibold">{d.title}</div>
                        <div className="text-xs text-gray-400">{d.cards.length} cartões</div>
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => openStudy(d.id)} className="px-2 py-1 rounded bg-green-600 text-white text-sm">Estudar</button>
                        <button onClick={() => removeDeck(d.id)} className="px-2 py-1 rounded border border-gray-700 text-sm">Remover</button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

        </section>

        {/* Lateral direita */}
        <aside className="space-y-6">
          <div className="bg-gray-800 rounded-2xl p-4 shadow-lg">
            <h3 className="font-semibold">Decks</h3>
            <p className="text-sm text-gray-400 mb-3">Organize seus flashcards em baralhos temáticos</p>
            <div className="space-y-2 max-h-40 overflow-auto">
              {decks.length === 0 ? (
                <div className="text-sm text-gray-400">Nenhum baralho criado ainda</div>
              ) : (
                decks.map(d => (
                  <div key={d.id} className={`p-2 rounded-md cursor-pointer border ${selectedDeckId === d.id ? 'border-amber-500 bg-gray-900' : 'border-gray-800'}`} onClick={() => setSelectedDeckId(d.id)}>
                    <div className="font-medium">{d.title}</div>
                    <div className="text-xs text-gray-400">{d.cards.length} cartões</div>
                  </div>
                ))
              )}
            </div>
            <div className="mt-4 flex gap-2">
              <button onClick={() => setShowCreateDeck(true)} className="px-3 py-2 rounded bg-amber-500 text-gray-900 font-semibold">Criar Primeiro Baralho</button>
              <button className="px-3 py-2 rounded border border-gray-700">Importar do Anki</button>
            </div>
          </div>

          <div className="bg-gray-800 rounded-2xl p-4 shadow-lg">
            <h3 className="font-semibold">Simulador Estatístico</h3>
            <p className="text-sm text-gray-400 mb-3">Simule desempenho com sistema Certo/Errado/Branco</p>
            <div className="space-y-2 text-sm">
              <label className="block">Seed
                <input type="number" className="mt-1 w-full rounded bg-gray-900 border border-gray-700 p-2 text-sm" value={seed} onChange={e => setSeed(Number(e.target.value))} />
              </label>
              <label className="block">Quantidade de Questões
                <input type="number" className="mt-1 w-full rounded bg-gray-900 border border-gray-700 p-2 text-sm" value={numQuestions} onChange={e => setNumQuestions(Number(e.target.value))} />
              </label>
              <label className="block">Quantidade de Candidatos
                <input type="number" className="mt-1 w-full rounded bg-gray-900 border border-gray-700 p-2 text-sm" value={numCandidates} onChange={e => setNumCandidates(Number(e.target.value))} />
              </label>
              <label className="block">Porcentagem Gabarito (0-1)
                <input type="number" step="0.01" min="0" max="1" className="mt-1 w-full rounded bg-gray-900 border border-gray-700 p-2 text-sm" value={gabaritoPct} onChange={e => setGabaritoPct(Number(e.target.value))} />
              </label>
              <div className="flex gap-2">
                <button className="px-3 py-2 rounded bg-amber-500 text-gray-900 font-semibold">Executar Simulação</button>
                <button className="px-3 py-2 rounded border border-gray-700">Limpar</button>
              </div>
            </div>
          </div>

          <div className="bg-gray-800 rounded-2xl p-4 shadow-lg">
            <h3 className="font-semibold">Sessão de Estudo</h3>
            <p className="text-sm text-gray-400">Escolha um baralho para começar a estudar</p>
            <div className="mt-3 flex gap-2 flex-wrap">
              <button className="px-3 py-2 rounded border border-gray-700" onClick={() => { if (decks[0]) openStudy(decks[0].id); }}>Estudar Primeiro Baralho</button>
              <button className="px-3 py-2 rounded border border-gray-700" onClick={() => setShowCreateCard(true)}>Criar Cartão</button>
            </div>
          </div>
        </aside>
      </main>

      {/* Modais */}
      {showCreateDeck && (
        <Modal onClose={() => setShowCreateDeck(false)}>
          <h3 className="text-lg font-bold mb-2">Criar Novo Baralho</h3>
          <input placeholder="Título do baralho" className="w-full p-2 rounded bg-gray-900 border border-gray-700 mb-3" value={newDeckTitle} onChange={e => setNewDeckTitle(e.target.value)} />
          <div className="flex gap-2 justify-end">
            <button className="px-3 py-2 rounded border" onClick={() => setShowCreateDeck(false)}>Cancelar</button>
            <button className="px-3 py-2 rounded bg-amber-500 text-gray-900 font-semibold" onClick={createDeck}>Criar Baralho</button>
          </div>
        </Modal>
      )}

      {showCreateCard && (
        <Modal onClose={() => setShowCreateCard(false)}>
          <h3 className="text-lg font-bold mb-2">Criar Novo Cartão</h3>
          <label className="text-sm text-gray-400">Baralho *</label>
          <select className="w-full p-2 rounded bg-gray-900 border border-gray-700 mb-3" value={selectedDeckId || ""} onChange={e => setSelectedDeckId(e.target.value)}>
            <option value="">Selecione um baralho</option>
            {decks.map(d => <option key={d.id} value={d.id}>{d.title}</option>)}
          </select>

          <input placeholder="Frente do Cartão (Pergunta)" className="w-full p-2 rounded bg-gray-900 border border-gray-700 mb-3" value={newCardFront} onChange={e => setNewCardFront(e.target.value)} />
          <input placeholder="Verso do Cartão (Resposta)" className="w-full p-2 rounded bg-gray-900 border border-gray-700 mb-3" value={newCardBack} onChange={e => setNewCardBack(e.target.value)} />

          <div className="flex gap-2 justify-end">
            <button className="px-3 py-2 rounded border" onClick={() => setShowCreateCard(false)}>Cancelar</button>
            <button className="px-3 py-2 rounded bg-amber-500 text-gray-900 font-semibold" onClick={createCard}>Criar Cartão</button>
          </div>

        </Modal>
      )}

      {showStudy && selectedDeck && (
        <Modal onClose={() => setShowStudy(false)} wide>
          <h3 className="text-lg font-bold mb-2">Sessão de Estudo — {selectedDeck.title}</h3>
          <StudySession deck={selectedDeck} onClose={() => setShowStudy(false)} updateDeck={(updated) => setDecks(decks.map(d => d.id === updated.id ? updated : d))} />
        </Modal>
      )}

      <footer className="max-w-6xl mx-auto p-6 text-sm text-gray-400 text-center">
        <div>Desenvolvido por W. Carvalho | Flashcards MSB © 2025</div>
      </footer>
    </div>
  );
}

function StatCard({ title, value }) {
  return (
    <div className="p-4 rounded-lg bg-gray-900 border border-gray-800">
      <div className="text-sm text-gray-400">{title}</div>
      <div className="text-2xl font-bold">{value}</div>
    </div>
  );
}

function Modal({ children, onClose, wide }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60" onClick={onClose}></div>
      <div className={`relative z-10 ${wide ? 'w-11/12 md:w-3/4' : 'w-11/12 md:w-1/2'} max-h-[90vh] overflow-auto p-6 bg-gray-800 rounded-2xl border border-gray-700`}>{children}</div>
    </div>
  );
}

function StudySession({ deck, onClose, updateDeck }) {
  const [index, setIndex] = useState(0);
  const cards = deck.cards || [];
  if (cards.length === 0) return (
    <div>
      <p>Nenhum cartão neste baralho. Crie alguns cartões para começar.</p>
      <div className="mt-4 flex justify-end"><button className="px-3 py-2 rounded border" onClick={onClose}>Fechar</button></div>
    </div>
  );

  const card = cards[index % cards.length];
  const [showBack, setShowBack] = useState(false);

  function mark(difficulty) {
    // dificuldade: 'easy' => level up; 'hard' => level down; 'mid' => stay
    const updated = { ...deck };
    updated.cards = updated.cards.map(c => {
      if (c.id !== card.id) return c;
      let newLevel = c.level;
      if (difficulty === 'easy') newLevel = Math.min(3, newLevel + 1);
      if (difficulty === 'hard') newLevel = Math.max(0, newLevel - 1);
      if (difficulty === 'mid') newLevel = Math.min(3, Math.max(0, newLevel));
      return { ...c, level: newLevel };
    });
    updateDeck(updated);
    setShowBack(false);
    setIndex(i => i + 1);
  }

  return (
    <div>
      <div className="p-4 rounded-lg bg-gray-900 border border-gray-800">
        <div className="text-sm text-gray-400">Cartão {index + 1} / {cards.length}</div>
        <div className="mt-3 p-6 rounded bg-gray-700 text-gray-100 font-semibold text-lg">{card.front}</div>
        {showBack && <div className="mt-3 p-4 rounded bg-gray-800 text-gray-200">{card.back}</div>}

        <div className="mt-4 flex gap-2">
          <button onClick={() => setShowBack(s => !s)} className="px-3 py-2 rounded border">{showBack ? 'Esconder' : 'Mostrar Resposta'}</button>
          <div className="ml-auto flex gap-2">
            <button onClick={() => mark('hard')} className="px-3 py-2 rounded border">Difícil</button>
            <button onClick={() => mark('mid')} className="px-3 py-2 rounded border">Médio</button>
            <button onClick={() => mark('easy')} className="px-3 py-2 rounded bg-amber-500 text-gray-900">Fácil</button>
          </div>
        </div>
      </div>

      <div className="mt-4 flex justify-end">
        <button className="px-3 py-2 rounded border" onClick={onClose}>Encerrar Sessão</button>
      </div>
    </div>
  );
}
