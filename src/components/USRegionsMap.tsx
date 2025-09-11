import React from "react";
import { View } from "react-native";
import Svg, { Path, Text as SvgText } from "react-native-svg";

type USRegionsMapProps = {
  selected?: string[];
  onToggle?: (region: string) => void;
};

const USRegionsMap: React.FC<USRegionsMapProps> = ({ selected = [], onToggle }) => {
  const on = (r: string) => selected.includes(r);
  const fill = (r: string) => (on(r) ? "#059669" : "#E5E7EB");
  const label = (r: string) => (on(r) ? "white" : "#374151");

  const outline =
    "M110,330 C96,300 110,270 140,248 C175,222 210,190 260,180 C300,172 340,176 372,186 C405,197 438,188 470,197 C520,212 552,236 592,236 C632,236 660,228 688,246 C712,260 724,260 744,272 C764,292 762,312 744,328 C726,344 708,360 676,380 C640,402 596,420 556,430 C516,440 476,440 438,432 C398,424 360,406 324,396 C290,388 268,376 236,364 C206,354 168,352 138,362 C122,368 108,356 110,330 Z";

  const regions: Record<string, string> = {
    West: "M125,322 L142,270 L170,240 L215,230 L255,238 L290,252 L296,292 L296,332 L262,346 L220,354 L170,345 Z",
    Midwest: "M296,252 L360,240 L430,236 L495,242 L495,300 L430,308 L340,312 L296,296 Z",
    South: "M296,300 L430,308 L520,304 L610,312 L610,372 L520,384 L430,388 L360,382 L300,360 Z",
    Northeast: "M495,242 L560,246 L620,258 L680,280 L680,320 L620,316 L560,312 L495,300 Z",
  };

  const labelPos: Record<string, { x: number; y: number }> = {
    West: { x: 210, y: 305 },
    Midwest: { x: 395, y: 285 },
    South: { x: 470, y: 360 },
    Northeast: { x: 610, y: 295 },
  };

  return (
<View style={{ flex: 1, justifyContent: "center", alignItems: "center" , marginTop: -20  }}>
<Svg width={350} height={240} viewBox="0 100 800 240">
        <Path d={outline} fill="#F3F4F6" stroke="#9CA3AF" strokeWidth={2} />
        {Object.entries(regions).map(([name, d]) => (
          <React.Fragment key={name}>
            <Path
              d={d}
              fill={fill(name)}
              stroke="#374151"
              strokeWidth={1.5}
              onPress={() => onToggle?.(name)}
            />
            <SvgText
              x={labelPos[name].x}
              y={labelPos[name].y}
              fontSize={24}
              fontWeight="bold"
              textAnchor="middle"
              fill={label(name)}
              onPress={() => onToggle?.(name)}
            >
              {name}
            </SvgText>
          </React.Fragment>
        ))}
      </Svg>
    </View>
  );
};

export default USRegionsMap;
