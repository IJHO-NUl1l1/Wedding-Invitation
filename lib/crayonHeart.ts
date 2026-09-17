/**
 * 크레파스 하트의 경로 계산. 컴포넌트(app/components/CrayonHeart.tsx)와 검증 스크립트가 같이 쓴다.
 *
 * 실제로 손으로 칠하듯 한 획씩 긋는다.
 * 왼쪽 아래로 내려가는 획과 오른쪽 위로 올라가는 획을 번갈아 긋고, 획은 하트 윤곽선을 조금 지나친 뒤에 꺾는다.
 * 두 획이 벌어지는 각도는 획 길이에 따라 다르다. 하트 끝부분처럼 짧은 획은 넓게, 가운데처럼 긴 획은 좁게 벌어진다.
 *
 * 이전 방식들의 문제:
 * - 하트보다 큰 지그재그를 하트 모양으로 잘라내기: 윤곽이 너무 완벽해 손으로 칠한 느낌이 없었고,
 *   선이 하트 밖을 오래 지나 칠하는 도중 멈칫멈칫 끊겼다.
 * - 윤곽선에 닿자마자 꺾기: 꺾이는 자리들이 윤곽선을 따라 이어져 테두리 선이 있는 것처럼 보였다.
 *
 * 좌표계는 하단 참석여부 버튼(RsvpButton)의 하트와 같은 52x48이고, y는 아래로 갈수록 커진다.
 */

export type Pt = [number, number];

export const HEART_D =
  "M26 45S3 30.5 3 16.5C3 8.5 9 3 15.8 3c4.3 0 8.1 2.3 10.2 5.8C28.1 5.3 31.9 3 36.2 3 43 3 49 8.5 49 16.5 49 30.5 26 45 26 45z";

/** HEART_D를 이루는 3차 곡선들. S·상대좌표·반복 명령을 절대좌표 C로 풀어 쓴 것이다. */
const SEGMENTS: [Pt, Pt, Pt, Pt][] = [
  [[26, 45], [26, 45], [3, 30.5], [3, 16.5]],
  [[3, 16.5], [3, 8.5], [9, 3], [15.8, 3]],
  [[15.8, 3], [20.1, 3], [23.9, 5.3], [26, 8.8]],
  [[26, 8.8], [28.1, 5.3], [31.9, 3], [36.2, 3]],
  [[36.2, 3], [43, 3], [49, 8.5], [49, 16.5]],
  [[49, 16.5], [49, 30.5], [26, 45], [26, 45]],
];

function cubicAt([p0, p1, p2, p3]: [Pt, Pt, Pt, Pt], t: number): Pt {
  const m = 1 - t;
  const a = m * m * m, b = 3 * m * m * t, c = 3 * m * t * t, d = t * t * t;
  return [a * p0[0] + b * p1[0] + c * p2[0] + d * p3[0], a * p0[1] + b * p1[1] + c * p2[1] + d * p3[1]];
}

/** 하트 윤곽을 점으로 바꾼 다각형. 경로 계산이 한 번뿐이라 이 정도 밀도로 충분하다 */
export const HEART_POLYGON: Pt[] = SEGMENTS.flatMap((seg) =>
  Array.from({ length: 24 }, (_, i) => cubicAt(seg, i / 24))
);

/** 점이 하트 안에 있는지 (반직선 교차 판정) */
export function insideHeart([x, y]: Pt): boolean {
  let inside = false;
  const poly = HEART_POLYGON;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const [xi, yi] = poly[i];
    const [xj, yj] = poly[j];
    if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) inside = !inside;
  }
  return inside;
}

