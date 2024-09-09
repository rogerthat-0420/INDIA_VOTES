
var validYears = ['1962', '1967', '1971', '1977', '1980', '1984', '1989', '1991', '1996', '1998', '1999', '2004', '2009', '2014', '2019'];
var map = { '2002': '1962', '2003': '1967', '2004': '1971', '2005': '1977', '2006': '1980', '2007': '1984', '2008': '1989', '2009': '1991', '2010': '1996', '2011': '1998', '2012': '1999', '2013': '2004', '2014': '2009', '2015': '2014', '2016': '2019' }
// Data
var allData = {
  '2002': { 'Andhra Pradesh': 64.2279069767442, 'Uttar Pradesh ': 51.591764705882355, 'Gujarat': 57.845454545454544, 'Maharashtra': 60.18181818181818, 'Rajasthan': 52.32272727272727, 'Punjab': 65.36363636363636, 'Kerala': 70.41111111111111, 'West Bengal': 55.49444444444444, 'Bihar ': 46.9, 'Assam': 52.65, 'Madhya Pradesh ': 44.82222222222222, 'Orissa': 24.46315789473684, 'Himachal Pradesh': 35.625, 'Delhi': 68.97999999999999, 'Manipur': 65.2, 'Tripura': 67.94999999999999 },
  '2003': { 'Andhra Pradesh': 68.435, 'Kerala': 75.6421052631579, 'Uttar Pradesh ': 54.48470588235294, 'Gujarat': 63.520833333333336, 'Maharashtra': 64.68888888888888, 'Rajasthan': 58.29565217391304, 'West Bengal': 65.9475, 'Haryana': 72.65555555555555, 'Punjab': 71.20769230769231, 'Andaman & Nicobar Islands': 78.5, 'Orissa': 43.225, 'Bihar ': 51.06792452830189, 'Assam': 59.34615384615385, 'Madhya Pradesh ': 53.34324324324324, 'Jammu & Kashmir': 54.224999999999994, 'Himachal Pradesh': 51.26666666666667, 'Chandigarh': 65.4, 'Delhi': 69.8, 'Dadra & Nagar Haveli': 78.3, 'Manipur': 66.2, 'Laccadive, Minicoy And Amindivi Islands': 82.0, 'Goa, Daman And Diu': 68.5, 'Pondicherry': 74.9, 'Tripura': 74.85 },
  '2004': { 'Andaman & Nicobar Islands': 70.6, 'Andhra Pradesh': 58.917073170731705, 'Kerala': 64.57894736842105, 'Uttar Pradesh ': 45.998823529411766, 'Gujarat': 55.47083333333333, 'Maharashtra': 59.94444444444444, 'Rajasthan': 53.9695652173913, 'West Bengal': 61.915, 'Haryana': 64.32222222222222, 'Punjab': 59.96923076923077, 'Jammu & Kashmir': 59.96666666666667, 'Orissa': 42.775, 'Bihar ': 48.24339622641509, 'Assam': 50.800000000000004, 'Madhya Pradesh ': 47.73783783783784, 'Chandigarh': 62.9, 'Delhi': 65.31428571428572, 'Tamil Nadu': 71.95128205128205, 'Dadra & Nagar Haveli': 69.8, 'Himachal Pradesh': 41.25, 'Manipur': 48.8, 'Goa, Daman And Diu': 56.05, 'Nagaland': 53.8, 'Pondicherry': 70.1, 'Tripura': 60.8 },
  '2005': { 'Andhra Pradesh': 62.459523809523816, 'Kerala': 79.255, 'Uttar Pradesh ': 56.49294117647058, 'Gujarat': 58.91923076923077, 'Maharashtra': 60.40208333333334, 'Rajasthan': 57.071999999999996, 'West Bengal': 60.33571428571428, 'Haryana': 73.37, 'Punjab': 70.15384615384616, 'Jammu & Kashmir': 59.75, 'Andaman & Nicobar Islands': 71.0, 'Tamil Nadu': 67.38717948717948, 'Bihar ': 60.02222222222222, 'Arunachal Pradesh': 56.3, 'Orissa': 43.90952380952381, 'Assam': 54.51428571428572, 'Karnataka': 63.357142857142854, 'Madhya Pradesh ': 54.855, 'Chandigarh': 67.4, 'Delhi': 71.37142857142858, 'Dadra & Nagar Haveli': 68.5, 'Himachal Pradesh': 59.55, 'Manipur': 60.05, 'Lakshadweep': 84.6, 'Mizoram': 49.9, 'Goa, Daman And Diu': 62.8, 'Nagaland': 52.8, 'Pondicherry': 73.6, 'Meghalaya': 47.55, 'Tripura': 70.1 },
  '2006': { 'Andhra Pradesh': 56.98571428571429, 'Kerala': 62.165, 'Uttar Pradesh ': 49.94705882352941, 'Gujarat': 55.17307692307692, 'Maharashtra': 57.00625, 'Rajasthan': 54.588, 'West Bengal': 70.76666666666667, 'Haryana': 64.86, 'Punjab': 62.676923076923075, 'Jammu & Kashmir': 59.160000000000004, 'Andaman & Nicobar Islands': 84.5, 'Tamil Nadu': 66.77948717948718, 'Bihar ': 51.425925925925924, 'Arunachal Pradesh': 68.55, 'Orissa': 45.857142857142854, 'Karnataka': 57.88214285714286, 'Madhya Pradesh ': 51.697500000000005, 'Chandigarh': 63.9, 'Delhi': 65.72857142857143, 'Dadra & Nagar Haveli': 72.8, 'Himachal Pradesh': 58.6, 'Manipur': 81.7, 'Assam': 54.15, 'Lakshadweep': 88.8, 'Mizoram': 56.1, 'Goa, Daman And Diu': 69.5, 'Nagaland': 63.9, 'Pondicherry': 80.4, 'Sikkim': 44.7, 'Tripura': 80.0, 'Meghalaya': 51.2 },
  '2007': { 'Andhra Pradesh': 69.04047619047618, 'Kerala': 77.17, 'Uttar Pradesh ': 55.84705882352941, 'Gujarat': 57.72692307692308, 'Maharashtra': 61.89791666666667, 'Rajasthan': 56.94, 'West Bengal': 78.61904761904762, 'Haryana': 66.9, 'Punjab': 67.3923076923077, 'Jammu & Kashmir': 66.51666666666667, 'Andaman & Nicobar Islands': 78.8, 'Tamil Nadu': 73.26410256410257, 'Bihar ': 58.370370370370374, 'Arunachal Pradesh': 75.25, 'Orissa': 55.91904761904762, 'Assam': 77.32142857142857, 'Karnataka': 65.8607142857143, 'Madhya Pradesh ': 57.464999999999996, 'Chandigarh': 68.9, 'Delhi': 66.0, 'Dadra & Nagar Haveli': 74.6, 'Himachal Pradesh': 61.425, 'Manipur': 85.75, 'Lakshadweep': 87.0, 'Goa, Daman And Diu': 71.8, 'Nagaland': 66.5, 'Pondicherry': 72.3, 'Meghalaya': 54.1, 'Sikkim': 57.6, 'Tripura': 77.30000000000001 },
  '2008': { 'Andhra Pradesh': 70.60952380952381, 'Kerala': 79.39500000000001, 'Uttar Pradesh ': 51.36470588235294, 'Gujarat': 54.36923076923077, 'Maharashtra': 60.03333333333333, 'Rajasthan': 56.5, 'West Bengal': 79.67619047619048, 'Haryana': 64.51, 'Punjab': 62.684615384615384, 'Jammu & Kashmir': 38.68, 'Andaman & Nicobar Islands': 71.7, 'Tamil Nadu': 67.07948717948717, 'Bihar ': 59.96851851851852, 'Arunachal Pradesh': 60.25, 'Orissa': 59.028571428571425, 'Karnataka': 67.8, 'Madhya Pradesh ': 55.145, 'Chandigarh': 65.7, 'Delhi': 57.05714285714286, 'Dadra & Nagar Haveli': 72.9, 'Daman & Diu': 66.0, 'Himachal Pradesh': 63.949999999999996, 'Manipur': 71.7, 'Lakshadweep': 85.0, 'Mizoram': 58.3, 'Goa': 59.45, 'Nagaland': 74.7, 'Pondicherry': 66.7, 'Meghalaya': 52.25, 'Sikkim': 72.0, 'Tripura': 83.85 },
  '2009': { 'Andhra Pradesh': 61.53333333333334, 'Kerala': 73.375, 'Uttar Pradesh ': 49.39523809523809, 'Gujarat': 44.00384615384615, 'Maharashtra': 49.1875, 'Rajasthan': 47.316, 'West Bengal': 76.75952380952381, 'Haryana': 65.97999999999999, 'Punjab': 24.03076923076923, 'Andaman & Nicobar Islands': 64.4, 'Tamil Nadu': 64.25897435897436, 'Bihar ': 59.95, 'Arunachal Pradesh': 52.05, 'Orissa': 53.666666666666664, 'Assam': 75.07142857142857, 'Karnataka': 54.99285714285714, 'Madhya Pradesh ': 44.2375, 'Chandigarh': 57.8, 'Delhi': 49.94285714285714, 'Dadra & Nagar Haveli': 66.5, 'Daman & Diu': 67.0, 'Himachal Pradesh': 57.4, 'Manipur': 69.6, 'Lakshadweep': 80.4, 'Mizoram': 58.6, 'Goa': 42.55, 'Nagaland': 77.1, 'Pondicherry': 67.7, 'Meghalaya': 54.5, 'Sikkim': 58.8, 'Tripura': 67.15 },
  '2010': { 'Andhra Pradesh': 63.397619047619045, 'Kerala': 71.205, 'Uttar Pradesh ': 46.49294117647059, 'Gujarat': 36.48846153846154, 'Maharashtra': 53.65625, 'Rajasthan': 43.32, 'West Bengal': 82.68095238095238, 'Haryana': 70.78999999999999, 'Punjab': 62.33076923076923, 'Jammu & Kashmir': 53.36666666666667, 'Andaman & Nicobar Islands': 62.0, 'Tamil Nadu': 67.2948717948718, 'Bihar ': 59.4574074074074, 'Arunachal Pradesh': 55.150000000000006, 'Orissa': 59.214285714285715, 'Assam': 78.58571428571429, 'Karnataka': 60.521428571428565, 'Madhya Pradesh ': 54.4625, 'Chandigarh': 58.4, 'Delhi': 52.885714285714286, 'Dadra & Nagar Haveli': 77.0, 'Daman & Diu': 70.7, 'Himachal Pradesh': 57.575, 'Manipur': 74.80000000000001, 'Lakshadweep': 89.0, 'Mizoram': 73.4, 'Goa': 56.3, 'Nagaland': 88.3, 'Pondicherry': 75.4, 'Meghalaya': 63.35, 'Sikkim': 77.4, 'Tripura': 79.05000000000001 },
  '2011': { 'Andhra Pradesh': 66.28571428571429, 'Kerala': 70.7, 'Uttar Pradesh ': 55.61058823529412, 'Gujarat': 60.01538461538462, 'Maharashtra': 58.37708333333333, 'Rajasthan': 60.312, 'West Bengal': 79.30714285714286, 'Haryana': 69.16, 'Punjab': 60.13076923076923, 'Jammu & Kashmir': 46.63333333333333, 'Andaman & Nicobar Islands': 63.7, 'Tamil Nadu': 58.57692307692308, 'Bihar ': 64.68333333333334, 'Arunachal Pradesh': 58.95, 'Orissa': 58.06666666666667, 'Assam': 62.121428571428574, 'Karnataka': 65.32857142857144, 'Madhya Pradesh ': 61.870000000000005, 'Chandigarh': 53.7, 'Delhi': 53.528571428571425, 'Dadra & Nagar Haveli': 77.4, 'Daman & Diu': 72.8, 'Himachal Pradesh': 66.475, 'Manipur': 57.25, 'Lakshadweep': 85.1, 'Mizoram': 69.6, 'Goa': 61.25, 'Nagaland': 45.4, 'Pondicherry': 62.8, 'Meghalaya': 74.6, 'Sikkim': 67.1, 'Tripura': 80.80000000000001 },
  '2012': { 'Andhra Pradesh': 69.5, 'Kerala': 70.24499999999999, 'Uttar Pradesh ': 53.641176470588235, 'Gujarat': 47.71923076923077, 'Maharashtra': 62.71875, 'Rajasthan': 53.943999999999996, 'West Bengal': 75.14761904761905, 'Haryana': 63.96999999999999, 'Punjab': 56.23076923076923, 'Jammu & Kashmir': 37.06666666666667, 'Andaman & Nicobar Islands': 59.5, 'Tamil Nadu': 58.72564102564103, 'Bihar ': 61.492592592592594, 'Arunachal Pradesh': 72.35, 'Orissa': 55.766666666666666, 'Assam': 71.43571428571428, 'Karnataka': 68.30714285714285, 'Madhya Pradesh ': 54.947500000000005, 'Chandigarh': 48.4, 'Delhi': 45.800000000000004, 'Dadra & Nagar Haveli': 74.7, 'Daman & Diu': 71.7, 'Himachal Pradesh': 56.825, 'Manipur': 65.75, 'Lakshadweep': 80.2, 'Mizoram': 65.3, 'Goa': 45.2, 'Nagaland': 76.3, 'Pondicherry': 63.3, 'Meghalaya': 57.7, 'Sikkim': 81.7, 'Tripura': 68.05 },
  '2013': { 'Andhra Pradesh': 70.70476190476191, 'Kerala': 71.28, 'Uttar Pradesh ': 48.26625, 'Gujarat': 45.892307692307696, 'Maharashtra': 55.333333333333336, 'Rajasthan': 49.512, 'West Bengal': 77.35, 'Uttarakhand': 48.3, 'Haryana': 66.1, 'Punjab': 61.70769230769231, 'Jammu & Kashmir': 38.5, 'Andaman & Nicobar Islands': 63.7, 'Tamil Nadu': 61.36410256410256, 'Bihar ': 58.0025, 'Arunachal Pradesh': 56.05, 'Orissa': 66.12380952380951, 'Assam': 69.15, 'Karnataka': 65.92857142857143, 'Madhya Pradesh ': 48.320689655172416, 'Chhattisgarh': 52.309090909090905, 'Chandigarh': 51.1, 'Delhi': 49.042857142857144, 'Jharkhand': 55.59285714285714, 'Dadra & Nagar Haveli': 69.0, 'Daman & Diu': 70.2, 'Himachal Pradesh': 59.3, 'Manipur': 67.0, 'Lakshadweep': 81.5, 'Mizoram': 62.8, 'Goa': 58.7, 'Nagaland': 91.4, 'Pondicherry': 76.1, 'Meghalaya': 54.3, 'Sikkim': 76.4, 'Tripura': 66.7 },
  '2014': { 'Andhra Pradesh': 73.49761904761905, 'Uttar Pradesh ': 47.8275, 'Maharashtra': 50.85, 'Gujarat': 47.91153846153846, 'Rajasthan': 48.48, 'Kerala': 73.64500000000001, 'West Bengal': 81.59761904761905, 'Uttarakhand': 53.02, 'Haryana': 67.37, 'Punjab': 69.73076923076923, 'Jammu & Kashmir': 43.53333333333333, 'Andaman & Nicobar Islands': 64.2, 'Tamil Nadu': 73.17692307692307, 'Bihar ': 44.7275, 'Arunachal Pradesh': 68.65, 'Orissa': 65.33333333333333, 'Assam': 69.49285714285715, 'Karnataka': 59.607142857142854, 'Madhya Pradesh ': 51.34827586206896, 'Chhattisgarh': 55.38181818181818, 'Chandigarh': 65.5, 'Delhi': 52.028571428571425, 'Jharkhand': 51.45, 'Dadra & Nagar Haveli': 73.2, 'Daman & Diu': 71.3, 'Himachal Pradesh': 58.5, 'Manipur': 76.69999999999999, 'Lakshadweep': 85.9, 'Mizoram': 52.8, 'Nagaland': 90.0, 'Goa': 55.5, 'Pondicherry': 79.8, 'Meghalaya': 64.95, 'Sikkim': 85.6, 'Tripura': 84.75 },
  '2015': { 'Andhra Pradesh': 70.95882352941176, 'Uttar Pradesh': 58.5225, 'Maharashtra': 60.54791666666667, 'Gujarat': 63.607692307692304, 'Rajasthan': 63.06, 'Kerala': 73.97, 'West Bengal': 82.16428571428571, 'Uttarakhand': 60.67999999999999, 'Andhra Pradesh ': 78.82, 'Haryana': 71.46000000000001, 'Punjab': 70.66153846153847, 'Jammu & Kashmir': 50.38333333333333, 'Andaman & Nicobar Islands': 70.7, 'Tamil Nadu': 73.9948717948718, 'Bihar ': 56.50750000000001, 'Arunachal Pradesh': 79.35, 'Orissa': 73.86666666666667, 'Assam': 79.55714285714285, 'Karnataka': 67.71428571428571, 'Madhya Pradesh ': 61.713793103448275, 'Chhattisgarh': 69.68181818181819, 'Chandigarh': 73.7, 'Delhi': 65.2, 'Jharkhand': 64.04285714285714, 'Dadra & Nagar Haveli': 84.1, 'Daman & Diu': 78.0, 'Himachal Pradesh': 64.375, 'Manipur': 79.45, 'Lakshadweep': 86.6, 'Mizoram': 61.7, 'Nagaland': 87.8, 'Goa': 77.1, 'Pondicherry': 82.1, 'Meghalaya': 70.65, 'Sikkim': 83.4, 'Tripura': 84.65 },
  '2016': { 'Andhra Pradesh': 69.00588235294117, 'Uttar Pradesh': 61.228750000000005, 'Maharashtra': 64.92083333333333, 'Gujarat': 67.91923076923078, 'Rajasthan': 68.708, 'Kerala': 81.81, 'West Bengal': 79.82857142857144, 'Uttarakhand': 63.7, 'Andhra Pradesh ': 91.75200000000001, 'Haryana': 74.69, 'Punjab': 68.3, 'Jammu & Kashmir': 50.083333333333336, 'Andaman & Nicobar Islands': 77.5, 'Tamil Nadu': 74.63684210526316, 'Bihar ': 59.50750000000001, 'Arunachal Pradesh': 83.85, 'Orissa': 77.21428571428571, 'Assam': 88.66923076923078, 'Karnataka': 72.525, 'Madhya Pradesh ': 73.7448275862069, 'Chhattisgarh': 75.2909090909091, 'Chandigarh': 74.9, 'Delhi': 68.47142857142858, 'Jharkhand': 70.37142857142858, 'Dadra & Nagar Haveli': 102.7, 'Daman & Diu': 79.6, 'Himachal Pradesh': 80.75, 'Manipur': 91.4, 'Lakshadweep': 94.4, 'Mizoram': 69.3, 'Nagaland': 84.7, 'Goa': 77.55000000000001, 'Pondicherry': 82.8, 'Meghalaya': 76.69999999999999, 'Sikkim': 86.3, 'Tripura': 88.6 },
}



