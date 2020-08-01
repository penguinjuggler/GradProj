class Material {
    constructor(name, elasticity, foo) {
        this.name = name;
        this.elasticity = elasticity;
        this.foo = foo;
    }
}

class Units {
	constructor(name, lengthText, lengthMult, pressureText, pressureMult, forceText, forceMult, momentText, momentMult, unitList) {
		this.name = name;
		this.lengthText = lengthText;
		this.lengthMult = lengthMult;
		this.pressureText = pressureText;
		this.pressureMult = pressureMult;
		this.forceText = forceText;
		this.forceMult = forceMult;
		this.momentText = momentText;
		this.momentMult = momentMult;
		this.unitList = unitList;
	}
}

// Setup units - multiplier between Metric and Imperial
const UnitChoice = {
	'Metric - m/Pa/N': new Units('Metric - m/Pa/N','m',1,'Pa',1, 'N',1,'Nm',1,'m/Pa/N'),
	'Imperial - in/psi/lbf': new Units('Imperial - in/psi/lbf','in', 39.37,'psi', 145.038, 'lbf',0.225,'in-lb',8.85,'in/psi/lbf'),
};

// Setup Materials and their Young's Modulus of Elasticities (GPa), ultimate tensile strength (MPa), and other material properties
const materials = {
  'Aluminum': new Material('Aluminum', 69*Math.pow(10,9), 110),
  'Steel': new Material('Steel', 180*Math.pow(10,9), 860),
  'Copper': new Material('Copper', 117*Math.pow(10,9), 220),
};


/*
function calculateFoo(elasticity, radius) {
  return elasticity * radius;
}*/

