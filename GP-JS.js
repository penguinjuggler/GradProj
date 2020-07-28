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
	'Metric': new Units('Metric','m',1,'GPa',1, 'N',1,'Nm',1,'m / GPa / kgs'),
	'Imperial': new Units('Imperial','in', 39.37,'kpsi', 145.038, 'lbf',0.225,'in-lb',8.85,'inch / kpsi / lbs'),
};

// Setup Materials and their Young's Modulus of Elasticities (GPa), ultimate tensile strength (MPa), and other material properties
const materials = {
  'Aluminum': new Material('Aluminum', 69, 110),
  'Steel': new Material('Steel', 180, 860),
  'Copper': new Material('Copper', 117, 220),
};

var BeamPicNum;


function calculateFoo(elasticity, radius) {
  return elasticity * radius;
}

$(document).ready(function() {
	
    var materials_select = document.getElementById("MaterialSelect");
	//var materials_Modulus = document.getElementById("YM_Display");
	var unit_select = document.getElementById("UnitSelect");
	var CrossSectionArea;
	
	
	// Setup Unit input
    for (let unitKey in UnitChoice) {
        var unit = UnitChoice[unitKey];

        var el = document.createElement("option");
        el.textContent = unit.name;
        el.value = unit.name;
        unit_select.appendChild(el);
    }
	
    // Setup material input
    for (let materialKey in materials) {
        var material = materials[materialKey];

        var el = document.createElement("option");
        el.textContent = material.name;
        el.value = material.name;
        materials_select.appendChild(el);
    }

	// Sets up Value inputs for Cross Section and Beam Length, 
	$("#Radius, #BeamLength, #Height, #Width").attr({
		type:'number',
		min:'1',
		max:'1000000000',
		maxLength:'8',
		value:'10',
		step:'.001',
		oninput:"this.value=this.value.slice(0,this.maxLength)",
		style:'width:6em',
		required:'true'
	})
	
	// Sets up Value inputs for Forces and Moments
	$(".Force, .Moment").attr({
		type:'number',
		min:'-10000000',
		max:'10000000',
		maxLength:'8',
		value:'0',
		step:'.001',
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
    

    $("#submit1").click(function(e) {
        var text = $("#MaterialSelect option:selected").text();
        const material = materials[text]; 

        // Read cross section radius
        const radiusInput = $('#CrossSectionRadius');
        const radiusValue = parseFloat(radiusInput.val());

		
        // Calculate foo
		//alert(calculateFoo(material.elasticity, radiusValue));

		// Will change BeamPicture based on final direction of forces
		// Need to set BeamPicNum above
		/*
		var BeamChange = $("#BeamPic");
		BeamChange.attr('src', 'BeamPic' + BeamPicNum + '.png');
        */
			
    });
	
	// Sets input options for a radius or rectangle values depending on radio input
	$("input[type=radio][name=CircleOrRect]").change(function() {
		if (this.value == 'Rect') {
			$("#RectDim").removeAttr("hidden");
			$("#CircleDim").attr("hidden","true");
		} else if (this.value == 'Circle') {
			$("#CircleDim").removeAttr("hidden");
			$("#RectDim").attr("hidden","true");
		}
	})

	let ChangeTriggers = $("#MaterialSelect, #UnitSelect, #BeamLength, #CircleDim, #RectDim, input[type=radio][name=CircleOrRect], #fX, #fY, #fZ, #mX, #mY, #mZ");
	
	// Updates Youngs Modulus on change of Material and Unit Choice
	// Also updates "stress results" with arbitrary calculation, to be updated later
	ChangeTriggers.change(function() {
		var text1 = $("#MaterialSelect option:selected").text();
		var text2 = $("#UnitSelect option:selected").text();
		var elas = parseInt(materials[text1].elasticity * UnitChoice[text2].pressureMult);
		$("#ElasticityDisplay").text(elas + " " + UnitChoice[text2].pressureText);
		$("#UnitDisplay").text(UnitChoice[text2].unitList);
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
		
		var Ix, Iy, Iz;
		var normZ1, normZ2, normZ;
		var mX_tot, halfy;
		
		var RadioInput = $("input[type=radio][name=CircleOrRect]:checked").val();
		if (RadioInput == 'Rect') {
			// No twisting with rectangular cross section
			$("#mZ").val('0');
			$("#mZ").attr('disabled','disabled');
			CrossSectionArea = (h*w);
			Ix = (w*Math.pow(h,3)/12); // I = (bh^3)/12
			Iy = (h*Math.pow(w,3)/12); // I = (hb^3)/12
			Iz = 0;
			halfy = h/2;
		} else if (RadioInput == 'Circle') {
			// Allows twisting
			$("#mZ").removeAttr('disabled');
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
		normZ1 = (fZ/CrossSectionArea); // Normal Stress in Z = P/A = Force in Z / Cross Section Area
		mX_tot = -fY*len + mX; 			// Moment X Total = Force in Y * length of beam + Moment X at end		
		normZ2 = (mX_tot*halfy)/Ix; 	// normal stress = -M*y/I
		normZ = normZ1 + normZ2;
		
		$("#NormalZ").html("Normal Stress in Z: <br>Due to Axial Force: " + normZ1.toFixed(3) + " " + UnitChoice[text2].pressureText
			+ "<br>Due to moment caused by force in Y and moment at end: " + normZ2.toFixed(3) + " " + UnitChoice[text2].pressureText
			+ "<br>Total Normal Stress in Z: " + normZ.toFixed(3) + " " + UnitChoice[text2].pressureText);
		
		
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
	});
	


});


	


//alert(calculateFoo(material.elasticity, radiusValue));
//document.getElementById("ElasticityDisplay").innerHTML = material.elasticity;