export type ScribbleOptions = {
  /** 획의 평균 기울기(°, 수평 기준). 내려가는 획은 이보다 가파르고 올라가는 획은 이보다 완만하다 */
  slope: number;
  /** 짧은 획에서 내려가는 획과 올라가는 획이 벌어지는 각도(°) */
  spreadShort: number;
  /** 긴 획에서 벌어지는 각도(°) */
  spreadLong: number;
  /** 하트 안에서 지나는 길이가 이 이하면 짧은 획으로 본다 */
  shortLength: number;
  /** 이 이상이면 긴 획으로 본다. 그 사이는 길이에 비례해 각도가 줄어든다 */
  longLength: number;
  /** 획마다 각도가 흔들리는 폭(°) */
  angleJitter: number;
  /** 꺾는 자리에서 옆으로 더 옮기는 거리. 0이면 두 각도의 차이만으로 나아간다. 키우면 더 성기게 칠해진다 */
  spacing: number;
  /** spacing이 들쭉날쭉한 정도 (0 = 일정) */
  jitter: number;
  /**
   * 꺾을 때마다 윤곽선 밖으로 벗어나는 비율(%)의 범위 [최소, 최대].
   * 기준은 그 획이 하트 안에서 지나는 길이다. 30칸 획에 2%면 윤곽선 밖으로 0.6칸 나간 뒤 꺾는다.
   * 꺾는 횟수만큼 이 범위 안에서 비율을 미리 뽑아 두고 그 순서대로 그린다.
   */
  overshootPct: [number, number];
  /** 꺾는 자리를 둥글게 도는 정도. 0이면 뾰족하게 꺾인다 */
  turnRound: number;
  /** 한 획이 곧지 않고 휘는 정도 */
  bend: number;
  /**
   * 마지막으로 꺾인 획만 더 가파르게 세우는 각도(°).
   * 마지막 획이 하트 위쪽까지 올라가야 거기서 꺾어 뾰족한 끝까지 길게 내려그을 수 있다.
   * (벌어짐 각도를 키우는 방식은 올라가는 획이 오히려 완만해져 옆에서 끝나 버렸다)
   */
  lastAngleBoost: number;
  /** 마지막 획 끝에서 한 번 더 꺾어 하트 아래 뾰족한 끝을 향해 한 획 더 긋는다 */
  finishAtTip: boolean;
  /**
   * 뾰족한 끝까지 그은 뒤, 거기서 다른 획들과 똑같은 규칙으로 V자로 꺾어 더 긋는 일반 획 수 (finishAtTip이 켜져 있을 때만).
   * 마지막 획들이 하트 오른쪽 아래에 닿기 전에 끝나 오른쪽이 비스듬히 잘린 것처럼 보여 한 획 더 긋는다.
   */
  extraStrokes: number;
  /** 뾰족한 끝을 향해 내려가는 획을, 끝을 겨눈 방향보다 더 가파르게 세우는 각도(°) */
  tipAngleBoost: number;
  /** 뾰족한 끝 뒤에 긋는 추가 획의 길이 배율. 2면 두 배로 길게 긋는다 (그만큼 하트 밖으로 더 나간다) */
  extraStrokeScale: number;
  seed: number;
};

/** 획 하나의 기록. 검증 스크립트가 각도와 벗어난 비율을 확인할 때 쓴다 */
export type StrokeInfo = {
  direction: "down" | "up";
  /** 하트 안에서 지나는 길이 */
  insideLength: number;
  /** 이 획에 적용한 벌어짐 각도(°) */
  spread: number;
  /** 실제로 그은 기울기(°) */
  angle: number;
  /** 윤곽선 밖으로 벗어난 비율(%) */
  overshoot: number;
};

const add = (p: Pt, d: Pt, t: number): Pt => [p[0] + d[0] * t, p[1] + d[1] * t];

/**
 * 하트를 대각선으로 칠하는 경로.
 * 렌더마다 모양이 바뀌지 않게 고정 시드로 흔든다.
 * points는 경로를 따라 찍은 점들로, 검증 스크립트가 선이 하트 밖을 지나는 비율을 잴 때 쓴다.
 *
 * 마지막 획에만 각도를 더 벌리려면 어느 획이 마지막인지 먼저 알아야 해서, 같은 설정으로 한 번 미리 그려
 * 획 수를 센 뒤 다시 그린다. 랜덤 값을 같은 순서로 쓰므로 마지막 획 전까지는 두 번 모두 똑같다.
 */
export function scribbleAcrossHeart(o: ScribbleOptions) {
  const dry = buildScribble(o, -1);
  return buildScribble(o, dry.strokes.length - 1);
}

