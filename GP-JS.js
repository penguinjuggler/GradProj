class Material {
    constructor(name, elasticity, foo) {
        this.name = name;
        this.elasticity = elasticity;
        this.foo = foo;
    }
}

class Units {
	constructor(name, lengthText, lengthMult, stressText, stressMult, forceText, forceMult, momentText, momentMult, unitList) {
		this.name = name;
		this.lengthText = lengthText;
		this.lengthMult = lengthMult;
		this.stressText = stressText;
		this.stressMult = stressMult;
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

//switched back to just naming all of them for clarity
/*var Stress = [
	[0, 0, 0], // sigX,  sigY,  sigZ
	[0, 0, 0]  // tauXY, tauYZ, tauXZ
];

var Loads = [
	[0, 0, 0], // fX, fY, fZ
	[0, 0, 0]  // mX, mY, mZ
];*/

const XYZ = ["X","Y","Z"];
const ABC = ["A","B","C"];
const sigtau = ["sig","tau"];


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
	
	$(".slider").attr({
		type:'range',
		style:'width:50%; display:inline'
	})
	$(".inputText").attr({
		type:'number',
		style:'width:30%; text-align:right',
		maxLength:'8',
		oninput:"this.value=this.value.slice(0,this.maxLength)",
		required:'true'
	})
	
	$(".lengths0").attr({
		value:'1',
		min:'0',
		max:'1000',
		step:'.1'
	})

	$(".lengths1").attr({
		value:'0.1',
		min:'0.001',
		max:'100',
		step:'.001'
	})
	
	// Sets up Value inputs for Forces and Moments
	$(".Force, .Moment").attr({
		value:'0',
		min:'-10000000',
		max:'10000000',
		step:'0.001'
	})
	
	// Connects Slider to Text Input
	$("#LengthRange").change(function() {$("#LengthInput").val(this.value);})
	$("#RadiusRange").change(function() {$("#RadiusInput").val(this.value);})
	$("#HeightRange").change(function() {$("#HeightInput").val(this.value);})
	$("#Width_Range").change(function() {$("#Width_Input").val(this.value);})
	$("#FxSlide").change(function() {$("#Fx").val(this.value);})
	$("#FySlide").change(function() {$("#Fy").val(this.value);})
	$("#FzSlide").change(function() {$("#Fz").val(this.value);})
	$("#MxSlide").change(function() {$("#Mx").val(this.value);})
	$("#MySlide").change(function() {$("#My").val(this.value);})
	$("#MzSlide").change(function() {$("#Mz").val(this.value);})

	// Connects Text Input to Slider Input
	$("#LengthInput").change(function() {$("#LengthRange").val(this.value);})
	$("#RadiusInput").change(function() {$("#RadiusRange").val(this.value);})
	$("#HeightInput").change(function() {$("#HeightRange").val(this.value);})
	$("#Width_Input").change(function() {$("#Width_Range").val(this.value);})
	$("#Fx").change(function() {$("#FxSlide").val(this.value);})
	$("#Fy").change(function() {$("#FySlide").val(this.value);})
	$("#Fz").change(function() {$("#FzSlide").val(this.value);})	
	$("#Mx").change(function() {$("#MxSlide").val(this.value);})
	$("#My").change(function() {$("#MySlide").val(this.value);})
	$("#Mz").change(function() {$("#MzSlide").val(this.value);})
	
	$("#Reset").click(function() {
		$(".Force, .Moment").val('0');
		$("#LengthInput, #LengthRange").val('1');
		$("#HeightInput, #RadiusInput, #Width_Input, #HeightRange, #RadiusRange, #Width_Range").val('0.1');
	})
	
	
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

	// Not sure how to get the reset button to trigger the ChangeTrigger
	let ChangeTriggers = $(".slider, .inputText, #MaterialSelect, #UnitSelect, input[type=radio][name=CircleOrRect], #Reset");						
	
	// Auto Update if any of the inputs change
	ChangeTriggers.change(function() {
		var matChoice = $("#MaterialSelect option:selected").text();
		var text2 = $("#UnitSelect option:selected").text();
		const units = UnitChoice[text2];
		
		//$("#UnitDisplay").text(UnitChoice[text2].unitList);
		var elas = parseInt(materials[matChoice].elasticity * units.stressMult);
		$("#ElasticityDisplay").text(elas.toPrecision(3));
		$(".ForceUnits").text(units.forceText);
		$(".MomentUnits").text(units.momentText);
		$(".StressUnits").text(units.stressText);
		$(".LengthUnits").text(units.lengthText);
		
		// Material and Geometry Values
		var r = $("#RadiusInput").val();
		var len = $("#LengthInput").val();
		var h = $("#HeightInput").val();
		var w = $("#Width_Input").val();
		
		// Force and Moment Values
		/*for(var i=0; i<3; i++){
			Loads[0][i] = $("#f" + XYZ[i]).val();
			Loads[1][i] = $("#m" + XYZ[i]).val();
		}*/
		var Fx = $("#Fx").val();
		var Fy = $("#Fy").val();
		var Fz = $("#Fz").val();
		var Mx = $("#Mx").val();
		var My = $("#My").val();
		var Mz = $("#Mz").val();
		
		// Calculating Total Moments
		var Mx_tot = parseFloat(Mx) - Fy*len; // mX - fY*L
		var My_tot = parseFloat(My) + Fx*len; // mY + fX*L

		// Other Variables
		var Ix, Iy, Iz;
		var normZ1, normZ2, normZ;
		var Mx_tran, halfy, CrossSectionArea;

		// Selecting the Beam picture based on forces
		// CC  CB  CA
		// BC  BB  BA 
		// AC  AB  AA 
		var pos;
		if (Mx_tot>0)  {pos='A';}
		if (Mx_tot==0) {pos='B';}
		if (Mx_tot<0)  {pos='C';}
		if (My_tot>0)  {pos=pos + 'A';}
		if (My_tot==0) {pos=pos + 'B';}
		if (My_tot<0)  {pos=pos + 'C';}
		$("#BeamPicChoice").attr('src','BeamPics\\Beam_' + pos + '.png');
		
		var RadioInput = $("input[type=radio][name=CircleOrRect]:checked").val();
		if (RadioInput == 'Rect') {
			// No twisting with rectangular cross section
			$("#Mz, #MzSlide").val('0');
			$("#Mz, #MzSlide").attr('disabled','disabled');
			$("#CrossSectionPic").attr('src','BeamPics\\RectCrossSection1.png');
			CrossSectionArea = (h*w);
			Ix = (w*Math.pow(h,3)/12); // I = (bh^3)/12
			Iy = (h*Math.pow(w,3)/12); // I = (hb^3)/12
			Iz = 0;
			halfy = h/2;
		} else if (RadioInput == 'Circle') {
			// Allows twisting
			$("#Mz, #MzSlide").removeAttr('disabled');
			$("#CrossSectionPic").attr('src','BeamPics\\CircleCrossSection1.png');
			CrossSectionArea = (Math.PI * Math.pow(r,2));
			Ix = (Math.pow(r,4)*Math.PI/4); // I = (pi*r^4)/4
			Iy = Ix;
			Iz = Ix*2; // Iz = J = (pi*r^4)/2
			halfy = r;
		}
		
		
		// Realtime output
		
		// Cross Section Area
		$("#AreaOutput").html(CrossSectionArea.toFixed(3) + " " + units.lengthText + "<sup>2</sup>");
		
		// Normal Stress in Z = P/A - (Mx1 + Mx2)y/I
		normZ1 = (Fz/CrossSectionArea); 	// Normal Stress in Z = Fz/A
		Mx_tran = -Fy*len; 				// Moment X = Force in Y * length of beam		
		normZ2 = (Mx_tran*halfy)/Ix; 		// Normal stress = -M*y/I due to fY
		normZ3 = (Mx*halfy)/Ix;	// Normal stress = -M*y/I due to Mx
		normZ = normZ1 + normZ2 + normZ3;	// Normal stress Total
		$("#NormalZaxial").html(normZ1.toPrecision(3));
		$("#NormalZbending1").html(normZ2.toPrecision(3));
		$("#NormalZbending2").html(normZ3.toPrecision(3));
		$("#NormalZtot").html(normZ.toPrecision(3));
		
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
		
		/*
		for(var i=0; i<3; i++) {
			if (normZ>0) {
				$("#CubesigZ, #CubesigZlabel").removeAttr("hidden");
			} else if (normZ<0) {
				$("#CubesigZ, #CubesigZlabel").removeAttr("hidden");
				$("#CubesigZ").attr("src","CubePics\\sigZ-0.png");
			}
		}
		*/
		
	});
	
	// Section Groupings
	// clicking on a section header opens that one and closes the others
	// Not sure if I like this either
	$(".CalcSection, .VisSection, .ToolSection").attr("hidden","true");
	
	$("#HeaderTitle").click(function() {
		$(".IntroSection").removeAttr("hidden");
		$(".CalcSection, .VisSection, .ToolSection").attr("hidden","true");
	})
	$("#HeaderCalc").click(function() {
		$(".CalcSection").removeAttr("hidden");
		$(".IntroSection, .VisSection, .ToolSection").attr("hidden","true");
	})
	$("#HeaderVis").click(function() {
		$(".VisSection").removeAttr("hidden");
		$(".IntroSection, .CalcSection, .ToolSection").attr("hidden","true");
	})
	$("#HeaderTool").click(function() {
		$(".ToolSection").removeAttr("hidden");
		$(".IntroSection, .CalcSection, .VisSection").attr("hidden","true");
	})
	
	/*
	// Would be cool to just loop through group headers, and hide the sections below
	// Hides all sections to start, not sure if I want this or not
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
	*/
	// Tool Tip Code
	$(function() {
		$(".refbody").hide();
		$(".refnum").click(function(event) {
			$(this.nextSibling).toggle();
			event.stopPropagation();
		});
		$("body").click(function(event) {
			$(".refbody").hide();
		});
	});
	

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
