pi = Math.PI
sqrt = Math.sqrt
sin = function (x){
  return Math.sin(x * pi / 180 )
}
cos = function (x){
  return Math.cos(x * pi / 180 )
}
a = 5.4/sqrt(2)
conversion = 0.51 * sqrt(2.1) //  1/A

var linspace = function(start, stop, nsteps){
  delta = (stop-start)/(nsteps-1)
  return d3.range(start, stop+delta, delta).slice(0, nsteps)
}

function BSCO_tightBinding_function(Kx,Ky){

    t = 0.36
    t1 = -0.28*t
    t2 = 0.1*t
    t3 = 0.03*t
    return -2*t*(Math.cos(Kx*a)+Math.cos(Ky*a)) - t1*(Math.cos(Kx*a)*Math.cos(Ky*a))-2*t2*(Math.cos(2*Kx*a)+Math.cos(Ky*2*a))-t3*(Math.cos(Kx*2*a)*Math.cos(Ky*a)+Math.cos(2*Ky*a)*Math.cos(Kx*a))
}

function Spectral_function(kx,ky,E,Sigmat=5,T=90,sigma=0.1){
    Kb = 8.617333262145*Math.pow(10,-5) //eV/K
    Ed = BSCO_tightBinding_function(kx*pi/a,ky*pi/a)
    wt = linspace(E-2*sigma,E+2*sigma,10)
    sigma_sqrt_2pi = sigma*sqrt(2*pi)
    I = 0

    if(T!=0){
      FD=1/(Math.exp(E/(Kb*T))+1)
    }
    else{
      if(E<0){
        FD = 1
      }else{
        FD = 0
      }
    }
    if(sigma==0){
      return Sigmat/(Math.pow((E-Ed),2)+Math.pow(Sigmat,2))*FD
    }

    for(i=0;i<wt.length;i++){
      _wt = wt[i]
      I = I + Sigmat/(Math.pow((_wt-Ed),2)+Math.pow(Sigmat,2))* FD * Math.exp(-1/2*Math.pow((E - _wt),2)/(sigma*sigma))/sigma_sqrt_2pi
    }
    return I
}

function spectral_image(){
  T = document.getElementById('Temp').value
  Erange = 100
  var E = linspace(Ebot,Etop,Erange)
  let krange = 50
  var image = Array(krange*Erange)



  for(j=0;j<kx.length;j++){
    for(i=0;i<E.length;i++){
      image[j+i*krange] = Spectral_function(kx[j],ky[j],E[i],0.05,T,sigma=0)
    }
  }


  image_pixels = image_g.selectAll('rect').data(image,d=>d)
  krange = 50
  var E = linspace(Ebot,Etop,Erange)
  var myColor = d3.scaleSequential().domain([0,Math.max(...image)])
  //.interpolator(d3.interpolatePuRd);
  //.interpolator(d3.interpolateCividis);
  //.interpolator(d3.interpolateInferno);
  .interpolator(d3.interpolateMagma);
  //.interpolator(d3.interpolateGreys);

  image_pixels.enter()
  .append("rect")
    //.attr('x',function(d,i){return Dx(sqrt(Math.pow(kx[i % krange],2)+Math.pow(ky[i % krange],2)))})
    .attr('x',(d,i)=>Dx(-15+(i%krange)/50*30))
    .attr('y',function(d,i) {return Dy(E[Math.floor(i / krange)])})
    .attr('width',16)
    .attr('height',7)
    .style("fill",d=>myColor(d))

  image_pixels.exit().remove()
}

