import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: false,
  images: {
    // Next 16부터 필수. 여기 없는 값은 조용히 기본값(75)으로 떨어진다.
    // 손글씨 편지는 75에서 획이 뭉개져 90을 함께 허용한다.
    qualities: [75, 90],
  },
};

export default nextConfig;
