class Material {
    constructor(name, elasticity, foo) {
        this.name = name;
        this.elasticity = elasticity;
        this.foo = foo;
    }
	ElasticityDisp = function(units){
		var val1 = (this.elasticity * units.stressMult).toPrecision(3);
		$("#ElasticityDisplay").text(val1);
		return val1;
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

// Setup units - multiplier between Metric and Imperial, maybe add combinations
const UnitChoice = {
	'Metric - m/Pa/N': new Units('Metric - m/Pa/N','m',1,'Pa',1, 'N',1,'Nm',1,'m/Pa/N'),
	//'Metric - m/GPa/kN': new Units('Metric - m/GPa/kN','m',1,'GPa',0.000000001,'kN',.001,'kNm',0.001,'m/GPa/kN'),
	'Imperial - in/psi/lbf': new Units('Imperial - in/psi/lbf','in', 39.37,'psi', 145.038, 'lbf',0.225,'in-lb',8.85,'in/psi/lbf'),
};

// Setup Materials and their Young's Modulus of Elasticities (GPa), ultimate tensile strength (MPa), and other material properties
const materials = {
  'Aluminum': new Material('Aluminum', 69*Math.pow(10,9), 110),
  'Steel': new Material('Steel', 180*Math.pow(10,9), 860),
  'Copper': new Material('Copper', 117*Math.pow(10,9), 220),
};

// Takes in Stress Value, Normal or Shear (sig or tau), and X/Y/Z and displays matching cube pic
function showStress(StressVal,NorS,direction){
	var callSign = "#Cube" + NorS + direction;
	var callSignLabel = "#Cube" + NorS + direction + "label";
	if (StressVal>0) {
		$(callSign + ", " + callSignLabel).removeAttr("hidden");
		$(callSign).attr("src","CubePics\\" + NorS + direction + "-1.png");
	} else if (StressVal<0) {
		$(callSign + ", " + callSignLabel).removeAttr("hidden");
		$(callSign).attr("src","CubePics\\" + NorS + direction + "-0.png");
	}
}

function UnitSetup() {
	// Setup Unit input
    for (let unitKey in UnitChoice) {
        var unit = UnitChoice[unitKey];
        var el = document.createElement("option");
        el.textContent = unit.name;
        el.value = unit.name;
        $("#UnitSelect").append(el);
    }
}

function UnitSet(units){
	$(".ForceUnits").text(units.forceText);
	$(".MomentUnits").text(units.momentText);
	$(".StressUnits").text(units.stressText);
	$(".LengthUnits").text(units.lengthText);
}

function MaterialSetup() {
	for (let materialKey in materials) {
        var material = materials[materialKey];
        var el = document.createElement("option");
        el.textContent = material.name;
        el.value = material.name;
        $("#MaterialSelect").append(el);
    }
}

function InputSetup(){
	$(".slider").attr({
		type:'range',
		style:'width:6em; display:inline'
	})
	
	$(".inputText").attr({
		type:'number',
		style:'width:5em; text-align:right; margin-left:10px',
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
		max:'10',
		step:'.001'
	})
	
	// Sets up Value inputs for Forces and Moments
	$(".Force, .Moment").attr({
		value:'0',
		min:'-100000',
		max:'100000',
		step:'0.001'
	})
}

function BeamPictureSelect(Mx_tot, My_tot){
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
	return 'BeamPics\\Beam_' + pos + '.png';
}

function SliderToTextInput(){
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
}

function TextInputToSlider(){
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
}

function CircleOrRectHide(){
	$("input[type=radio][name=CircleOrRect]").change(function() {
		if (this.value == 'Rect') {
			$("#RectDim, #RectLabels").removeAttr("hidden");
			$("#CircleDim, #CircleLabels").attr("hidden","true");
		} else if (this.value == 'Circle') {
			$("#CircleDim, #CircleLabels").removeAttr("hidden");
			$("#RectDim, #RectLabels").attr("hidden","true");
		}
	})
}

function ResetButtonVals(){
	$("#Reset").click(function() {
		$(".Force, .Moment").val('0');
		$("#LengthInput, #LengthRange").val('1');
		$("#HeightInput, #RadiusInput, #Width_Input, #HeightRange, #RadiusRange, #Width_Range").val('0.1');
	})
}

function AreaMomentInertia_Rect(h,w) {
	Ix = (w*Math.pow(h,3)/12); // I = (bh^3)/12
	Iy = (h*Math.pow(w,3)/12); // I = (hb^3)/12
	Iz = 0;
	return [Ix, Iy, Iz];
}

function AreaMomentInertia_Circle(r) {
	Ix = (Math.pow(r,4)*Math.PI/4); // I = (pi*r^4)/4
	Iy = Ix;
	Iz = Ix*2; // Iz = J = (pi*r^4)/2
	return [Ix, Iy, Iz];
}

function HideCubeLayers(){
	let cubelayers = $("#CubetauXY, #CubetauYZ, #CubetauXZ, #CubesigX, #CubesigY, #CubesigZ");
	let cubelabels = $("#CubesigXlabel, #CubesigYlabel, #CubesigZlabel, #CubetauXYlabel, #CubetauYZlabel, #CubetauXZlabel");//
	cubelayers.attr("hidden","true");
	cubelabels.attr("hidden","true");
}

function ExpandCollapseSections() {
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
}


$(document).ready(function() {
	
	UnitSetup();
	MaterialSetup();
	InputSetup();
	
	// Connects the Range Slider and the Text Inputs to each other
	SliderToTextInput();
	TextInputToSlider();

	// Resets Values to 1, 0.1, and 0 upon button click
	ResetButtonVals();

	// Sets input options for a radius or rectangle values depending on radio input
	CircleOrRectHide();
	
	// Not sure how to get the reset button to trigger the ChangeTrigger
	let ChangeTriggers = $(".slider, .inputText, #MaterialSelect, #UnitSelect, input[type=radio][name=CircleOrRect], #Reset");						
	
	// Auto Update if any of the inputs change
	ChangeTriggers.change(function() {
		
		// Material and Unit Selection
		var matChoice = materials[$("#MaterialSelect").val()];
		var units = UnitChoice[$("#UnitSelect").val()];
		
		// Sets all units based on Unit Choice
		UnitSet(units);
		
		// Calculates/Displays Material Elasticity
		var ElasticityVal = matChoice.ElasticityDisp(units);
		
		// Get Geometry Values
		var r = $("#RadiusInput").val();
		var len = $("#LengthInput").val();
		var h = $("#HeightInput").val();
		var w = $("#Width_Input").val();
		
		// Get Force and Moment Values
		var Fx = $("#Fx").val();
		var Fy = $("#Fy").val();
		var Fz = $("#Fz").val();
		var Mx = $("#Mx").val();
		var My = $("#My").val();
		var Mz = $("#Mz").val();
		
		// Calculating Total Moments
		var Mx_tot = parseFloat(Mx) - Fy*len; // mX - fY*L
		var My_tot = parseFloat(My) + Fx*len; // mY + fX*L

		// Other Variable Setup
		// var Ix, Iy, Iz;
		var normZ1, normZ2;
		var normX=0, normY=0, normZ=0, tauXY=0, tauYZ=0, tauXZ=0;
		var Mx_tran, halfy, CrossSectionArea, tauXZ_BeamShear, tauXZ_Torsion;

		// Selecting and showing the Beam picture based on forces/moments
		var BeamPicName = BeamPictureSelect(Mx_tot,My_tot);
		$('#BeamPicChoice').attr('src',BeamPicName);
		
		// Get Circle or Rectangular Input
		var RadioInput = $("input[type=radio][name=CircleOrRect]:checked").val();
		
		// Calculate Cross Section Area, Ix/Iy/Iz and half of height (h/2 or r)
		if (RadioInput == 'Rect') {
			// No twisting with rectangular cross section
			$("#Mz, #MzSlide").val('0');
			$("#Mz, #MzSlide").attr('disabled','disabled');
			$("#CrossSectionPic").attr('src','BeamPics\\RectCrossSection1.png');
			CrossSectionArea = (h*w);
			[Ix,Iy,Iz] = AreaMomentInertia_Rect(h,w);
			halfy = h/2;
			tauXZ_BeamShear = 3*Fx/(2*CrossSectionArea);
			tauXZ_Torsion = 0;
		} else if (RadioInput == 'Circle') {
			// Allows twisting
			$("#Mz, #MzSlide").removeAttr('disabled');
			$("#CrossSectionPic").attr('src','BeamPics\\CircleCrossSection1.png');
			CrossSectionArea = (Math.PI * Math.pow(r,2));
			[Ix,Iy,Iz] = AreaMomentInertia_Circle(r);
			halfy = r;
			tauXZ_BeamShear = 4*Fx/(3*CrossSectionArea);
			tauXZ_Torsion = Mz*r/Iz;
		}
		
		// Cross Section Area Output
		$("#AreaOutput").text(CrossSectionArea.toPrecision(3));
		
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
		
		tauXZ = tauXZ_BeamShear + tauXZ_Torsion;
		$("#BeamShearXZ").text(tauXZ_BeamShear.toPrecision(3));
		$("#TorsionShearXZ").text(tauXZ_Torsion.toPrecision(3));
		$("#ShearXZ").text(tauXZ.toPrecision(3));
		/* 
			@top reference point: 
				mX contributes to pure bending (normal) stress [x]
				mY doesn't contribute normal (Neutral Axis) or shear stress [x]
				mZ (torsion) contributes to pure shear [x]
				fX contributes only to shear [x]
				fY contributes to shear (zero at top) and bending [x]
				fZ contributes to only normal [x]
		*/	
		
		
		HideCubeLayers();
		
		showStress(normX,"sig","X");
		showStress(normY,"sig","Y");
		showStress(normZ,"sig","Z");
		showStress(tauXY,"tau","XY");
		showStress(tauYZ,"tau","YZ");
		showStress(tauXZ,"tau","XZ");
		
	});
	
	// Initial Section Groupings
	$(".CalcSection, .VisSection, .ToolSection").attr("hidden","true");
	// Closes and Opens Sections on click
	ExpandCollapseSections();
	
});


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

//function foo(x,y,z) {return [a,b,c];}
// [a,b,c] = tester(x,y,z);