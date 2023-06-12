import style from "./HeaderTwo.module.scss";
import React from "react";
// eslint-disable-next-line no-unused-vars
import PieSvg from "./PieSvg";

interface LegendProps {
  color: string | string[];
  label: string;
  svgPath?: string[];
}

const participantColors = [
  { color: "#B60E3C", label: "이준석" },
  { color: "#C7611E", label: "박휘락" },
  { color: "#00AB6E", label: "김종대" },
  { color: "#00a0e2", label: "장경태" },
  { color: "#808080", label: "진행자" },
];

const topicColors = [
  { color: "#400000", label: "논쟁" },
  { color: "#ff0000", label: "논쟁구간" },
];

const LegendItem: React.FC<LegendProps> = ({ color, label }) => {
  const isOutlineOnly = label === "논쟁구간";

  const transform = isOutlineOnly
    ? "translate(8, 11.5) rotate(45) translate(-8, -8)"
    : "";

  let labelStyle = { marginTop: "-25px" };

  if (label === "논쟁") {
    //@ts-ignore
    labelStyle = { ...labelStyle, marginRight: "11px" };
  } else if (label === "논쟁구간") {
    //@ts-ignore
    labelStyle = { ...labelStyle, marginLeft: "20px" };
  }

  return (
    <>
      <svg
        width="16"
        height="16"
        style={{ marginTop: "-22.5px", marginRight: "5px", marginLeft: "8px" }}
      >
        <rect
          width={isOutlineOnly ? "11" : "16"}
          height={isOutlineOnly ? "11" : "16"}
          //@ts-ignore
          fill={isOutlineOnly ? "none" : color}
          transform={transform}
          //@ts-ignore
          stroke={color}
          strokeWidth="1"
        />
      </svg>
      <div style={labelStyle}>{label}</div>
    </>
  );
};

export default function Header() {
  return (
    <a className={style.mainLink}>
      <div className={style.naviTwo}>
        {/* <h3 style={{ marginLeft: "5px", marginTop: "-18px" }}>Data: 모병제</h3> */}
        <h3
          style={{ marginLeft: "5px", marginTop: "-18px", fontWeight: "550" }}
        >
          Legends:
        </h3>

        <div style={{ display: "flex", alignItems: "center" }}>
          {participantColors.map((item, i) => (
            <LegendItem
              key={i}
              color={item.color}
              label={item.label}
            ></LegendItem>
          ))}
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            marginBottom: "-55px",
            marginLeft: "-327px",
          }}
        >
          {topicColors.map((item, i) => (
            <LegendItem
              key={i}
              color={item.color}
              label={item.label}
            ></LegendItem>
          ))}
          <svg
            width="18"
            height="18"
            style={{ marginLeft: "-68px", marginTop: "-19px" }}
          >
            <path
              d="M8,1.6C8,1.6,8,1.6,8,1.6L8,0C3.6,0,0,3.6,0,8h1.6C1.6,4.5,4.5,1.6,8,1.6z"
              style={{
                fill: "#B60E3C",
                stroke: "#B60E3C",
                strokeWidth: "1",
              }}
            ></path>
            <path
              d="M14.3,8H16c0-4.4-3.6-8-8-8v1.6C11.5,1.6,14.3,4.5,14.3,8z"
              style={{
                fill: "#C7611E",
                stroke: "#C7611E",
                strokeWidth: "1",
              }}
            ></path>
            <path
              d="M8,14.4c-3.5,0-6.4-2.8-6.4-6.4H0c0,4.4,3.6,8,8,8L8,14.4C8,14.4,8,14.4,8,14.4z"
              style={{
                fill: "#00AB6E",
                stroke: "#00AB6E",
                strokeWidth: "1",
              }}
            ></path>
            <path
              d="M14.3,8c0,3.5-2.8,6.4-6.3,6.4V16c4.4,0,8-3.6,8-8H14.3z"
              style={{
                fill: "#00a0e2",
                stroke: "#00a0e2",
                strokeWidth: "1",
              }}
            ></path>
          </svg>
        </div>
      </div>
    </a>
  );
}