// Create root element
// https://www.amcharts.com/docs/v5/getting-started/#Root_element
var root = am5.Root.new("chartdiv");
root.numberFormatter.setAll({
  numberFormat: "#a",

  // Group only into M (millions), and B (billions)
  bigNumberPrefixes: [
    { number: 1e6, suffix: "M" },
    { number: 1e9, suffix: "B" }
  ],

  // Do not use small number prefixes at all
  smallNumberPrefixes: []
});

var stepDuration = 2000;


// Set themes
// https://www.amcharts.com/docs/v5/concepts/themes/
var myTheme = am5.Theme.new(root);

myTheme.rule("Label").setAll({
  fill: am5.color(0xFCFCFC),
  fontSize: "1em"
});

root.setThemes([
  am5themes_Animated.new(root),
  myTheme
]);

// Create chart
// https://www.amcharts.com/docs/v5/charts/xy-chart/
var chart = root.container.children.push(am5xy.XYChart.new(root, {
  panX: true,
  panY: true,
  wheelX: "none",
  wheelY: "none"
}));


// We don't want zoom-out button to appear while animating, so we hide it at all
chart.zoomOutButton.set("forceHidden", true);


// Create axes
// https://www.amcharts.com/docs/v5/charts/xy-chart/axes/
var yRenderer = am5xy.AxisRendererY.new(root, {
  minGridDistance: 20,
  inversed: true
});
// hide grid
yRenderer.grid.template.set("visible", false);

