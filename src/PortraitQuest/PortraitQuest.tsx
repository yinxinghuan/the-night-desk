import { useEffect, useMemo, useState } from 'react';
import { nightDeskCartridge } from './cartridge/nightDesk';
import { ghostpixelIdentity } from './identity/ghostpixel';
import { detectLocale, formatName } from './i18n';
import { usePortraitQuest } from './hooks/usePortraitQuest';
import type { Localized, StatKey } from './types';
import './PortraitQuest.less';

const STAT_KEYS: StatKey[] = ['calm', 'order', 'trust', 'truth'];

function local(text: Localized, locale: 'zh' | 'en') {
  return text[locale];
}

function effectClass(value: number) {
  return value >= 0 ? 'is-positive' : 'is-negative';
}

export default function PortraitQuest() {
  const locale = useMemo(detectLocale, []);
  const cartridge = nightDeskCartridge;
  const identity = ghostpixelIdentity;
  const copy = cartridge.copy[locale];
  const game = usePortraitQuest(cartridge, locale);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const update = () => setScale(Math.min(window.innerWidth / 390, window.innerHeight / 844));
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  const scene = game.isGameOver
    ? identity.scenes[game.ending?.id.startsWith('fail_') ? 'lose' : 'win']
    : identity.scenes.intro;

  return (
    <main
      className={`pq-shell pq-shell--${cartridge.id}${game.isPlaying && Math.min(...STAT_KEYS.map((key) => game.stats[key])) < 18 ? ' is-critical' : ''}`}
      style={{ width: 390, height: 844, transform: `scale(${scale})`, transformOrigin: 'center' }}
      data-phase={game.isGameOver ? 'over' : game.isPlaying ? 'playing' : 'start'}
    >
      <div className="pq-shell__grain" />
      <div className="pq-shell__lamp" />

      {!game.isPlaying && !game.isGameOver && (
        <section className="pq-start">
          {scene && <img className="pq-start__scene" src={scene} alt="" draggable={false} />}
          <div className="pq-start__veil" />
          {!scene && (
            <div className="pq-start__identity">
              <span className="pq-start__shift">{copy.eyebrow} · {copy.hudTime}</span>
              <img src={identity.portraits.arrival} alt="" draggable={false} />
              <span className="pq-start__name">{identity.username}</span>
            </div>
          )}
          <header className="pq-start__header">
            <p>{copy.eyebrow}</p>
            <h1>{copy.title}</h1>
            <span>{formatName(copy.subtitle, identity.username)}</span>
          </header>
          <div className="pq-start__footer">
            <p>{copy.guide}</p>
            <button type="button" className="pq-primary" onPointerDown={game.start}>
              <span>{copy.start}</span>
              <i aria-hidden="true">↳</i>
            </button>
          </div>
        </section>
      )}

      {game.isPlaying && (
        <section className="pq-game">
          <header className="pq-hud">
            <div className="pq-hud__brand">
              <span>{copy.hudTime}</span>
              <strong>{identity.username}</strong>
            </div>
            <div className="pq-gauges" aria-label="Status">
              {STAT_KEYS.map((key) => (
                <div className={`pq-gauge${game.stats[key] < 18 ? ' is-critical' : ''}`} key={key}>
                  <div className="pq-gauge__dial">
                    <i style={{ transform: `rotate(${-115 + game.stats[key] * 2.3}deg)` }} />
                  </div>
                  <span>{local(cartridge.statLabels[key], locale)}</span>
                  <b>{game.stats[key]}</b>
                </div>
              ))}
            </div>
          </header>

          <div className="pq-floor-track" aria-hidden="true">
            {Array.from({ length: 12 }, (_, index) => (
              <i className={index + 1 <= game.round ? 'is-lit' : ''} key={index} />
            ))}
          </div>

          <div className={`pq-portrait pq-portrait--${game.portrait}`}>
            <div className="pq-portrait__halo" />
            <img
              key={game.portrait}
              src={identity.portraits[game.portrait]}
              alt=""
              draggable={false}
            />
            <div className="pq-portrait__badge">
              <span>{copy.badge}</span>
              <b>{identity.username}</b>
            </div>
          </div>

          <article className={`pq-ledger${game.feedback ? ' is-resolving' : ''}`}>
            <div className="pq-ledger__topline">
              <span>{copy.round.replace('{round}', String(game.round))}</span>
              <b>{game.currentEvent.deskCode}</b>
            </div>
            <h2>{local(game.currentEvent.title, locale)}</h2>
            <p>{local(game.currentEvent.body, locale)}</p>

            {!game.feedback ? (
              <div className="pq-choices">
                {game.currentEvent.choices.map((choice, index) => (
                  <button
                    type="button"
                    className="pq-keytag"
                    disabled={game.inputLocked}
                    onPointerDown={() => game.choose(index as 0 | 1)}
                    key={index}
                  >
                    <i aria-hidden="true" />
                    <span>{local(choice.label, locale)}</span>
                    <small>{index === 0 ? 'A / ←' : 'D / →'}</small>
                  </button>
                ))}
              </div>
            ) : (
              <div className="pq-feedback" role="status">
                <div className="pq-feedback__particles" aria-hidden="true">
                  {Array.from({ length: 12 }, (_, index) => <i key={index} />)}
                </div>
                <p>{game.feedback.outcome}</p>
                <div>
                  {STAT_KEYS.map((key) => {
                    const value = game.feedback?.effects[key];
                    if (!value) return null;
                    return (
                      <span className={effectClass(value)} key={key}>
                        {local(cartridge.statLabels[key], locale)} {value > 0 ? '+' : ''}{value}
                      </span>
                    );
                  })}
                </div>
              </div>
            )}
          </article>
        </section>
      )}

      {game.showMidpoint && (
        <section className="pq-interlude">
          {identity.scenes.midpoint && <img src={identity.scenes.midpoint} alt="" draggable={false} />}
          <div className="pq-interlude__veil" />
          <span>06 / 12</span>
          <h2>{local(cartridge.midpoint[game.midpointMode].title, locale)}</h2>
          <p>{local(cartridge.midpoint[game.midpointMode].body, locale)}</p>
          <button type="button" className="pq-primary" onPointerDown={game.continueMidpoint}>{copy.continue}</button>
        </section>
      )}

      {game.isGameOver && game.ending && (
        <section className={`pq-result${game.ending.id.startsWith('fail_') ? ' is-failure' : ''}`}>
          {scene && <img className="pq-result__scene" src={scene} alt="" draggable={false} />}
          <div className="pq-result__veil" />
          {!scene && (
            <div className="pq-result__portrait">
              <img src={identity.portraits[game.ending.id.startsWith('fail_') ? 'exhausted' : 'resolved']} alt="" draggable={false} />
            </div>
          )}
          <div className="pq-result__content">
            <span>{game.ending.id.startsWith('fail_') ? copy.failed : copy.dawn}</span>
            <h2>{local(game.ending.title, locale)}</h2>
            <p>{local(game.ending.summary, locale)}</p>
            <small>{formatName(copy.resultFor, identity.username)}</small>
            <div className="pq-result__score">
              <div><span>{copy.score}</span><b>{game.score}</b></div>
              <div><span>{copy.best}</span><b>{game.bestScore}</b></div>
            </div>
            <div className="pq-result__stats">
              {STAT_KEYS.map((key) => (
                <span key={key}>{local(cartridge.statLabels[key], locale)} <b>{game.stats[key]}</b></span>
              ))}
            </div>
            <button type="button" className="pq-primary" onPointerDown={game.start}>{copy.again}</button>
            <button type="button" className="pq-result__home" onPointerDown={game.home}>{copy.home}</button>
          </div>
        </section>
      )}
    </main>
  );
}
