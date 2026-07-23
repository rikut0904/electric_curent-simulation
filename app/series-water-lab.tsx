"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type Model = {
  key: string;
  label: string;
  title: string;
  formula: string;
  description: string;
};

const models: Model[] = [
  {
    key: "current",
    label: "Model 1",
    title: "直列接続の電流特性 - 電流はどこでも等しい",
    formula: "I = I1 = I2 = I3",
    description: "1本の川では分岐がないため、上流・岩場・下流のどこでも同じ電流が流れる。",
  },
  {
    key: "voltage",
    label: "Model 2",
    title: "直列接続の電圧特性",
    formula: "V = V1 + V2 + V3",
    description: "電圧降下はその抵抗がどれだけ電源が与えた全体の押す力を弱めるかを表す。",
  },
  {
    key: "resistance",
    label: "Model 3",
    title: "合成抵抗",
    formula: "R = R1 + R2 + R3",
    description: "合成抵抗は、複数の抵抗を同じ働きをする1つの大きな抵抗に置き換えたときの流れにくさのこと。",
  },
];

export function SeriesWaterLab() {
  const [active, setActive] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const viewerRef = useRef<HTMLDivElement>(null);
  const current = models[active];

  const next = () => setActive((value) => (value + 1) % models.length);
  const previous = () => setActive((value) => (value + models.length - 1) % models.length);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowRight") next();
      if (event.key === "ArrowLeft") previous();
      if (event.key === "f" || event.key === "F") toggleFullscreen();
    };

    const onFullscreenChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };

    window.addEventListener("keydown", onKeyDown);
    document.addEventListener("fullscreenchange", onFullscreenChange);

    return () => {
      window.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("fullscreenchange", onFullscreenChange);
    };
  }, []);

  const toggleFullscreen = async () => {
    if (!document.fullscreenElement) {
      await viewerRef.current?.requestFullscreen();
      return;
    }

    await document.exitFullscreen();
  };

  const scene = useMemo(() => {
    if (current.key === "current") return <CurrentScene />;
    if (current.key === "voltage") return <VoltageScene />;
    return <ResistanceScene />;
  }, [current.key]);

  return (
    <main className="shell">
      <header className="siteHeader">
        <div>
          <h1>直列接続</h1>
        </div>
      </header>

      <section ref={viewerRef} className="viewer" aria-label="直列接続モデルビューア">
        <div className="viewerTop">
          <div>
            <p>{current.label}</p>
            <h2>{current.title}</h2>
          </div>
          <button className="fullscreenButton" type="button" onClick={toggleFullscreen}>
            {isFullscreen ? "全画面終了" : "全画面"}
          </button>
        </div>

        <div className="slideFrame">
          <button className="navButton navLeft" type="button" onClick={previous} aria-label="前のモデルへ">
            ‹
          </button>
          <div className="ratioStage" key={current.key}>
            {scene}
          </div>
          <button className="navButton navRight" type="button" onClick={next} aria-label="次のモデルへ">
            ›
          </button>
        </div>

        <div className="viewerBottom">
          <strong>数式で表すと：{current.formula}</strong>
          <p>{current.description}</p>
          <div className="dots" aria-label="モデル選択">
            {models.map((model, index) => (
              <button
                key={model.key}
                className={index === active ? "dot active" : "dot"}
                type="button"
                onClick={() => setActive(index)}
                aria-label={`${model.label}を表示`}
              />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

function CurrentScene() {
  return (
    <svg viewBox="0 0 1600 900" role="img" aria-label="水流量がどこでも等しいモデル">
      <defs>
        <marker id="flowArrow" markerWidth="14" markerHeight="14" refX="12" refY="7" orient="auto">
          <path d="M2 2 L12 7 L2 12 Z" fill="#ffffff" />
        </marker>
      </defs>
      <SimpleRiver y={450} />
      <RiverArrow x1={210} x2={370} y={450} />
      <RiverArrow x1={560} x2={690} y={450} />
      <RiverArrow x1={850} x2={980} y={450} />
      <RiverArrow x1={1140} x2={1300} y={450} />
      <RockBarrier x={450} y={450} />
      <RockBarrier x={740} y={450} />
      <RockBarrier x={1030} y={450} />
      <text className="riverLabel" x="180" y="660">上流</text>
      <text className="riverLabel" x="1420" y="660">下流</text>
      <text className="sceneCaption" x="800" y="765">途中で枝分かれしない川なので、どの場所でも同じ量の水が流れる</text>
    </svg>
  );
}

function VoltageScene() {
  return (
    <svg viewBox="0 0 1600 900" role="img" aria-label="水の速さの変化で電圧を説明するモデル">
      <defs>
        <marker id="speedArrow" markerWidth="14" markerHeight="14" refX="12" refY="7" orient="auto">
          <path d="M2 2 L12 7 L2 12 Z" fill="#ffffff" />
        </marker>
      </defs>
      <SimpleRiver y={455} />
      <SpeedArrow x={200} y={455} length={185} label="速い流れ" />
      <SpeedArrow x={560} y={455} length={110} />
      <SpeedArrow x={845} y={455} length={135} />
      <SpeedArrow x={1140} y={455} length={165} label="遅い流れ" />
      <RockBarrier x={450} y={455} />
      <RockBarrier x={740} y={455} />
      <RockBarrier x={1030} y={455} />
      <text className="largeEquation" x="800" y="150">抵抗があると、全体の流れが遅くなる</text>
    </svg>
  );
}

function ResistanceScene() {
  return (
    <svg viewBox="0 0 1600 900" role="img" aria-label="合成抵抗は抵抗の和になるモデル">
      <defs>
        <marker id="arrowHead" markerWidth="14" markerHeight="14" refX="12" refY="7" orient="auto">
          <path d="M2 2 L12 7 L2 12 Z" fill="#f59e0b" />
        </marker>
      </defs>
      <SimpleRiver y={300} compact />
      <RockBarrier x={410} y={300} />
      <RockBarrier x={690} y={300} />
      <RockBarrier x={970} y={300} />
      <path className="combineArrow" d="M800 410 V520" markerEnd="url(#arrowHead)" />
      <SimpleRiver y={660} compact />
      <WideRockBarrier x={800} y={660} />
    </svg>
  );
}

function SimpleRiver({ y, compact = false }: { y: number; compact?: boolean }) {
  const height = compact ? 126 : 170;
  const top = y - height / 2;
  return (
    <g className={compact ? "simpleRiver compactRiver" : "simpleRiver"}>
      <rect className="landStrip upper" x="90" y={top - 34} width="1420" height="38" rx="18" />
      <rect className="landStrip lower" x="90" y={top + height - 4} width="1420" height="38" rx="18" />
      <rect className="riverBody" x="110" y={top} width="1380" height={height} rx="46" />
      <path className="riverSurface" d={`M160 ${y - 42} C330 ${y - 76} 500 ${y - 12} 670 ${y - 42} S1020 ${y - 72} 1200 ${y - 40} S1400 ${y - 12} 1460 ${y - 34}`} />
      <path className="riverSurface second" d={`M150 ${y + 35} C330 ${y + 2} 485 ${y + 70} 665 ${y + 36} S1025 ${y + 2} 1210 ${y + 34} S1395 ${y + 66} 1460 ${y + 40}`} />
    </g>
  );
}

function RiverArrow({ x1, x2, y }: { x1: number; x2: number; y: number }) {
  return <path className="riverArrow" d={`M${x1} ${y} H${x2}`} markerEnd="url(#flowArrow)" />;
}

function SpeedArrow({
  x,
  y,
  length,
  label="",
}: {
  x: number;
  y: number;
  length: number;
  label?: string;
}) {
  return (
    <g className="speedArrow">
      <path d={`M${x} ${y} H${x + length}`} markerEnd="url(#speedArrow)" />
      <text x={x + length / 2} y={y - 105}>{label}</text>
    </g>
  );
}

function RockBarrier({ x, y }: { x: number; y: number }) {
  return (
    <g className="rockBarrier" transform={`translate(${x} ${y})`}>
      <path d="M-62 -86 C-20 -126 52 -102 64 -46 C114 -20 92 54 34 54 C-16 96 -86 58 -72 0 C-96 -34 -92 -62 -62 -86" />
      <path d="M48 -72 C96 -106 150 -66 134 -12 C176 24 138 82 82 62 C36 46 18 -38 48 -72" />
      <path className="rapid" d="M-98 -18 C-42 18 14 18 68 -12 M42 26 C86 48 130 42 172 18" />
    </g>
  );
}

function WideRockBarrier({ x, y }: { x: number; y: number }) {
  return (
    <g className="wideRockBarrier" transform={`translate(${x} ${y})`}>
      <path d="M-210 -78 C-155 -148 -50 -122 -8 -62 C40 -154 180 -120 208 -28 C260 38 190 128 82 92 C-12 154 -176 110 -210 -78" />
      <path className="rapid" d="M-238 -18 C-166 28 -88 26 -18 -8 M30 24 C112 64 178 54 238 12" />
    </g>
  );
}

function FlowMarker({ x, y, label }: { x: number; y: number; label: string }) {
  return (
    <g className="flowMeter" transform={`translate(${x} ${y})`}>
      <circle r="58" />
      <path d="M-24 8 L-4 28 L30 -24" />
      <text y="100">{label}</text>
    </g>
  );
}