$(document).ready(function() {
	
	// Setup Unit input
    for (let unitKey in UnitChoice) {
        var unit = UnitChoice[unitKey];
        var el = document.createElement("option");
        el.textContent = unit.name;
        el.value = unit.name;
        $("#UnitSelect").append(el);
    }
	
    // Setup material input
    for (let materialKey in materials) {
        var material = materials[materialKey];
        var el = document.createElement("option");
        el.textContent = material.name;
        el.value = material.name;
        $("#MaterialSelect").append(el);
    }

	// Sets up Value inputs for Cross Section and Beam Length, 
	$("#Radius, #BeamLength, #Height, #Width").attr({
		type:'number',
		min:'0.001',
		max:'1000000000',
		maxLength:'8',
		//value:'10',
		step:'.001',
		oninput:"this.value=this.value.slice(0,this.maxLength)",
		style:'width:6em; text-align:right',
		required:'true'
	})
	
	// Sets up Value inputs for Forces and Moments
	$(".Force, .Moment").attr({
		type:'number',
		min:'-10000000',
		max:'10000000',
		maxLength:'8',
		value:'0',
		step:'0.001',
		oninput:"this.value=this.value.slice(0,this.maxLength)",
		style:'width:6em; text-align:center;',
		required:'true'
	})
	
    // Setup units input...
    //
    /*
     *
     * ﻿
     * $('#CrossSectionRadius')
     * S.fn.init [input#CrossSectionRadius]
     * const someElement = $('#CrossSectionRadius')
     * undefined
     * someElement
     * S.fn.init [input#CrossSectionRadius]
     * someElement.attr('src', 'foo.svg')
     * S.fn.init [input#CrossSectionRadius]
     */
    

    /*	Will likely delete this section, since using autoupdate feature
	$("#submit1").click(function(e) {
        var text = $("#MaterialSelect option:selected").text();
        const material = materials[text]; 

        // Calculate foo
		//alert(calculateFoo(material.elasticity, radiusValue));
		
		var BeamChange = $("#BeamPic");
		BeamChange.attr('src', 'BeamPic' + BeamPicNum + '.png');
        	
    });*/
	
	// Sets input options for a radius or rectangle values depending on radio input
	$("input[type=radio][name=CircleOrRect]").change(function() {
		if (this.value == 'Rect') {
			$("#RectDim, #RectLabels").removeAttr("hidden");
			$("#CircleDim, #CircleLabels").attr("hidden","true");
		} else if (this.value == 'Circle') {
			$("#CircleDim, #CircleLabels").removeAttr("hidden");
			$("#RectDim, #RectLabels").attr("hidden","true");
		}
	})

	let ChangeTriggers = $("#MaterialSelect, #UnitSelect, #BeamLength, #CircleDim, #RectDim, \
							input[type=radio][name=CircleOrRect], #fX, #fY, #fZ, #mX, #mY, #mZ");
	
	// Updates Youngs Modulus on change of Material and Unit Choice
	ChangeTriggers.change(function() {
		var text1 = $("#MaterialSelect option:selected").text();
		var text2 = $("#UnitSelect option:selected").text();
		
		//$("#UnitDisplay").text(UnitChoice[text2].unitList);
		var elas = parseInt(materials[text1].elasticity * UnitChoice[text2].pressureMult);
		$("#ElasticityDisplay").text(elas.toExponential() + " " + UnitChoice[text2].pressureText);
		$("#ForceUnits").text(UnitChoice[text2].forceText);
		$("#MomentUnits").text(UnitChoice[text2].momentText);
		$("#RadiusUnit, #HeightUnit, #WidthUnit, #LengthUnit").text(UnitChoice[text2].lengthText);
		
		// Material and Geometry Values
		var r = $("#Radius").val();
		var len = $("#BeamLength").val();
		var h = $("#Height").val();
		var w = $("#Width").val();
			
		// Force and Moment Values
		var fX = $("#fX").val();
		var fY = $("#fY").val();
		var fZ = $("#fZ").val();
		var mX = $("#mX").val();
		var mY = $("#mY").val();
		var mZ = $("#mZ").val();
		
		// Calculating Total Moments
		var mX_tot = parseFloat(mX) - (fY*len);
		var mY_tot = parseFloat(mY) + (fX*len);
		
		// Other Variables
		var Ix, Iy, Iz;
		var normZ1, normZ2, normZ;
		var mX_tran, halfy, CrossSectionArea;
		
		
		// Selecting the Beam picture based on forces
		// CC  CB  CA
		// BC  BB  BA 
		// AC  AB  AA 
		var pos;
		if (mX_tot>0)  {pos='A';}
		if (mX_tot==0) {pos='B';}
		if (mX_tot<0)  {pos='C';}
		if (mY_tot>0)  {pos=pos + 'A';}
		if (mY_tot==0) {pos=pos + 'B';}
		if (mY_tot<0)  {pos=pos + 'C';}
		$("#BeamPicChoice").attr('src','BeamPics\\Beam_' + pos + '.png');
		
		var RadioInput = $("input[type=radio][name=CircleOrRect]:checked").val();
		if (RadioInput == 'Rect') {
			// No twisting with rectangular cross section
			$("#mZ").val('0');
			$("#mZ").attr('disabled','disabled');
			$("#CrossSectionPic").attr('src','BeamPics\\RectCrossSection1.png');
			CrossSectionArea = (h*w);
			Ix = (w*Math.pow(h,3)/12); // I = (bh^3)/12
			Iy = (h*Math.pow(w,3)/12); // I = (hb^3)/12
			Iz = 0;
			halfy = h/2;
		} else if (RadioInput == 'Circle') {
			// Allows twisting
			$("#mZ").removeAttr('disabled');
			$("#CrossSectionPic").attr('src','BeamPics\\CircleCrossSection1.png');
			CrossSectionArea = (Math.PI * Math.pow(r,2));
			Ix = (Math.pow(r,4)*Math.PI/4); // I = (pi*r^4)/4
			Iy = Ix;
			Iz = Ix*2; // Iz = (pi*r^4)/2
			halfy = r;
		}
		
		
		// Realtime output
		
		// Cross Section Area
		$("#AreaOutput").html(CrossSectionArea.toFixed(3) + " " + UnitChoice[text2].lengthText + "<sup>2</sup>");
		
		// Normal Stress in Z = P/A - (Mx1 + Mx2)y/I
		normZ1 = (fZ/CrossSectionArea); 	// Normal Stress in Z = Fz/A
		mX_tran = -fY*len; 					// Moment X = Force in Y * length of beam		
		normZ2 = (mX_tran*halfy)/Ix; 		// Normal stress = -M*y/I due to fY
		normZ3 = (mX*halfy)/Ix;				// Normal stress = -M*y/I due to mX
		normZ = normZ1 + normZ2 + normZ3;	// Normal stress Total
		
		$("#NormalZaxial").html(normZ1.toFixed(3) + " " + UnitChoice[text2].pressureText);
		$("#NormalZbending1").html(normZ2.toFixed(3) + " " + UnitChoice[text2].pressureText);
		$("#NormalZbending2").html(normZ3.toFixed(3) + " " + UnitChoice[text2].pressureText);
		$("#NormalZtot").html(normZ.toFixed(3) + " " + UnitChoice[text2].pressureText);
		
		
		// Shear stress
		// fX and fY contribute, and torsion (mZ)
		
		/* 
			@top reference point: 
				mX contributes to pure bending (normal) stress
				mY doesn't contribute normal (Neutral Axis) or shear stress
				mZ (torsion) contributes to pure shear
				fX contributes only to shear
				fY contributes to shear and bending
				fZ contributes to only normal
		*/	
		
		//alert(normZ)
		let cubelayers = $("#CubetauXY, #CubetauYZ, #CubetauXZ, #CubesigX, #CubesigY, #CubesigZ");
		let cubelabels = $("#CubesigXlabel, #CubesigYlabel, #CubesigZlabel, #CubetauXYlabel, #CubetauYZlabel, #CubetauXZlabel");//
		cubelayers.attr("hidden","true");
		cubelabels.attr("hidden","true");
		if (normZ>0) {
			$("#CubesigZ, #CubesigZlabel").removeAttr("hidden");
		} else if (normZ<0) {
			$("#CubesigZ, #CubesigZlabel").removeAttr("hidden");
			$("#CubesigZ").attr("src","CubePics\\sigZ-0.png");
		}
		
	});
	
	// Section Groupings
	// Would be cool to just loop through group headers, and hide the sections below
	// Hides all sections to start, not sure if I want this or not
	$(".IntroSection, .CalcSection, .VisSection, .ToolSection").attr("hidden","true");
	
	// What is Stress Section
	$("#HeaderTitle").click(function() {
		let Section = $(".IntroSection");
		if (Section.attr("hidden")) {
			Section.removeAttr("hidden");
		} else {
		Section.attr("hidden","true");
		}
	})
	// Calculations Section
	$("#HeaderCalc").click(function() {
		let Section = $(".CalcSection");
		if (Section.attr("hidden")) {
			Section.removeAttr("hidden");
		} else {
		Section.attr("hidden","true");
		}
	})
	// Visualization Section
	$("#HeaderVis").click(function() {
		let Section = $(".VisSection");
		if (Section.attr("hidden")) {
			Section.removeAttr("hidden");
		} else {
		Section.attr("hidden","true");
		}
	})
		// Calculations Section
	$("#HeaderTool").click(function() {
		let Section = $(".ToolSection");
		if (Section.attr("hidden")) {
			Section.removeAttr("hidden");
		} else {
		Section.attr("hidden","true");
		}
	})
	
	
	// Tool Tip Code - noConflict and switching to $() is weird. Not sure exactly what's going on here.
	//jQuery.noConflict();
	jQuery(function() {
	jQuery(".refbody").hide();
	jQuery(".refnum").click(function(event) {
	  jQuery(this.nextSibling).toggle();
	  event.stopPropagation();
	});
	jQuery("body").click(function(event) {
	  jQuery(".refbody").hide();
	});
	});
	
	// Collapsible?
	//var acc = document.getElementsByClassName("HeaderBox");
	//var i;
	


	/*
	for (i = 0; i < acc.length; i++) {
	  acc[i].addEventListener("click", function() {
		this.classList.toggle("active");
		var panel = this.nextElementSibling;
		if (panel.style.maxHeight) {
		  panel.style.maxHeight = null;
		} else {
		  panel.style.maxHeight = panel.scrollHeight + "px";
		} 
	  });
	}
	*/
	
});

/*
	
*/

//alert(calculateFoo(material.elasticity, radiusValue));
//document.getElementById("ElasticityDisplay").innerHTML = material.elasticity;