/** lastIndex: 마지막 획의 번호. -1이면 마지막 획 처리 없이 자연스럽게 끝날 때까지 그린다 */
function buildScribble(o: ScribbleOptions, lastIndex: number) {
  let s = o.seed;
  const rand = () => {
    s = (s * 16807) % 2147483647;
    return s / 2147483647 - 0.5;
  };

  /** 화면 기준 방향. down이면 왼쪽 아래, 아니면 오른쪽 위 */
  const dir = (deg: number, down: boolean): Pt => {
    const r = (deg * Math.PI) / 180;
    return down ? [-Math.cos(r), Math.sin(r)] : [Math.cos(r), -Math.sin(r)];
  };

  // 칠해 나가는 방향: 평균 기울기에 수직인 오른쪽 아래
  const slopeRad = (o.slope * Math.PI) / 180;
  const sweep: Pt = [Math.sin(slopeRad), Math.cos(slopeRad)];

  /** p에서 d로 나아갈 때 하트에 처음 들어가는 거리와 마지막으로 나오는 거리. 가운데 오목한 곳은 건너간다 */
  const cross = (p: Pt, d: Pt): [number, number] | null => {
    let first = -1;
    let last = -1;
    for (let t = 0; t < 90; t += 0.3) {
      if (insideHeart(add(p, d, t))) {
        if (first < 0) first = t;
        last = t;
      }
    }
    return first < 0 ? null : [first, last];
  };

  // 꺾을 때마다 윤곽선 밖으로 벗어날 비율을 미리 뽑아 둔다. 그리는 동안에는 이 순서대로만 쓴다
  const [minPct, maxPct] = o.overshootPct;
  const plan = Array.from({ length: 80 }, () => +(minPct + (rand() + 0.5) * (maxPct - minPct)).toFixed(1));

  // 시작: 하트 왼쪽 위에서 첫 획(왼쪽 아래로)이 하트를 지나는 자리를 찾고, 들어가기 조금 전에서 출발한다
  const firstDir = dir(o.slope, true);
  const center: Pt = [26, 24];
  let start: Pt | null = null;
  for (let k = -40; k < 40; k += 1) {
    const from = add(add(center, sweep, k), firstDir, -45);
    const c = cross(from, firstDir);
    if (c) {
      start = add(from, firstDir, c[0] - 1);
      break;
    }
  }
  if (!start) return { d: "", points: [] as Pt[], strokes: [] as StrokeInfo[] };

  const points: Pt[] = [start];
  let d = `M${start[0].toFixed(2)} ${start[1].toFixed(2)}`;
  let p = start;

  const sampleQuad = (a: Pt, q: Pt, b: Pt, steps: number) => {
    for (let j = 1; j <= steps; j++) {
      const t = j / steps;
      const m = 1 - t;
      points.push([m * m * a[0] + 2 * m * t * q[0] + t * t * b[0], m * m * a[1] + 2 * m * t * q[1] + t * t * b[1]]);
    }
  };

  const strokes: StrokeInfo[] = [];

  /**
   * 일반 획 하나를 긋고 하트 바깥에서 꺾는다. 반복 구간과 뾰족한 끝 뒤의 추가 획이 같이 쓴다.
   * planIndex번째로 미리 정해 둔 튀어나옴 비율을 쓴다. 하트에 걸리지 않으면 긋지 않고 false를 돌려준다.
   *
   * forceDraw를 켜면 하트에 걸리지 않아도 생략하지 않고, 원래 규칙대로의 각도로 짧은 획 기준 길이(shortLength)만큼
   * 이어서 긋는다. 뾰족한 끝 뒤의 추가 획용이다. 앞 획이 끝난 자리에서 반드시 이어 그려야 해서,
   * 각도가 조금 어색해도 하트에 걸리는 각도를 따로 찾지 않는다.
   * 반복 구간은 끄고 쓰므로 하트에 안 걸리면 끝나고, 랜덤 값을 쓰는 순서도 예전과 같다.
   */
  const drawStroke = (
    down: boolean,
    planIndex: number,
    angleBoost: number,
    lengthScale = 1,
    forceDraw = false
  ): boolean => {
    // 먼저 평균 기울기로 그었을 때의 길이를 보고, 짧은 획일수록 넓게 긴 획일수록 좁게 벌린다
    const probe = cross(p, dir(o.slope, down));
    if (!probe && !forceDraw) return false; // 더 칠할 곳이 없으면 끝
    const probeLength = probe ? probe[1] - probe[0] : 0;
    const k = Math.min(1, Math.max(0, (probeLength - o.shortLength) / (o.longLength - o.shortLength)));
    const spread = o.spreadShort + (o.spreadLong - o.spreadShort) * k;
    // 내려가는 획은 평균보다 가파르게, 올라가는 획은 완만하게
    const angle = (down ? o.slope + spread / 2 : o.slope - spread / 2) + rand() * 2 * o.angleJitter + angleBoost;
    const heading = dir(angle, down);

    const c = cross(p, heading);
    if (!c && !forceDraw) return false;

    // 하트에 걸리면 윤곽선을 지나 미리 정해 둔 비율만큼 더 나간 뒤 멈추고,
    // 걸리지 않으면(forceDraw) 짧은 획 기준 길이만큼 긋는다. lengthScale을 주면 그은 길이 전체를 배로 늘린다
    const insideLength = c ? c[1] - c[0] : 0;
    const reach = (c ? c[1] + (insideLength * plan[planIndex]) / 100 : o.shortLength) * lengthScale;
    const end = add(p, heading, reach);
    strokes.push({
      direction: down ? "down" : "up",
      insideLength: +insideLength.toFixed(1),
      spread: +spread.toFixed(1),
      angle: +angle.toFixed(1),
      // 길이를 늘리면 미리 정한 비율보다 더 나가므로 실제로 벗어난 비율을 기록한다. 하트에 안 걸리면 0
      overshoot: c ? +(((reach - c[1]) / insideLength) * 100).toFixed(1) : 0,
    });

    // 한 획은 손목이 흔들린 듯 가운데가 살짝 휜다
    const mid: Pt = [(p[0] + end[0]) / 2, (p[1] + end[1]) / 2];
    const ctrl = add(mid, [-heading[1], heading[0]], rand() * 2 * o.bend);
    d += ` Q${ctrl[0].toFixed(2)} ${ctrl[1].toFixed(2)} ${end[0].toFixed(2)} ${end[1].toFixed(2)}`;
    sampleQuad(p, ctrl, end, 14);

    // 하트 바깥에서 꺾는다. 두 획의 각도가 달라 꺾어 돌아오는 것만으로도 칠해 나가는 방향으로 나아가고,
    // spacing만큼 옆으로 더 옮기면 그만큼 성기게 칠해진다.
    // 옮기는 구간은 둥글게 돌아 손으로 휙 꺾은 모양이 된다 (곧은 선으로 옮기면 네모난 고리처럼 보였다)
    if (o.spacing > 0) {
      const next = add(end, sweep, o.spacing * (1 + rand() * o.jitter));
      const hook = add([(end[0] + next[0]) / 2, (end[1] + next[1]) / 2], heading, o.turnRound);
      d += ` Q${hook[0].toFixed(2)} ${hook[1].toFixed(2)} ${next[0].toFixed(2)} ${next[1].toFixed(2)}`;
      sampleQuad(end, hook, next, 6);
      p = next;
    } else {
      p = end;
    }
    return true;
  };

  for (let i = 0; i < plan.length; i++) {
    const isLast = i === lastIndex;
    // 마지막 획은 더 가파르게 세운다
    if (!drawStroke(i % 2 === 0, i, isLast ? o.lastAngleBoost : 0)) break;
    // 세운 마지막 획 뒤에는 다음 획이 다시 하트에 걸릴 수 있어, 정해 둔 곳에서 멈춘다
    if (isLast) break;
  }

  // 마지막 획 끝에서 한 번 더 꺾어, 하트 아래 뾰족한 끝을 지나도록 한 획 더 긋는다.
  // 이 획이 없으면 아래 끝까지 칠해지지 않아 뭉툭해 보였다
  if (lastIndex >= 0 && o.finishAtTip && strokes.length > 0) {
    const tip: Pt = [26, 42.5]; // 뾰족한 끝(26,45)보다 살짝 안쪽을 겨눠 끝을 확실히 지나게 한다
    const dx = tip[0] - p[0];
    const dy = tip[1] - p[1];
    // 끝을 겨눈 방향에서 tipAngleBoost만큼 더 가파르게 세운다 (좌우·위아래 방향은 그대로)
    const aimed = Math.atan2(Math.abs(dy), Math.abs(dx)) + (o.tipAngleBoost * Math.PI) / 180;
    const heading: Pt = [Math.sign(dx) * Math.cos(aimed), Math.sign(dy) * Math.sin(aimed)];
    const c = cross(p, heading);
    if (c) {
      const pct = plan[strokes.length];
      const insideLength = c[1] - c[0];
      const end = add(p, heading, c[1] + (insideLength * pct) / 100);
      strokes.push({
        direction: heading[1] > 0 ? "down" : "up",
        insideLength: +insideLength.toFixed(1),
        spread: 0,
        angle: +((Math.atan2(Math.abs(heading[1]), Math.abs(heading[0])) * 180) / Math.PI).toFixed(1),
        overshoot: pct,
      });
      const mid: Pt = [(p[0] + end[0]) / 2, (p[1] + end[1]) / 2];
      const ctrl = add(mid, [-heading[1], heading[0]], rand() * 2 * o.bend);
      d += ` Q${ctrl[0].toFixed(2)} ${ctrl[1].toFixed(2)} ${end[0].toFixed(2)} ${end[1].toFixed(2)}`;
      sampleQuad(p, ctrl, end, 14);
      p = end;

      // 뾰족한 끝에서 다른 획들과 똑같이 V자로 꺾어 일반 획을 더 긋는다. 끝으로 내려온 다음이라 첫 추가 획은 올라간다
      for (let e = 0; e < o.extraStrokes; e++) {
        if (!drawStroke(e % 2 === 1, strokes.length, 0, o.extraStrokeScale, true)) break;
      }
    }
  }

  return { d, points, strokes };
}
