class Material {
    constructor(name, elasticity) {
        this.name = name;
        this.elasticity = elasticity;
    }
}

$(document).ready(function() {
    var materials_select = document.getElementById("materials");
    var materials_options = ['Aluminum', 'Steel', 'Copper'];
    var material_objs = {};

    for(var i = 0; i < materials_options.length; i++) {
        var material = new Material(materials_options[i], i);
        material_objs[materials_options[i]] = material;

        var opt = materials_options[i];
        var el = document.createElement("option");
        el.textContent = opt;
        el.value = opt;
        materials_select.appendChild(el);
    }
    $("#submit1").click(function(e) {
        var text = $("#materials option:selected").text();
        alert(material_objs[text].elasticity);
    });

});