var yAxis = chart.yAxes.push(am5xy.CategoryAxis.new(root, {
  maxDeviation: 0,
  categoryField: "network",
  renderer: yRenderer
}));

var xAxis = chart.xAxes.push(am5xy.ValueAxis.new(root, {
  maxDeviation: 0,
  min: 0,
  strictMinMax: true,
  extraMax: 0.1,
  renderer: am5xy.AxisRendererX.new(root, {})
}));

xAxis.set("interpolationDuration", stepDuration / 10);
xAxis.set("interpolationEasing", am5.ease.linear);


// Add series
// https://www.amcharts.com/docs/v5/charts/xy-chart/series/
var series = chart.series.push(am5xy.ColumnSeries.new(root, {
  xAxis: xAxis,
  yAxis: yAxis,
  valueXField: "value",
  categoryYField: "network"
}));

// Rounded corners for columns
series.columns.template.setAll({ cornerRadiusBR: 5, cornerRadiusTR: 5 });

// Make each column to be of a different color
series.columns.template.adapters.add("fill", function (fill, target) {
  return chart.get("colors").getIndex(series.columns.indexOf(target));
});

series.columns.template.adapters.add("stroke", function (stroke, target) {
  return chart.get("colors").getIndex(series.columns.indexOf(target));
});

