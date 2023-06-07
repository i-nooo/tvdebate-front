import React, { useEffect, useRef } from "react";
import style from "./Bubble.module.scss";
import * as d3 from "d3";
// eslint-disable-next-line no-unused-vars

export const Bubble = () => {
  const svgRef = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    if (svgRef.current) {
      //@ts-ignore
      const svg = d3.select(svgRef.current);

      const zoomed = (event: any) => {
        const { transform } = event;
        svg.attr("transform", transform);
      };

      const zoom = d3.zoom().scaleExtent([1, 1]).on("zoom", zoomed);
      //@ts-ignore
      svg.call(zoom);
    }
  }, []);

  return (
    <div className={style.bubbleContainer}>
      <div className={style.title}>
        Bubble Chart for Comparing Argumentation
      </div>
      <svg
        ref={svgRef}
        className={style.bubbleArea}
        xmlns="http://www.w3.org/2000/svg"
        xmlnsXlink="http://www.w3.org/1999/xlink"
        version="1.1"
        id="레이어_1"
        x="0px"
        y="0px"
        viewBox="0 0 1503.7 270"
        xmlSpace="preserve"
      >
        <style type="text/css"></style>

        <g transform="translate(895.4209809026149,333.6451320096652)">
          <path
            className={style.st0}
            d="M-800.7-282c51.5,0,93.2,41.7,93.2,93.2c0,29.8-14.3,57.9-38.4,75.4l-5-6.9c37.9-27.5,46.2-80.5,18.7-118.3   c-15.9-21.9-41.4-34.9-68.5-34.9V-282z"
          />
          <path
            className={style.st1}
            d="M-873.9-246.6c17.7-22.4,44.6-35.5,73.2-35.5v8.5c-25.9,0-50.5,11.9-66.5,32.3L-873.9-246.6z"
          />
          <path
            className={style.st2}
            d="M-871.5-128.3c-28.9-33.8-29.8-83.3-2.3-118.2l6.7,5.2c-25,31.7-24.1,76.7,2.1,107.5L-871.5-128.3z"
          />
          <path
            className={style.st3}
            d="M-745.9-113.5c-39.3,28.6-94.1,22.1-125.6-14.9l6.4-5.5c28.7,33.6,78.4,39.5,114.2,13.5L-745.9-113.5z"
          />
        </g>

        <text
          transform="matrix(1 0 0 1 47.4324 43.0281)"
          className={style.title0}
        >
          토론 시작 및 모병제 도입
        </text>
        <g transform="translate(1350.9128576241155,539.4636084343023)">
          <path
            className={style.st3}
            d="M-1029.3-309.4c-46,22.4-101.4,3.3-123.8-42.7c-2-4.1-3.7-8.4-5.1-12.8l8-2.5c14,44.4,61.2,69,105.6,55.1   c4-1.3,7.9-2.8,11.6-4.6L-1029.3-309.4z"
          />
          <path
            className={style.st2}
            d="M-1158.2-364.9c-14.6-46.4,9.2-96.2,54.4-114l3.1,7.8c-41.1,16.2-62.7,61.5-49.5,103.6L-1158.2-364.9z"
          />
          <path
            className={style.st0}
            d="M-1069.8-485.3c51.2,0,92.6,41.5,92.6,92.6c0,35.4-20.2,67.8-52.1,83.3l-3.7-7.6   c41.8-20.4,59.2-70.8,38.8-112.6c-14.1-29-43.5-47.3-75.7-47.3V-485.3z"
          />
          <path
            className={style.st1}
            d="M-1103.8-478.9c10.8-4.3,22.3-6.4,33.9-6.4v8.4c-10.6,0-21,2-30.9,5.9L-1103.8-478.9z"
          />
        </g>
        <text transform="matrix(1 0 0 1 245.6339 37.918)" className={style.st7}>
          <tspan x="0" y="0" className={style.title0}>
            인구절벽, 징병제에{" "}
          </tspan>
          <tspan x="15" y="10.8" className={style.title0}>
            {" "}
            미치는 영향
          </tspan>
        </text>
        <path
          className={style.st8}
          d="M473.5,47.3c54.5,0,98.8,44.2,98.8,98.8s-44.2,98.8-98.8,98.8c-8.2,0-16.3-1-24.2-3l2.2-8.7  c48.1,12.2,96.9-17,109.1-65s-17-96.9-65-109.1c-7.2-1.8-14.6-2.7-22-2.7V47.3z"
        />
        <path
          className={style.st3}
          d="M415.6,66.1c16.8-12.2,37.1-18.7,57.8-18.7v9c-18.9,0-37.3,6-52.6,17L415.6,66.1z"
        />
        <path
          className={style.st0}
          d="M374.9,140.3c1.7-29.6,16.7-56.9,40.8-74.3l5.3,7.3c-21.9,15.8-35.5,40.6-37,67.5L374.9,140.3z"
        />
        <path
          className={style.st9}
          d="M449.3,241.9c-45.9-11.6-77.2-54.2-74.4-101.5l9,0.5c-2.5,43,25.9,81.8,67.6,92.3L449.3,241.9z"
        />
        <text
          transform="matrix(1 0 0 1 436.5184 32.5628)"
          className={style.st7}
        >
          <tspan x="0" y="0" className={style.title0}>
            모병제, 병력 충원에{" "}
          </tspan>
          <tspan x="16.5" y="10.8" className={style.title0}>
            {" "}
            문제 없나?
          </tspan>
        </text>
        <path
          className={style.st2}
          d="M657.8,66.2c46.2,0,83.7,37.5,83.7,83.7c0,22.7-9.2,44.5-25.6,60.2l-5.3-5.5c30.2-29.2,31.1-77.3,1.9-107.6  c-14.3-14.9-34.1-23.3-54.8-23.3V66.2z"
        />
        <path
          className={style.st10}
          d="M715.9,210.2c-33.1,31.9-85.8,31.2-117.9-1.7l5.4-5.3c29.2,29.9,77.1,30.6,107.2,1.6L715.9,210.2z"
        />
        <path
          className={style.st8}
          d="M598,208.5c-31.5-32.2-31.9-83.6-0.8-116.2l5.5,5.2c-28.2,29.7-27.9,76.4,0.8,105.6L598,208.5z"
        />
        <path
          className={style.st0}
          d="M597.1,92.3c15.8-16.6,37.7-26,60.7-26v7.6c-20.8,0-40.8,8.6-55.2,23.7L597.1,92.3z"
        />
        <text
          transform="matrix(1 0 0 1 614.9458 46.7298)"
          className={style.st7}
        >
          <tspan x="0" y="0" className={style.title0}>
            모병제, 일자리 문제{" "}
          </tspan>
          <tspan x="30" y="10.8" className={style.title0}>
            {" "}
            해결책?
          </tspan>
        </text>

        <circle className={style.st9} cx="32.3" cy="161.3" r="16.2" />
        <text transform="matrix(1 0 0 1 21.8709 159.8806)">
          <tspan x="3" y="0" className={style.style0}>
            {" "}
            50만군
          </tspan>
          <tspan x="0" y="6" className={style.style0}>
            {" "}
            유지불가
          </tspan>
        </text>
        <circle className={style.st9} cx="32.1" cy="129.8" r="15.3" />
        <text
          transform="matrix(1 0 0 1 19.7684 131.1424)"
          className={style.style1}
        >
          인구절벽위협
        </text>
        <circle className={style.st10} cx="122.4" cy="122" r="17.3" />
        <text
          transform="matrix(1 0 0 1 112.1123 121.3133)"
          className={style.st7}
        >
          <tspan x="0" y="0" className={style.style2}>
            청년인구{" "}
          </tspan>
          <tspan x="5" y="6.5" className={style.style2}>
            {" "}
            감소
          </tspan>
        </text>
        <circle className={style.st10} cx="114.4" cy="156.6" r="18.4" />
        <circle className={style.st15} cx="154.1" cy="155.7" r="21.3" />
        <text
          transform="matrix(1 0 0 1 138.6409 152.9124)"
          className={style.st7}
        >
          <tspan x="6" y="0" className={style.style3}>
            {" "}
            미비한
          </tspan>
          <tspan x="0" y="8.4" className={style.style3}>
            군정책검토
          </tspan>
        </text>
        <circle className={style.st8} cx="153.4" cy="120.6" r="13.7" />
        <text transform="matrix(1 0 0 1 144.2659 119.1668)">
          <tspan x="0" y="0" className={style.style0}>
            감군대비{" "}
          </tspan>
          <tspan x="0" y="6" className={style.style0}>
            {" "}
            무대책
          </tspan>
        </text>
        <circle className={style.st8} cx="64.5" cy="126.5" r="17.2" />
        <circle className={style.st15} cx="66.6" cy="161.8" r="18.1" />
        <text
          transform="matrix(1 0 0 1 56.0789 163.4104)"
          className={style.style2}
        >
          북 핵위협
        </text>
        <text
          transform="matrix(1 0 0 1 123.575 95.3377)"
          className={style.title1}
        >
          현 군상황
        </text>
        <circle className={style.st19} cx="51.3" cy="145.9" r="40.9" />
        <circle className={style.st19} cx="135.8" cy="144" r="43.6" />
        <text
          transform="matrix(1 0 0 1 32.4627 97.9783)"
          className={style.title1}
        >
          현 사회상황
        </text>
        <circle className={style.st15} cx="256.7" cy="132.9" r="16.8" />
        <text transform="matrix(1 0 0 1 242.8604 130.387)">
          <tspan x="4" y="0" className={style.style0}>
            {" "}
            대책없는{" "}
          </tspan>
          <tspan x="0" y="6" className={style.style0}>
            총선용 모병제
          </tspan>
        </text>
        <circle className={style.st10} cx="221.2" cy="134.6" r="18.8" />
        <text
          transform="matrix(1 0 0 1 210.2593 132.8872)"
          className={style.style4}
        >
          <tspan x="0" y="0" className={style.style4}>
            전쟁양상
          </tspan>
          <tspan x="3" y="7" className={style.style4}>
            무인화
          </tspan>
        </text>
        <circle className={style.st8} cx="259.2" cy="164.2" r="14.6" />
        <text
          transform="matrix(1 0 0 1 250.6749 162.8675)"
          className={style.st7}
        >
          <tspan x="0" y="0" className={style.style0}>
            자주국방{" "}
          </tspan>
          <tspan x="2" y="6" className={style.style0}>
            {" "}
            어려움
          </tspan>
        </text>
        <circle className={style.st9} cx="310.3" cy="173.7" r="15.6" />
        <text transform="matrix(1 0 0 1 297.9021 173.534)">
          <tspan x="0" y="0" className={style.style1}>
            직업군인위주
          </tspan>
          <tspan x="3" y="5.5" className={style.style1}>
            {" "}
            편제개편
          </tspan>
        </text>
        <circle className={style.st9} cx="300.2" cy="142.5" r="17.4" />
        <text transform="matrix(1 0 0 1 288.6936 141.0613)">
          <tspan x="0" y="0" className={style.style1}>
            감축을 통한
          </tspan>
          <tspan x="0.8" y="5.2" className={style.style1}>
            {" "}
            군 정예화
          </tspan>
        </text>
        <circle className={style.st15} cx="341" cy="148.6" r="24" />
        <text transform="matrix(1 0 0 1 329.5245 144.0694)">
          <tspan x="0" y="0" className={style.style2}>
            질적향상과
          </tspan>
          <tspan x="1.8" y="6.5" className={style.style2}>
            현대화 후
          </tspan>
          <tspan x="-0.8" y="13.1" className={style.style2}>
            모병제 도입
          </tspan>
        </text>
        <circle className={style.st19} cx="238.4" cy="148.6" r="41.5" />
        <circle className={style.st19} cx="323.1" cy="151" r="42.2" />
        <text
          transform="matrix(1 0 0 1 210.2037 104.7032)"
          className={style.title2}
        >
          인구절벽, 모병제가 답인가?
        </text>
        <text
          transform="matrix(1 0 0 1 297.4009 104.8545)"
          className={style.title2}
        >
          인력확충 문제, 해결법은?
        </text>
        <circle className={style.st10} cx="228.2" cy="170" r="17.2" />
        <text
          transform="matrix(1 0 0 1 217.7371 167.8357)"
          className={style.st7}
        >
          <tspan x="3" y="0" className={style.style12}>
            {" "}
            50만군
          </tspan>
          <tspan x="0" y="6.7" className={style.style12}>
            유지불가
          </tspan>
        </text>
        <text
          transform="matrix(1 0 0 1 395.4852 169.0567)"
          className={style.style6}
        >
          감축을 통한
        </text>
        <text
          transform="matrix(1 0 0 1 396.8929 173.1856)"
          className={style.style6}
        >
          군 정예화
        </text>
        <ellipse
          className={style.st8}
          cx="537.3"
          cy="122.5"
          rx="14"
          ry="14.2"
        />
        <circle className={style.st8} cx="510.9" cy="149.7" r="23.8" />
        <text
          transform="matrix(-1 0 0 1 523.5291 167.9248)"
          className={style.title3}
        >
          {" "}
        </text>
        <ellipse
          className={style.st9}
          cx="482.7"
          cy="124.8"
          rx="13.7"
          ry="13.9"
        />
        <text
          transform="matrix(0.9897 0 0 1 474.7341 123.618)"
          className={style.st7}
        >
          <tspan x="0" y="0" className={style.style8}>
            정예화된{" "}
          </tspan>
          <tspan x="4" y="5.8" className={style.style8}>
            {" "}
            보병
          </tspan>
        </text>
        <ellipse
          className={style.st9}
          cx="484"
          cy="175.8"
          rx="13.5"
          ry="13.6"
        />
        <text
          transform="matrix(1 0 0 1 487.6693 92.6934)"
          className={style.title2}
        >
          모병제, 과연 현실적인가?
        </text>
        <circle className={style.st8} cx="539.2" cy="174.6" r="13.9" />
        <circle className={style.st10} cx="473.4" cy="150.6" r="13.7" />
        <circle className={style.st19} cx="511.3" cy="149.5" r="52" />
        <path
          className={style.st8}
          d="M548.8,134.3c-7.8,0-14.1,6.3-14.1,14c0,7.7,6.3,14,14.1,14s13.9-6.3,13.9-14  C562.7,140.6,556.5,134.3,548.8,134.3z"
        />
        <circle className={style.st15} cx="719.4" cy="161.9" r="12" />
        <text
          transform="matrix(1 0 0 1 708.9817 160.9412)"
          className={style.style5}
        >
          <tspan x="0" y="0">
            군 사회인식
          </tspan>
          <tspan x="4" y="6">
            개선필요
          </tspan>
        </text>
        <text
          transform="matrix(1 0 0 1 596.8926 108.8831)"
          className={style.title4}
        >
          일자리 제공 가능한가?
        </text>
        <ellipse
          className={style.st8}
          cx="642.5"
          cy="143.8"
          rx="16.9"
          ry="16.7"
        />
        <text transform="matrix(1.0092 0 0 1 630.8313 141.5291)">
          <tspan x="2" y="0" className={style.style7}>
            {" "}
            경제호황{" "}
          </tspan>
          <tspan x="0" y="6.2" className={style.style7}>
            모병어려움
          </tspan>
        </text>
        <circle className={style.st8} cx="641" cy="171.9" r="11.4" />
        <text transform="matrix(1 0 0 1 631.2188 171.7117)">
          <tspan x="0" y="0" className={style.style5}>
            일자리총량
          </tspan>
          <tspan x="5" y="5.3" className={style.style5}>
            {" "}
            일정
          </tspan>
        </text>
        <circle className={style.st9} cx="611.8" cy="170.7" r="17.9" />
        <text transform="matrix(1 0 0 1 598.1343 171.0948)">
          <tspan x="0" y="0" className={style.style0}>
            21만 일자리
          </tspan>
          <tspan x="7.7" y="5.5" className={style.style0}>
            제공
          </tspan>
        </text>
        <circle className={style.st9} cx="608.8" cy="135.1" r="17.9" />
        <text
          transform="matrix(1 0 0 1 593.9023 135.0977)"
          className={style.st7}
        >
          <tspan x="0" y="0" className={style.style7}>
            징병 경력단절
          </tspan>
          <tspan x="10" y="6.2" className={style.style7}>
            {" "}
            문제
          </tspan>
        </text>
        <circle className={style.st10} cx="686.2" cy="134" r="15.3" />
        <text
          transform="matrix(1 0 0 1 674.3689 135.49)"
          className={style.style7}
        >
          악폐습 감소
        </text>
        <circle className={style.st10} cx="689.8" cy="167.4" r="18.2" />
        <text
          transform="matrix(1 0 0 1 673.6941 168.0135)"
          className={style.st7}
        >
          <tspan x="0" y="0" className={style.style2}>
            자기계발혜택
          </tspan>
          <tspan x="9.8" y="6.6" className={style.style2}>
            {" "}
            제공
          </tspan>
        </text>
        <circle className={style.st19} cx="621.5" cy="152.1" r="39.8" />
        <circle className={style.st15} cx="715.1" cy="136.8" r="13.6" />
        <text transform="matrix(1 0 0 1 704.2349 134.7234)">
          <tspan x="4" y="0" className={style.style8}>
            {" "}
            제한된
          </tspan>
          <tspan x="0" y="5.7" className={style.style8}>
            사회적지위
          </tspan>
        </text>
        <circle className={style.st19} cx="697.9" cy="151.3" r="36.6" />
        <text
          transform="matrix(1 0 0 1 675.5991 110.0413)"
          className={style.title4}
        >
          현 병사의 위치는?
        </text>
        <path
          className={style.st3}
          d="M860.7,30.9c64.3,0,116.5,52.2,116.5,116.5c0,40.9-21.4,78.7-56.4,99.8l-5.5-9.1  c50.1-30.2,66.3-95.2,36.1-145.3c-19.2-31.8-53.6-51.3-90.7-51.3V30.9z"
        />
        <path
          className={style.st8}
          d="M747.5,174.5c-11.2-46.9,7.6-95.8,47.3-123.1l6,8.7c-36.1,24.8-53.2,69.3-43,111.9L747.5,174.5z"
        />
        <path
          className={style.st0}
          d="M920.8,247.2c-55.1,33.2-126.7,15.4-159.9-39.8c-6.2-10.2-10.7-21.3-13.5-33l10.3-2.5  c13.6,56.9,70.7,92,127.6,78.4c10.6-2.5,20.7-6.7,30-12.3L920.8,247.2z"
        />
        <path
          className={style.st2}
          d="M794.8,51.4c19.4-13.3,42.4-20.5,65.9-20.5v10.6c-21.4,0-42.3,6.5-60,18.6L794.8,51.4z"
        />
        <text
          transform="matrix(1 0 0 1 819.7805 11.8474)"
          className={style.st7}
        >
          <tspan x="0" y="0" className={style.title0}>
            모병제, 질적 향상 및{" "}
          </tspan>
          <tspan x="6" y="10.8" className={style.title0}>
            {" "}
            간부확보 문제는?
          </tspan>
        </text>
        <circle className={style.st8} cx="831.6" cy="131.5" r="20.1" />
        <text
          transform="matrix(1 0 0 1 817.0626 131.4895)"
          className={style.style2}
        >
          <tspan x="0" y="0">
            병사 장기복무
          </tspan>
          <tspan x="7" y="6">
            어려움
          </tspan>
        </text>
        <circle className={style.st8} cx="826.3" cy="171.1" r="19.6" />
        <text
          transform="matrix(1 0 0 1 811.1699 173.3914)"
          className={style.style7}
        >
          취업시장 제한
        </text>
        <circle className={style.st10} cx="786.4" cy="171.7" r="20.4" />
        <text transform="matrix(1 0 0 1 768.8435 170.5296)">
          <tspan x="0" y="0" className={style.style4}>
            직무혼합단계
          </tspan>
          <tspan x="5" y="7.2" className={style.style4}>
            {" "}
            모병전환
          </tspan>
        </text>
        <circle className={style.st10} cx="787.9" cy="127.8" r="23.6" />
        <text
          transform="matrix(1 0 0 1 767.6169 126.4134)"
          className={style.st7}
        >
          <tspan x="8" y="0" className={style.style3}>
            {" "}
            특수병과
          </tspan>
          <tspan x="0" y="8.3" className={style.style3}>
            직업군인 전환
          </tspan>
        </text>
        <circle className={style.st9} cx="886.6" cy="167.1" r="23.2" />
        <text
          transform="matrix(1 0 0 1 866.781 163.9659)"
          className={style.st7}
        >
          <tspan x="5" y="0" className={style.style3}>
            {" "}
            간부중심
          </tspan>
          <tspan x="0" y="8.4" className={style.style3}>
            {" "}
            군개편 가능
          </tspan>
        </text>
        <ellipse
          className={style.st15}
          cx="932.6"
          cy="125.2"
          rx="22.7"
          ry="21.8"
        />
        <text
          transform="matrix(1.0417 0 0 1 919.7648 121.9073)"
          className={style.st7}
        >
          <tspan x="4.5" y="0" className={style.style9}>
            {" "}
            예비역{" "}
          </tspan>
          <tspan x="0" y="8" className={style.style9}>
            소멸문제
          </tspan>
        </text>
        <circle className={style.st10} cx="889.7" cy="123.7" r="20.6" />
        <text
          transform="matrix(1 0 0 1 872.322 122.7803)"
          className={style.st7}
        >
          <tspan x="0" y="0" className={style.style4}>
            직업예비군제
          </tspan>
          <tspan x="9" y="7.2" className={style.style4}>
            {" "}
            전환
          </tspan>
        </text>
        <text
          transform="matrix(1 0 0 1 779.0559 93.5613)"
          className={style.title4}
        >
          모병제, 질적 향상 가능성은?
        </text>
        <text
          transform="matrix(1 0 0 1 877.3811 90.6756)"
          className={style.title4}
        >
          모병제 전환 시 간부운용계획?
        </text>
        <circle className={style.st19} cx="805.8" cy="148.1" r="51.2" />
        <circle className={style.st15} cx="933.5" cy="170.4" r="24.1" />
        <text
          transform="matrix(1 0 0 1 919.6046 166.2803)"
          className={style.st7}
        >
          <tspan x="4.5" y="0" className={style.style3}>
            {" "}
            충분한{" "}
          </tspan>
          <tspan x="0" y="8.8" className={style.style3}>
            부사관 수
          </tspan>
        </text>
        <circle className={style.st19} cx="911.8" cy="149.3" r="54.8" />
        <path
          className={style.st8}
          d="M1074.6,55.1c51.9,0,93.9,42,93.9,93.9c0,12.2-2.4,24.2-7,35.5l-7.9-3.2c17.8-43.6-3.1-93.5-46.7-111.3  c-10.2-4.2-21.2-6.3-32.3-6.3V55.1z"
        />
        <path
          className={style.st15}
          d="M1004.7,86.2c0.1-0.1,0.2-0.3,0.4-0.4c17.8-19.6,42-30.8,68.5-30.8v8.5c-24,0-46,10.1-62.1,27.9  c-0.1,0.2-0.3,0.3-0.4,0.5L1004.7,86.2z"
        />
        <path
          className={style.st2}
          d="M1012.4,219.2c-12.8-11.3-21.7-25.4-26.8-40.5c-10.3-30.8-4.3-66,18.8-92.1c0.1-0.1,0.3-0.3,0.4-0.4l6.4,5.7  c-21.1,23.5-26.7,55.5-17.6,83.5c4.5,13.8,12.6,26.6,24.1,37c0.1,0.1,0.3,0.2,0.4,0.4L1012.4,219.2z"
        />
        <path
          className={style.st10}
          d="M1161.5,185.5c-19.6,48-74.4,70-122.4,50.4c-9.8-4-18.8-9.6-26.7-16.6l5.7-6.4c35.3,31.3,89.2,28,120.5-7.3  c6.4-7.2,11.5-14.4,15.1-23.3L1161.5,185.5z"
        />
        <text
          transform="matrix(1 0 0 1 1033.3489 46.552)"
          className={style.title0}
        >
          여성 징집과 봉급체계
        </text>
        <circle className={style.st8} cx="1037.2" cy="170.6" r="21.7" />
        <text
          transform="matrix(1 0 0 1 1019.4436 170.2088)"
          className={style.style9}
        >
          남성 2년늦는
        </text>
        <text
          transform="matrix(1 0 0 1 1024.8794 178.3582)"
          className={style.style9}
        >
          {" "}
          취업시기
        </text>
        <circle className={style.st10} cx="1101.2" cy="165.7" r="18.9" />
        <text
          transform="matrix(1 0 0 1 1086.3982 164.3179)"
          className={style.style7}
        >
          여성사병징집
        </text>
        <text
          transform="matrix(1 0 0 1 1094.0574 170.2886)"
          className={style.style7}
        >
          불필요
        </text>
        <circle className={style.st8} cx="1053.1" cy="135.1" r="17.1" />
        <text transform="matrix(1 0 0 1 1040.2117 130.6873)">
          <tspan x="8" y="0" className={style.style10}>
            {" "}
            여성{" "}
          </tspan>
          <tspan x="-3" y="5.3" className={style.style10}>
            사병단기복무시
          </tspan>
          <tspan x="4" y="10.6" className={style.style10}>
            {" "}
            혜택제공
          </tspan>
        </text>
        <circle className={style.st15} cx="1138.2" cy="160.8" r="18.5" />
        <text transform="matrix(1 0 0 1 1124.1902 159.5884)">
          <tspan x="0" y="0" className={style.style11}>
            여군 모병 후{" "}
          </tspan>
          <tspan x="5" y="6.4" className={style.style11}>
            {" "}
            후방투입
          </tspan>
        </text>
        <text
          transform="matrix(1 0 0 1 1033.3777 99.7166)"
          className={style.title5}
        >
          현 상황과 여성 모병방안은?
        </text>
        <circle className={style.st10} cx="1115.5" cy="130.3" r="19.2" />
        <text
          transform="matrix(1 0 0 1 1104.678 128.1453)"
          className={style.style7}
        >
          <tspan x="6" y="0">
            충분한
          </tspan>
          <tspan x="0" y="6">
            여군간부 수
          </tspan>
        </text>
        <circle className={style.st9} cx="1016" cy="134.9" r="19.9" />
        <text transform="matrix(1 0 0 1 998.5701 133.0716)">
          <tspan x="6" y="0" className={style.style4}>
            {" "}
            복잡한{" "}
          </tspan>
          <tspan x="0" y="7.1" className={style.style4}>
            봉급체계문제{" "}
          </tspan>
        </text>
        <circle className={style.st19} cx="1032.6" cy="150.1" r="43" />
        <circle className={style.st19} cx="1117.8" cy="151.6" r="41.2" />
        <text transform="matrix(1 0 0 1 54.5516 124.8972)">
          <tspan x="0" y="0" className={style.style11}>
            안보위협
          </tspan>
          <tspan x="0" y="6.5" className={style.style11}>
            과소평가
          </tspan>
        </text>
        <text transform="matrix(0.9857 0 0 1 526.1335 122.3416)">
          <tspan x="0" y="0" className={style.style5}>
            병력수요공급
          </tspan>
          <tspan x="0" y="5" className={style.style5}>
            {" "}
            예측불가
          </tspan>
        </text>
        <text transform="matrix(1 0 0 1 495.1963 147.5769)">
          <tspan x="2" y="0" className={style.style3}>
            {" "}
            경제호황{" "}
          </tspan>
          <tspan x="0" y="8.4" className={style.style3}>
            모병어려움
          </tspan>
        </text>
        <text transform="matrix(1 0 0 1 531.7732 173.8318)">
          <tspan x="0" y="0" className={style.style5}>
            미군 모병
          </tspan>
          <tspan x="0" y="4.9" className={style.style5}>
            인원 미달
          </tspan>
        </text>
        <text
          transform="matrix(1.0067 0 0 1 538.1724 148.0779)"
          className={style.st7}
        >
          <tspan x="0" y="0" className={style.style1}>
            일자리총량
          </tspan>
          <tspan x="5" y="5.3" className={style.style1}>
            {" "}
            일정
          </tspan>
        </text>
        <text transform="matrix(0.9931 0 0 1 472.0662 176.0222)">
          <tspan x="0" y="0" className={style.style1}>
            21만 일자리
          </tspan>
          <tspan x="7.7" y="5.5" className={style.style1}>
            제공
          </tspan>
        </text>
        <text transform="matrix(1 0 0 1 462.1345 150.0545)">
          <tspan x="-0.5" y="0" className={style.style13}>
            사회주류로의
          </tspan>
          <tspan x="3" y="5" className={style.style13}>
            {" "}
            발판제공
          </tspan>
        </text>
        <text
          transform="matrix(1 0 0 1 101.189 154.9178)"
          className={style.st7}
        >
          <tspan x="0" y="0" className={style.style11}>
            군 부적응자
          </tspan>
          <tspan x="0" y="6.5" className={style.style11}>
            {" "}
            매년증가
          </tspan>
        </text>
        <circle className={style.st9} cx="410" cy="170.4" r="13.7" />
        <text transform="matrix(1 0 0 1 399.1274 170.2342)">
          <tspan x="0" y="0" className={style.style5}>
            직업군인위주
          </tspan>
          <tspan x="3" y="5.5" className={style.style5}>
            {" "}
            편제개편
          </tspan>
        </text>
        <circle className={style.st9} cx="401.1" cy="142.9" r="15.3" />
        <text transform="matrix(1 0 0 1 391.0349 141.6971)">
          <tspan x="0" y="0" className={style.style6}>
            감축을 통한
          </tspan>
          <tspan x="0.7" y="4.6" className={style.style6}>
            {" "}
            군 정예화
          </tspan>
        </text>
        <circle className={style.st15} cx="437" cy="148.3" r="21.1" />
        <text transform="matrix(1 0 0 1 426.9185 144.3396)">
          <tspan x="0" y="0" className={style.style8}>
            질적향상과
          </tspan>
          <tspan x="1.6" y="5.7" className={style.style8}>
            현대화 후
          </tspan>
          <tspan x="-0.7" y="11.5" className={style.style8}>
            모병제 도입
          </tspan>
        </text>
        <circle className={style.st19} cx="421.3" cy="150.4" r="37.1" />
        <text
          transform="matrix(1 0 0 1 398.6868 109.8758)"
          className={style.title2}
        >
          인력확충 문제, 해결법은?
        </text>
        <g style={{ marginLeft: "-100px" }}>
          <text
            transform="matrix(1 0 0 1 1345.7354 29.8116)"
            className={style.title0}
          >
            국방 예산 이슈 및 토론 마무리{" "}
          </text>
          <path
            className={style.st3}
            d="M1402.1,39.8c56.1,0,101.6,45.5,101.6,101.6c0,23.1-7.9,45.5-22.3,63.5l-7.2-5.8  c31.9-39.8,25.4-97.9-14.4-129.8c-16.4-13.1-36.7-20.3-57.7-20.3V39.8z"
          />
          <path
            className={style.st8}
            d="M1342.4,223.5c-41.4-30-53.9-86.1-29.4-131l8.1,4.4c-22.3,40.8-10.9,91.7,26.7,119.1L1342.4,223.5z"
          />
          <path
            className={style.st0}
            d="M1481.4,204.8c-33.9,42.3-95.1,50.6-139,18.7l5.4-7.5c39.9,29,95.5,21.5,126.3-17L1481.4,204.8z"
          />
          <path
            className={style.st9}
            d="M1313.1,92.6c17.8-32.5,52-52.8,89.1-52.8V49c-33.7,0-64.8,18.4-81,48L1313.1,92.6z"
          />
          <circle className={style.st15} cx="1375.3" cy="123.9" r="19.2" />
          <text
            transform="matrix(1 0 0 1 1361.5872 125.824)"
            className={style.style0}
          >
            국방예산초과
          </text>
          <circle className={style.st10} cx="1334.9" cy="138.4" r="23.8" />
          <text
            transform="matrix(1 0 0 1 1318.2891 136.595)"
            className={style.style2}
          >
            부대 통폐합을
          </text>
          <text
            transform="matrix(1 0 0 1 1318.2891 142.8665)"
            className={style.style2}
          >
            통한 예산조정
          </text>
          <circle className={style.st8} cx="1370.2" cy="160.3" r="17.4" />
          <text
            transform="matrix(1 0 0 1 1360.6743 158.5574)"
            className={style.style7}
          >
            국방예산
          </text>
          <text
            transform="matrix(1 0 0 1 1360.6743 164.1931)"
            className={style.style7}
          >
            조정불가
          </text>
          <ellipse
            className={style.st8}
            cx="1469.9"
            cy="159.2"
            rx="16.5"
            ry="16.4"
          />
          <text
            transform="matrix(1.0025 0 0 1 1460.3037 157.1502)"
            className={style.st7}
          >
            <tspan x="0" y="0" className={style.style0}>
              병사처우
            </tspan>
            <tspan x="0" y="6" className={style.style0}>
              개선필요
            </tspan>
          </text>
          <circle className={style.st9} cx="1432.6" cy="116.8" r="19.4" />
          <text
            transform="matrix(1 0 0 1 1427.1658 114.7464)"
            className={style.style7}
          >
            징집
          </text>
          <text
            transform="matrix(1 0 0 1 1417.3999 120.4075)"
            className={style.style7}
          >
            편제유지 불가
          </text>
          <circle className={style.st10} cx="1431.4" cy="158.2" r="22.1" />
          <text
            transform="matrix(1 0 0 1 1413.791 159.4048)"
            className={style.style4}
          >
            직업군인 전환
          </text>
          <circle className={style.st15} cx="1470.2" cy="124.1" r="18.8" />
          <text
            transform="matrix(1 0 0 1 1455.3311 125.7622)"
            className={style.style0}
          >
            군 악폐습철폐
          </text>
          <text
            transform="matrix(1 0 0 1 1435.7217 87.4795)"
            className={style.title6}
          >
            마무리발언
          </text>
          <text
            transform="matrix(1 0 0 1 1328.7319 90.3125)"
            className={style.title6}
          >
            모병제를 위한 군예산조정
          </text>
          <circle className={style.st19} cx="1447.3" cy="139.4" r="47.1" />
          <circle className={style.st19} cx="1355.1" cy="138.4" r="44.6" />
        </g>
      </svg>
    </div>
  );
};
