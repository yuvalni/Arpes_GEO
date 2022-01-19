pi = Math.PI
sqrt = Math.sqrt
sin = function (x){
  return Math.sin(x * pi / 180 )
}
cos = function (x){
  return Math.cos(x * pi / 180 )
}


function plot_slit(theta,tau,phi){
  delta = d3.range(-15,15+0.5,0.5)
  conversion = 0.51 * sqrt(6.4)
  a = 5.4/sqrt(2)
  prange = pi / a
  _ky = delta.map(x => a / pi * conversion * (sin(x)*cos(tau)+cos(x)*sin(tau)*cos(theta)))
  _kx = delta.map(x => a / pi * conversion * (cos(x)*sin(theta)))

kx = []
ky = []

  for(i=0; i< _ky.length;i++){
      ky[i] = _ky[i]*cos(phi) + _kx[i]*sin(phi)
      kx[i] = _kx[i]*cos(phi) - _ky[i]*sin(phi)
  }


  _slit_y = a/pi * conversion * sin(tau) * cos(theta)
  _slit_x = a/pi *conversion * sin(theta)

  slit_y = _slit_y*cos(phi) + _slit_x*sin(phi)
  slit_x = _slit_x*cos(phi) - _slit_y*sin(phi)




    var Gen = d3.line()
        .x((p) => x(p[0]))
        .y((p) => y(p[1]))
        .curve(d3.curveBasis);


    svg.append("path")
      .attr("d", Gen(d3.zip(kx,ky)))
      .attr("fill", "none")
      .attr("stroke", "green")
      .attr("stroke-width", 5);


    svg.append("circle")
        .attr("cx",x(slit_x))
        .attr("cy",y(slit_y))
        .attr("r",5)
        .style("fill", "#69b3a2")
}


var margin = {top: 10, right: 30, bottom: 30, left: 60},
    width = 800 - margin.left - margin.right,
    height = 800 - margin.top - margin.bottom;

// append the svg object to the body of the page
var svg = d3.select("#arpes")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");
// Add X axis
var x = d3.scaleLinear()
  .domain([-pi, pi])
  .range([ 0, width ]);
svg.append("g")
  .attr("transform", "translate(0," + height + ")")
  .call(d3.axisBottom(x));

// Add Y axis
var y = d3.scaleLinear()
  .domain([-pi, pi])
  .range([ height, 0]);
svg.append("g")
  .call(d3.axisLeft(y));