// root.setAll({
//   textColor: "white"
// });

// Update label bullet to have white fill
series.bullets.push(function () {
  return am5.Bullet.new(root, {
    locationX: 1,
    sprite: am5.Label.new(root, {
      text: "{valueXWorking.formatNumber('#.# a')}",
      fill: "white", // Change fill color to white
      centerX: am5.p100,
      centerY: am5.p50,
      populateText: true
    })
  });
});

var label = chart.plotContainer.children.push(am5.Label.new(root, {
  text: "2002",
  fontSize: "8em",
  opacity: 0.2,
  x: am5.p100,
  y: am5.p100,
  centerY: am5.p100,
  centerX: am5.p100
}));

// Get series item by category
function getSeriesItem(category) {
  for (var i = 0; i < series.dataItems.length; i++) {
    var dataItem = series.dataItems[i];
    if (dataItem.get("categoryY") == category) {
      return dataItem;
    }
  }
}

// Axis sorting
function sortCategoryAxis() {
  // sort by value
  series.dataItems.sort(function (x, y) {
    return y.get("valueX") - x.get("valueX"); // descending
    //return x.get("valueX") - y.get("valueX"); // ascending
  });

  // go through each axis item
  am5.array.each(yAxis.dataItems, function (dataItem) {
    // get corresponding series item
    var seriesDataItem = getSeriesItem(dataItem.get("category"));

    if (seriesDataItem) {
      // get index of series data item
      var index = series.dataItems.indexOf(seriesDataItem);
      // calculate delta position
      var deltaPosition =
        (index - dataItem.get("index", 0)) / series.dataItems.length;
      // set index to be the same as series data item index
      if (dataItem.get("index") != index) {
        dataItem.set("index", index);
        // set deltaPosition instanlty
        dataItem.set("deltaPosition", -deltaPosition);
        // animate delta position to 0
        dataItem.animate({
          key: "deltaPosition",
          to: 0,
          duration: stepDuration / 2,
          easing: am5.ease.out(am5.ease.cubic),
          "axisColor": "#ffffff",
          "labelColor": "#ffffff",
        });
      }
    }
  });
  // sort axis items by index.
  // This changes the order instantly, but as deltaPosition is set, they keep in the same places and then animate to true positions.
  yAxis.dataItems.sort(function (x, y) {
    return x.get("index") - y.get("index");
  });
}

