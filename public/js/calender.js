const cal = new CalHeatMap();
const data = {
  "1676693425.0": 1,
  "1675829425.0": 2,
};
const config = {
  domain: "month",
  subDomain: "day",
  verticalOrientation: true,
  range: 1,
  tooltip: true,
  start: new Date(2023, 1),
  data: data,
  legend: [0.0, 0.5, 1.0, 1.5],
  cellSize: 30,
  subDomainTextFormat: "%d",
};
cal.init(config);


// const cal = new CalHeatmap();
// cal.paint(
//   {
//     data: {
//       source: '/data/seattle-weather.csv',
//       type: 'csv',
//       x: 'date',
//       y: 'temp_min',
//       groupY: 'min',
//     },
//     verticalOrientation: true,
//     range: 5,
//     itemSelector: '#cal-heatmap',
//     date: { start: new Date('2012-01-01') },
//     scale: { color: { type: 'diverging', scheme: 'PRGn', domain: [-10, 15] } },
//     domain: {
//       type: 'month',
//       padding: [10, 10, 10, 10],
//       label: { position: 'top' },
//     },
//     subDomain: { type: 'x_day', radius: 2, width: 15, height: 15, label: 'D' },
//   },
//   [
//     [
//       Tooltip,
//       {
//         text: function (date, value, dayjsDate) {
//           return (
//             (value ? value + '°C' : 'No data') + ' on ' + dayjsDate.format('LL')
//           );
//         },
//       },
//     ],
//   ]
// );
// render(
//   <div>
//     <div id="cal-heatmap" className="margin-bottom--md"></div>
//     <a
//       className="button button--sm button--secondary"
//       href="#"
//       onClick={e => {
//         e.preventDefault();
//         cal.previous();
//       }}
//     >
//       ← Previous
//     </a>
//     <a
//       className="button button--sm button--secondary margin-left--xs"
//       href="#"
//       onClick={e => {
//         e.preventDefault();
//         cal.next();
//       }}
//     >
//       Next →
//     </a>
//   </div>
// );