import {auth} from "./firebase.js";

let idToken="";

let user;
let uid;
let data = {};

auth.onAuthStateChanged(async (user) =>{
	if(user){
		idToken = await user.getIdToken();
		user = firebase.auth().currentUser;
		uid = user.uid;
		await getLoginLog();
	}else{
		location.href = "/login";
	}
});


const getLoginLog = async(req,res) =>{
	const response = await fetch(`/searchLogin?uid=${uid}`, {
		method: "GET",
		headers: {
		"Content-Type": "application/json",
		Authorization: `Bearer ${idToken}`,
		},
	});

	const responseData = await response.json();
	// データベースに情報がない場合は何もしない
	if (responseData.length == 0) {
		return;
	}

	data = responseData.reduce((acc, {timestamp}) => {
		acc[timestamp] = 1;
		return acc;
	  }, {});
	  
    // CalHeatMapの初期化
    const cal = new CalHeatMap();
    
    const config = {
      domain: "month",
      subDomain: "x_day",
      range: 1,
      tooltip: true,
      start: new Date(),
      data: data,
      legend: [1.0, 2.0, 3.0],
      cellSize: 30,
      subDomainTextFormat: "%d",
      legendColors: {
        min: "#ededed",
        max: "#eb8686",
        empty:"white",
        // Will use the CSS for the missing keys
      }
    };
    
    const container = document.getElementById("cal-heatmap");
    cal.init(config, container);
}
  





// const cal = new CalHeatmap();

// const data = {
//       source: '/data/seattle-weather.csv',
//       type: 'csv',
//       x: 'date',
//       y: 'temp_min',
//       groupY: 'min',
// };
// const config = {
//   verticalOrientation: true,
//   range: 1,
//   itemSelector: '#cal-heatmap',
//   date: { start: new Date('2012-01-01') },
//   scale: { color: { type: 'diverging', scheme: 'PRGn', domain: [-10, 15] } },
//   domain: {
//     type: 'month',
//     padding: [10, 10, 10, 10],
//     label: { position: 'top' },
//   },
//   subDomain: { type: 'x_day', radius: 2, width: 15, height: 15, label: 'D' },
//   Tooltip:
//   {
//     text: function (date, value, dayjsDate) {
//       return (
//         (value ? value + '°C' : 'No data') + ' on ' + dayjsDate.format('LL')
//       );
//     },
//   },
// }
// cal.init(config);