var year = 2002;

// update data with values each 1.5 sec
var interval = setInterval(function () {
  year++;
  if (year > 2018) {
      clearInterval(interval);  
      year = 2002;
      interval = setInterval(function () {
        year++;
        updateData();
      }, stepDuration);
  }


  updateData();
}, stepDuration);

var sortInterval = setInterval(function () {
  sortCategoryAxis();
}, 100);

function setInitialData() {
  var d = allData[year];

  for (var n in d) {
    series.data.push({ network: n, value: d[n] });
    yAxis.data.push({ network: n });
  }
}

function updateData() {
  var itemsWithNonZero = 0;

  if (allData[year]) {
    label.set("text", map[year].toString());

    am5.array.each(series.dataItems, function (dataItem) {
      var category = dataItem.get("categoryY");
      var value = allData[year][category];

      if (value > 0) {
        itemsWithNonZero++;
      }

      dataItem.animate({
        key: "valueX",
        to: value,
        duration: stepDuration,
        easing: am5.ease.linear
      });
      dataItem.animate({
        key: "valueXWorking",
        to: value,
        duration: stepDuration,
        easing: am5.ease.linear
      });
    });

    yAxis.zoom(0, itemsWithNonZero / yAxis.dataItems.length);
  }
}

setInitialData();
setTimeout(function () {
  year++;
  updateData();
}, 50);

// Make stuff animate on load
// https://www.amcharts.com/docs/v5/concepts/animations/
series.appear(1000);
chart.appear(1000, 100);