function plot_slit(){
  theta = parseFloat(document.getElementById('theta').value) + parseFloat(document.getElementById('theta_sample').value)
  phi = parseFloat(document.getElementById('phi').value) + parseFloat(document.getElementById('phi_sample').value)
  tau = parseFloat(document.getElementById('tau').value) + parseFloat(document.getElementById('tau_sample').value)


  //delta = d3.range(-15,15+0.5,0.5)
  delta = linspace(-15,15,50)

  _ky = delta.map(x => a / pi * conversion * (sin(x)*cos(tau)+cos(x)*sin(tau)*cos(theta)))
  _kx = delta.map(x => a / pi * conversion * (cos(x)*sin(theta)))


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

    //FS.append("path")
    //  .attr("d", Gen(d3.zip(kx,ky)))
    //  .attr("fill", "none")
    //  .attr("stroke", "green")
    //  .attr("stroke-width", 5);

    slit_dots = slit.selectAll('circle')
    .data(d3.zip(kx,ky),d=>d)

    slit_dots.enter()
    .append("circle")
      .attr("cx", d=>x(d[0]))
      .attr("cy",d=> y(d[1]))
      .attr('r',2)
      .style("fill","#F68C20")

    slit_dots
    .exit()
    .remove()


    slit_center = slit_center_g.selectAll('circle')
    .data([[slit_x,slit_y]],d=>d)

    slit_center.enter()
    .append("circle")
        .attr("cx",d=>x(d[0]))
        .attr("cy",d=>y(d[1]))
        .attr("r",5)
        //.style("fill", "#69b3a2")
        .style("fill", "#07519e")


    slit_center.exit().remove()
}


  var kx = []
  var ky = []

  var margin = {top: 10, right: 30, bottom: 30, left: 60}
      width = 750 - margin.left - margin.right,
      height = 700 - margin.top - margin.bottom;

  // append the svg object to the body of the page
  var FS = d3.select("#arpes")
    .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
    .append("g")
      .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");
  // Add X axis
  var x = d3.scaleLinear()
    //.domain([-pi, pi])
    .domain([-1,1])
    .range([ 0, width ]);
  FS.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x));

  // Add Y axis
  var y = d3.scaleLinear()
    //.domain([-pi, pi])
    .domain([-1,1])
    .range([ height, 0]);
  FS.append("g")
    .call(d3.axisLeft(y));

  FS.append("circle")
  .attr("cx",x(0))
  .attr("cy",y(0))
  .attr("r",x(a/pi*conversion)-x(0))
  .style("fill", "none")
  .attr("stroke","black")
  .style("stroke-width",2)
  .style("stroke-opacity",0.2)

  slit = FS.append('g')
  slit_center_g = FS.append('g')


  var Dispersion_margin = {top: 10, right: 30, bottom: 30, left:  60}
  var Dispersion = d3.select("#arpes")
    .append("svg")
      .attr("width", width + Dispersion_margin.left + Dispersion_margin.right)
      .attr("height", height + Dispersion_margin.top + Dispersion_margin.bottom)
    .append("g")
      .attr("transform",
            "translate(" + Dispersion_margin.left + "," + Dispersion_margin.top + ")");

            // Add X axis
    var Dx = d3.scaleLinear()
      .domain([-15, 15])
      .range([ 0, width ]);
    Dispersion.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(Dx));

    // Add Y axis
    Etop = 0.1
    Ebot = -0.9;
    var Dy = d3.scaleLinear()
      .domain([Ebot, Etop])
      .range([ height, 0]);
    Dispersion.append("g")
      .call(d3.axisLeft(Dy));

    var Ek_scale = d3.scaleLinear()
    .domain([2.2+Ebot,2.2+Etop])
    .range([height,0])


    Dispersion.append("g")
    .attr("transform", "translate("+ width+",0)")
    .call(d3.axisRight(Ek_scale));

    var Dispersion_line = d3.line()
          .x((p) => Dx(p[0]))
          .y((p) => Dy(p[1]))
          .curve(d3.curveBasis);

      image_g = Dispersion.append('g')

      Dispersion.append("path")
        .attr("d", Dispersion_line([[-15,0],[15,0]]))
        .attr("fill", "none")
        .attr("stroke", "grey")
        .attr("stroke-width", 1)
        .attr("stroke-opacity",0.6)
        .style("stroke-dasharray", ("10,3")) ;


function draw_FS(Ef){
  kxs = linspace(-pi/a,pi/a,500)
  kys = linspace(-pi/a,pi/a,500)
  FS_points = []
  for(i=0;i<kxs.length;i++){
    for(j=0;j<kys.length;j++){
      E = BSCO_tightBinding_function(kxs[i],kys[j])
      if(Math.abs(E-Ef)<0.01){
        FS_points.push([kxs[i],kys[j]])
      }
    }
  }

  FS.append("g")
  .selectAll("circle")
  .data(FS_points)
  .enter()
  .append("circle")

  .attr("cx",d=>x(d[0]*a/pi))
  .attr("cy",d=>y(d[1]*a/pi))
  .attr("r",1)
  .style("fill", "none")
  .attr("stroke","black")
  .style("stroke-width",0.5)
  .style("stroke-opacity",1)


}

plot_slit()
spectral_image()
draw_FS(0)
